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
 * AUTHORS:
 * Miggi Zwicklbauer (miggi.zwicklbauer@fokus.fraunhofer.de)
 * Thomas Tröllmich  (thomas.troellmich@fokus.fraunhofer.de)
 * Benedikt Vogel 	 (vogel@irt.de)
 * Stefano Miccoli (stefano.miccoli@finconsgroup.com)
 * Marco Ferrari (marco.ferrari@finconsgroup.com)
 **/
import deepAssign from 'assign-deep';
import { post, layouts } from '../appData';
import { createReducer, mergeState } from '../utils';
import { generateId } from '../../functions';
import { componentLoader } from '../../ComponentLoader';

const prefix = type => `model/${type}`;
export const CHANGE_AREA_STATE_CONTENT = prefix('CHANGE_AREA_STATE_CONTENT');
export const CHANGE_AREA_STATE_STYLE = prefix('CHANGE_AREA_STATE_STYLE');
export const CHANGE_AREA_STATE_META = prefix('CHANGE_AREA_STATE_META');
export const CHANGE_AREA_STATE_TYPE = prefix('CHANGE_AREA_STATE_TYPE');
export const CHANGE_PAGE_LAYOUT = prefix('CHANGE_PAGE_LAYOUT');
export const CHANGE_AREA_TEMPLATE = prefix('CHANGE_AREA_TEMPLATE');
export const CHANGE_BACKGROUND = prefix('CHANGE_BACKGROUND');
export const CHANGE_PAGE_STYLES = prefix('CHANGE_PAGE_STYLES');
export const CHANGE_DEFAULT_ACTIVE = prefix('CHANGE_DEFAULT_ACTIVE');
export const ADD_AREA_STATE = prefix('ADD_AREA_STATE');
export const DELETE_AREA_STATE = prefix('DELETE_AREA_STATE');
export const EDIT_AREA_STATE_NAME = prefix('EDIT_AREA_STATE_NAME');
export const SET_STATE_ACTIVE = prefix('SET_STATE_ACTIVE');

const m = (!Array.isArray(post.meta) && post.meta ? post.meta : {});
const initialState = {
  model: m.model,
  pageContent: m.content && !(m.content instanceof Array) ? m.content : {},
  pageStyles: m.styles || {},
  background: m.background || '',
  layoutId: m.layoutId,
  defaultActive: m.defaultActive
};

const sanitizeState = (state) => {
  const s = deepAssign({}, state);
  // set default layout (first in list) to the page if not defined
  if (!s.layoutId || layouts.findIndex(({ id }) => id === s.layoutId) === -1) {
    if (layouts && layouts[0] && layouts[0].id) { s.layoutId = layouts[0].id; }
  }
  // set the first layout area as active if not area is defined as active
  const layout = layouts.find(({ id }) => id === s.layoutId);
  if (layout && layout.data && layout.data.find(box => box.i === s.defaultActive) === -1) {
    delete s.defaultActive;
  }
  // set default content (empty text component) to each layout area if not defined
  layout && layout.data && layout.data.forEach((box) => {
    if (!s.pageContent[box.i] || !Object.keys(s.pageContent[box.i]).length) {
      s.pageContent[box.i] = {};
      s.pageContent[box.i][generateId()] = instantiateNewState('default', true);
    }
  });

  return s;
};

function instantiateNewState(stateTitle, stateActive, componentTitle, componentType = 'text') {
  const componentInitialValues = componentLoader.getComponentDefaults(componentType);
  return {
    type: componentType,
    stateTitle,
    stateActive,
    componentTitle: componentTitle || '',
    ...componentInitialValues
  };
}

export default createReducer(sanitizeState(initialState), {
  [CHANGE_AREA_STATE_CONTENT]: mergeState((data = {}, { areaId, stateId = '_0' }) => ({
    pageContent: {
      [areaId]: {
        [stateId]: {
          data
        }
      }
    }
  })),
  [CHANGE_AREA_STATE_META]: (state, { key, value }, { areaId, stateId = '_0' }) => {
    let next = {
      pageContent: {
        [areaId]: {
          [stateId]: {
            [key]: value
          }
        }
      }
    };
    next = deepAssign({}, state, next);
    return next;
  },
  [CHANGE_AREA_STATE_TYPE]: (state, { newComponentType }, { areaId, stateId = '_0' }) => {
    const currentAreaState = state.pageContent[areaId][stateId];
    const newAreaState = instantiateNewState(currentAreaState.stateTitle,
                                                currentAreaState.stateActive,
                                                currentAreaState.componentTitle,
                                                newComponentType);
    const nextState = deepAssign({}, state);
      // deepAssign doesnt work here when previous element is a structured object which has to be replace with empty object
    nextState.pageContent[areaId][stateId] = newAreaState;
    return nextState;
  },
  [ADD_AREA_STATE]: mergeState((stateTitle, { areaId }) => ({
    pageContent: {
      [areaId]: {
	    [generateId()]: instantiateNewState(stateTitle, false)
      }
    }
  })),
  [DELETE_AREA_STATE]: (state, stateId, areaId) => {
    const next = deepAssign({}, state);
    delete next.pageContent[areaId][stateId];
    return next;
  },
  [EDIT_AREA_STATE_NAME]: (state, newtitle, { stateId, areaId }) => {
    const next = deepAssign({}, state);
    next.pageContent[areaId][stateId].stateTitle = newtitle;
    return next;
  },
  [CHANGE_PAGE_LAYOUT]: (state, payload) => {
    const layoutId = parseInt(payload, 10);
    if (state.layoutId !== layoutId) {
      let next = { ...state, layoutId };
      next.pageContent = {};
      next = sanitizeState(next);
      return next;
    }
  },
  [CHANGE_AREA_TEMPLATE]: mergeState((templateData, areaId) => ({
    pageContent: {
      [areaId]: templateData
    }
  })),
  [CHANGE_BACKGROUND]: mergeState(background => ({
    background
  })),
  [CHANGE_PAGE_STYLES]: (state, styles) => {
    let next = {
      pageStyles: styles
    };
    next = deepAssign({}, state, next);
    return next;
  },
  [CHANGE_AREA_STATE_STYLE]: (state, styles, { areaId, stateId }) => {
    let next = {
      pageContent: {
        [areaId]: {
          [stateId]: {
            styles
          }
        }
      }
    };
    next = deepAssign({}, state, next);
    return next;
  },
  /**
   * Change the active area on page init
   */
  [CHANGE_DEFAULT_ACTIVE]: (state, defaultActive) => {
    if (defaultActive === state.defaultActive) {
      const next = { ...state };
      delete next.defaultActive;
      return next;
    }
    return { ...state, defaultActive };
  },
  /**
   * Change the visible state for the area on page init
   */
  [SET_STATE_ACTIVE]: (state, areaId, stateId) => {
    const newState = Object.assign({}, state);
      // iterate area states
    for (const key of Object.keys(newState.pageContent[areaId])) {
	  if (stateId == key) {
	      newState.pageContent[areaId][key].stateActive = true;
	  } else {
	      newState.pageContent[areaId][key].stateActive = false;
	  }
    }
    return newState;
  }
});
