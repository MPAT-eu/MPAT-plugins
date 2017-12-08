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
import { selectedRange, leftOfSelected, rightOfSelected } from './Utils';
import { toKeyNames, translateKeys } from './ElementMenu';
import { noSubmitOnEnter } from '../utils';
import Constants from '../../constants';

const i18n = Constants.locstr.timeline.rangeEdit;

function protect(r, p, def = '') {
  let v = def;
  if (r != null && r[p] != null) v = r[p];
  return v;
}

function protectClock(r) {
  let v = {y: 2017, m:10, d: 10, h: 10, i: 10, s: 10};
  if (r != null && r.clock != null) v = r.clock;
  return v;
}

function protectNumber(r, p, def = '') {
  let v = def;
  if (r != null && r[p] != null) v = r[p];
  v = +(+v).toFixed(3);
  return v;
}

export const constWidth = 10;

export default class RangeEdit extends React.PureComponent {

  static propTypes = {
    /*eslint-disable*/
    storeState: React.PropTypes.object.isRequired,
    actions: React.PropTypes.object.isRequired
    /*eslint-enable*/
  };

  constructor(props) {
    super(props);
    autobind(this);
  }

  handleChangeRangeType(event) {
    const range = selectedRange(this.props);
    if (range === null) return;
    if (event.target.value === 'TimeEvent' || event.target.value === 'MediaEvent') {
      this.props.actions.changeRangeProps(
        this.props.storeState.selected,
        {
          type: event.target.value,
          width: Math.min(constWidth, range.width)
        });
    } else {
      this.props.actions.changeRangeProps(this.props.storeState.selected,
        { type: event.target.value });
    }
  }

  handleChangeRangeData(event) {
    this.props.actions.changeRangeProps(this.props.storeState.selected,
      { data: event.target.value });
  }

  handleChangeRangeKeyCode(event) {
    this.props.actions.changeRangeProps(this.props.storeState.selected,
      { keycode: translateKeys(event.target.value) });
  }

  handleChangeRangeBegin(event) {
    const value = +event.target.value;
    const range = selectedRange(this.props);
    const lrange = leftOfSelected(this.props);
    const rrange = rightOfSelected(this.props);
    const min = (lrange ? lrange.begin + lrange.duration : 0);
    const max = (rrange ? rrange.begin : this.props.storeState.timeLineDuration);
    if (value < min || value > max) {
      // start is out of bounds
    }
    const begin = (value < min ? min : value);
    const start = begin * this.props.storeState.sizeFromDuration;
    const duration = (begin + range.duration > max ?
      max - begin :
      range.duration);
    const width = duration * this.props.storeState.sizeFromDuration;
    this.props.actions.changeRangeProps(this.props.storeState.selected,
      { begin, start, duration, width });
  }

  handleChangeRangeDuration(event) {
    const value = +event.target.value;
    const range = selectedRange(this.props);
    const rrange = rightOfSelected(this.props);
    const max = (rrange ? rrange.begin : this.props.storeState.timeLineDuration);
    const duration = (value + range.begin > max ? max - range.begin : value);
    const width = duration * this.props.storeState.sizeFromDuration;
    this.props.actions.changeRangeProps(this.props.storeState.selected,
      { duration, width });
  }

  handleChangeRangeDateSeconds(event) {
    const value = +event.target.value;
    const range = selectedRange(this.props);
    const clock = range.clock;
    clock.s = value;
    this.props.actions.changeRangeProps(this.props.storeState.selected, { clock });
  }

  handleChangeRangeDateMinutes(event) {
    const value = +event.target.value;
    const range = selectedRange(this.props);
    const clock = range.clock;
    clock.i = value;
    this.props.actions.changeRangeProps(this.props.storeState.selected, { clock });
  }

  handleChangeRangeDateHours(event) {
    const value = +event.target.value;
    const range = selectedRange(this.props);
    const clock = range.clock;
    clock.h = value;
    this.props.actions.changeRangeProps(this.props.storeState.selected, { clock });
  }

  handleChangeRangeDateDay(event) {
    const value = +event.target.value;
    const range = selectedRange(this.props);
    const clock = range.clock;
    clock.d = value;
    this.props.actions.changeRangeProps(this.props.storeState.selected, { clock });
  }

  handleChangeRangeDateMonth(event) {
    const value = +event.target.value;
    const range = selectedRange(this.props);
    const clock = range.clock;
    clock.m = value;
    this.props.actions.changeRangeProps(this.props.storeState.selected, { clock });
  }

  handleChangeRangeDateYear(event) {
    const value = +event.target.value;
    const range = selectedRange(this.props);
    const clock = range.clock;
    clock.y = value;
    this.props.actions.changeRangeProps(this.props.storeState.selected, { clock });
  }

