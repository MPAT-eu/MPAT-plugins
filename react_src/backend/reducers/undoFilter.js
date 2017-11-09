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
 **/
import { CHANGE_BACKGROUND, CHANGE_COMPONENT_STYLE, CHANGE_AREA_STATE_META, CHANGE_AREA_STATE_CONTENT } from './pageModelReducer';

let previousAction = null;

export default function filterUndos(action, currentState, previousHistory) {
  // if no previous action, store current action as previous action and return true
  if (previousAction === null) {
    previousAction = action;
    return true;
  }
  switch (action.type) {
    case CHANGE_BACKGROUND:
      if (previousAction.type === CHANGE_BACKGROUND) {
        // if same action, return false and no need to change the previous action...
        return false;
      }
      break;
    case CHANGE_COMPONENT_STYLE:
      if (previousAction.type === CHANGE_COMPONENT_STYLE &&
          previousAction.payload.key === action.payload.key &&
          previousAction.meta.id === action.meta.id) {
        // if same action, return false and no need to change the previous action...
        return false;
      }
      break;
    case CHANGE_AREA_STATE_META:
      if (previousAction.type === CHANGE_AREA_STATE_META &&
        previousAction.payload.key === action.payload.key &&
        previousAction.meta.areaId === action.meta.areaId &&
        previousAction.meta.stateId === action.meta.stateId) {
        // if same action, return false and no need to change the previous action...
        return false;
      }
      break;
    case CHANGE_AREA_STATE_CONTENT:
      if (previousAction.type === CHANGE_AREA_STATE_CONTENT &&
        previousAction.meta.areaId === action.meta.areaId &&
        previousAction.meta.stateId === action.meta.stateId) {
        // if same action, return false and no need to change the previous action...
        return false;
      }
      break;
    default:
      break;
  }
  previousAction = action;
  return true; // no filter
}
