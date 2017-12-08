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
import { thisRange } from './Utils';
import { toKeyNames } from './ElementMenu';

export default class Event extends React.PureComponent {
  static propTypes = {
    i: React.PropTypes.number.isRequired,
    nbuntimed: React.PropTypes.number.isRequired,
    position: React.PropTypes.number.isRequired,
    /*eslint-disable*/
    storeState: React.PropTypes.object.isRequired,
    actions: React.PropTypes.object.isRequired
    /*eslint-enable*/
  };

  static getTooltip(range) {
    switch (range.type) {
      case 'StreamEvent':
        return `StreamEvent ${range.data}`;
      case 'KeyEvent':
        return `KeyEvent ${toKeyNames(range.keycode)}`;
      case 'ClockEvent':
        return `ClockEvent ${range.clock.y}/${range.clock.m}/${range.clock.d} ${range.clock.h}:${range.clock.i}:${range.clock.s}`;
      default:
        return 'unknown';
    }
  }

  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
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

  render() {
    const range = thisRange(this.props);
    const eventTitle = range.title || '';
    const tooltip = Event.getTooltip(range);
    const width = (this.props.nbuntimed === 0 ? 100 :
      Math.min(100, 960 / this.props.nbuntimed));
    return (
      <div
        className="tltooltip"
        style={{position: 'absolute', left: this.props.position * width, width: width}}
      >
        <div
          className={`timerange ${range.type}${
            (this.props.i === this.props.storeState.selected)
              ? ' selected'
              : ''}`}
          onClick={this.handleClick}
          id={`tl${range.id}`}
          style={{width: width}}
        >
          {eventTitle.substr(0, 10)}
        </div>
        {tooltip && <div className="tltooltiptext">{tooltip}</div>}
      </div>
    );
  }
}
