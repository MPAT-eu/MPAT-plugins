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
 * Benedikt Vogel 	 (vogel@irt.de)
 *
 **/
import React, { PropTypes as Types } from 'react';
import autobind from 'class-autobind';
import CustomLinkContent from './CustomLinkContent';
import CustomTextContent from './CustomTextContent';
import { createHandler, handlersWithTag } from '../../utils';
import { registerHandlers, unregisterHandlers } from '../../RemoteBinding';
import { componentLoader } from '../../../ComponentLoader';

import {
  HotspotText,
  HotspotVideo,
  HotspotLink,
  HotspotImage,
  HotspotAudioOn,
  HotspotAudioOff
} from '../icons/Icons';


export default class HotSpot extends React.Component {

  static propTypes = {
    hotSpotMeta: Types.shape({
      height: Types.string,
      remoteKey: Types.string
    }),
    style: Types.shape({
      width: Types.number,
      height: Types.number,
      left: Types.number,
      top: Types.number
    }),
    data: Types.shape({
      text: Types.string
    }),
   // focused: Types.boolean,
   // active: Types.boolean,
    type: Types.string,
    i: Types.string,
    componentStyle: Types.shape({})
  }
  constructor(props) {
    super(props);
    autobind(this);
    this.state = this.props;
  }

  componentDidMount() {
    // hide all hotspots on any keyEvent
    const currentComponentKey = this.props.hotSpotMeta && this.props.hotSpotMeta.remoteKey || false;
    if (!currentComponentKey) return;
    const possibleKeys = ['VK_0', 'VK_1', 'VK_2', 'VK_3', 'VK_4', 'VK_5', 'VK_6', 'VK_7', 'VK_8', 'VK_9', 'VK_GREEN', 'VK_BLUE', 'VK_YELLOW'];
    const handlers = [];
    possibleKeys.forEach((key) => {
      const keyCode = KeyEvent[key];
      if (key === currentComponentKey) {
        handlers.push(createHandler(keyCode, this.toggleContent));
      } else {
        handlers.push(createHandler(keyCode, this.hideContent));
      }
    });
    handlers[0] && registerHandlers(this, handlersWithTag('global', handlers));
  }

  componentWillReceiveProps(nextProps) {
    this.setState(nextProps);
  }

  componentWillUnmount() {
    unregisterHandlers(this.props.i);
  }

  getIcon() {
    const hs = this.props.hotSpotMeta;
    const style = { width: '100%' };
    if (this.state.active && hs.custom_active_icon) return <img alt="" style={style} src={hs.custom_active_icon} />;
    if (this.state.focused && hs.custom_focused_icon) return <img alt="" style={style} src={hs.custom_focused_icon} />;
    if (hs.custom_normal_icon) return <img alt="" style={style} src={hs.custom_normal_icon} />;

    const stateBg = this.state.active ? hs.active_bg : hs.focused_bg;
    const bg = this.state.focused ? stateBg : hs.normal_bg;
    const stateFill = this.state.active ? hs.active_fill : hs.focused_fill;
    const fill = this.state.focused ? stateFill : hs.normal_fill;
    const fiFill = fill || 'white';
    const fiBg = bg || 'black';
    switch (this.state.type) {
      case 'audio': return this.state.active ? HotspotAudioOn(fiBg, fiFill) : HotspotAudioOff(fiBg, fiFill);
      case 'video': return HotspotVideo(fiBg, fiFill);
      case 'link' : return HotspotLink(fiBg, fiFill);
      case 'image': return HotspotImage(fiBg, fiFill);
      case 'text' : return HotspotText(fiBg, fiFill);

      default: return null;
    }
  }

  getContent() {
    switch (this.props.type) {
      case 'audio' : return componentLoader.getComponentByType('audio').classes.view;
      case 'video' : return componentLoader.getComponentByType('video').classes.view;
      case 'image' : return componentLoader.getComponentByType('image').classes.view;
      case 'link' : return CustomLinkContent;
      case 'text' : return CustomTextContent;
      default: return null;
    }
  }

  getStyles() {
    const contentStretch = 3;
    const { hotSpotMeta = {} } = this.props;
    const hs = hotSpotMeta;
    const width = hs.width ? hs.width : this.props.style.width * contentStretch;
    const shouldLeft = this.props.style.left - this.props.style.width * (contentStretch - 1) / (2);
    const maxLeft = (shouldLeft > 1280 - width) ? 1280 - width - 30 : shouldLeft;
    const left = shouldLeft < 0 ? 15 : maxLeft;
    const type = this.props.type;
    const { style } = this.props;
    const forcedHeight = style.height < style.width ? style.width : style.height;
    const content = {
      width: `${width}px`,
      left: `${left}px`,
      position: 'absolute',
      zIndex: this.state.active || this.state.focused ? 20 : 5,
      display: type === 'audio' ? 'none' : 'block'
    };
    Object.assign(content, this.props.componentStyle);
    if (hs.height) {
      content.height = `${hs.height}px`;
    }
    switch (hs.position) {
      case 'lower':
        content.top = `${this.props.style.top + forcedHeight + 10}px`;
        break;
      case 'upper':
        content.bottom = `${720 - this.props.style.top + 10}px`;
        break;
      case 'static':
        content.top = `${hs.staticTop}px`;
        content.left = `${hs.staticLeft}px`;
        break;
      default:

    }
    if (hs.position === 'lower') { content.top = `${this.props.style.top + forcedHeight + 10}px`; } else {
      content.bottom = `${720 - this.props.style.top + 10}px`;
    }
    // hide hs if video is selected
    const zIndex = (this.props.type === 'video' && this.state.active) ? -10 : 10;

    return {
      content,
      hotspot: {
        width: `${this.props.style.width}px`,
        height: `${this.props.style.height}px`,
        left: `${this.props.style.left}px`,
        bottom: `${720 - this.props.style.top - this.props.style.height}px`,
        position: 'absolute',
        zIndex
      }
    };
  }

  toggleContent() {
    const state = Object.assign({}, this.state);
    state.focused = !state.focused;
    this.setState(state);
    return false;
  }

  hideContent() {
    const state = Object.assign({}, this.state);
    state.focused = false;
    this.setState(state);
    return false;
  }

  renderIcon() {
    const styles = this.getStyles();
    return (
      <div style={styles.hotspot} className={'hotSpot'}>
        {this.getIcon()}
      </div>
    );
  }

  renderContent() {
    const Content = this.getContent();
    const styles = this.getStyles();
    return (
      <div className="hotspot-content" style={styles.content}>
        {typeof Content === 'object' ? "Oops!" : <Content
          {...this.state}
          {...this.props.data}
          id={this.props.i}
          hotSpotMeta={this.props.hotSpotMeta}
          // fix me: - at least the video needs a preview size
          //         - video hotspot don't work
          //         - image maybe also
          //         - solved for hotspot position:static
          position={{ width: 100, height: 100 }}
        />}
      </div>
    );
  }

  render() {
    return (
      <div>
        {this.renderIcon()}
        {this.state.focused && this.renderContent()}
      </div>
    );
  }
}
