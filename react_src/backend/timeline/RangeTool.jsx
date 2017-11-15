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
 * Jean-Philippe Ruijs (github.com/jeanphilipperuijs)
 *
 **/
import React from 'react';
import RangeEdit from './RangeEdit';
import RangeRemove from './RangeRemove';
import ButtonWP from './ButtonWP';

import Constants from '../../constants';

const i18n = Constants.locstr.timeline.rangeTool;

export default class RangeTool extends React.PureComponent {
  constructor() {
    super();
    this.swapSelected = this.swapSelected.bind(this);
  }

  swapSelected() {
    const selectedIndex = this.props.storeState.selected;
    if (selectedIndex >= 0 &&
      selectedIndex < this.props.storeState.ranges.length &&  // plain array range check
      this.props.storeState.sortedRanges.indexOf(selectedIndex) <
      this.props.storeState.ranges.length - 1) { // sorted range is not last
      this.props.actions.switchRanges(selectedIndex);
    }
  }

  render() {
    return (
      <div className="borderLine">
        <table>
          <tbody>
            <tr>
              <td style={{ paddingRight: 300 }}>{i18n.range}</td>
              <td>
                <RangeRemove
                  style={{ float: 'right' }}
                  action={this.props.actions.removeRange}
                  storeState={this.props.storeState}
                />
              </td>
              <td>
                <ButtonWP
                  value={i18n.swapButton.value}
                  title={i18n.swapButton.title}
                  action={this.swapSelected}
                />
              </td>
            </tr>
          </tbody>
        </table>
        <RangeEdit storeState={this.props.storeState} actions={this.props.actions} />
      </div>
    );
  }
}


RangeTool.propTypes = {
  /*eslint-disable*/
  storeState: React.PropTypes.object.isRequired,
  actions: React.PropTypes.object.isRequired
  /*eslint-enable*/
};
