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
import ButtonWP from './ButtonWP';
import Constants from '../../constants';

const i18n = Constants.locstr.timeline.rangeRemove;


export default class RangeRemove extends React.PureComponent {
  static propTypes = {
    /*eslint-disable*/
    storeState: React.PropTypes.object,
    /*eslint-enable*/
    action: React.PropTypes.func
  };

  constructor(props) {
    super(props);
    this.removeSelected = this.removeSelected.bind(this);
  }

  removeSelected() {
    const index = this.props.storeState.selected;
    if (index >= 0) {
      this.props.action(index);
    }
  }

  render() {
    return (
      <ButtonWP
        value={i18n.button.value}
        title={i18n.button.title}
        action={this.removeSelected}
        bgColor="#43B4F9"
      />
    );
  }
}
