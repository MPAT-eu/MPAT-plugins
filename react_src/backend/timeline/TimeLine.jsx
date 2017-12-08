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
import TimeRange from './TimeRange';
import Event from './Event';
import TimeMarker from './TimeMarker';
import TimeScale from './TimeScale';
import RangeTool from './RangeTool';
import { log } from './Utils';
import Constants from '../../constants';

let pos = 0;

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

  untimed(range) {
    switch (range.type) {
      case 'StreamEvent':
      case 'KeyEvent':
      case 'ClockEvent':
        return 1;
      default:
        return 0;
    }
  }

  position() {
    return pos++;
  }

  render() {
    const { timeLineLength, timeLineDuration, ranges } = this.props.storeState;
    const untimed = (ranges === null ? 0 : ranges.reduce((sum, a) => sum + this.untimed(a), 0));
    pos = 0;
    return (
      <div>
        <div className="timeline" onClick={this.handleClick}>
          {ranges.map((range, i) =>
                        (range.type === 'StreamEvent' ||
                          range.type === 'KeyEvent' ||
                          range.type === 'ClockEvent') ?
                          null : (
                            <TimeRange
                              storeState={this.props.storeState}
                              actions={this.props.actions}
                              key={range.key}
                              i={i}
                            />))
                 .filter(a => a) /* remove null */}
          <TimeMarker storeState={this.props.storeState} actions={this.props.actions} />
          <TimeScale
            pixelLength={+timeLineLength}
            timeLineDuration={+timeLineDuration}
          />
        </div>
        {untimed > 0 &&
        <div className="timeline2" onClick={this.handleClick}>
          {ranges.map((range, i) =>
                        (range.type === 'StreamEvent' ||
                          range.type === 'KeyEvent' ||
                          range.type === 'ClockEvent') ?
                          (<Event
                            storeState={this.props.storeState}
                            actions={this.props.actions}
                            key={range.key}
                            i={i}
                            position={this.position()}
                            nbuntimed={untimed}
                          />) : null)
                 .filter(a => a) /* remove null */}
        </div>
        }
        <div id="propsheet">
          <RangeTool storeState={this.props.storeState} actions={this.props.actions} />
        </div>
      </div>
    );
  }
}
