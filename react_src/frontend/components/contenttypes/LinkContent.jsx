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
import { componentLoader } from '../../../ComponentLoader';
import { application } from '../../appData';
import { createHandler, handlersWithTag } from '../../utils';
import { classnames } from '../../../functions';
import { registerHandlers, unregisterHandlers } from '../../RemoteBinding';
// import { pageElemType, pageElemDefaults } from '../../types';

class LinkContent extends React.Component {

  static propTypes = {
    // ...pageElemType,
    label: Types.string,
    url: Types.string,
    cover: Types.bool,
    thumbnail: Types.string,
    pageUtils: Types.object
  };

  static defaultProps = {
    // ...pageElemDefaults
    label: '',
    url: '',
    cover: false,
    thumbnail: ''
  };

  componentDidMount() {
    if (application.application_manager.smooth_navigation) {
      registerHandlers(this, handlersWithTag('active', [
        createHandler(KeyEvent.VK_ENTER, () => { this.props.pageUtils.goToPage(this.props.url); })
      ]));
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!application.application_manager.smooth_navigation && nextProps.active) {
      this.props.pageUtils.goToPage(this.props.url);
    }
  }

  componentWillUnmount() {
    unregisterHandlers(this);
  }

  render() {
    return (
      <div
        className={classnames({ 'page-element-content': true, 'link-background': true })}
        style={{ backgroundImage: `url(${this.props.thumbnail})`, backgroundSize: this.props.cover ? 'cover' : 'contain' }}
      >
        <p>{this.props.label}</p>
      </div>
    );
  }
}
componentLoader.registerComponent('link', { view: LinkContent }, {
  isStylable: true
});
