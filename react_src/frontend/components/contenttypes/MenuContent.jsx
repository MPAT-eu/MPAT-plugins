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
 * Stefano Miccoli (stefano.miccoli@finconsgroup.com)
 * Marco Ferrari (marco.ferrari@finconsgroup.com)
 **/
import React from 'react';
import autobind from 'class-autobind';
import { createHandler, createTaggedHandler, handlersWithTag } from '../../utils';
import { registerHandlers, unregisterHandlers } from '../../RemoteBinding';
import { trackAction } from '../../analytics/index';
import { componentLoader } from '../../../ComponentLoader';
import { application } from '../../appData';

class MenuContent extends React.Component {

  // duplicated default values from backend, we should avoid this by setting
  // default values in component data (ie: setContent even if not changed)
  static defaultProps = {
    orientation: 'horizontal',
    loop: false,
    sidemenu: false,
    showButtons: false,
    listArray: []
  };

  constructor(props) {
    super(props);
    autobind(this);
    this.state = {
      currentIndex: 0
    };
    let index = 0;
    this.currentPageInfo = props.pageUtils && props.pageUtils.getCurrentPage();
    if (props.listArray !== undefined) {
      for (const item of props.listArray) {
        if (this.currentPageInfo) { // async page loading
            if (item.appUrl.substring(0, 7) === 'page://') {
              // check if menu item linked to this page via internal uri
                const itemPageId = +item.appUrl.substring(7);
                if (itemPageId === +this.currentPageInfo.id) {
                    this.state.currentIndex = index;
                }
            } else if (item.appUrl === this.currentPageInfo.page_url) {
              // check if menu item linked to this page via standard url
                this.state.currentIndex = index;
            }
        } else if (item.appUrl === window.location.href ||
          item.appUrl === window.location.pathname) { // sync page loading
          this.state.currentIndex = index;
          break;
        }
        index++;
      }
    } else { console.log('MenuContent: no listArray in props'); }
  }

  componentDidMount() {
    // Register Key Handlers
    const isHorizontal = this.props.orientation === 'horizontal';

    const goToKeys = this.props.listArray.map(({ remoteKey }) => KeyEvent[remoteKey]);

    const activeHandlers = [
      createHandler(KeyEvent.VK_ENTER, this.enter),
      createHandler(isHorizontal ? KeyEvent.VK_LEFT : KeyEvent.VK_UP, this.prev),
      createHandler(isHorizontal ? KeyEvent.VK_RIGHT : KeyEvent.VK_DOWN, this.next)
    ];
    if (application.application_manager.smooth_navigation) {
      activeHandlers.push(createHandler(isHorizontal ? KeyEvent.VK_UP : KeyEvent.VK_LEFT,
                                        () => {return false;}));
      activeHandlers.push(createHandler(isHorizontal ? KeyEvent.VK_DOWN : KeyEvent.VK_RIGHT,
                                        () => {return false;}));
    }
    registerHandlers(this, handlersWithTag('active', activeHandlers).concat(
      createTaggedHandler('global', goToKeys, this.goTo)
    ));
  }
  componentWillUnmount() {
    unregisterHandlers(this);
  }

  prev() {
    const state = this.state;
    if (state.currentIndex === 0) {
        if (this.props.loop) {
            state.currentIndex = this.props.listArray.length - 1;
        } else if (application.application_manager.smooth_navigation) {
            return false;
        }
    } else if (state.currentIndex > 0) {
    state.currentIndex--;
    } else {
    }
    this.setState(state);
    trackAction('menu', 'prev', this.props.listArray[state.currentIndex].description);

    const curItem = this.props.listArray[state.currentIndex];
    if (curItem.role === 'control' &&
        this.props.targetComponent &&
        curItem.stateData.triggerAction === "focus") {
      const { targetState, targetLabel } = curItem.stateData;
      trackAction('menu', 'control', targetLabel);
      this.props.setAreaState(this.props.targetComponent, targetState);
    }
  }

  next() {
    const state = this.state;
    if (state.currentIndex === this.props.listArray.length - 1) {
        if (this.props.loop) {
            state.currentIndex = 0;
        } else if (application.application_manager.smooth_navigation) {
            return false;
        }
    } else if (state.currentIndex < this.props.listArray.length - 1) {
      state.currentIndex++;
    }
    this.setState(state);
    trackAction('menu', 'next', this.props.listArray[state.currentIndex].description);
    const curItem = this.props.listArray[state.currentIndex];
    if (curItem.role === 'control' &&
        this.props.targetComponent &&
        curItem.stateData.triggerAction === "focus") {
      const { targetState, targetLabel } = curItem.stateData;
      trackAction('menu', 'control', targetLabel);
      this.props.setAreaState(this.props.targetComponent, targetState);
    }
  }

  goTo(event) {
    const state = this.state;
    let index = 0;
    for (const item of this.props.listArray) {
      if (KeyEvent[item.remoteKey] === event.keyCode) {
        state.currentIndex = index;
        // select proper item and click on it
        this.setState(state);
        this.enter();
        break;
      }
      index++;
    }
  }

  enter() {
    const curItem = this.props.listArray[this.state.currentIndex];
    if (curItem.role === 'control' &&
       this.props.targetComponent &&
       curItem.stateData.triggerAction === "enter") {
      const { targetState, targetLabel } = curItem.stateData;
      trackAction('menu', 'control', targetLabel);
      this.props.setAreaState(this.props.targetComponent, targetState);
    } else if (curItem.role === 'application') {
      this.props.pageUtils.performAction(curItem.role, curItem.appData, curItem.remoteKey);
    } else if (curItem.role === 'ait') {
      this.props.pageUtils.performAction(curItem.role, curItem.aitData);
    } else if (!curItem.role || curItem.role === 'link') {
      // !curItem.role for backward compatibility
      const url = curItem.appUrl;
      trackAction('menu', 'goto', url);
      this.props.pageUtils.goToPage(url);
    }
  }

  render() {
    const componentClass = (this.props.orientation === 'horizontal') ?
      'menu-content horizontal-menu-component' : 'menu-content vertical-menu-component';
    return (
      <div>
         {(this.props.title) && <h2>{this.props.title}</h2>}
         <ul className={componentClass}>
           {this.props.listArray.map((item, i) => {
             const activeElementStyles = (i === this.state.currentIndex && this.props.componentStyles.activeItem) ? this.props.componentStyles.activeItem : {}
             const icon = (this.props.showButtons) ?
               <img src={application.icons.remote['button_' +
               item.remoteKey.replace(/VK_/g, '').toLowerCase()]} /> : '';
             return (
               <li className={i === this.state.currentIndex ? 'menu-item menu-item-active' : 'menu-item'} key={item.id} id={item.id} >
                 <span href={item.appUrl} style={activeElementStyles}>{icon} {item.description}</span>
               </li>
             );
           })}
         </ul>
      </div>
    );
  }
}
componentLoader.registerComponent(
  'menu',
  { view: MenuContent },
  {
    isStylable: true
  });
