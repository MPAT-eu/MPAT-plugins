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
const debug = false;

export function log(msg) {
  if (debug) window.console.log(msg);
}

export function sortedIndex(props) {
  return props.storeState.sortedRanges.indexOf(props.i);
}

export function thisRange(props) {
  return props.storeState.ranges[props.i];
}

export function selectedRange(props) {
  if (props.storeState.selected < 0) return null;
  return props.storeState.ranges[props.storeState.selected];
}

export function leftRange(props) {
  const index = sortedIndex(props);
  if (index === 0) return null;
  return props.storeState.ranges[props.storeState.sortedRanges[index - 1]];
}

export function rightRange(props) {
  const index = sortedIndex(props);
  if (index === props.storeState.ranges.length - 1) return null;
  return props.storeState.ranges[props.storeState.sortedRanges[index + 1]];
}

export function leftOfSelected(props) {
  const index = props.storeState.sortedRanges.indexOf(props.storeState.selected);
  if (index === 0) return null;
  return props.storeState.ranges[props.storeState.sortedRanges[index - 1]];
}

export function rightOfSelected(props) {
  const index = props.storeState.sortedRanges.indexOf(props.storeState.selected);
  if (index === props.storeState.ranges.length - 1) return null;
  return props.storeState.ranges[props.storeState.sortedRanges[index + 1]];
}
