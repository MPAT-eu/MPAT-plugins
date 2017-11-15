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
 * Jean-Philippe Ruijs (github.com/jeanphilipperuijs)
 *
 **/
import React from 'react';
import TimeLineEditor from './TimeLineEditor';
import { log } from './Utils';
import KeyEvent from './KeyEvent';
import { constWidth } from './RangeEdit';
import Constants from '../../constants';

const i18n = Constants.locstr.timeline.elementMenu;

let value = 'StreamEvent';
let post = null;
let autoStreamEventData = 1;

const translate = {
  RED: KeyEvent.VK_RED,
  GREEN: KeyEvent.VK_GREEN,
  YELLOW: KeyEvent.VK_YELLOW,
  BLUE: KeyEvent.VK_BLUE,
  BACK: KeyEvent.VK_BACK,
  ENTER: KeyEvent.VK_ENTER,
  UP: KeyEvent.VK_UP,
  LEFT: KeyEvent.VK_LEFT,
  DOWN: KeyEvent.VK_DOWN,
  RIGHT: KeyEvent.VK_RIGHT,
  0: KeyEvent.VK_0,
  1: KeyEvent.VK_1,
  2: KeyEvent.VK_2,
  3: KeyEvent.VK_3,
  4: KeyEvent.VK_4,
  5: KeyEvent.VK_5,
  6: KeyEvent.VK_6,
  7: KeyEvent.VK_7,
  8: KeyEvent.VK_8,
  9: KeyEvent.VK_9
};

export function translateKeys(key) {
  if (translate[key]) return translate[key];
  return key;
}

export function toKeyNames(keyCode) {
  if (keyCode === KeyEvent.VK_RED) return 'RED';
  if (keyCode === KeyEvent.VK_GREEN) return 'GREEN';
  if (keyCode === KeyEvent.VK_YELLOW) return 'YELLOW';
  if (keyCode === KeyEvent.VK_BLUE) return 'BLUE';
  if (keyCode === KeyEvent.VK_BACK) return 'BACK';
  if (keyCode === KeyEvent.VK_ENTER) return 'ENTER';
  if (keyCode === KeyEvent.VK_UP) return 'UP';
  if (keyCode === KeyEvent.VK_LEFT) return 'LEFT';
  if (keyCode === KeyEvent.VK_DOWN) return 'DOWN';
  if (keyCode === KeyEvent.VK_RIGHT) return 'RIGHT';
  if (keyCode === KeyEvent.VK_0) return '0';
  if (keyCode === KeyEvent.VK_1) return '1';
  if (keyCode === KeyEvent.VK_2) return '2';
  if (keyCode === KeyEvent.VK_3) return '3';
  if (keyCode === KeyEvent.VK_4) return '4';
  if (keyCode === KeyEvent.VK_5) return '5';
  if (keyCode === KeyEvent.VK_6) return '6';
  if (keyCode === KeyEvent.VK_7) return '7';
  if (keyCode === KeyEvent.VK_8) return '8';
  if (keyCode === KeyEvent.VK_9) return '9';
  return keyCode;
}

export default class ElementMenu extends React.PureComponent {

  static propTypes = {
    /*eslint-disable*/
    storeState: React.PropTypes.object.isRequired,
    actions: React.PropTypes.object.isRequired
    /*eslint-enable*/
  };

  static sortedPages = window.MPATTimeLinePages.map((a) => {
    a.title = a.title.toUpperCase();
    return a;
  }).sort((a,b) => a.title < b.title ? -1 : 1);

  constructor() {
    super();
    this.removeBack = this.removeBack.bind(this);
    this.add = this.add.bind(this);
  }

