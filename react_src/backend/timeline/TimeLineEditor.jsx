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
import Popup from 'react-popup';
import ElementMenu from './ElementMenu';
import Preview from './Preview';
import TimeLine from './TimeLine';
import { log } from './Utils';
import { clearHistory, canLeave } from './redux/UndoRedo';
import PublishButton from './PublishButton';
import RestoreButton from './RestoreButton';
import DeleteButton from './DeleteButton';
import DSMCC from './DSMCC';
import BeeBeeBoxEvent from './BeeBeeBoxEvent';
import { noSubmitOnEnter } from '../utils';
import Constants from '../../constants';

const i18n = Constants.locstr.timeLineEditor;

export default class TimeLineEditor extends React.PureComponent {

  static propTypes = {
    /*eslint-disable*/
    storeState: React.PropTypes.object.isRequired,
    actions: React.PropTypes.object.isRequired
    /*eslint-enable*/
  };

  static updateStatusInfo(v) {
    const statusinfos = document.getElementsByClassName('statusinfo');
    /*eslint-disable*/
    for (const si in statusinfos) {
      if (statusinfos.hasOwnProperty(si)) {
        /*eslint-enable*/
        const l = statusinfos[si];
        try {
          l.innerText = v;
          window.defaultStatus = v;
        } catch (err) {
          log(`${i18n.error.unableToSet} ${v}`);
        }
      }
    }
  }

  constructor() {
    super();
    this.locStr = Constants.locstr.timeline;
    document.title = `${this.locStr.title} "${window.MPATOther.blogname}"`;
    this.broadcast = this.broadcast.bind(this);
    this.changeTimeValue = this.changeTimeValue.bind(this);
    this.changeUIOptions = this.changeUIOptions.bind(this);
    window.addEventListener('beforeunload', (e) => {
      if (canLeave()) return undefined;
      const ee = e || window.event;
      ee.returnValue = i18n.unsavedChanges;
      return ee.returnValue;
    });
  }

  componentDidMount() {
    const scenario =
      (window.MPATOther.timeline_scenario ? window.MPATOther.timeline_scenario : null);
    if (scenario) {
      this.props.actions.restore(scenario);
    }
    this.props.actions.changeTimeLineProps(
      {
        blogid: window.MPATOther.blogid,
        blogname: window.MPATOther.blogname,
        guid: window.MPATOther.guid,
        generated: window.MPATOther.generated
      });
    // undo clear history
    clearHistory();
  }

  changeTimeValue(event) {
    const formerDuration = this.props.storeState.timeLineDuration;
    const timeLineDuration = (event.target.value > 20000 ? 20000 : event.target.value);
    const sizeFromDuration = this.props.storeState.timeLineLength /
      timeLineDuration;
    // scale all ranges according to newer duration
    const scale = timeLineDuration / formerDuration;
    this.props.storeState.ranges.forEach((range) => {
      console.log(`changeRangeProps ${range.id} ${scale * range.begin}`);
      this.props.actions.changeRangeProps(
        range.id,
        {
          begin: scale * range.begin,
          duration: scale * range.duration
        });
    });
    this.props.actions.changeTimeLineProps({ timeLineDuration, sizeFromDuration });
  }

  changeUIOptions() {
    Popup.create(
      {
        content: (
          <div>
            <h2>Change Editable Events</h2>
            <table id="uiControls">
              <tbody>
                <tr>
                  <td><p>Stream Events</p></td>
                  <td>
                    <input
                      type="checkbox"
                      id="streamevent"
                      defaultChecked={this.props.storeState.streamEvents}
                    />
                  </td>
                  <td/>
                </tr>
                <tr>
                  <td><p>Media Events</p></td>
                  <td>
                    <input
                      type="checkbox"
                      id="mediaevent"
                      defaultChecked={this.props.storeState.mediaEvents}
                    />
                  </td>
                  <td/>
                </tr>
                <tr>
                  <td><p>Key Events</p></td>
                  <td>
                    <input
                      type="checkbox"
                      id="keyevent"
                      defaultChecked={this.props.storeState.keyEvents}
                    />
                  </td>
                  <td/>
                </tr>
                <tr>
                  <td><p>Time Events</p></td>
                  <td>
                    <input
                      type="checkbox"
                      id="timeevent"
                      defaultChecked={this.props.storeState.timeEvents}
                    />
                  </td>
                  <td/>
                </tr>
                <tr>
                  <td><p>Clock Events</p></td>
                  <td>
                    <input
                      type="checkbox"
                      id="clockevent"
                      defaultChecked={this.props.storeState.clockEvents}
                    />
                  </td>
                  <td/>
                </tr>
                <tr>
                  <td colSpan="3">
                    <button
                      type="button"
                      className="white_blue done_button"
                      id="done"
                      onClick={() => {
                        this.props.actions.changeUi(
                          document.getElementById('streamevent').checked,
                          document.getElementById('mediaevent').checked,
                          document.getElementById('keyevent').checked,
                          document.getElementById('timeevent').checked,
                          document.getElementById('clockevent').checked
                        );
                        Popup.close();
                      }}
                    >
                      Done
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )
      });
  }

  broadcast() {
    return this.props.storeState.ui === 'broadcast' ||
           this.props.storeState.ui === 'broadcastplus' ||
           this.props.storeState.ui === 'complete';
  }

  render() {
    const { timeLineDuration } = this.props.storeState;
    return (
      <div className="timelineeditor">
        <div className="leftColumn">
          <Preview storeState={this.props.storeState}/>
          <TimeLine storeState={this.props.storeState} actions={this.props.actions}/>
          <table style={{borderCollapse: true, border: 0}}>
            <tbody>
              <tr>
                <td>
                  <input
                    type="button"
                    className="timeline-button"
                    value="Change UI options"
                    title="Change UI options"
                    onClick={this.changeUIOptions}
                  />
                </td>
                <td><pre>Application URL: {window.MPATOther.url.scenario}</pre></td>
              </tr>
            </tbody>
          </table>

        </div>
        <div className="rightColumn">
          <div className="floatRight">
            <DeleteButton
              timeout_label={5000}
              storeState={this.props.storeState}
              actions={this.props.actions}
            />
            <RestoreButton
              timeout_label={5000}
              actions={this.props.actions}
              storeState={this.props.storeState}
            />
            <PublishButton
              timeout_label={5000}
              storeState={this.props.storeState}
            />
          </div>
          <div id="timelineedit" className="borderLine">
            {this.locStr.title}
            <table>
              <tbody>
                <tr>
                  <td>
                    <label htmlFor="timelineduration">{this.locStr.duration}</label>
                  </td>
                  <td>
                    <input
                      type="number"
                      id="timelineduration" className="timelinevalue"
                      value={timeLineDuration}
                      onKeyPress={noSubmitOnEnter}
                      onChange={this.changeTimeValue}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div id="pagetable">
            <ElementMenu storeState={this.props.storeState} actions={this.props.actions}/>
          </div>
          {this.broadcast() &&
          <div>
            <DSMCC />
            <BeeBeeBoxEvent
              storeState={this.props.storeState}
            />
          </div>}
        </div>
      </div>
    );
  }
}
