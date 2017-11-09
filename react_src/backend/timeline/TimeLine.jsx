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
import TimeRange from './TimeRange';
import TimeMarker from './TimeMarker';
import TimeScale from './TimeScale';
import RangeTool from './RangeTool';
import { log } from './Utils';
import Constants from '../../constants';

export default class TimeLine extends React.PureComponent {

  static propTypes = {
    /*eslint-disable*/
    storeState: React.PropTypes.object.isRequired,
    actions: React.PropTypes.object.isRequired
    /*eslint-enable*/
  };

  constructor() {
    super();
    this.locStr = Constants.locstr.timeline;
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(event) {
    log('handleClick', event.target);
    if (this.props.storeState.selected >= 0) {
      this.props.actions.selectRange(-1);
    }
    event.preventDefault();
    event.stopPropagation();
  }

  render() {
    const { timeLineLength, timeLineDuration, ranges } = this.props.storeState;
    return (
      <div>
        {/*eslint-disable*/}
        <div className="timeline" onClick={this.handleClick}>
          {/*eslint-enable*/}
          {ranges.map((range, i) => (
            <TimeRange
              storeState={this.props.storeState}
              actions={this.props.actions}
              key={range.key}
              i={i}
            />))}
          <TimeMarker storeState={this.props.storeState} actions={this.props.actions} />
          <TimeScale
            pixelLength={+timeLineLength}
            timeLineDuration={+timeLineDuration}
          />
        </div>
        <div id="propsheet">
          <RangeTool storeState={this.props.storeState} actions={this.props.actions} />
        </div>
      </div>
    );
  }
}
