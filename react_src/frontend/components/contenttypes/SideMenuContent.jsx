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
 * Jean-Claude Dufourd (jean-claude.dufourd@telecom-paristech.fr
 *
 **/
import React, { PropTypes as Types } from 'react';
import autobind from 'class-autobind';
import { pageElemType, pageElemDefaults } from '../../types';
import { getStyleRuleValue, createHandler, handlersWithTag } from '../../utils';
import { registerHandlers, unregisterHandlers } from '../../RemoteBinding';
import { trackAction } from '../../analytics';

export default class SideMenuContent extends React.Component {

  static propTypes = {
    ...pageElemType,
    initialSlide: Types.number,
    loop: Types.bool,
    listArray: Types.array //eslint-disable-line
  };
  // duplicated default values from backend, we should avoid this by setting
  // default values in component data (ie: setContent even if not changed)
  static defaultProps = {
    ...pageElemDefaults,
    listArray: []
  };

  constructor(props) {
    super(props);
    autobind(this);
    this.state = {
      currentIndex: 0
    };

    let index = 0;
    this.currentPageInfo = this.props.pageUtils && this.props.pageUtils.getCurrentPage();
    if (props.listArray !== undefined) {
      for (const item of props.listArray) { // eslint-disable-line
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
                  item.appUrl === window.location.pathname) {
          // sync page loading
          this.state.currentIndex = index;
          break;
        }
        index++;
      }
    } else { console.log('SideMenuContent: no listArray in props'); }
  }

  componentDidMount() {
    const handlers = [
      createHandler(KeyEvent.VK_ENTER, this.enter),
      createHandler(KeyEvent.VK_UP, this.prev),
      createHandler(KeyEvent.VK_DOWN, this.next)
    ];
    registerHandlers(this, handlersWithTag('focused', handlers));
  }
  componentWillUnmount() {
    unregisterHandlers(this);
  }
  componentDidUpdate(prevProps) {
    if(this.props.focused !== prevProps.focused && this.props.focused) {
      trackAction('menu', 'menu-open');
    }
  }

  prev() {
    const state = this.state;
    if (state.currentIndex === 0) {
      if (this.props.loop) {
        state.currentIndex = this.props.listArray.length - 1;
      }
    } else if (state.currentIndex > 0) {
      state.currentIndex--;
    }
    this.setState(state);
    trackAction('menu', 'prev', this.props.listArray[state.currentIndex].description);

    const curItem = this.props.listArray[state.currentIndex];
    if (curItem.role === 'control' && this.props.targetComponent &&
      curItem.stateData.triggerAction === 'focus') {
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
      }
    } else if (state.currentIndex < this.props.listArray.length - 1) {
      state.currentIndex++;
    }
    this.setState(state);
    trackAction('menu', 'next', this.props.listArray[state.currentIndex].description);

    const curItem = this.props.listArray[state.currentIndex];
    if (curItem.role === 'control' && this.props.targetComponent &&
      curItem.stateData.triggerAction === 'focus') {
      const { targetState, targetLabel } = curItem.stateData;
      trackAction('menu', 'control', targetLabel);
      this.props.setAreaState(this.props.targetComponent, targetState);
    }
  }

  goTo(event) {
    const state = this.state;
    let index = 0;
    for (const item of this.props.listArray) { // eslint-disable-line
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
    if (curItem.role === 'control' && this.props.targetComponent &&
      curItem.stateData.triggerAction === 'enter') {
      const { targetState, targetLabel } = curItem.stateData;
      trackAction('menu', 'control', targetLabel);
      this.props.setAreaState(this.props.targetComponent, targetState);
    } else if (curItem.role === 'application') {
      this.props.pageUtils.performAction(curItem.role, curItem.appData);
    } else if (curItem.role === 'ait') {
      this.props.pageUtils.performAction(curItem.role, curItem.aitData);
    } else if (!curItem.role || curItem.role === 'link') { // !curItem.role for backward compatibility
      const url = curItem.appUrl;
      trackAction('menu', 'goto', url);
      this.props.pageUtils.goToPage(url);
    }
  }

  render() {
    const style = this.props.position;
    let itemcount = 1;
    if (this.props.focused) {
      const center = style.top + style.height / 2;
      itemcount = this.props.listArray.length;
      const fonzsize = getStyleRuleValue('fontSize', '.side-menu').slice(0, -2);
      // 1.5 = line heigth | 13 = 5px padding + 3px separator
      // -3 = no separator after last element | 40 = 20px margin
      style.height = itemcount * (fonzsize * 1.5 + 13) - 3 + 40;
      style.top = center - style.height / 2;
      style.width = getStyleRuleValue('width', '.side-menu');
    } else {
      style.lineHeight = `${style.height / 2}px`;
    }
    return (
      this.props.focused ?
        <div className="side-menu" style={style}>
          <div>
            {this.props.listArray.map((item, i) => {
              const activeElementStyles = (i === this.state.currentIndex && this.props.componentStyles.activeItem) ? this.props.componentStyles.activeItem : {};
              return (
                <div key={item.id} id={item.id}>
                  <p className={(i === this.state.currentIndex) ? 'side-menu-item side-menu-item-active' : 'side-menu-item'} style={activeElementStyles}>{item.description}</p>
                  { i !== itemcount - 1 &&
                    <hr />
                  }
                </div>
              );
            })}
          </div>
        </div>
      :
        <div className="side-menu side-menu-collapsed" style={style}>
          <span>{this.props.title}
            <hr /><hr /><hr />
          </span>
        </div>
    );
  }
}
