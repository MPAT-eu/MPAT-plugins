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
 * Jean-Philippe Ruijs (jean-philippe.ruijs@telecom.paristech.fr)
 *
 **/
import React, { PropTypes as Types } from 'react';
import autobind from 'class-autobind';
import { log } from '../utils';
import { generateId } from '../../functions';
import { application } from '../appData';
import Constants from '../../constants';

const i18n = Constants.locstr.frontend;

function denoteVideoError(error) {
  switch (error) {
    case 0:
      return i18n.error.formatNotSupported;
    case 1:
      return i18n.error.connection;
    case 2:
      return i18n.error.unidentified; // by DAE 1.1 p. 263:
    case 3:
      return i18n.error.resource;
    case 4:
      return i18n.error.corrupt;
    case 5:
      return i18n.error.available;
    case 6:
      return i18n.error.position; // (by ETSI 1.2.1)
    case 7:
      return i18n.error.blocked;
    default:
      return `Unexpected error code: ${error}`;
  }
}

function denotePlaystate(state, error) {
  switch (state) {
    case 0:
      return 'STOPPED';
    case 1:
      return 'PLAYING';
    case 2:
      return 'PAUSED';
    case 3:
      return 'CONNECTING';
    case 4:
      return 'BUFFERING';
    case 5:
      return 'FINISHED';
    case 6:
      return `ERROR [${denoteVideoError(error)}]`;
    default:
      return `Unexpected state code: ${state}`;
  }
}

export default class Video extends React.Component {

  static propTypes = {
    src: Types.string.isRequired,
    type: Types.string.isRequired,
    videoFinishedCB: Types.func,
    loop: Types.bool,
    autoplay: Types.bool,
    compScreen: Types.bool,
    compScreenMeta: Types.object,
    style: Types.object
  };

  static defaultProps = {
    loop: false,
    autoplay: false,
    type: 'video/mp4'
  };

  constructor() {
    super();
    autobind(this);
    const initialState = { synchronizer: null, loadingstyle: { display: 'block' }, display: 'block' };
    if (application &&
        application.icons &&
        application.icons.videoplayer &&
        application.icons.videoplayer.loading) {
      initialState.loadingstyle.backgroundImage = `url(${application.icons.videoplayer.loading})`;
    }
    this.state = initialState;
    this.id = `video_${generateId()}`;
  }

  componentDidMount() {
    this.video = document.getElementById(this.id);
    this.video.onPlayStateChange = () => {
      if (this.playState() === 5) {
        if (this.props.loop) {
          this.play();
        } else if (this.props.videoFinishedCB) {
          this.props.videoFinishedCB();
        }
      } else if (this.video.playState === 3 || this.video.playState === 4) {
        const loadingStyle = this.state.loadingstyle;
        loadingStyle.display = 'block';
        this.setState({ loadingstyle: loadingStyle });
      } else {
        const loadingStyle = this.state.loadingstyle;
        loadingStyle.display = 'none';
        this.setState({ loadingstyle: loadingStyle });
      }
      log(`VideoState:: ${denotePlaystate(this.video.playState, this.video.error)}`);
    };
    this.props.autoplay && this.play();
  }

  componentWillUnmount() {
    // if the video is removed before init. fast toggeling
    this.setState({ display: 'none' });
    if (this.video) {
      this.video.onPlayStateChange = () => {};
      this.video.stop && this.video.stop();
      this.video.setSource && this.video.setSource('');
    }
  }

  play() {
    this.video.play && this.video.play(1);
  }
  pause() {
    this.video.play && this.video.play(0);
  }
  seek(pos) {
    this.video.seek(pos);
  }

  currentPosition() {
    return this.video.playPosition;
  }
  length() {
    return this.video.playTime;
  }
  playState() {
    return this.video.playState;
  }

  render() {
    return (
      <div style={{ position: 'absolute', overflow: 'hidden', width: '100%', height: '100%', display: this.state.display }}>
        <div className="video-wrapper" style={this.props.style}>
          <object id={this.id} type={this.props.type} data={this.props.src} />
        </div>
        <div style={this.state.loadingstyle} className="video-loading" />
      </div>
    );
  }
}
