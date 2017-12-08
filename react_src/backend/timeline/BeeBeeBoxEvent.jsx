/**
 *
 * Copyright (c) 2017 MPAT Consortium , All rights reserved.
 * Fraunhofer FOKUS, Fincons Group, Telecom ParisTech, IRT, Lacaster University, Leadin, RBB, Mediaset
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public
 * License along with this library. If not, see <http://www.gnu.org/licenses/>.
 *
 * AUTHORS:
 * Jean-Claude Dufourd (Telecom ParisTech)
 * Jean-Philippe Ruijs (github.com/jeanphilipperuijs)
 *
 **/
import React from 'react';
import Constants from '../../constants';
import ButtonWP from './ButtonWP';
import TimeLineEditor from './TimeLineEditor';
import LocalizedStrings from 'react-localization';

const i18n = new LocalizedStrings({
  en: {
    title: 'BeeBee Box',
    button: {
      link: 'Generate',
      title: 'Retrieve a BeeBee Box formatted XML for stream events'
    },
    fileName: 'beebeebox_streamevents.xml',
    no_streamevents: 'no event to stream',
    generated_streamevents: 'The file "{0}" has been generated.',
    no_project: 'No project loaded to convert to BeeBee Box file'

  },
  nl: {
    title: 'BeeBee Box',
    button: {
      link: 'BeeBee Box',
      title: 'Download een XML BeeBeeBox-geformatteerde StreamEvents-bestand'
    },
    fileName: 'beebeebox_streamevents.xml',
    no_streamevents: 'Geen events om te streamen',
    generated_streamevents: 'Het bestand "{0}" wordt gegenereerd.',
    no_project: 'Geen project geladen om te converteren'
  }
});

const constants = {
  postStreamEvent: {
    url: 'http://beebeebox.enst.fr/beebee/se.php',
    cType: 'appication/x-form-urlencoded',
  }
};

export default class BeeBeeBoxEvent extends React.PureComponent {
  static propTypes = {
    /*eslint-disable*/
    storeState: React.PropTypes.object.isRequired,
    /*eslint-enable*/
  };

  static get2Digits(v) {
    const vv = Math.floor(v);
    return (vv < 10) ? `0${vv}` : vv;
  }

  static get3Digits(vv) {
    const v = Math.floor(vv);
    return (v < 100) ? `00${v}` : this.get2Digits(v);
  }

  static getEvent(t, v) {
    return `\t<event timestamp="${t}" value="${v}"/>`;
  }

  static getTiming(t) {
    let v = [0, 0, 0, 0];
    try {
      const h0 = Math.floor(t / 3600);
      const m0 = Math.floor(t / 60);
      const s0 = t - (m0 * 60);
      const h = this.get2Digits(h0);
      const m = this.get2Digits(m0);
      const s = this.get2Digits(s0);
      const ms = this.get3Digits(0);
      v = [h, m, s, ms];
    } catch (err) {
      return 'timing error';
    }
    return v;
  }

  static download(filename, text) {
    const element = document.createElement('a');
    element.setAttribute('href', `data:text/plain;charset=utf-8,'${encodeURIComponent(text)}`);
    element.setAttribute('download', filename);
    element.setAttribute('target', '_blank');
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }

  // FIXME does not work
  static send(xhr, content) {
    xhr.open('POST', constants.postStreamEvent.url, true);
    xhr.setRequestHeader('Content-type', constants.postStreamEvent.cType);
    const label = 'label';
    const description = 'description';
    const seFile = 'seFileRemote';
    const kind = 'LOCAL';
    let toSend =
      `label=${encodeURIComponent(label)} &description=${encodeURIComponent(description)}`;
    if (kind === 'REMOTE') toSend += `&seFileRemote=${encodeURIComponent(seFile)}`;
    if (kind === 'LOCAL') toSend += `&seFileLocal=${encodeURIComponent(seFile)}`;
    toSend += `&kind=${encodeURIComponent(kind)}&file=${encodeURIComponent(content)}`;
    xhr.send(toSend);
  }

  constructor() {
    super();
    this.lastAction = new Date();
    this.timesincelastAction = -1;
    this.generateBeeBeeBoxStreamEventXML = this.generateBeeBeeBoxStreamEventXML.bind(this);
  }

  generateBeeBeeBoxStreamEventXML() {
    if (this.props.storeState.ranges.length > 0) {
      this.timesincelastAction = new Date() - this.lastAction;
      const ev = [];
      ev.push('<?xml version="1.0" encoding="UTF-8"?>');
      ev.push('<events>');
      const self = this;
      this.props.storeState.sortedRanges.forEach((dIndex, i) => {
        // we get an index of range, get the actual range from the index
        const d = self.props.storeState.ranges[dIndex];
        if (d.type === 'StreamEvent') {
          const t0 = BeeBeeBoxEvent.getTiming(d.begin);
          const start = BeeBeeBoxEvent.getEvent(t0.join(':'), i);
          ev.push(start);
          // for streamEvents, do not generate the ERASE
          // let theEnd = d.begin + d.duration - 1;
          // let t1 = self.getTiming( theEnd );
          // let stop = self.getEvent( t1.join( ':' ), 'ERASE' );
          // ev.push( stop );
        }
      });
      ev.push('</events>');
      const ll = document.getElementsByClassName('statusinfo')[0];
      let streamEvent = ev.join('\n');

      if (ev.length > 3) {
        BeeBeeBoxEvent.download(i18n.fileName, streamEvent);
        const el = document.getElementById('eventsxml');
        el.value = streamEvent;
        el.style.fontSize = '0.8em';
        ll.value = i18n.formatString(i18n.generated_streamevents,
          i18n.fileName);
      } else {
        streamEvent = null;
        ll.value = i18n.no_streamevents;
      }
    } else {
      TimeLineEditor.updateStatusInfo(i18n.no_project);
    }
  }

  render() {
    return (
      <div  className="borderLine">
        <details>
          <summary>{i18n.title}</summary>
          <ButtonWP
            value={i18n.button.link} title={i18n.button.title}
            action={this.generateBeeBeeBoxStreamEventXML}
          />
          <textarea id="eventsxml" />
        </details>
      </div>
    );
  }
}
