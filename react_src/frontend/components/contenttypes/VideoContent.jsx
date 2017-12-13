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
import React, { PropTypes } from 'react';
import autobind from 'class-autobind';

import { createHandler, handlersWithTag, log } from '../../utils';
import { classnames } from '../../../functions';
import { registerHandlers, unregisterHandlers } from '../../RemoteBinding';
import Video from './../Video';
import { trackAction } from '../../analytics';
import { componentLoader } from '../../../ComponentLoader';
// import { HotspotVideo } from '../icons/Icons';
import { application } from '../../appData';

class VideoContent extends React.Component {

  static propTypes = {
    playIcon: PropTypes.bool,
    showNavBar: PropTypes.bool
  };

  static defaultProps = {
    playIcon: true,
    showNavBar: true,
    onVideoFinish: () => { }
  };

  // FIXME I think the new event propagation might make this method obsolete
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
      isFullscreen: false,
      isPlaying: false,
      hasStarted: false,
      focused: 2,
      duration: 0,
      position: 0,
      controlsTimer: -1,
      playpositionInterval: -1
    };
  }

  componentDidMount() {
    const isPreview = window.MPATPreviewDoNotAutostartVideos;

    if (this.props.navigable) {
      const handlerActive = [
        createHandler(KeyEvent.VK_RIGHT, this.turnRIGHT),
        createHandler(KeyEvent.VK_LEFT, this.turnLEFT),
        createHandler(KeyEvent.VK_UP, this.goVertical),
        createHandler(KeyEvent.VK_DOWN, this.goVertical),
        createHandler(KeyEvent.VK_ENTER, this.triggerControls),
        createHandler(KeyEvent.VK_BACK, this.back)
      ];
      registerHandlers(this, handlersWithTag('active', handlerActive));
    }
    const handlerGlobal = [
      createHandler(KeyEvent.VK_PLAY, this.play),
      createHandler(KeyEvent.VK_PAUSE, this.pause),
      createHandler(KeyEvent.VK_STOP, this.stop),
      createHandler(KeyEvent.VK_REWIND, this.seekBackward),
      createHandler(KeyEvent.VK_FAST_FWD, this.seekForward)
    ];
    const handlerAlways = [
      createHandler('appWillHide', this.removePlayer),
      createHandler('appWillShow', this.addPlayer)
    ];

    registerHandlers(this, handlersWithTag('global', handlerGlobal));
    registerHandlers(this, handlersWithTag('always', handlerAlways));

    if (this.props.autostart && !isPreview) {
      setTimeout(() => {
        this.play();
        this.startControlsFadeout();
      }, 1500);
    }
  }

  componentWillReceiveProps(nextProps) {
    try {
      if (nextProps.active && !this.props.active) {
        this.triggerControls({ entered: true });
      }
      if (!nextProps.active && this.props.active) {
        if (this.props.hotSpotMeta && this.props.hotSpotMeta.isHotSpot) {
          this.stop();
        } else if (this.state.isFullscreen) {
          this.toggleFullscreen();
        }
      }
      if (!nextProps.allowMedia && this.props.allowMedia) {
        this.stop();
      }
      if (nextProps.url !== this.props.url) {
        this.stop();
        setTimeout(() => {
          this.play();
          this.startControlsFadeout();
        }, 1000);
      }
    } catch (e) {
      log(`videoConten error while receving props: ${JSON.stringify(e)}`);
    }
  }

  removePlayer() {
    log('playerState: remove');
    if (this.video && this.video.currentPosition) {
      this.lastPlayerPosition = this.video.currentPosition();
      this.lastPlayState = this.state.isPlaying;
    }
    this.stop();
  }

  addPlayer() {
    log('playerState: add');
    if (this.props.autostart) {
      setTimeout(() => {
        this.play();
        this.startControlsFadeout();
      }, 1500);
    }
    setTimeout(() => {
      if (!this.video) return;
      if (this.lastPlayerPosition) {
        this.video.seek(this.lastPlayerPosition);
      }
      if (this.lastPlayState === true) {
        this.play();
      }
      if (this.lastPlayState === false) {
        this.pause();
      }
    }, 1500);
  }

  componentWillUnmount() {
    unregisterHandlers(this);
    this.setState({ hasStarted: false });
    if (this.state.controlsTimer) {
      clearTimeout(this.state.controlsTimer);
    }
    if (this.state.playpositionInterval) {
      clearInterval(this.state.playpositionInterval);
    }
  }

  turnRIGHT() {
    log(`turnRIGHT focused: ${this.state.focused}`);
    // focused === 4: most right;
    // focused === 0: ctrl-bar hidden
    if (application.application_manager.smooth_navigation && !this.state.isFullscreen) {
      if ((!this.state.hasStarted) || (this.state.focused === 4 || this.state.focused === 0)) {
        // only preview image is show, no navigable element in the component or  we reached the boundraries elements
        // thus move to next component
        return false;
      }
    }
    if (this.state.focused) {
      let f = (this.state.focused + 1) % 5;
      f = f || 1;
      this.setState({ focused: f });
      this.startControlsFadeout();
    }
    if (this.state.isFullscreen && this.state.focused == 0) {
      this.setState({
        focused: 2
      });
      this.startControlsFadeout();
    }
  }

  turnLEFT() {
    log(`turnLEFT focused: ${this.state.focused}`);
    //  focused === 1: most left
    //  focused === 0: ctrl-bar hidden
    if (application.application_manager.smooth_navigation && !this.state.isFullscreen) {
      if ((!this.state.hasStarted) || (this.state.focused === 1 || this.state.focused === 0)) {
        // only preview image is show, no navigable element in the component or  we reached the boundraries elements
        // thus move to next component
        return false;
      }
    }
    if (this.state.focused) {
      let f = (this.state.focused - 1) % 5;
      f = f || 4;
      this.setState({ focused: f });
      this.startControlsFadeout();
    }
    if (this.state.isFullscreen && this.state.focused == 0) {
      this.setState({
        focused: 2
      });
      this.startControlsFadeout();
    }
  }

  goVertical() {
    if (application.application_manager.smooth_navigation && !this.state.isFullscreen) {
      return false;
    } else if (this.state.isFullscreen && this.state.focused == 0) {
      this.setState({
        focused: 2
      });
      this.startControlsFadeout();
    }
  }

  back() {
    if (this.state.isFullscreen) {
      if (this.props.fullscreen) {
        this.stop();
      } else {
        this.toggleFullscreen();
      }
    } else {
      return false;
    }
  }

  triggerControls({ entered }) {
    if (application.application_manager.smooth_navigation && entered === true) {
      log('triggerControls entered');
      this.setState({ focused: 2 });
      this.startControlsFadeout();
      return true;
    }
    if (this.state.hasStarted) {
      if (this.state.focused && this.props.showNavBar) {
        switch (this.state.focused) {
          case 1:
            this.seekBackward();
            break;
          case 2:
            switch (this.video.playState()) {
              case 1:
                this.pause();
                break;
              default:
                this.play();
                break;
            }
            break;
          case 3:
            this.seekForward();
            break;
          case 4:
            this.toggleFullscreen();
            break;
          default:
            break;
        }
      } else {
        this.setState({ focused: 2 });
      }
      this.startControlsFadeout();
    } else {
      this.play();
    }
  }
  startControlsFadeout() {
    if (this.state.controlsTimer) {
      clearTimeout(this.state.controlsTimer);
    }
    const t = setTimeout(() => this.setState({ focused: 0, controlsTimer: -1 }), 5000);
    this.setState({ controlsTimer: t });
  }
  updatePlayPosition() {
    this.setState({
      duration: Math.round(this.video.length() / 1000),
      position: Math.round(this.video.currentPosition() / 1000)
    });
  }

  play() {
    clearInterval(this.state.playpositionInterval);
    const i = setInterval(() => {
      this.updatePlayPosition();
    }, 1000);
    this.setState({
      isFullscreen: (!this.state.hasStarted) ? this.props.fullscreen : this.state.isFullscreen,
      hasStarted: true,
      focused: 2,
      isPlaying: true,
      playpositionInterval: i
    }, () => this.video.play());
    trackAction('video', 'play', this.props.url);
  }

  pause(focuse) {
    const focused = focuse || 2;
    this.setState({ hasStarted: true, isPlaying: false, focused }, () => this.video.pause());
    this.updatePlayPosition();
    clearInterval(this.state.playpositionInterval);
    trackAction('video', 'pause', this.props.url);
  }

  stop() {
    this.setState({ hasStarted: false, isPlaying: false, isFullscreen: false, focused: 2, position: 0 });
    clearInterval(this.state.playpositionInterval);
    trackAction('video', 'stop', this.props.url);
    if (this.props.hotSpotMeta && this.props.hotSpotMeta.isHotSpot && this.props.active) {
      VideoContent.triggerBackKeyboardEvent();
    }
  }

  getSkipTime(direction) {
    // video length >= 10 minutes ==> skip 30sec per time
    // video length >= 5 minutes ==> skip 15sec per time
    // video length < 5 minutes ==> skip 10sec per time
    const skipTime = 10e3;
    if (this.video.length() >= 600e3) {
      const skipTime = 30e3;
    } else if (this.video.length() >= 300e3) {
      const skipTime = 15e3;
    }
    let nextPosition = false;
    switch (direction) {
      case 'forward':
        log(this.video.currentPosition());
        if ((this.video.currentPosition() + skipTime) > this.video.length()) {
          // 2do add recursion fallback
          log(`video skip was blocked for: ${direction}`);
          nextPosition = false;
        } else {
          nextPosition = this.video.currentPosition() + skipTime;
        }
        break;
      case 'backward':
        if ((this.video.currentPosition() - skipTime) < 0) {
          // 2do add recursion fallback
          log(`video skip was blocked for: ${direction}`);
          nextPosition = 0;
        } else {
          nextPosition = this.video.currentPosition() - skipTime;
        }
        break;
      default:
        log('!!! skipTime was called but nothing happened');
    }
    log(`skip time: ${nextPosition}`);
    return nextPosition;
  }

  seekBackward() {
    if (this.video) {
      const newPosition = this.getSkipTime('backward');
      if (newPosition !== false) this.video.seek(newPosition);
      this.updatePlayPosition();
    }
    trackAction('video', 'ff', this.props.url);
    const focused = 1;
    if (this.state.isPlaying === false && this.state.hasStarted === true) {
      this.pause(focused);
    } else {
      this.setState({ focused });
    }
  }

  seekForward() {
    if (this.video) {
      const newPosition = this.getSkipTime('forward');
      if (newPosition !== false) this.video.seek(newPosition);
      this.updatePlayPosition();
    }
    trackAction('video', 'rw', this.props.url);
    const focused = 3;
    // was paused stay in paused. issue raised by sven via phone
    if (this.state.isPlaying === false && this.state.hasStarted === true) {
      this.pause(focused);
    } else {
      this.setState({ focused });
    }
  }

  toggleFullscreen() {
    // we track only when we are going fullscreen
    if (!this.state.isFullscreen) {
      trackAction('video', 'fullscreen', this.props.url);
    }

    if (this.props.hotSpotMeta && this.props.hotSpotMeta.isHotSpot && this.state.isFullscreen) {
      this.stop();
    } else {
      this.setState({ isFullscreen: !this.state.isFullscreen });
    }
    this.setState({ focused: 4 });
  }

  render() {
    const thumbnailUrl = `url(${this.props.thumbnail})`;
    // const fileExt = this.props.url.split('.').pop();
    let fileExt = null;
    if (this.props.url !== undefined) { fileExt = this.props.url.split('.').pop(); }

    const types = { mpd: 'application/dash+xml', mp4: 'video/mp4', ts: 'video/mpeg' };
    const videoTyp = types[fileExt] ? types[fileExt] : types.mp4;

    // playposition & progressbar
    const { focused, duration, position } = this.state;
    const formatTime = (minutes, seconds) => {
      const pad = n => `00${n}`.substr(`00${n}`.length - 2);
      const m = minutes || '00';
      const s = seconds || '00';
      return `${pad(m)}:${pad(s)}`;
    };

    const durationMinutes = Math.floor(duration / 60);
    const durationSeconds = duration % 60;
    const timeFull = formatTime(durationMinutes, durationSeconds);

    const positionMinutes = Math.floor(position / 60);
    const positionSeconds = position % 60;
    const timeElapsed = formatTime(positionMinutes, positionSeconds);

    const progressProcent = 100 / duration * position;

    // video zoom
    const { width, height } = this.props.position;
    let style;
    if (!this.state.isFullscreen && this.props.zoom && width / 16 * 9 !== height) {
      if (width / height > 1.77777) {
        const zoomHeight = width / 16 * 9;
        const zoomOffset = (height - zoomHeight) / 2;
        style = { height: `${zoomHeight}px`, top: `${zoomOffset}px` };
      } else {
        const zoomWidth = height / 9 * 16;
        const zoomOffset = (width - zoomWidth) / 2;
        style = { width: `${zoomWidth}px`, left: `${zoomOffset}px` };
      }
    }

    // video icon was {HotspotVideo('transparent')} (SVG)

    return (
      <div className={classnames({ 'page-element-content': true, 'video-content': true, fullscreen: this.state.isFullscreen })}>
        <div style={{ backgroundImage: thumbnailUrl }} className="thumbnail" />
        {this.props.playIcon &&
        <div className="video-content-indication-icon" />
        }
        {this.state.hasStarted &&
          <Video
            ref={c => (this.video = c)}
            src={this.props.url}
            type={videoTyp}
            style={style}
            videoFinishedCB={() => {
              this.stop();
              this.props.onVideoFinish();
            }}
            loop={this.props.loop}
            compScreen={this.props.compScreen}
            compScreenMeta={this.props.compScreenMeta}
          />
        }
        {this.state.hasStarted && focused !== 0 && this.props.showNavBar &&
          <div className="video-controls-container">
            <div className="video-controls">
              <div
                style={{ backgroundImage: `url(${application.icons.videoplayer.rewind})` }}
                className={classnames({ 'video-button': true, active: focused === 1 })}
              />
              <div
                style={{ backgroundImage: `url(${this.state.isPlaying ? application.icons.videoplayer.pause : application.icons.videoplayer.play})` }}
                className={classnames({ 'video-button': true, active: focused === 2 })}
              />
              <div
                style={{ backgroundImage: `url(${application.icons.videoplayer.forward})` }}
                className={classnames({ 'video-button': true, active: focused === 3 })}
              />
              <div
                style={{ backgroundImage: `url(${this.state.isFullscreen ? application.icons.videoplayer.fullscreenexit : application.icons.videoplayer.fullscreen})` }}
                className={classnames({ 'video-button': true, active: focused === 4 })}
              />
            </div>
            <div className="video-progressinfo">
              <div className="video-time-elapsed">{timeElapsed}</div>
              <div className="video-progressbar">
                <div className="video-progressbar-background">
                  <div className="video-progressbar-elapsed" style={{ width: `${progressProcent}%` }} />
                </div>
              </div>
              <div className="video-time-full">{timeFull}</div>
            </div>
          </div>
        }
      </div>
    );
  }
}
componentLoader.registerComponent(
  'video',
  { view: VideoContent },
  {
    isStylable: false
  });
