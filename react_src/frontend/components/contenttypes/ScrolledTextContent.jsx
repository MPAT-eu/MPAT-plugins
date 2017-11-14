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
 * Benedikt Vogel    (vogel@irt.de)
 * Jean-Claude Dufourd (jean-claude.dufourd@telecom-paristech.fr
 *
 **/
import React from 'react';
import autobind from 'class-autobind';
import { createHandler, handlersWithTag } from '../../utils';
import { registerHandlers, unregisterHandlers } from '../../RemoteBinding';
import { ArrowDownST, ArrowUpST } from '../icons/Icons';
import { componentLoader } from '../../../ComponentLoader';
import { application } from '../../appData';

class ScrolledTextContent extends React.Component {

  // TODO propTypes and defaultProps

  constructor() {
    super();
    autobind(this);
    this.state = {
      textOffset: 0
    };
  }

  componentDidMount() {
    registerHandlers(this, handlersWithTag('active', [
      createHandler(KeyEvent.VK_UP, this.scrollUp),
      createHandler(KeyEvent.VK_DOWN, this.scrollDown)
    ]));
    this.scrollMax = (this.props.position.height * 0.8) - document.getElementById(`scrolledText${this.props.id}`).offsetHeight;
  }

  componentWillUnmount() {
    unregisterHandlers(this);
  }

  //scrollMax = -1;

  hasScrollUp() {
    return (this.state.textOffset !== 0);
  }

  hasScrollDown() {
    return (this.state.textOffset !== this.scrollMax);
  }

  scrollUp() {
    if (application.application_manager.smooth_navigation &&
      this.state.textOffset === 0) return false;
    // console.log("up");
    let off = this.state.textOffset;
    off += this.props.position.height * 0.8;
    if (off > 0) off = 0;
    this.setState({ textOffset: off });
  }

  scrollDown() {
    if (application.application_manager.smooth_navigation &&
      this.state.textOffset === this.scrollMax) return false;
    // console.log("down");
    let off = this.state.textOffset;
    off -= this.props.position.height * 0.8;
    if (off < this.scrollMax) off = this.scrollMax;
    this.setState({ textOffset: off });
  }

  render() {
    const { unfocussedArrowColor = '#888888',
      focussedArrowColor = '#43B4F9', arrowsPosition = 'ONTEXTRIGHT',
      text, id } = this.props;
    const arrowUpPosition = `${arrowsPosition}up`;
    const arrowDownPosition = `${arrowsPosition}down`;

    return (
      <div className="page-element-content text-content">
        {this.hasScrollUp() &&
        <div className={arrowUpPosition}>
          <ArrowUpST color={unfocussedArrowColor} activeColor={focussedArrowColor} />
        </div>}
        <div style={{ position: 'relative', overflow: 'hidden', width: '100%', height: '100%' }}>
          <div
            id={`scrolledText${id}`}
            style={{ position: 'absolute', top: this.state.textOffset }}
            dangerouslySetInnerHTML={{ __html: text }}
          />
        </div>
        {this.hasScrollDown() &&
        <div className={arrowDownPosition}>
          <ArrowDownST color={unfocussedArrowColor} activeColor={focussedArrowColor} />
        </div>}
      </div>
    );
  }

}
componentLoader.registerComponent('scrolledtext', { view: ScrolledTextContent }, {
  isStylable: true
});
