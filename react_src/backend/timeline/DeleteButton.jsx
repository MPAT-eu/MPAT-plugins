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
import ButtonWP from './ButtonWP';

const i18n = Constants.locstr;

export default class DeleteButton extends React.PureComponent {
  static propTypes = {
    /*eslint-disable*/
    storeState: React.PropTypes.object.isRequired,
    actions: React.PropTypes.object
    /*eslint-enable*/
  }

  constructor(props) {
    super(props);
    this.lastAction = new Date();
    this.timesincelastAction = -1;
    this.deleteScenario = this.deleteScenario.bind(this);
  }

  deleteScenario() {
    const msg = i18n.formatString(i18n.timeline.remove.warning_overwrite,
      this.props.storeState.blogname);
    /*eslint-disable*/
    if (confirm(msg)) {
      /*eslint-enable*/
      window.MPATOther.timeline_scenario.reset = true;
      this.props.actions.restore(
        {
          reset: true,
          backComponent: null,
          ranges: [],
          sortedRanges: [],
          marker: {
            pixel: 0, seconds: 0
          },
          timeLineLength: 960,
          timeLineDuration: 720,
          sizeFromDuration: 960 / 720,
          selected: -1
        }
      );
    }
  }

  render() {
    return (
      <ButtonWP value={i18n.timeline.remove.button.value}
        title={i18n.timeline.remove.button.title}
        action={this.deleteScenario}
        bgColor="#43B4F9"
      />
    );
  }
}
