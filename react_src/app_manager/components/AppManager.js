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
 * Jean-Philippe Ruijs (github.com/jeanphilipperuijs)
 * Jean-Claude Dufourd (jean-claude.dufourd@telecom-paristech.fr
 *
 **/
import React from 'react';
import { Sortable } from 'react-sortable';
import autobind from 'class-autobind';
import constants from '../../constants';

const i18n = constants.locstr.appMgr;

export default class AppManager extends React.Component {

  constructor(props) {
    super();
    autobind(this);
    this.state = {
      draggingIndex: null,
      data: {
        pagesOrder: props.data.pagesOrder.slice(0),
        selectedNavModel: props.data.selectedNavModel
      }
    };
  }

  updateState(obj) {
    this.setState(obj);
  }

  setContent(key, value, _id = false) {
    const state = this.state;
    if (_id) {
      const idx = state.data.pagesOrder.findIndex(({ id }) => id === _id);
      state.data.pagesOrder[idx][key] = value;
    } else {
      state[key] = value;
    }
    this.setState(state);
  }

  render() {
    const listItems = this.state.data.pagesOrder.map((item, i) => {
      const props = {
        ...item,
        setContent: this.setContent
      };
      return (
        <SortableListItem
          key={i}
          updateState={this.updateState.bind(this)}
          items={this.state.data.pagesOrder}
          draggingIndex={this.state.draggingIndex}
          sortId={i}
          outline="list"
          childProps={{ onDrop(e) { e.preventDefault(); } }}
        >{props}</SortableListItem>
      );
    }, this);
    const slideflowSettings = JSON.stringify(this.state.data);

    return (
      <div className="app-list">
        {listItems}
        <input type="hidden" name="mpat_application_manager[slideflow_settings]" value={slideflowSettings} />
      </div>
    );
  }
}

class ListItem extends React.Component {

  render() {
    const { id, excluded, name, setContent } = this.props.children;
    return (
      <div {...this.props} className="list-item">{name}
        <div className="right">
          {i18n.exclude}
          <input type="checkbox" checked={excluded} value="1" onChange={e => setContent('excluded', e.target.checked, id)} />
        </div>
      </div>
    );
  }
}

const SortableListItem = Sortable(ListItem);