  getTimeRange(eventType) {
    const range = this.getFreeRegion();
    if (range === null || range.start < 0 || range.width < 0 ||
      range.start + range.width > this.props.storeState.timeLineLength) {
      return null;
    }
    log(`freeRegion ${range.start} ${range.width}`);
    const sfd = this.props.storeState.sizeFromDuration;
    const w = (eventType === 'TimeEvent' || eventType === 'MediaEvent' ?
      range.width : Math.min(constWidth, range.width));
    const v = {
      // generated ID in case we add one post multiple times
      id: Object(this.props.storeState.ranges).length,
      title: post && post.title,
      blogid: post && post.blogid,
      postid: post && post.postid,
      type: eventType,
      start: range.start,
      width: w,
      begin: range.start / sfd,
      duration: w / sfd
    };
    if (eventType === 'MediaTime') {
      v.time = range.start / sfd;
    } else if (eventType === 'KeyEvent') {
      v.keycode = -1;
    } else if (eventType === 'ClockEvent') {
      const time = new Date();
      v.clock = {
        y: time.getFullYear(),
        m: time.getMonth() + 1,
        d: time.getDate(),
        h: time.getHours(),
        i: time.getMinutes(),
        s: time.getSeconds()
      }
    } else if (eventType === 'StreamEvent') {
      v.data = `${autoStreamEventData++}`;
    }
    v.url = post && post.guid;
    return v;
  }

  /* assumption, the scenario is ordered */
  getFreeRegion() {
    const sorted = this.props.storeState.sortedRanges;
    const selectedIndex = this.props.storeState.selected;
    const sortedIndex = sorted.indexOf(selectedIndex);
    const timeranges = this.props.storeState.ranges;
    const selectedRange = (selectedIndex >= 0 ? timeranges[selectedIndex] : null);
    const timeLineLength = this.props.storeState.timeLineLength;
    // if no ranges, create one for whole duration
    if (timeranges.length === 0) return { start: 0, width: timeLineLength };
    // if one range is selected and free space after, add there
    if (selectedRange != null) {
      if (sortedIndex === timeranges.length - 1) {
        // selected range is last
        if (selectedRange.start + selectedRange.width < timeLineLength) {
          // there is space after
          return {
            start: selectedRange.start + selectedRange.width,
            width: timeLineLength - (selectedRange.start + selectedRange.width)
          };
        }
      } else if (selectedRange.start + selectedRange.width <
        timeranges[sorted[sortedIndex + 1]].start) {
        // selected range is not last
        // get the next index in the sortedRanges, then get the data from that range
        // there is space after selected
        return {
          start: selectedRange.start + selectedRange.width,
          width: timeranges[sorted[sortedIndex + 1]].start
          - (selectedRange.start + selectedRange.width)
        };
      }
    }
    const min = timeranges[sorted[0]].start;
    const max = timeranges[sorted[timeranges.length - 1]].start +
      timeranges[sorted[timeranges.length - 1]].width;
    // if space before first range, use it
    if (min > 0) return { start: 0, width: min };
    // if space after last range, use it
    if (max < timeLineLength) {
      return {
        start: max,
        width: timeLineLength - max
      };
    }
    // use first in-between space if any
    for (let i = 0; i < timeranges.length - 1; i++) {
      const s = timeranges[sorted[i]].start + timeranges[sorted[i]].width;
      const e = timeranges[sorted[i + 1]].start;
      if (s < e) return { start: s, width: e - s };
    }
    return null;
  }

  add() {
    log(`ElementMenu add ${value} ${post && post.title}`);
    switch (value) {
      case 'MediaEvent':
      case 'TimeEvent':
      case 'ClockEvent':
        if (post === null) return; // do not allow empty page in time-related events
      /*eslint-disable*/
      case 'StreamEvent':
      case 'KeyEvent':
        /*eslint-enable*/
        const gtr = this.getTimeRange(value);
        if (gtr === null) {
          // no free space or some other problem
          TimeLineEditor.updateStatusInfo(i18n.noFreeSpace);
          return;
        }
        if (value === 'KeyEvent') {
          log('KeyEvent', gtr);
          /*eslint-disable*/
          gtr.keycode = translateKeys(prompt(i18n.enterKeyCode, 'RED'));
          /*eslint-enable*/
        }
        this.props.actions.addRange(gtr);
        break;
      case 'Back':
        if (post === null) {
          this.props.actions.changeBack(null);
        } else {
          this.props.actions.changeBack(
            {
              name: post.title,
              meta: post.meta,
              guid: post.guid,
              blogid: post.blogid,
              postid: post.postid
            }
          );
        }
        break;
      default:
        break;
    }
  }