  render() {
    const selRange = selectedRange(this.props);
    const type = protect(selRange, 'type');
    const keycode = protect(selRange, 'keycode');
    const data = protect(selRange, 'data');
    const clock = protectClock(selRange);
    const begin = protectNumber(selRange, 'begin');
    const duration = protectNumber(selRange, 'duration');
    const url = protect(selRange, 'title', '<>');
    return (
      <span>
        <table id="listeditrange">
          <tbody>
            <tr>
              <td>
                <label htmlFor="editrangetype">{i18n.event.type}</label>
              </td>
              <td>
                <select
                  id="editrangetype"
                  onChange={this.handleChangeRangeType}
                  value={type}
                >
                  <option value="StreamEvent">{i18n.eventOptions.streamEvent}</option>
                  <option value="KeyEvent">{i18n.eventOptions.keyEvent}</option>
                  <option value="MediaEvent">{i18n.eventOptions.mediaEvent}</option>
                  <option value="TimeEvent">{i18n.eventOptions.timeEvent}</option>
                  <option value="ClockEvent">{i18n.eventOptions.clockEvent}</option>
                </select>
              </td>
              <td style={{ width: 15 }} />
              {(type === 'KeyEvent') &&
                <td>
                  <label htmlFor="editrangekey">{i18n.event.keycode}</label>
                </td>}
              {(type === 'KeyEvent') &&
                <td>
                  <input
                    type="text"
                    id="editrangekey"
                    size="7"
                    step="1"
                    onChange={this.handleChangeRangeKeyCode}
                    value={toKeyNames(keycode)}
                    onKeyPress={noSubmitOnEnter}
                  />
                </td>}
              {(type === 'StreamEvent') &&
                <td>
                  <label htmlFor="editrangedata">{i18n.event.data}</label>
                </td>}
              {(type === 'StreamEvent') &&
                <td>
                  <input
                    type="text"
                    id="editrangedata"
                    size="12"
                    step="1"
                    onChange={this.handleChangeRangeData}
                    value={data}
                    onKeyPress={noSubmitOnEnter}
                  />
                </td>}
              {(type === 'ClockEvent') &&
                <td>
                  <label htmlFor="editrangedate">{i18n.time}</label>
                </td>}
              {(type === 'ClockEvent') &&
                <td>
                <input
                  type="number"
                  min="2015"
                  max="2040"
                  size="4"
                  step="1"
                  onChange={this.handleChangeRangeDateYear}
                  value={clock.y}
                  onKeyPress={noSubmitOnEnter}
                />
                /
                <input
                  type="number"
                  min="1"
                  max="12"
                  size="2"
                  step="1"
                  onChange={this.handleChangeRangeDateMonth}
                  value={clock.m}
                  onKeyPress={noSubmitOnEnter}
                />
                /
                <input
                  type="number"
                  min="1"
                  max="31"
                  size="2"
                  step="1"
                  onChange={this.handleChangeRangeDateDay}
                  value={clock.d}
                  onKeyPress={noSubmitOnEnter}
                />
                <br />
                <input
                  type="number"
                  min="0"
                  max="23"
                  size="2"
                  step="1"
                  onChange={this.handleChangeRangeDateHours}
                  value={clock.h}
                  onKeyPress={noSubmitOnEnter}
                />
                :
                <input
                  type="number"
                  min="0"
                  max="59"
                  size="2"
                  step="1"
                  onChange={this.handleChangeRangeDateMinutes}
                  value={clock.i}
                  onKeyPress={noSubmitOnEnter}
                />
                :
                <input
                  type="number"
                  min="0"
                  max="59"
                  id="editrangedate"
                  size="2"
                  step="1"
                  onChange={this.handleChangeRangeDateSeconds}
                  value={clock.s}
                  onKeyPress={noSubmitOnEnter}
                />
              </td>}
              <td style={{ width: 15 }} />
              <td>
                <label htmlFor="editrangebegin">{i18n.event.begin}</label>
              </td>
              <td>
                <input
                  type="number"
                  id="editrangebegin"
                  size="8"
                  step="1"
                  onChange={this.handleChangeRangeBegin}
                  value={begin}
                  onKeyPress={noSubmitOnEnter}
                />
              </td>
              <td style={{ width: 15 }} />
              {(type === 'TimeEvent' || type === 'MediaEvent') &&
                <td>
                  <label htmlFor="editrangeduration">{i18n.event.dura}</label>
                </td>}
              {(type === 'TimeEvent' || type === 'MediaEvent') &&
                <td>
                  <input
                    type="number"
                    id="editrangeduration"
                    size="8"
                    step="1"
                    onChange={this.handleChangeRangeDuration}
                    value={duration}
                    onKeyPress={noSubmitOnEnter}
                  />
                </td>}
              <td style={{ width: 15 }} />
              <td>
                <label htmlFor="editpage">{i18n.page}:</label>
              </td>
              <td>
                <input
                  id="editpage"
                  size="20"
                  step="1"
                  onChange={() => { }}
                  value={url}
                  contentEditable="false"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </span>
    );
  }
}
