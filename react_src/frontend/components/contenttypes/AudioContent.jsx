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
 **/
import React, { PropTypes as Types } from 'react';
import autobind from 'class-autobind';
import { pageElemType, pageElemDefaults } from '../../types';
import { createHandler, handlersWithTag } from '../../utils';
import { classnames } from '../../../functions';
import { registerHandlers, unregisterHandlers } from '../../RemoteBinding';
import Audio from '../Audio';
import { AudioOn, AudioOff } from '../icons/Icons';
import { trackAction } from '../../analytics/index';
import { componentLoader } from '../../../ComponentLoader';
import { application } from '../../appData';

class AudioContent extends React.Component {

  static propTypes = {
    ...pageElemType,
    url: Types.string,
    autostart: Types.bool,
    loop: Types.bool
  };

  static defaultProps = {
    ...pageElemDefaults,
    url: '',
    autostart: false,
    loop: false
  };

  // FIXME this might be obsolete with the new event propagation
  static triggerBackKeyboardEvent() {
    const eventObj = document.createEventObject ?
            document.createEventObject() : document.createEvent('Events');

    if (eventObj.initEvent) {
      eventObj.initEvent('keydown', true, true);
    }

    eventObj.keyCode = 461;
    eventObj.which = 461;
    const el = document.getElementById('main');

    el.dispatchEvent ? el.dispatchEvent(eventObj) : el.fireEvent('onkeydown', eventObj);
  }

  constructor(props) {
    super(props);
    autobind(this);
    this.state = {
      initialPlay: true,
      isPlaying: false,
      hasStarted: false
    };
  }

  componentDidMount() {
    registerHandlers(this, handlersWithTag('active', [
      createHandler(KeyEvent.VK_ENTER, this.triggerControls)
    ]).concat(handlersWithTag('global', [
      createHandler(KeyEvent.VK_PLAY, this.play),
      createHandler(KeyEvent.VK_PAUSE, this.pause),
      createHandler(KeyEvent.VK_STOP, this.stop),
      createHandler(KeyEvent.VK_REWIND, this.seekBackward),
      createHandler(KeyEvent.VK_FAST_FWD, this.seekForward)
    ])));
    if (this.props.autostart) {
      setTimeout(() => {
        this.play();
      }, 2000);
    }
  }

  componentWillReceiveProps(nextProps) {
    // gaining control of component -> start execution automatically (to avoid double ok press) only if not smooth
    // In case of smooth navigation active status is set automatically by Page, but user didnt press ok yet
    if (!application.application_manager.smooth_navigation && nextProps.active && !this.props.active) {
      this.triggerControls();
    }
    const { active, hotSpotMeta } = this.props;
    // losing control of component -> always stop execution
    if (!nextProps.active && active && hotSpotMeta && hotSpotMeta.isHotSpot) {
      this.stop();
    }
  }

  componentWillUnmount() {
    unregisterHandlers(this);
  }

  triggerControls() {
    if (this.state.isPlaying) {
      if (this.props.hotSpotMeta && this.props.hotSpotMeta.isHotSpot) {
        this.stop();
        AudioContent.triggerBackKeyboardEvent();
      } else {
        this.pause();
      }
    } else {
      this.play();
    }
  }

  play() {
    const initialPlay = this.state.initialPlay;
    this.setState({ hasStarted: true, isPlaying: true, initialPlay: false }, () => this.audio.play());
    if (initialPlay) {
      trackAction('audio', 'initialPlay', this.props.url);
    } else {
      trackAction('audio', 'play', this.props.url);
    }
  }

  pause() {
    this.setState({ hasStarted: true, isPlaying: false }, () => this.audio.pause());
    trackAction('audio', 'pause', this.props.url);
  }

  stop() {
    this.setState({ hasStarted: false, isPlaying: false });
    trackAction('audio', 'stop', this.props.url);
  }

  seekBackward() {
    if (this.audio) {
      this.audio.seek(this.audio.currentPosition() - 5000);
      trackAction('audio', 'rw', this.props.url);
    }
  }

  seekForward() {
    if (this.audio) {
      this.audio.seek(this.audio.currentPosition() + 5000);
      trackAction('audio', 'ff', this.props.url);
    }
  }

  render() {
    return (
      <div className={classnames({ 'page-element-content': true, 'audio-player-toggle': true })}>
        {this.state.isPlaying &&
          <AudioOn />
              }
        {!this.state.isPlaying &&
          <AudioOff />
              }
        {this.state.hasStarted &&
          <Audio
            ref={c => (this.audio = c)}
            src={this.props.url}
            loop={this.props.loop}
          />
        }
      </div>
    );
  }
}
componentLoader.registerComponent(
  'audio',
  { view: AudioContent },
  {
    isHotSpottable: true,
    isStylable: false
  });