  removeBack() {
    this.props.actions.changeBack(null);
  }

  broadcast() {
    return this.props.storeState.ui === 'broadcast' ||
           this.props.storeState.ui === 'broadcastplus' ||
           this.props.storeState.ui === 'complete';
  }

  vod() {
    return this.props.storeState.ui === 'vod' ||
           this.props.storeState.ui === 'complete';
  }

  render() {
    const back = this.props.storeState.backComponent;
    return (
      <div id="timelinecontainer" className="timeline-container">
        {i18n.addToTheTimeline}
        <table style={{ fontSize: 'smaller' }}>
          <tbody>
            {this.vod() &&
            <tr>
              <td>
                <input type="radio" name="action" onChange={() => {
                  value = i18n.back;
                }}/>
                Video page {i18n.inTheBack}
              </td>
            </tr>
            }
            {back &&
            <tr>
              <td>
              {i18n.backPage}: {back.name}
                <button
                  type="button"
                  className="timeline-elt-button"
                  onClick={this.removeBack}
                >
                {i18n.remove}
                </button>
                </td>
              </tr>
            }
            <tr>
              <td>{i18n.eventLinkToPage}</td>
            </tr>
            {(this.broadcast() || this.props.storeState.streamEvents) &&
            <tr>
              <td>
                <input
                  type="radio"
                  name="action"
                  defaultChecked
                  onChange={() => {
                    value = 'StreamEvent';
                  }}
                />
                {i18n.streamEvent || "Stream Event"} <div className="StreamEvent coloredrect"/>
              </td>
            </tr>
            }
            {this.props.storeState.keyEvents &&
            <tr>
              <td>
                <input
                  type="radio"
                  name="action"
                  onChange={() => {
                    value = 'KeyEvent';
                  }}
                />
                {i18n.keyEvent || "Key Event"}
                <div className="KeyEvent coloredrect"/>
              </td>
            </tr>
            }
            {(this.vod() || this.props.storeState.mediaEvents) &&
            <tr>
              <td>
                <input
                  type="radio"
                  name="action"
                  onChange={() => { value = 'MediaEvent'; }}
                />
                {i18n.mediaEvent || "Media Event"}
                <div className="MediaEvent coloredrect"/>
              </td>
            </tr>
            }
            {this.props.storeState.timeEvents &&
            <tr>
              <td>
                <input
                  type="radio"
                  name="action"
                  onChange={() => {
                    value = 'TimeEvent';
                  }}
                />
                {i18n.timeEvent || "Time Event"}
                <div className="TimeEvent coloredrect"/>
              </td>
            </tr>
            }
            {this.props.storeState.clockEvents &&
            <tr>
              <td>
                <input
                  type="radio"
                  name="action"
                  onChange={() => {
                    value = 'ClockEvent';
                  }}
                />
                {i18n.clockEvent || "Clock Event"}
                <div className="ClockEvent coloredrect"/>
              </td>
            </tr>
            }
          </tbody>
        </table>
        {i18n.targetPage}:
        <select
          className="timeline-elt-select"
          onChange={(ev) => {
            post = (ev.target.value >= 0 ?
              ElementMenu.sortedPages[ev.target.value] : null);
          }}
        >
          <option key={-1} value={-1}>&lt;empty&gt;</option>
          {ElementMenu.sortedPages.map(
            (p, i) =>
              <option
                key={i}
                value={i}
              >
                {p.title}
              </option>)}
        </select> <br />
        <button type="button" className="timeline-button addelement-button" onClick={this.add}>
        {i18n.addElement}
        </button>
      </div>
    );
  }
}

