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
 * Jean-Claude Dufourd (jean-claude.dufourd@telecom-paristech.fr
 *
 **/
import {
  CHANGE_AREA_STATE_CONTENT,
  CHANGE_AREA_STATE_META,
  CHANGE_AREA_STATE_TYPE,
  CHANGE_AREA_STATE_STYLE,
  CHANGE_PAGE_LAYOUT,
  CHANGE_PAGE_STYLES,
  CHANGE_BACKGROUND,
  CHANGE_DEFAULT_ACTIVE,
  ADD_AREA_STATE,
  DELETE_AREA_STATE,
  EDIT_AREA_STATE_NAME,
  CHANGE_AREA_TEMPLATE,
  SET_STATE_ACTIVE
} from '../reducers/pageModelReducer';

import {
  changeAreaState
} from './pageUIActions';

const create = (type, payload, meta) => ({ type, payload, meta });

export const changeAreaStateContent = (areaId, stateId, data) => (
  create(CHANGE_AREA_STATE_CONTENT, data, { areaId, stateId })
);
export const changeAreaStateStyle = (areaId, stateId, styles) => (
  create(CHANGE_AREA_STATE_STYLE, styles, { areaId, stateId })
);
export const changeAreaStateMeta = (areaId, stateId, key, value) => (
  create(CHANGE_AREA_STATE_META, { key, value }, { areaId, stateId })
);
export const changeAreaStateType = (areaId, stateId, newComponentType) => (
  create(CHANGE_AREA_STATE_TYPE, {newComponentType}, { areaId, stateId })
);
export const addAreaState = (areaId, title) => (
  create(ADD_AREA_STATE, title, { areaId })
);
export const editAreaStateName = (areaId, stateId, title) => (
  create(EDIT_AREA_STATE_NAME, title, { areaId, stateId })
);
export const deleteAreaState = (areaId, stateId) => (dispatch, getState) => {
  const states = Object.keys(getState().model.present.pageContent[areaId]);
  if (states.length > 1) {
    dispatch(create(DELETE_AREA_STATE, stateId, areaId));
    if (getState().ui.selectedAreaStates[areaId] === stateId) {
      const selectedStateId = states.find(id => id !== stateId);
      if (selectedStateId) {
        dispatch(changeAreaState(areaId, selectedStateId));
      }
    }
  }
};
export const changeBackground = background => (
  create(CHANGE_BACKGROUND, background)
);
export const changePageStyles = styles => (
  create(CHANGE_PAGE_STYLES, styles)
);
export const changeDefaultActive = id => (
  create(CHANGE_DEFAULT_ACTIVE, id)
);
export const changePageLayout = id => (
  create(CHANGE_PAGE_LAYOUT, id)
);

export const changeAreaTemplate = (areaId, templateId) => (dispatch, getState) => {
  const templates = getState().ui.templates;
  const templateData = templates.find(template => template.id === templateId);
  if (templateData) {
    const id = areaId;
    dispatch(create(
      CHANGE_AREA_TEMPLATE,
      templateData.content,
      id
    ));
  }
};

export const setStateActive = (areaId, key) => (
    create(SET_STATE_ACTIVE, areaId, key)
);
