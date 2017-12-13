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
 * Jean-Claude Dufourd (Telecom ParisTech)
 **/
import React from 'react';
import Popup from 'react-popup';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as Actions from './Actions';
import TimeLineEditor from '../TimeLineEditor';
import TimeLineWizard from '../TimeLineWizard';
import UndoRedo from './UndoRedo';

function TimeLineContainer(props) {
  let Container = TimeLineEditor;
  if (window.MPATOther.timeline_scenario === '' || window.MPATOther.timeline_scenario.reset) Container = TimeLineWizard;
  return (
    <div>
      <Popup />
      <Container {...props} />
      <UndoRedo />
    </div>
  );
}

function stateToProps(state) {
  return { storeState: state.present };
}

function dispatchToProps(dispatch) {
  return { actions: bindActionCreators({ ...Actions }, dispatch) };
}

export default connect(stateToProps, dispatchToProps)(TimeLineContainer);
