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
import TimeLineEditor from './TimeLineEditor';
import ButtonWP from './ButtonWP';
import OptionIO from '../../OptionIO';
import { clearHistory } from './redux/UndoRedo';
import Constants from '../../constants';

const i18n = Constants.locstr.restoreButton;

export default class RestoreButton extends React.PureComponent {

  static propTypes = {
    /*eslint-disable*/
    storeState: React.PropTypes.object,
    actions: React.PropTypes.object
    /*eslint-enable*/
  };

  constructor(props) {
    super(props);
    this.lastAction = new Date();
    this.timesincelastAction = -1;
    this.loadScenario = this.loadScenario.bind(this);
  }

  loadScenario() {
    OptionIO.getCommon().get(
      'timeline_scenario',
      (a) => {
        this.props.actions.restore(a);
        clearHistory();
        TimeLineEditor.updateStatusInfo(Constants.locstr.timeline.scenario_loaded);
      },
      (e) => {
        TimeLineEditor.updateStatusInfo(i18n.restore + e);
      }
    );
  }

  render() {
    return (
      <ButtonWP
        value={Constants.locstr.timeline.restore.button.value}
        title={Constants.locstr.timeline.restore.button.title}
        action={this.loadScenario}
        bgColor="#43B4F9"
      />
    );
  }
}
