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
 * Stefano Miccoli (stefano.miccoli@finconsgroup.com)
 * Marco Ferrari (marco.ferrari@finconsgroup.com)
 **/
import React from 'react';
import autobind from 'class-autobind';

import { componentLoader } from '../../../ComponentLoader';
import { handlersWithTag, createHandler, log } from '../../utils';
import { registerHandlers, unregisterHandlers } from '../../RemoteBinding';

class BroadcastContent extends React.Component {
  constructor(props) {
    super(props);
    autobind(this);
    this.state = { fullScreen: false };
  }

  componentDidMount() {
    registerHandlers(this, handlersWithTag('always', [
      createHandler('appWillHide', this.goFullScreen),
      createHandler('appWillShow', this.fittComponent)
    ]));

    if (this.broadcast && this.broadcast.bindToCurrentChannel) {
      setTimeout(() => {
        this.broadcast.bindToCurrentChannel();
      }, 0);
    }
  }
  componentWillUnmount() {
    unregisterHandlers(this);
    if (this.broadcast && this.broadcast.release) {
      this.broadcast.release();
    }
  }
  fittComponent() {
    this.setState({ fullScreen: false });
  }

  goFullScreen() {
    this.setState({ fullScreen: true });
  }

  render() {
    const css = this.state.fullScreen ? { top: 0, left: 0, position: 'fixed', zIndex: 100, width: '1280px', height: '720px' } : { width: '100%', height: '100%' };
    return (
      <div style={css}>
        <object ref={b => (this.broadcast = b)} fullscreen={this.state.fullScreen} id="broadcast" type="video/broadcast" height="100%" width="100%" />
      </div>
    );
  }
}
componentLoader.registerComponent(
  'broadcast',
  { view: BroadcastContent },
  {
    isStylable: false
  });
