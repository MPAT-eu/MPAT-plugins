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
 * Benedikt Vogel 	 (vogel@irt.de)
 *
 **/
import React, { PropTypes as Types } from 'react';
import { createTaggedHandler } from '../../utils';
import { registerHandlers, unregisterHandlers } from '../../RemoteBinding';
import { setTrackingEnabled, isTrackingEnabled } from '../../analytics';
import { componentLoader } from '../../../ComponentLoader';
import { application } from '../../appData';

class ToggleTrackingContent extends React.Component {

  static propTypes = {
    disabledText: Types.string,
    enabledText: Types.string,
    button: Types.string
  };

  static defaultProps = {
    disabledText: 'Enable',
    enabledText: 'Disable',
    button: '0'
  };

  state = {
    trackingEnabled: isTrackingEnabled()
  };

  componentDidMount() {
    registerHandlers(this, [createTaggedHandler('always', KeyEvent[`VK_${this.props.button}`], this.toggleTracking)]);
  }

  componentWillUnmount() {
    unregisterHandlers(this);
  }

  toggleTracking = () => {
    setTrackingEnabled(!isTrackingEnabled());
    this.setState({ trackingEnabled: isTrackingEnabled() });
  }

  render() {
    const { disabledText, enabledText, button } = this.props;
    return (
      <div className="page-element-content toggle-tracking-content">
        <ul className="menu-component horizontal-menu-component">
          <li className="menu-item">
            <span>
              <img src={application.icons.remote[`button_${button}`]} /> {this.state.trackingEnabled ? enabledText : disabledText }
            </span>
          </li>
        </ul>
      </div>
    );
  }
}
componentLoader.registerComponent('toggletracking', { view: ToggleTrackingContent }, {
  isHotSpottable: false,
  isStylable: true
});
