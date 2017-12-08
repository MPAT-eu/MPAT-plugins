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
import autobind from 'class-autobind';
import OptionIO from '../../OptionIO';
import { clearHistory } from './redux/UndoRedo';
import Constants from '../../constants';

let choiceVideo = null;

const i18n = Constants.locstr.timeline.wizard;

export default class TimeLineWizard extends React.PureComponent {

  constructor(props) {
    super(props);
    autobind(this);
    this.state = {
      vod: false,
      video: null
    }
  }

  checkandnext() {
    const duration = (this.state.vod ? document.getElementById('duration').value : 1000);
    OptionIO.getCommon().put(
      'timeline_scenario',
      {
        choiceVideo,
        timeLineDuration: duration,
        streamEvents: document.getElementById('streamevent').checked,
        mediaEvents: document.getElementById('mediaevent').checked,
        keyEvents: document.getElementById('keyevent').checked,
        timeEvents: document.getElementById('timeevent').checked,
        clockEvents: document.getElementById('clockevent').checked,
        ui: document.getElementById("recommendedUI").value,
        backComponent: this.state.video,
        ranges: [],
        sortedRanges: [],
        marker: {
          pixel: 0, seconds: 0
        },
        timeLineLength: 960,
        sizeFromDuration: 960 / duration,
        selected: -1
      },
      () => {
        delete window.MPATOther.timeline_scenario.reset;
        clearHistory();
        window.location.reload(true);
      },
      (e) => {
        console.log(i18n.errorSaving + e);
      }
    );
  }

  onPageSelect(ev) {
    const value = +ev.target.value;
    if (value === -1) {
      this.setState({ video: null });
    } else {
      const post = window.MPATTimeLinePages[value];
      this.setState({
        video: {
          name: post.title,
          meta: post.meta,
          guid: post.guid,
          blogid: post.blogid,
          postid: post.postid
        }
      });
    }
  }

  broadcast() {
    choiceVideo = 'broadcast';
    document.getElementById("streamevent").checked = true;
    document.getElementById("mediaevent").checked = false;
    document.getElementById("duration").value = '1000';
    document.getElementById("recommendedUI").value = 'broadcast';
    this.setState({ vod: false });
  }

  vod() {
    choiceVideo = 'ondemand';
    document.getElementById("streamevent").checked = false;
    document.getElementById("mediaevent").checked = true;
    document.getElementById("recommendedUI").value = 'vod';
    this.setState({ vod: true });
  }

  onSelect(ev) {
    const mode = ev.target.value;
    switch (mode) {
      case 'broadcast':
        document.getElementById("streamevent").checked = true;
        document.getElementById("mediaevent").checked = false;
        document.getElementById("keyevent").checked = false;
        document.getElementById("timeevent").checked = false;
        document.getElementById("clockevent").checked = false;
        break;
      case 'broadcastplus':
        document.getElementById("streamevent").checked = true;
        document.getElementById("mediaevent").checked = false;
        document.getElementById("keyevent").checked = true;
        document.getElementById("timeevent").checked = true;
        document.getElementById("clockevent").checked = true;
        break;
      case 'vod':
        document.getElementById("streamevent").checked = false;
        document.getElementById("mediaevent").checked = true;
        document.getElementById("keyevent").checked = false;
        document.getElementById("timeevent").checked = false;
        document.getElementById("clockevent").checked = false;
        break;
      case 'complete':
        document.getElementById("streamevent").checked = true;
        document.getElementById("mediaevent").checked = true;
        document.getElementById("keyevent").checked = true;
        document.getElementById("timeevent").checked = true;
        document.getElementById("clockevent").checked = true;
        break;
      default:
        break;
    }
  }

  render() {
    const ur = document.getElementById("undoRedo");
    if (ur) ur.style.display = 'none';
    const pages = window.MPATTimeLinePages.map((page, i) => {
      return (<option key={i} value={i}>{page.title}</option>);
    });
    pages.unshift(<option key="-1" value='-1'>--CHOOSE--</option>);
    return (
      <div id="timelinewizard" className="timelinewizard">
        <h2>{i18n.title}</h2>
        <p>{i18n.welcome}</p>
        <br />
        <p>{i18n.question.videoType}
        <table style={{ borderCollapse: true, border: 0 }}>
            <tr style={{ margin: 10 }}>
              <td><p>Broadcast Video</p></td>
              <td><input type="radio" id="broadcastradio" name="bv" onClick={this.broadcast} /></td>
              <td style={{ paddingLeft: 20 }}><p>On-Demand Video</p></td>
              <td><input type="radio" id="vodradio" name="bv" onClick={this.vod} /></td>
            </tr>
          </table></p>
        {this.state.vod && <hr style={{ height: 20 }} />}
        {this.state.vod && <p>{i18n.question.duration}
        <input type="number" id="duration" defaultValue="720" /></p>}
        {this.state.vod &&
          <p>If the video page already exists, please select it:
          <select id="pageselector" onChange={this.onPageSelect} defaultValue="-1">
              {pages}
            </select>
          </p>}
        <hr style={{ height: 20 }} />
        <p>{i18n.question.eventType}</p>
        <table style={{ borderCollapse: true, border: 0, paddingLeft: 40 }}>
          <tr style={{ margin: 10 }}>
            <td><p>Stream Events</p></td>
            <td><input type="checkbox" id="streamevent" /></td>
            <td><p style={{ marginLeft: 20, fontSize: 18 }}>{i18n.tooltip.streamEvent}</p></td>
          </tr>
          <tr style={{ margin: 10 }}>
            <td><p>Media Events</p></td>
            <td><input type="checkbox" id="mediaevent" /></td>
            <td><p style={{ marginLeft: 20, fontSize: 18 }}>{i18n.tooltip.mediaEvent}</p></td>
          </tr>
          <tr style={{ margin: 10 }}>
            <td><p>Key Events</p></td>
            <td><input type="checkbox" id="keyevent" /></td>
            <td><p style={{ marginLeft: 20, fontSize: 18 }}>{i18n.tooltip.keyEvent}</p></td>
          </tr>
          <tr style={{ margin: 10 }}>
            <td><p>Time Events</p></td>
            <td><input type="checkbox" id="timeevent" /></td>
            <td><p style={{ marginLeft: 20, fontSize: 18 }}>{i18n.tooltip.timeEvent}</p></td>
          </tr>
          <tr style={{ margin: 10 }}>
            <td><p>Clock Events</p></td>
            <td><input type="checkbox" id="clockevent" /></td>
            <td><p style={{ marginLeft: 20, fontSize: 18 }}>{i18n.tooltip.clockEvent}</p></td>
          </tr>
        </table>
        <hr style={{ height: 20 }} />
        <p>{i18n.timelineUI.label}:
        <select id="recommendedUI" onChange={this.onSelect}>
            <option value="vod">{i18n.timelineUI.option.vod}</option>
            <option value="broadcast">{i18n.timelineUI.option.bc}</option>
            <option value="broadcastplus">{i18n.timelineUI.option.bcp}</option>
            <option value="complete">{i18n.timelineUI.option.cui}</option>
          </select></p>
        <hr style={{ height: 20 }} />
        <button
          type="button"
          name="next"
          onClick={this.checkandnext}
          style={{ width: 100, margin: 20 }}
        >
          {i18n.next} &gt;
        </button>
      </div>
    );
  }
}
