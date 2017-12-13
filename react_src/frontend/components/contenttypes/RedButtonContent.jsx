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
 * Miggi Zwicklbauer (miggi.zwicklbauer@fokus.fraunhofer.de)
 * Thomas Tröllmich  (thomas.troellmich@fokus.fraunhofer.de)
 * Jean-Claude Dufourd (jean-claude.dufourd@telecom-paristech.fr
 * Stefano Miccoli (stefano.miccoli@finconsgroup.com)
 * Marco Ferrari (marco.ferrari@finconsgroup.com)
 **/
import React from 'react';
import autobind from 'class-autobind';
import { createTaggedHandler } from '../../utils';
import { classnames } from '../../../functions';
import { registerHandlers, unregisterHandlers } from '../../RemoteBinding';
import { componentLoader } from '../../../ComponentLoader';

class RedButtonContent extends React.Component {

  // TODO propTypes and defaultProps

  constructor() {
    super();
    autobind(this);
    this.state = { visible: false };
  }

  componentDidMount() {
    registerHandlers(this, [
      createTaggedHandler('global', KeyEvent.VK_RED, this.redButtonTrigger)
    ]);
    window.setTimeout(() => {
      this.setState({ visible: true });
      window.setTimeout(() => this.setState({ visible: false }), this.props.duration * 1000);
    }, this.props.time * 1000);
  }

  componentWillUnmount() {
    unregisterHandlers(this);
  }

  redButtonTrigger() {
    window.location.href = this.props.url;
  }

  render() {
    return (
      <div
        className={classnames({
          'page-element-content': true,
          'image-content': true,
          fullscreen: this.props.active
        })}
      >
        <img
          src={this.props.img}
          style={{ visibility: (this.state.visible ? 'visible' : 'hidden') }}
          role="presentation"
        />
      </div>
    );
  }
}
componentLoader.registerComponent(
  'redbutton',
  { view: RedButtonContent },
  {
    isStylable: false
  });
