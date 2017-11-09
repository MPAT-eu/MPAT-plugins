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
 * Jean-Philippe Ruijs (jean-philippe.ruijs@telecom.paristech.fr)
 *
 **/
import React from 'react';
import Constants from '../../constants';
import { noSubmitOnEnter, getDsmcc } from '../utils';
import OptionIO from '../../OptionIO';
import TimeLineEditor from './TimeLineEditor';

const i18n = Constants.locstr.timeline.dsmcc;
export default class DSMCC extends React.Component {

  static getStamp() {
    return new Date().toISOString().replace('T', ' ').replace('Z', '');
  }

  constructor() {
    super();
    this.state = {
      sen: 'id1',
      sei: 1,
      ct: 9,
      dsmcc: undefined,
      errorMsg: undefined
    };
    this.save = this.saveDSMCC.bind(this);
    this.download = this.downloadDsmcc.bind(this);
    this.changeComponentTag = this.changeComponentTag.bind(this);
    this.changeStreamEventId = this.changeStreamEventId.bind(this);
    this.changeStreamEventName = this.changeStreamEventName.bind(this);
  }

  componentWillMount() {
    this.getDsmccOptions();
  }

  getDsmccOptions() {
    OptionIO.getCommon().get(
      'dsmcc',
      (j) => {
        if (j !== null) {
          this.setState(
            {
              ct: j.tag,
              sei: j.id,
              sen: j.name
            });
        }
      },
      (e) => {
        this.setState({ errorMsg: i18n.error.onLoad + e });
      }
    );
  }

  saveDSMCC() {
    OptionIO.getCommon().put(
      'dsmcc',
      { tag: this.state.ct, id: this.state.sei, name: this.state.sen },
      () => {
        TimeLineEditor.updateStatusInfo(i18n.saved);
      },
      (e) => {
        this.setState({ errorMsg: i18n.error.onSave + e });
      }
    );
  }

  downloadDsmcc() {
    const element = document.createElement('a');
    element.setAttribute('href', `data:text/plain;charset=utf-8,${encodeURIComponent(this.state.dsmcc)}`);
    element.setAttribute('download', i18n.fileName);
    element.setAttribute('target', '_blank');
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }

  changeStreamEventId(event) {
    let v = event.target.value;
    if (v > 65535) v = 65535;
    if (v < 1) v = 1;
    this.state.sei = v;
    this.updateDsmcc();
  }

  changeStreamEventName(event) {
    const v = event.target.value;
    if (v.length > 0) {
      this.state.sen = v;
      this.updateDsmcc();
    }
  }

  changeComponentTag(event) {
    let v = event.target.value;
    if (v > 255) v = 255;
    if (v < 1) v = 1;
    this.state.ct = v;
    this.updateDsmcc();
  }

  updateDsmcc() {
    this.setState(
      {
        dsmcc: getDsmcc(this.state.ct, this.state.sei, this.state.sen)
      });
    this.saveDSMCC();
  }

  render() {
    return (
      <div className="borderLine">
        <details>
          <summary>{i18n.title}</summary>
          <div>
            <ul style={{ width: 250 }}>
              <li>
                <label title={i18n.seID.title} htmlFor="inputdsmcc1">
                  {i18n.seID.label}
                </label>
                <input
                  className="inputDsmcc"
                  size="3"
                  id="inputdsmcc1"
                  onChange={this.changeStreamEventId}
                  value={this.state.sei}
                  max="65535"
                  min="1"
                  type="number"
                  onKeyPress={noSubmitOnEnter}
                />
              </li>
              <li>
                <label title={i18n.seName.title} htmlFor="inputdsmcc2">
                  {i18n.seName.label}
                </label>
                <input
                  className="inputDsmcc"
                  id="inputdsmcc2"
                  size="10"
                  onChange={this.changeStreamEventName}
                  value={this.state.sen}
                  type="text"
                  onKeyPress={noSubmitOnEnter}
                />
              </li>
              <li>
                <label title={i18n.seComponentTag.title} htmlFor="inputdsmcc3">
                  {i18n.seComponentTag.label}
                </label>
                <input
                  className="inputDsmcc"
                  id="inputdsmcc3"
                  size="3"
                  onChange={this.changeComponentTag}
                  value={this.state.ct}
                  max="255"
                  min="1"
                  type="number"
                  onKeyPress={noSubmitOnEnter}
                />
              </li>
            </ul>
            <span
              style={{
                width: '85%',
                paddingLeft: '1em',
                display: 'block',
                color: 'white',
                backgroundColor: 'red'
              }}
            >
              {this.state.errorMsg}
            </span>
          </div>
        </details>
      </div>
    );
  }
}
