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
 * AUTHORS:
 * Benedikt Vogel 	 (vogel@irt.de)
 *
 **/
import React from 'react';

export default class CustomLinkContent extends React.Component {

  // TODO propTypes and defaultProps

  componentWillReceiveProps(nextProps) {
    if (nextProps.active) {
      window.location.href = this.props.url;
    }
  }

  render() {
    return (!this.props.label ? <div /> :
    <div
      style={{
        zIndex: 301,
        background: '#222',
        color: 'white',
        padding: '12px',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
      }}
    >
      <p>{this.props.label}</p>
    </div>
    );
  }
}
