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
import { createStore } from 'redux';
import undoable from 'redux-undo';
import { ADD_RANGE, REMOVE_RANGE, SWITCH_RANGES, MOVE_TIMEMARKER,
  CHANGE_FRONT, CHANGE_BACK, CHANGE_TIMELINE_PROPS, SELECT, RESTORE,
  CHANGE_RANGE_PROPS, CHANGE_UI } from './Actions';

const initialState = {
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
};

let rangeKey = 0;

function switchRanges(state, index) {
  // switch range i with the next one
  const sortedIndex = state.sortedRanges.indexOf(index);
  const tr = state.ranges;
  if (sortedIndex >= tr.length - 1 || sortedIndex < 0) {
    // then return an empty object as nothing is done
    return {};
  }
  const newSorted = [...state.sortedRanges];
  const save = newSorted[sortedIndex];
  newSorted[sortedIndex] = newSorted[sortedIndex + 1];
  newSorted[sortedIndex + 1] = save;
  const newRanges = [...state.ranges];
  const r2 = tr[state.sortedRanges[sortedIndex + 1]];
  newRanges[index] = Object.assign({}, tr[index], {
    start: r2.start + r2.width - tr[index].width,
    begin: r2.begin + r2.duration - tr[index].duration,
    key: rangeKey++
  });
  newRanges[state.sortedRanges[sortedIndex + 1]] = Object.assign({}, r2, {
    start: tr[index].start,
    begin: tr[index].begin,
    key: rangeKey++
  });
  return { ranges: newRanges, sortedRanges: newSorted };
}

function sortUponAdd(state, range) {
  // if untimed, then return sortedRanges unmodified
  if (range.type === 'StreamEvent' || range.type === 'KeyEvent' || range.type === 'ClockEvent') {
    return state.sortedRanges;
  }
  let i = 0;
  while (i < state.sortedRanges.length &&
         state.ranges[state.sortedRanges[i]].start < range.start) {
    i++;
  }
  // here i is the index in sortedRanges of the first range to the right of the inserted range
  // so we need to insert the new range here
  // the new range will have the index (in ranges) ranges.length
  const newSortedRanges = [...state.sortedRanges];
  newSortedRanges.splice(i, 0, state.ranges.length);
  return newSortedRanges;
}

function sortUponRemove(state, index) {
  // index is for the ranges table and disappears
  // indexes above go down by one
  const newSortedRanges = [];
  for (let i = 0; i < state.sortedRanges.length; i++) {
    if (state.sortedRanges[i] < index) {
      newSortedRanges.push(state.sortedRanges[i]);
    } else if (state.sortedRanges[i] > index) {
      newSortedRanges.push(state.sortedRanges[i] - 1);
    }
    // and do nothing when equal
  }
  return newSortedRanges;
}

function TimeLineApp(state = initialState, action) {
  switch (action.type) {
    case CHANGE_UI:
      return Object.assign({}, state, {
        streamEvents: action.stream,
        mediaEvents: action.media,
        keyEvents: action.key,
        timeEvents: action.time,
        clockEvents: action.clock
      });
    case ADD_RANGE:
      /*eslint-disable*/
      action.range.key = rangeKey++;
      /*eslint-enable*/
      return Object.assign({}, state, {
        ranges: [...state.ranges, action.range],
        sortedRanges: sortUponAdd(state, action.range)
      });
    /*eslint-disable*/
    case REMOVE_RANGE:
      /*eslint-enable*/
      if (action.index < 0 || action.index >= state.ranges.length) {
        return state;
      }
      let newSR = state.selected;
      if (newSR === action.index) {
        newSR = -1;
      } else if (newSR > action.index) {
        newSR -= 1;
      }
      const newRanges = state.ranges.filter((o, i) => action.index !== i);
      const newSortedRanges = sortUponRemove(state, action.index);
      return Object.assign({}, state, {
        ranges: newRanges,
        sortedRanges: newSortedRanges,
        selected: newSR
      });
    case CHANGE_BACK:
      return Object.assign({}, state, {
        backComponent: action.page
      });
    case SWITCH_RANGES:
      return Object.assign({}, state, switchRanges(state, action.index));
    case CHANGE_TIMELINE_PROPS:
      return Object.assign({}, state, action.prop);
    case MOVE_TIMEMARKER:
      return Object.assign({}, state, {
        marker: { pixel: action.time * state.sizeFromDuration, seconds: action.time }
      });
    /*eslint-disable*/
    case CHANGE_RANGE_PROPS:
      /*eslint-enable*/
      if (action.index < 0 || action.index >= state.ranges.length) return state;
      const s = Object.assign({}, state);
      s.ranges = s.ranges.slice(0); // clone the array that contains changes
      s.ranges[action.index] = Object.assign({}, s.ranges[action.index], action.props);
      // assumption here is that the order is not changed
      return s;
    case SELECT:
      return Object.assign({}, state, {
        selected: action.rangeIndex
      });
    case RESTORE:
      rangeKey = 0;
      // adjust rangekey to max of keys
      if (action.project.ranges) {
        action.project.ranges.forEach((range) => {
          if (rangeKey <= range.key) {
            rangeKey = range.key + 1;
          }
        });
      }
      // filter untimed events that are still in sortedRanges
      action.project.sortedRanges =
        action.project.sortedRanges.filter((i) => {
          const type = action.project.ranges[i].type;
          return type === 'TimeEvent' || type === 'MediaEvent';
        });
      // it is a brand new object, not reused, OK to just use
      return action.project;
    default:
      return state;
  }
}

let previousAction = null;

function hasSameProps(obj1, obj2) {
  if (!obj1 || !obj2) return true;
  const obj1Props = Object.keys(obj1);
  const obj2Props = Object.keys(obj2);
  if (obj1Props.length === obj2Props.length) {
    return obj1Props.every(prop => obj2Props.indexOf(prop) >= 0);
  }
  return false;
}

function undoFilter(action, currentState, previousHistory) {
  // SELECT is not taken into account by undo-redo
  // so sometimes selection may change unexplicably after an undo/redo
  if (action.type === SELECT) return false;
  // if no previous action, store current action as previous action and return true
  if (previousAction === null) {
    previousAction = action;
    return true;
  }
  switch (action.type) {
    // case ADD_RANGE: break;
    // case REMOVE_RANGE: break;
    // case SWITCH_RANGES: break;
    case MOVE_TIMEMARKER:
      if (previousAction.type === MOVE_TIMEMARKER) {
        // if same action, return false and no need to change the previous action...
        return false;
      }
      break;
    // case CHANGE_FRONT: break;
    // case CHANGE_BACK: break;
    case CHANGE_TIMELINE_PROPS:
      if (previousAction.type === CHANGE_TIMELINE_PROPS &&
          hasSameProps(previousAction.props, action.props)) {
        // if same action, return false and no need to change the previous action...
        return false;
      }
      break;
    // case SELECT: break;
    // case RESTORE: break;
    case CHANGE_RANGE_PROPS:
      if (previousAction.type === CHANGE_RANGE_PROPS &&
          previousAction.index === action.index &&
          hasSameProps(previousAction.props, action.props)) {
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


export default createStore(undoable(TimeLineApp, { filter: undoFilter }));

