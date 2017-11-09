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
import { createReducer, mergeState as merge } from '../utils';

const prefix = type => `ui/${type}`;
export const CHANGE_AREA_STATE = prefix('CHANGE_AREA_STATE');
export const SAVE_TEMPLATE = prefix('SAVE_TEMPLATE');
export const DELETE_TEMPLATE = prefix('DELETE_TEMPLATE');
export const FETCH_TEMPLATES = prefix('FETCH_TEMPLATES');

const initialState = {
  selectedAreaStates: {},
  templates: [],
  pending: false
};

export default createReducer(initialState, {
  [CHANGE_AREA_STATE]: merge((stateId, areaId) => ({
    selectedAreaStates: {
      [areaId]: stateId
    }
  })),
  [`${SAVE_TEMPLATE}_REQUEST`]: merge(() => ({
    pending: true
  })),
  [`${SAVE_TEMPLATE}_SUCCESS`]: merge(() => ({
    pending: false
  })),
  [`${SAVE_TEMPLATE}_FAIL`]: merge(() => ({
    pending: false
  })),
  [`${DELETE_TEMPLATE}_REQUEST`]: merge(() => ({
    pending: true
  })),
  [`${DELETE_TEMPLATE}_SUCCESS`]: merge(() => ({
    pending: false
  })),
  [`${DELETE_TEMPLATE}_FAIL`]: merge(() => ({
    pending: false
  })),
  [`${FETCH_TEMPLATES}_REQUEST`]: merge(() => ({
    pending: true
  })),
  [`${FETCH_TEMPLATES}_SUCCESS`]: merge(templates => ({
    templates,
    pending: false
  })),
  [`${FETCH_TEMPLATES}_FAIL`]: merge(() => ({
    pending: false
  }))
});
