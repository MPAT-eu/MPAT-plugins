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
import React from 'react';
import autobind from 'class-autobind';

import { createHandler, handlersWithTag } from '../../utils';
import { registerHandlers, unregisterHandlers } from '../../RemoteBinding';
import { trackAction } from '../../analytics';
import { componentLoader } from '../../../ComponentLoader';

class ListContent extends React.Component {

  // TODO propTypes and defaultProps

  constructor() {
    super();
    autobind(this);
    this.state = {
      currentIndex: 0
    };
  }

  componentDidMount() {
    // Register Key Handlers
    registerHandlers(this, handlersWithTag('active', [
      createHandler(KeyEvent.VK_UP, this.up),
      createHandler(KeyEvent.VK_DOWN, this.down),
      createHandler(KeyEvent.VK_ENTER, this.enter)
    ]));
  }

  componentWillUnmount() {
    unregisterHandlers(this);
  }

  up() {
    const state = this.state;
    state.currentIndex--;
    if (state.currentIndex < 0) {
      state.currentIndex = this.props.listArray.length - 1;
    }
    this.setState(state);
    trackAction('list', 'up', this.props.listArray[state.currentIndex].description);
  }

  down() {
    const state = this.state;
    state.currentIndex++;
    if (state.currentIndex >= this.props.listArray.length) {
      state.currentIndex = 0;
    }
    this.setState(state);
    trackAction('list', 'down', this.props.listArray[state.currentIndex].description);
  }

  enter() {
    const url = this.props.listArray[this.state.currentIndex].appUrl;
    trackAction('list', 'goto', url);
    window.location.href = url;
  }

  render() {
    const items = this.props.listArray;
    return (
      <div>
        {items.map((item, i) => (
          <ListElement
            key={i}
            item={item}
            isSelected={i === this.state.currentIndex}
          />
        ))}
      </div>
    );
  }
}

function ListElement({ item, isSelected }) {
  let css;
  if (isSelected) {
    css = { border: '2px #f00 solid', margin: '10px', padding: '10x' };
  } else { css = { border: '2px #ddd solid', margin: '10px', padding: '10x' }; }
  return (
    <div style={css}>
      <a href={item.appUrl}>{item.title}</a>
      <p>{item.description}</p>
    </div>
  );
}
componentLoader.registerComponent('list', { view: ListContent }, {
  isStylable: true
});
