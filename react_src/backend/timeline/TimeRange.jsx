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
 * Author:
 * Jean-Claude Dufourd (Telecom ParisTech)
 **/
import React from 'react';
import Draggable from './Draggable';
import { log, sortedIndex, thisRange, leftRange, rightRange } from './Utils';
import { toKeyNames } from './ElementMenu';

export default class TimeRange extends React.PureComponent {
  static propTypes = {
    i: React.PropTypes.number,
    /*eslint-disable*/
    storeState: React.PropTypes.object.isRequired,
    actions: React.PropTypes.object.isRequired
    /*eslint-enable*/
  };

  static getTooltip(range) {
    return `${range.type} ${Math.round(range.begin)} ${Math.round(range.duration)}`;
  }

  constructor(props) {
    super(props);
    this.state = {
      mainTR: null,
      rightArrow: null,
      dragged: false
    };
    this.dragSetStart = this.dragSetStart.bind(this);
    this.dragSetWidth = this.dragSetWidth.bind(this);
    this.dragSetStartAndWidth = this.dragSetStartAndWidth.bind(this);
    this.minx = this.minx.bind(this);
    this.maxx = this.maxx.bind(this);
    this.maxx2 = this.maxx2.bind(this);
    this.maxx3 = this.maxx3.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.setDragged = this.setDragged.bind(this);
  }

  setDragged(b) {
    this.setState({ dragged: b });
  }

  setWidth(w) {
    log(`setWidth ${w}`);
    this.props.actions.changeRangeProps(this.props.i,
      {
        width: w,
        duration: w / this.props.storeState.sizeFromDuration
      });
  }

  dragSetStart(x, y) {
    log(`dragSetStart ${x} ${y}`);
    this.props.actions.changeRangeProps(this.props.i,
      {
        start: x,
        begin: x / this.props.storeState.sizeFromDuration
      });
  }

  dragSetWidth(x, y) {
    log(`dragSetWidth ${x} ${y}`);
    this.setWidth(x - thisRange(this.props).start);
  }

  dragSetStartAndWidth(x, y) {
    const range = thisRange(this.props);
    log(`dragSetStartAndWidth x:${x}, y:${y}, s:${+range.start}, w:${+range.width}`);
    /* maintain right bound */
    const d = x - range.start;
    this.props.actions.changeRangeProps(this.props.i,
      {
        start: x,
        width: range.width - d,
        begin: x / this.props.storeState.sizeFromDuration,
        duration: (range.width - d) / this.props.storeState.sizeFromDuration
      });
    this.state.mainTR.setPosition(x, y);
    this.state.rightArrow.setPosition(range.start + range.width - d, y);
  }

  handleClick(event) {
    if (this.props.storeState.selected === this.props.i) {
      this.props.actions.selectRange(-1);
    } else {
      this.props.actions.selectRange(this.props.i);
    }
    event.stopPropagation();
    event.preventDefault();
  }

  minx() {
    let tmp;
    const index = sortedIndex(this.props);
    if (index === 0) {
      tmp = 0;
    } else {
      const range = leftRange(this.props);
      tmp = range.start + range.width;
    }
    log(`TimeRange minx${tmp}`);
    return tmp;
  }

  maxx() {
    const currWidth = thisRange(this.props).width;
    let tmp;
    const range = rightRange(this.props);
    if (range) {
      tmp = range.start - currWidth;
    } else {
      tmp = this.props.storeState.timeLineLength - currWidth;
    }
    log(`TimeRange maxx${tmp}`);
    return tmp;
  }

  maxx2() {
    const range = rightRange(this.props);
    let tmp;
    if (range) {
      tmp = range.start;
    } else {
      tmp = this.props.storeState.timeLineLength;
    }
    log(`TimeRange maxx2${tmp}`);
    return tmp;
  }

  maxx3() {
    const range = thisRange(this.props);
    const tmp = range.start + range.width;
    log(`TimeRange maxx3${tmp}`);
  }

  resizable(range) {
    return !this.state.dragged && range.type === 'TimeEvent' || range.type === 'MediaEvent';
  }

  render() {
    const range = thisRange(this.props);
    const eventTitle = range.title || '';
    const tooltip = TimeRange.getTooltip(range);
    return (
      <div>
        <Draggable
          ref={(r) => { this.state.mainTR = r; }}
          x={range.start}
          y={0}
          set={this.dragSetStart}
          minx={this.minx}
          miny={() => 0}
          maxx={this.maxx}
          maxy={() => 0}
          dragged={this.setDragged}
          tooltip={tooltip}
        >
          {/*eslint-disable*/}
          {range.type === 'StreamEvent' &&
          <div
            className="shadowstreamev"
            id={`sh${range.id}`}
          >
            {eventTitle.substr(0, 10)}
          </div>}
          {range.type === 'KeyEvent' &&
          <div
            className="shadowkeyev"
            id={`sh${range.id}`}
          >
            {eventTitle.substr(0, 10)}
          </div>}
          {range.type === 'ClockEvent' &&
          <div
            className="shadowclockev"
            id={`sh${range.id}`}
          >
            {eventTitle.substr(0, 10)}
          </div>}
          <div
            className={`timerange ${range.type}${
              (this.props.i === this.props.storeState.selected)
                ? ' selected'
                : ''}`}
            onClick={this.handleClick}
            id={`tl${range.id}`}
            style={{ width: range.width - 1 }}
          >
            {/*eslint-enable*/}
            {eventTitle.substr(0, 10)}
          </div>
        </Draggable>
        {this.resizable(range) &&
        <Draggable
          ref={(r) => { this.state.rightArrow = r; }}
          x={range.start + range.width}
          y={0}
          set={this.dragSetWidth}
          minx={this.minx}
          miny={() => 0}
          maxx={this.maxx2}
          maxy={() => 0}
        >
          <div className="trresize">&gt;</div>
        </Draggable>}
      </div>
    );
  }
}
