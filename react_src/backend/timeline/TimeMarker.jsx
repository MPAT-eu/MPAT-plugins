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

export default class TimeMarker extends React.PureComponent {

  static propTypes = {
    /*eslint-disable*/
    storeState: React.PropTypes.object.isRequired,
    actions: React.PropTypes.object.isRequired
    /*eslint-enable*/
  };

  constructor() {
    super();
    this.set = this.set.bind(this);
  }

  set(xx, yy) {
    let x = xx;
    let y = yy;
    if (isNaN(x)) x = 0;
    if (isNaN(y)) y = 0;
    this.props.actions.moveTimeMarker(Math.round(x / this.props.storeState.sizeFromDuration));
  }

  render() {
    return (
      <div>
        <Draggable
          set={this.set}
          x={this.props.storeState.marker.pixel}
          y={0}
          minx={() => 0}
          miny={() => 0}
          maxx={() => this.props.storeState.timeLineLength}
          maxy={() => 0}
        >
          <div id="timemarker" style={{ left: 0, width: 29 }}>
            <div className="timemarker" style={{ left: 0, width: 29, background: 'rgba(255, 0, 0, 0.)' }}>
              <div className="timemarker" style={{ top: -1, left: -2, width: 5, height: 58 }}>
                <div
                  style={{
                    top: -1,
                    left: -2,
                    width: 1,
                    height: 50,
                    background_color: 'rgba(0,0,0, 0.5)'
                  }}
                />
              </div>
            </div>
          </div>
        </Draggable>
      </div>
    );
  }
}
