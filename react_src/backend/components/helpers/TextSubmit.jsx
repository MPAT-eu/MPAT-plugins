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
 * Jean-Philippe Ruijs (jean-philippe.ruijs@telecom.paristech.fr)
 *
 **/
import React, { PropTypes as Types } from 'react';
import { noSubmitOnEnter } from '../../utils';
import Constants from '../../../constants';

const i18n = Constants.locstr.textSubmit;

export default class TextSubmit extends React.PureComponent {

  static propTypes = {
    placeholder: Types.string,
    tooltiptext: Types.string,
    onClickSubmit: Types.func
  };

  state = {
    text: ''
  };

  onChange = (e) => {
    this.setState({ text: e.target.value });
  };

  onClickSubmit = (e) => {
    e.preventDefault();
    this.props.onClickSubmit && this.props.onClickSubmit(this.state.text);
    this.setState({ text: "" });
  };

  render() {
    return (
      <span>
        <input
          placeholder={this.props.placeholder}
          type="text"
          key='1'
          onKeyPress={noSubmitOnEnter}
          onChange={this.onChange}
          value={this.state.text}
        />
        <button onClick={this.onClickSubmit} className="white_blue" >{i18n.ok}</button>
      </span>
    );
  }
}
