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
import { log } from './Utils';
// import { getTooltipped } from '../tooltipper.jsx';

export default class Draggable extends React.PureComponent {
  static propTypes = {
    tooltip: React.PropTypes.string,
    x: React.PropTypes.number,
    y: React.PropTypes.number,
    set: React.PropTypes.func.isRequired,
    maxx: React.PropTypes.func.isRequired,
    maxy: React.PropTypes.func.isRequired,
    minx: React.PropTypes.func.isRequired,
    miny: React.PropTypes.func.isRequired,
    dragged: React.PropTypes.func,
    children: React.PropTypes.node
  };

  constructor(props) {
    super(props);
    this.state = {
      dragging: false,
      hasMoved: false
    };
    this.onMouseDown = this.onMouseDown.bind(this);
  }

  componentDidUpdate(props, state) {
    if (this.state.dragging && !state.dragging) {
      this.addEventListener('mousemove', this.onMouseMove.bind(this));
      this.addEventListener('mouseup', this.onMouseUp.bind(this));
    } else if (!this.state.dragging && state.dragging) {
      this.clearListeners();
    }
  }

  onMouseDown(e) {
    log('Draggable onMouseDown');
    /* if not left button; ignore */
    if (e.button !== 0) return;
    this.initialCursorPosition = {
      x: e.screenX, y: e.screenY
    };
    this.initialObjectPosition = {
      x: this.currentObjectPosition.x,
      y: this.currentObjectPosition.y
    };
    this.setState({
      dragging: true,
      hasMoved: false
    });
    if (this.props.dragged) this.props.dragged(true);
    e.stopPropagation();
    e.preventDefault();
  }

  onMouseUp(e) {
    log('Draggable onMouseUp');
    this.setState({ dragging: false });
    if (this.props.dragged) this.props.dragged(false);
    this.props.set(this.currentObjectPosition.x, this.currentObjectPosition.y);
    e.stopPropagation();
    e.preventDefault();
  }

  onMouseMove(e) {
    log(`Draggable onMouseMove shift=${e.shiftKey}`);
    if (!this.state.dragging) return;
    const ipx = this.initialObjectPosition.x + e.screenX - this.initialCursorPosition.x;
    const ipy = this.initialObjectPosition.y + e.screenY - this.initialCursorPosition.y;
    this.setPosition(ipx, ipy);
    this.props.set(this.currentObjectPosition.x, this.currentObjectPosition.y);
    e.stopPropagation();
    e.preventDefault();
    log(`Draggable onMouseMove${ipx} ${ipy}`);
  }

  /*
   * check and set if the position if no collision detected
   * added shift-drag option to ignore x-axis collisions
   */
  setPosition(_newx, _newy) {
    let newx = _newx;
    let newy = _newy;
    // X-axis (time)
    let limit = this.getLimitMinX();
    if (newx < limit) {
      newx = limit;
    }
    limit = this.getLimitMaxX();
    if (newx > limit) {
      newx = limit;
    }
    // Y-axis (fixed space)
    limit = this.getLimitMinY();
    if (newy < limit) {
      newy = limit;
    }
    limit = this.getLimitMaxY();
    if (newy > limit) {
      newy = limit;
    }
    this.currentObjectPosition = { x: newx, y: newy };
    this.setState({ hasMoved: true });
    log(`Draggable setPosition (${newx}, ${newy}, ${limit})`);
  }

  getLimitMaxY() {
    return (typeof this.props.maxy === 'function' ? this.props.maxy() : this.props.maxy);
  }

  getLimitMinY() {
    return (typeof this.props.miny === 'function' ? this.props.miny() : this.props.miny);
  }

  getLimitMinX() {
    return (typeof this.props.minx === 'function' ? this.props.minx() : this.props.minx);
  }

  getLimitMaxX() {
    return (typeof this.props.maxx === 'function' ? this.props.maxx() : this.props.maxx);
  }

  clearListeners() {
    while (this.listeners.length > 0) {
      const p = this.listeners.pop();
      document.removeEventListener(p.event, p.func);
    }
  }

  listeners = [];
  initialCursorPosition = null;
  initialObjectPosition = null;
  currentObjectPosition = {
    x: this.props.x,
    y: this.props.y
  };

  addEventListener(event, func) {
    this.listeners.push({ event, func });
    document.addEventListener(event, func);
  }

  render() {
    this.currentObjectPosition = {
      x: this.props.x,
      y: this.props.y
    };
    return (
      <div
        className="tltooltip"
        onMouseDown={this.onMouseDown}
        style={{
          position: 'absolute',
          left: `${this.props.x}px`,
          top: `${this.props.y}px`
        }}
      >
        {this.props.children}
        {this.props.tooltip && <div className="tltooltiptext">{this.props.tooltip}</div>}
      </div>
    );
  }
}
