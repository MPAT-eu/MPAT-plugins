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
 * Miggi Zwicklbauer (miggi.zwicklbauer@fokus.fraunhofer.de)
 * Thomas Tröllmich  (thomas.troellmich@fokus.fraunhofer.de)
 *
 **/
import React, { PropTypes as Types } from 'react';

export default class BoxHeader extends React.PureComponent {
  static propTypes = {
    children: Types.oneOfType([Types.element, Types.arrayOf(Types.element)]).isRequired,
    boxSize: Types.shape({
      width: Types.number,
      height: Types.number
    }).isRequired,
    minWidth: Types.number.isRequired
  };
  constructor(props) {
    super();
    this.state = {
      isCollapsed: props.boxSize.width < props.minWidth
    };
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.boxSize.width !== this.props.boxSize.width) {
      if (nextProps.boxSize.width > this.props.minWidth) {
        this.setState({ isCollapsed: false });
      } else {
        this.setState({ isCollapsed: true });
      }
    }
  }
  calcCollapse(hover) {
    this.setState({ isCollapsed: !hover && this.props.boxSize.width < this.props.minWidth });
  }
  render() {
    const { children } = this.props;
    let minWidth = this.props.minWidth;
    const { isCollapsed } = this.state;
    const width = isCollapsed ? '40px' : '100%';
    minWidth = isCollapsed ? '0' : minWidth;
    return (
      <div
        className="boxHeader"
        style={{ width, minWidth }}
        onMouseEnter={() => this.calcCollapse(true)}
        onMouseLeave={() => this.calcCollapse(false)}
      >
        { isCollapsed ?
          <div><span className="dashicons dashicons-menu" /></div>
              :
          children
        }
      </div>
    );
  }
}
