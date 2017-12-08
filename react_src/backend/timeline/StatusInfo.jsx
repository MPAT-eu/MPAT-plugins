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
 * Jean-Claude Dufourd (Telecom ParisTech)
 * Jean-Philippe Ruijs (github.com/jeanphilipperuijs)
 *
 **/
import React from 'react';
import Constants from '../../constants';
import TimeLineEditor from './TimeLineEditor';

const i18n = Constants.locstr.timeline;

export default class StatusInfo extends React.PureComponent {

  static propTypes = {
    /*eslint-disable*/
    storeState: React.PropTypes.object.isRequired
    /*eslint-enable*/
  };

  componentWillMount() {
    const wpadminbar = document.getElementById('wpadminbar');
    const l = document.createElement('label');
    l.className = 'statusinfo';
    wpadminbar.appendChild(l);
  }

  render() {
    let info = '';
    if (this.props.storeState.guid) {
      info = Constants.locstr.formatString(i18n.existing_project,
        this.props.storeState.blogname);
    } else {
      info = Constants.locstr.formatString(i18n.new_project,
        this.props.storeState.blogname);
    }
    TimeLineEditor.updateStatusInfo(info);
    return (
      <p className="statusinfo">{info}</p>
    );
  }
}
