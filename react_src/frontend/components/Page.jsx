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
 * Benedikt Vogel    (vogel@irt.de)
 * Jean-Claude Dufourd (jean-claude.dufourd@telecom-paristech.fr
 * Stefano Miccoli (stefano.miccoli@finconsgroup.com)
 * Marco Ferrari (marco.ferrari@finconsgroup.com)
 **/
import React, { PropTypes as Types } from 'react';
import styleType from 'react-style-proptype';
import autobind from 'class-autobind';
import invariant from 'invariant';

import { createHandler, handlersWithTag, getQueryParams, mapArgs } from '../utils';
import { registerHandlers, unregisterHandlers } from '../RemoteBinding';
import Video from './Video';
import PageElement from './PageElement';
import { trackAction } from '../analytics/index';
import { application } from '../appData';
import { componentLoader } from '../../ComponentLoader';

// filtering the navigable found in the content with the navigability of the component
function isNavigable(content) {
  // this function should only return content.navigable
  // but to support legacy application it does some more...
  return (content.navigable) || (content.hotSpotMeta && content.hotSpotMeta.isHotSpot);
}

export default class Page extends React.PureComponent {

  static propTypes = {
    defaultActive: Types.string,
    layout: Types.arrayOf(Types.shape({
      i: Types.string.isRequired,
      x: Types.number.isRequired,
      y: Types.number.isRequired,
      w: Types.number.isRequired,
      h: Types.number.isRequired
    })).isRequired,
    content: Types.objectOf(Types.objectOf(Types.shape({
      type: Types.string,
      data: Types.object,
      navigable: Types.bool,
      compScreen: Types.bool,
      styles: Types.objectOf(styleType)
    }))),
    styles: Types.object,
    background: Types.string,
    parent: Types.string,
    allowMedia: Types.bool
  };

  static defaultProps = {
    allowMedia: true
  };

  static getBackgroundType(background) {
    if (!background) return false;
    if (background.match(/^#/) || background.match(/^rgb\(/) || background.match(/^rgba\(/)) {
      return 'color';
      // FIXME not every video url has a file extension in it.
      // Maybe we should add a select element to chose whether the background
      // is a color or a video
    } else if (background.match(/\.(ts|mpegts|mp4|mpd)/)) {
      return 'video';
    }
    return 'image';
  }

  constructor(props) {
    super();
    autobind(this);
    let focusedIndex;
    let state = {};
    if (props.defaultActive) {
      focusedIndex = props.layout.findIndex(({ i }) => i === props.defaultActive);
    }
    if (focusedIndex !== undefined && focusedIndex > -1) {
      state = { focusedIndex, focusedIsActive: true };
    } else {
      focusedIndex = props.layout.reduce((prev, box, index) => {
        const content = props.content[box.i] &&
          (props.content[box.i][Object.keys(props.content[box.i])[0]]);
        if ((content && isNavigable(content)) || !content) {
          const dst = box.x + box.y;
          if (dst < prev.dst) {
            return { dst, index };
          }
        }
        return prev;
      }, { dst: Infinity, index: 0 }).index;
      state = { focusedIndex, focusedIsActive: false };
    }

    this.queryParams = getQueryParams();
    // define active state for each box
    state.areaStates = this.getAreaStates(props.content);
    this.state = state;
    this.queryParams = getQueryParams();
    window.setAreaState = this.setAreaState;
  }

  componentDidMount() {
    // Register Key Handlers
    const scrollMethod =
      (application.application_manager.smooth_navigation) ? this.moveTo : this.scroll;
    registerHandlers(this, handlersWithTag('global', [
      createHandler(KeyEvent.VK_UP, scrollMethod.bind(null, 'up')),
      createHandler(KeyEvent.VK_DOWN, scrollMethod.bind(null, 'down')),
      createHandler(KeyEvent.VK_LEFT, scrollMethod.bind(null, 'left')),
      createHandler(KeyEvent.VK_RIGHT, scrollMethod.bind(null, 'right')),
      createHandler(KeyEvent.VK_ENTER, this.activateCurrent),
      createHandler(KeyEvent.VK_BACK, this.deactivateOrBack)
    ]));

    if (this.backgroundVideo) {
      registerHandlers(this, handlersWithTag('global', [
        createHandler(KeyEvent.VK_PLAY, this.backgroundVideo.play),
        createHandler(KeyEvent.VK_PAUSE, this.backgroundVideo.pause)
      ]));
    }
  }

  componentWillUnmount() {
    unregisterHandlers(this);
  }

  componentWillReceiveProps(nextProps) {
    if (JSON.stringify(nextProps.content) !== JSON.stringify(this.props.content)) {
      this.setState({ areaStates: this.getAreaStates(nextProps.content) });
    }
  }

  getAreaStates(content) {
    const that = this;
    return Object.assign(
              {}, // protection if empty layout/page
              ...Object.keys(content).map((obj) => {
                let stateActiveId = null;
                let isQueryParam = false;
                for (const key in content[obj]) {
                  const stateTitle = `state-${content[obj][key].stateTitle}`;
                  if (stateTitle == that.queryParams[obj]) {
                    isQueryParam = true;
                    return { [obj]: key };
                  }
                  for (const keyParams in that.queryParams[obj]) {
                    if (stateTitle == that.queryParams[obj][keyParams]) {
                      isQueryParam = true;
                      return { [obj]: key };
                    }
                  }

                  if (content[obj][key].stateActive === true) {
                    stateActiveId = key;
                  }
                }
                return { [obj]: (stateActiveId != null && isQueryParam == false) ? stateActiveId : Object.keys(content[obj])[0] };
              })
      );
  }

  getFocused() {
    const { content, layout } = this.props;
    return content[layout[this.state.focusedIndex].i] || {};
  }

  setAreaState(areaId, stateId) {
    invariant(
      typeof this.props.content[areaId] === 'object' && this.props.content[areaId][stateId],
      `Area ${areaId} has no state with id ${stateId}!`
    );
    this.setState({ areaStates: { ...this.state.areaStates, [areaId]: stateId } });
  }

  activateCurrent() {
    // forward more detailed component information
    const { type = 'text' } = this.getFocused();
    trackAction('component', 'activate', type);
    if (this.state.focusedIsActive) {
      // since focusedIsActive is already true for defaultActive
      // state won't be updated => no re-render => no component update (MPAT-365)
      this.forceUpdate();
    } else {
      this.setState({ focusedIsActive: true });
    }
  }

  deactivateCurrent() {
    // forward more detailed component information
    const { type = 'text' } = this.getFocused();
    trackAction('component', 'deactivate', type);
    if (this.state.focusedIsActive) {
      this.setState({ focusedIsActive: false });
    }
  }

  deactivateOrBack() {
    if (this.state.focusedIsActive) {
      this.deactivateCurrent();
    } else if (this.props.pageUtils.goToPreviousPage) {
        // current navigation support history
      this.props.pageUtils.goToPreviousPage();
       // console.log("go to previous");
    } else if (this.props.parent) {
        // good 'ol parent link
      window.location.href = this.props.parent;
    }
  }

  scroll(dir) {
    let { focusedIndex } = this.state;
    const { content, layout } = this.props;
    const active = this.props.layout[focusedIndex];

    const isInDirection = (b) => {
      const a = active;
      switch (dir) {
        case 'left': return (b.x + b.w < a.x + a.w / 2) && (b.x < a.x);
        case 'right': return (b.x > a.x + a.w / 2) && (b.x + b.w > a.x + a.w);
        case 'up': return (b.y + b.h < a.y + a.h / 2) && (b.y < a.y);
        case 'down': return (b.y > a.y + a.h / 2) && (b.y + b.h > a.y + a.h);
        default: return 0;
      }
    };

    const distToActive = (box) => {
      const dstX = (box.x + box.w / 2) - (active.x + active.w / 2);
      const dstY = (box.y + box.h / 2) - (active.y + active.h / 2);
      return dstX * dstX + dstY * dstY;
    };

    focusedIndex = layout.reduce((prev, box, index) => {
      let boxContent = (content[box.i] || {});
      boxContent = boxContent[this.state.areaStates[box.i]];
      if (boxContent && isNavigable(boxContent) && isInDirection(box)) {
        const dst = distToActive(box);
        if (dst < prev.dst) {
          return { dst, index };
        }
      }
      return prev;
    }, { dst: Infinity, index: focusedIndex }).index;

    if (focusedIndex === this.state.focusedIndex) {
      return false;
    }

    this.setState({ focusedIndex, focusedIsActive: false });
  }

  moveTo(direction) {
      // this.scroll changes the index of the focused component (only if there's an eligible one)
    this.scroll(direction);
      // this.activateCurrent set active=true for focused item
    this.activateCurrent();
  }

  render() {
    const { allowMedia, layout, content, background, pageUtils } = this.props;
    const { focusedIndex, focusedIsActive } = this.state;
    const pageElements = layout.map(mapArgs((box, index) => {
      let boxContent = (content[box.i] || {});
      boxContent = boxContent[this.state.areaStates[box.i]];
      return [box, index, boxContent];
    }, (box, index, firstStateContent) =>
      <PageElement
        key={box.i}
        active={index === focusedIndex && focusedIsActive}
        allowMedia={allowMedia}
        focused={index === focusedIndex}
        queryParams={this.queryParams[box.i]}
        style={this.props.style} // styles applied to PageElement dom element
        focusedStyles={this.props.styles.activeComponent || {}} // object that describe styles configured in admin UI and to be applied to the focused component TODO need to merge with customizer values
        setAreaState={this.setAreaState}
        moveTo={this.moveTo}
        pageUtils={pageUtils}
        navigable={isNavigable(firstStateContent)}
        {...firstStateContent}
        {...box}
      />
    ));

    const backgroundStyle = {};
    let vid = false;
    // DEPRECATED background color and media is now managed in 2 different fields in page styles
    // TODO need to remove it when legacy is discontinued
    const type = Page.getBackgroundType(background);
    // check for colour, image or video as background
    if (type === 'color') {
      backgroundStyle.backgroundColor = background;
    } else if (type === 'video' || type === 'image') {
      backgroundStyle.backgroundImage = background;
    }

    const pageStyles = Object.assign({}, backgroundStyle, this.props.styles.container || {});
    if (pageStyles.backgroundImage) {
      if (pageStyles.backgroundImage.match(/\.(ts|mpegts|mp4|mpd)/)) {
            // background image is actually a video, instantiate the player
        vid = <Video ref={v => (this.backgroundVideo = v)} src={pageStyles.backgroundImage} autoplay />;
        delete pageStyles.backgroundImage;
      } if (pageStyles.backgroundImage !== 'none' &&
              pageStyles.backgroundImage !== 'initial' &&
              pageStyles.backgroundImage !== 'inherit') {
            // css compliant background image url format
        pageStyles.backgroundImage = `url(${pageStyles.backgroundImage})`;
      }
    }
    const pageStyleOverride = {};
    if (pageStyles.backgroundImage === 'none') {
      pageStyleOverride.backgroundImage = 'none';
    }
    return (
      <div className="page-container">
        {/*
        we need the following hack to allow a page to override the general background
        so that the page can have a transparent background and let the viewer see the video
        underneatch it
        */}
        <div className="page" style={pageStyleOverride}>
          {/*
          We need a sperated div to achieve the stack of backgroungs,
          where global background styles are applied to page via standard css,
          while page specific ones are applied to background div.
          So we can leverage on transparencies
           */}
          <div className="background" style={pageStyles}>
            {vid}
          </div>
          <div className="page-elements-container">
            {pageElements}
          </div>
        </div>
      </div>
    );
  }
}
