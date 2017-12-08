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
import React from 'react';
import { ActionCreators as UndoActionCreators } from 'redux-undo';
import { connect } from 'react-redux';

let clearHistoryInternal;
let canLeaveInternal;

export function clearHistory() { clearHistoryInternal(); }

export function canLeave() { return canLeaveInternal; }

const UndoRedo = ({ canUndo, canRedo, onUndo, onRedo, onClearHistory }) => {
  clearHistoryInternal = onClearHistory;
  canLeaveInternal = !canUndo;
  return (
    <div id="undoRedo" className="undoRedo">
      <input
        type="button"
        className="button green_white"
        onClick={onUndo}
        disabled={!canUndo}
        value="UNDO"
      />
      &nbsp;
      <input
        type="button"
        className="button green_white"
        onClick={onRedo}
        disabled={!canRedo}
        value="REDO"
      />
    </div>
  );
};

UndoRedo.propTypes = {
  canUndo: React.PropTypes.bool,
  canRedo: React.PropTypes.bool,
  onClearHistory: React.PropTypes.func,
  onUndo: React.PropTypes.func,
  onRedo: React.PropTypes.func
};

const mapStateToProps = (state) => { // eslint-disable-line
  return {
    canUndo: state.past.length > 0,
    canRedo: state.future.length > 0
  };
};

const mapDispatchToProps = (dispatch) => { // eslint-disable-line
  return {
    onUndo: () => dispatch(UndoActionCreators.undo()),
    onRedo: () => dispatch(UndoActionCreators.redo()),
    onClearHistory: () => dispatch(UndoActionCreators.clearHistory())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UndoRedo);

