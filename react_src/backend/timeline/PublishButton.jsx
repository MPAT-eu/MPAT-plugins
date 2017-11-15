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
import TimeLineEditor from './TimeLineEditor';
import ButtonWP from './ButtonWP';
import Constants from '../../constants';
import OptionIO from '../../OptionIO';
import { clearHistory } from './redux/UndoRedo';

const i18n = Constants.locstr.timeline.publish;

export default class PublishButton extends React.PureComponent {

  static propTypes = {
    /*eslint-disable*/
    storeState: React.PropTypes.object.isRequired,
    /*eslint-enable*/
  };


  constructor(props) {
    super(props);
    this.lastAction = new Date();
    this.timesincelastAction = -1;
    this.createScenario = this.createScenario.bind(this);
  }

  createScenario() {
    if (this.props.storeState.guid) {
      const msg = `${i18n.warning_overwrite} ${this.props.storeState.blogname}`;
      /*eslint-disable*/
      if (confirm(msg)) {
        /*eslint-enable*/
        this.saveScenarioUsingRest();
      } else {
        // let statusinfo = document.getElementsByClassName('statusinfo')[0];
        TimeLineEditor.updateStatusInfo(i18n.no_ovewrite);
      }
    } else {
      this.saveScenarioUsingRest();
    }
  }

  saveScenarioUsingRest() {
    OptionIO.getCommon().put(
      'timeline_scenario',
      this.props.storeState,
      () => {
        clearHistory();
        TimeLineEditor.updateStatusInfo(i18n.scenario_published);
        window.setTimeout(() => {
          // TimeLineEditor.updateStatusInfo(respJSON.msg.post.guid;
          TimeLineEditor.updateStatusInfo('');
        }, this.props.timeout_label);
      },
      (e) => {
        TimeLineEditor.updateStatusInfo(i18n.failed + e);
      }
    );
  }

  render() {
    return (
      <ButtonWP
        value={i18n.button.value}
        title={i18n.button.title}
        action={this.createScenario}
        bgColor={Constants.styleguide.color.normal.green}
      />
    );
  }
}
