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
import { AudioOff } from '../icons';
import { componentLoader } from '../../../ComponentLoader';
import { noSubmitOnEnter } from '../../utils';
import { getTooltipped } from '../../tooltipper.jsx';
import Constants from '../../../constants';

const i18n = Constants.locstr.audio;

function edit(params) {
  const { id, data, changeAreaContent } = params;
  return (
    <AudioEdit id={id} {...data} changeAreaContent={changeAreaContent} />
  );
}

function preview() {
  return (
    <div className="mpat-content-preview audiocontent-preview">
      <AudioOff />
    </div>
  );
}

class AudioEdit extends React.PureComponent {

  static propTypes = {
    url: Types.string,
    autostart: Types.bool,
    loop: Types.bool,
    changeAreaContent: Types.func.isRequired
  };

  static defaultProps = {
    url: '',
    autostart: false,
    loop: false
  };

  setContent(key, value) {
    this.props.changeAreaContent({ [key]: value });
  }

  render() {
    const { url, autostart, loop } = this.props;
    return (
      <div className="component editHeader">
        <h2>{i18n.title}</h2>
        <table>
          <tbody>
            <tr>
              <td>
                <label htmlFor="audioUrlInput">{i18n.audioUrlLabel} </label>
              </td>
              <td>
                {
                  getTooltipped(
                    <input
                      type="text"
                      id="audioUrlInput"
                      value={url}
                      placeholder={i18n.audioUrlInput}
                      onChange={e => this.setContent('url', e.target.value)}
                      onKeyPress={noSubmitOnEnter}
                    />
                    , i18n.ttAudioUrl)
                }
                &nbsp;&nbsp;
                {
                  getTooltipped(
                    <button
                      type="button"
                      target="audioUrlInput"
                      className="button mpat-insert-media white_blue"
                      data-type="audio"
                    >{i18n.chooseFile}</button>
                    , i18n.ttChooseFile)
                }
              </td>
            </tr>
            <tr>
              <td>
                <label>{i18n.autoStart}: </label>
              </td>
              <td>
                {getTooltipped(<input
                  type="checkbox"
                  checked={autostart}
                  onChange={e => this.setContent.call(this, 'autostart', e.target.checked)}
                />
                  , i18n.ttAutostart)}
              </td>
            </tr>
            <tr>
              <td>
                <label>{i18n.repeat}: </label>
              </td>
              <td>
                {getTooltipped(<input
                  type="checkbox"
                  checked={loop}
                  onChange={e => this.setContent.call(this, 'loop', e.target.checked)}
                />
                  , i18n.ttRepeat)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

componentLoader.registerComponent(
  'audio',
  { edit, preview },
  {
    isHotSpottable: true,
    isScrollable: false,
    hasNavigableGUI: true,
    isStylable: false
  },
  {
    navigable: true
  }
);

