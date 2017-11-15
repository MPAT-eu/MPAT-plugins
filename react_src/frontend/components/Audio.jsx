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
 *
 **/
import React, { PropTypes as Types } from 'react';
import { log } from '../utils';
import Constants from '../../constants';

const i18n = Constants.locstr.frontend;

function denoteAudioError(error) {
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
      return i18n.state.stop;
    case 1:
      return i18n.state.play;
    case 2:
      return i18n.state.pause;
    case 3:
      return i18n.state.connected;
    case 4:
      return i18n.state.buffering;
    case 5:
      return i18n.state.finished;
    case 6:
      return `ERROR [${denoteAudioError(error)}]`;
    default:
      return `Unexpected state code: ${state}`;
  }
}

export default class Audio extends React.Component {

  static propTypes = {
    src: Types.string.isRequired,
    loop: Types.bool
  }

  static defaultProps = {
    loop: false
  }

  componentDidMount() {
    this.audio = document.getElementById('audio');
    this.audio.onPlayStateChange = () => {
      if (this.props.loop && this.playState() === 5) {
        this.play();
      }
      log(`audioState:: ${denotePlaystate(this.audio.playState, this.audio.error)}`);
    };
  }

  componentWillUnmount() {
    this.audio.stop && this.audio.stop();
    this.audio.setSource && this.audio.setSource('');
  }

  play() {
    this.audio.play && this.audio.play(1);
  }
  pause() {
    this.audio.play && this.audio.play(0);
  }

  seek(pos) {
    this.audio.seek(pos);
  }

  currentPosition() {
    return this.audio.playPosition;
  }

  length() {
    return this.audio.playTime;
  }
  playState() {
    return this.audio.playState;
  }

  render() {
    const audioHtml = `<object id="audio" type="audio/mpeg" data="${this.props.src}"></object>`;
    return (
      <div
        className="audio-wrapper"
        dangerouslySetInnerHTML={{ __html: audioHtml }}
      />
    );
  }

}
