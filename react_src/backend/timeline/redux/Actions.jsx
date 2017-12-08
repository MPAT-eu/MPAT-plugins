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
 * Jean-Claude Dufourd (Telecom ParisTech)
 **/
export const ADD_RANGE = 'ADD_RANGE';
export const REMOVE_RANGE = 'REMOVE_RANGE';
export const CHANGE_RANGE_PROPS = 'CHANGE_RANGE_PROPS';
export const SWITCH_RANGES = 'SWITCH_RANGES';
export const MOVE_TIMEMARKER = 'MOVE_TIMEMARKER';
export const CHANGE_BACK = 'CHANGE_BACK';
export const CHANGE_TIMELINE_PROPS = 'CHANGE_TIMELINE_PROPS';
export const SELECT = 'SELECT';
export const RESTORE = 'RESTORE';
export const CHANGE_UI = 'CHANGE_UI';

const debugActions = false;

export function changeUi(stream, media, key, time, clock) {
  if (debugActions) window.console.log('changeUi');
  return {
    type: CHANGE_UI,
    stream,
    media,
    key,
    time,
    clock
  };
}

export function addRange(range) {
  if (debugActions) window.console.log('addRange');
  return {
    type: ADD_RANGE,
    range
  };
}

export function selectRange(rangeIndex) {
  if (debugActions) window.console.log('selectRange');
  return {
    type: SELECT,
    rangeIndex
  };
}

export function removeRange(index) {
  if (debugActions) window.console.log('removeRange');
  return {
    type: REMOVE_RANGE,
    index
  };
}

export function changeRangeProps(index, props) {
  if (debugActions) window.console.log('changeRangeProps');
  return {
    type: CHANGE_RANGE_PROPS,
    index,
    props
  };
}

export function switchRanges(index) {
  if (debugActions) window.console.log('switchRanges');
  return {
    type: SWITCH_RANGES,
    index
  };
}

export function moveTimeMarker(time) {
  if (debugActions) window.console.log('moveTimeMarker');
  return {
    type: MOVE_TIMEMARKER,
    time
  };
}

export function changeBack(page) {
  if (debugActions) window.console.log('changeBack');
  return {
    type: CHANGE_BACK,
    page
  };
}

export function changeTimeLineProps(propValue) {
  if (debugActions) window.console.log('changeTimeLineProps');
  return {
    type: CHANGE_TIMELINE_PROPS,
    prop: propValue
  };
}

export function restore(project) {
  if (debugActions) window.console.log('restore');
  return {
    type: RESTORE,
    project
  };
}
