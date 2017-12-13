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
 * Benedikt Vogel 	 (vogel@irt.de)
 * Jean-Claude Dufourd (jean-claude.dufourd@telecom-paristech.fr
 * Stefano Miccoli (stefano.miccoli@finconsgroup.com)
 * Marco Ferrari (marco.ferrari@finconsgroup.com)
 **/
import React, { PropTypes as Types } from 'react';
import { pageElemType, pageElemDefaults } from '../../types';
import { componentLoader } from '../../../ComponentLoader';
import { application } from '../../appData';
import autobind from 'class-autobind';
import { classnames } from '../../../functions';
import { createHandler, handlersWithTag } from '../../utils';
import { registerHandlers, unregisterHandlers } from '../../RemoteBinding';

class ImageContent extends React.Component {

  static propTypes = {
    ...pageElemType,
    imgUrl: Types.string
  };

  static defaultProps = {
    ...pageElemDefaults,
    imgUrl: ''
  };

  constructor(props) {
    super(props);
    autobind(this);
    this.state = {
      fullscreen: props.active
    };
  }

  componentDidMount() {
    if (application.application_manager.smooth_navigation &&
      this.props.navigable) {
      registerHandlers(this, handlersWithTag('active', [
        createHandler(KeyEvent.VK_ENTER, () => { this.setState({ fullscreen: true }); }),
        createHandler(KeyEvent.VK_BACK, () => { this.setState({ fullscreen: false }); })
      ]));
    }
  }

  componentWillReceiveProps(nextProps) {
    // gaining control of component -> go to fullscreen only if not smooth
    // In case of smooth navigation active status is set automatically by Page, but user didnt press ok yet
    if (!application.application_manager.smooth_navigation && nextProps.active &&
      this.props.navigable) {
      this.setState({ fullscreen: true });
    }
    // losing control of component, remove fullscreen anyway
    if (!nextProps.active && nextProps.active != this.props.active && this.props.navigable) {
      this.setState({ fullscreen: false });
    }
  }

  componentWillUnmount() {
    if (this.props.navigable) unregisterHandlers(this);
  }

  render() {
    return (
      <div
        style={{ backgroundImage: `url(${this.props.imgUrl})` }}
        className={classnames({
          'page-element-content': true,
          'image-content': true,
          fullscreen: this.state.fullscreen
        })}
      />
    );
  }
}

componentLoader.registerComponent('image', { view: ImageContent }, {
  isStylable: false
});
