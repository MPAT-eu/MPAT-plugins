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
 *
 **/
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PageEditor from '../components/pageeditor/PageEditor';
import * as pageModelActions from '../actions/pageModelActions';
import * as pageUIActions from '../actions/pageUIActions';
import { getLayoutById } from '../utils';
import { layouts } from '../appData';

export default connect(
  (state) => {
    const layout = getLayoutById(state.model.present.layoutId) || layouts[0];
    const content = state.model.present.pageContent;
    const selectedAreaStates = Object.assign(
      ...Object.keys(content).map(key => ({ [key]: Object.keys(content[key])[0] })),
      state.ui.selectedAreaStates
    );

    return {
      ...state.model.present,
      ...state.ui,
      layout,
      layouts,
      selectedAreaStates
    };
  },
  dispatch => ({ actions: bindActionCreators(
    { ...pageModelActions, ...pageUIActions },
    dispatch
  ) })
)(PageEditor);
