/**
 *
 * Copyright (c) 2017 MPAT Consortium , All rights reserved.
 * Fraunhofer FOKUS, Fincons Group, Telecom ParisTech, IRT, Lancaster University, Leadin, RBB, Mediaset
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
 **/
import React from 'react';
import autobind from 'class-autobind';

export default class ComponentToggle extends React.Component {
  constructor(props) {
    super(props);
    autobind(this);
    this.state = {
      enabled: this.props.enabled
    };
  }

  toggle(e) {
    e.preventDefault();
    const newState = !this.state.enabled;
    this.setState(
            { enabled: newState },
            this.props.updateState({
              componentName: this.props.name,
              enabled: newState
            })
        );
  }

  render() {
    return (<button className={this.state.enabled ? 'white_blue selected' : 'button white_blue disabled'} onClick={this.toggle}>{this.props.name}</button>);
  }
}
