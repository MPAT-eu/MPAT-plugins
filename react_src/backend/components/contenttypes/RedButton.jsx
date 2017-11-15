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
 * Jean-Claude Dufourd (jean-claude.dufourd@telecom-paristech.fr
 *
 **/
import autobind from 'class-autobind';
import React, { PropTypes as Types } from 'react';
import { componentLoader } from '../../../ComponentLoader';
import { openMediaGallery, noSubmitOnEnter } from '../../utils';
import { getTooltipped } from '../../tooltipper.jsx';
import Constants from '../../../constants';

function editView(params) {
  const { id, data, changeAreaContent, context, stateId } = params;
  return (
    // FIXME empty content should come as undefined, not as empty string
    <RedEdit id={id} {...(data === '' ? {} : data) } changeAreaContent={changeAreaContent} />
  );
}
function preview(content = {}) {
  const divImage = { backgroundImage: `url(${content.img})` };
  return (
    <div className="mpat-content-preview imagecontent-preview" style={divImage}>
      <p className="right">{`Red Button shows @${content.time}s for ${content.duration}s`}</p>
    </div>
  );
}


class RedEdit extends React.PureComponent {

  static propTypes = {
    id: Types.string,
    url: Types.string,
    img: Types.string,
    time: Types.string,
    duration: Types.string
  };

  static defaultProps = {
    url: '',
    img: '',
    time: '',
    duration: ''
  };

  constructor() {
    super();
    autobind(this);
  }

  componentDidMount() {
    if (!window.MPAT) window.MPAT = {};
    window.MPAT.mediaUploaderTarget = content => this.setContent('img', content);
  }

  componentWillUnmount() {
    delete window.MPAT.mediaUploaderTarget;
  }

  setContent(key, value) {
    this.props.changeAreaContent({ [key]: value });
  }

  render() {
    const { url, img, time, duration } = this.props;
    return (
      <div className="component editHeader">
        <h2>{Constants.locstr.redbutton.redButtonSettings}</h2>
        <table>
          <tbody>
            <tr>
              <td>
                <label>{Constants.locstr.redbutton.buttonImage}: </label>
              </td>
              <td>
                {getTooltipped(
                  <input
                    type="text"
                    id="mediaUploaderTarget"
                    value={img}
                    placeholder={Constants.locstr.redbutton.placeHolderImageUrl}
                    onChange={e => this.setContent('img', e.target.value)}
                    onKeyPress={noSubmitOnEnter}
                  />
                  , Constants.locstr.redbutton.ttImageUrl)}
                &nbsp;&nbsp;
              {getTooltipped(
                  <button
                    type="button"
                    target="mediaUploaderTarget"
                    className="button mpat-insert-media white_blue"
                    data-type="image"
                  >
                    {Constants.locstr.redbutton.chooseImage}
                  </button>
                  , Constants.locstr.redbutton.ttChooseImage)}
              </td>
            </tr>
            <tr>
              <td>
                <label>{Constants.locstr.redbutton.redButtonLink}: </label>
              </td>
              <td>
                {getTooltipped(
                  <input
                    type="text"
                    value={url}
                    placeholder={Constants.locstr.redbutton.placeHolderRedButtonLink}
                    onKeyPress={noSubmitOnEnter}
                    onChange={e => this.setContent('url', e.target.value)}
                  />
                  , Constants.locstr.redbutton.ttRedButtonLink)}
              </td>
            </tr>
            <tr>
              <td>
                <label>{Constants.locstr.redbutton.fadeInTime}: </label>
              </td>
              <td>
                {getTooltipped(
                  <input
                    type="text"
                    value={time}
                    placeholder={Constants.locstr.redbutton.placeHolderFadeInTime}
                    onKeyPress={noSubmitOnEnter}
                    onChange={e => this.setContent('time', e.target.value)}
                  />
                  , Constants.locstr.redbutton.ttFadeInTime)}
              </td>
            </tr>
            <tr>
              <td>
                <label>{Constants.locstr.redbutton.displayDuration}: </label>
              </td>
              <td>
                {getTooltipped(
                  <input
                    type="text"
                    value={duration}
                    placeholder={Constants.locstr.redbutton.placeHolderDisplayDuration}
                    onKeyPress={noSubmitOnEnter}
                    onChange={e => this.setContent('duration', e.target.value)}
                  />
                  , Constants.locstr.redbutton.ttDisplayDuration)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

componentLoader.registerComponent(
  'redbutton', {
    edit: editView,
    preview
  }, {
    isHotSpottable: false,
    isScrollable: false,
    hasNavigableGUI: false,
    isStylable: false
  }, {
    navigable: true
  }
);
