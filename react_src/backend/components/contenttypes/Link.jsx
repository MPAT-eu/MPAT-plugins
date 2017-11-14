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
 * Benedikt Vogel 	 (vogel@irt.de)
 * Jean-Claude Dufourd (jean-claude.dufourd@telecom-paristech.fr
 *
 **/
import React, { PropTypes as Types } from 'react';
import autobind from 'class-autobind';
import { noSubmitOnEnter } from '../../utils';
import {getTooltipped} from '../../tooltipper.jsx';
import PageSelector from '../helpers/PageSelector';
import { componentLoader } from '../../../ComponentLoader';
import Constants from '../../../constants';

function edit(params) {
  const { id, data, changeAreaContent } = params;
  return (
    <LinkEdit id={id} {...data} changeAreaContent={changeAreaContent} />
  );
}

function preview(content = {}) {
  const divStyleCover = {
    backgroundImage: `url(${content.thumbnail})`,
    backgroundSize: 'cover'
  };
  const divStyleContain = {
    backgroundImage: `url(${content.thumbnail})`,
    backgroundSize: 'contain'
  };
  if (content.data && content.data.cover) {
    return (
      <div className="mpat-content-preview imagecontent-preview" style={divStyleCover}>
        <p>{content.data.label}</p>
      </div>
    );
  }
  return (
    <div className="mpat-content-preview imagecontent-preview" style={divStyleContain}>
      <p>{(content.data) ? content.data.label : ''}</p>
    </div>
  );
}


class LinkEdit extends React.PureComponent {

  static propTypes = {
    label: Types.string,
    url: Types.string,
    cover: Types.bool,
    thumbnail: Types.string
  };

  static defaultProps = {
    label: '',
    url: '',
    cover: false,
    thumbnail: '',
    changeAreaContent: Types.function
  };

  constructor() {
    super();
    autobind(this);
  }

  setContent(key, value) {
    const res = { [key]: value };
    if (key === 'label') {
      res.labelEdited = (value !== '');
    }
    this.props.changeAreaContent(res);
  }

  mediaGalleryCallback(imgData) {
    this.setContent('thumbnail', imgData.imgUrl);
  }

  setPageCallbackFunction(selectedPage) {
    if (this.props.labelEdited) {
      this.props.changeAreaContent(
        {
          'url': selectedPage.url
        })
    } else {
      this.props.changeAreaContent(
        {
          'label': selectedPage.title,
          'url': selectedPage.url
        })
    }
  }

  render() {
    const { thumbnail, label, url, cover } = this.props;
    return (
      <div className="component editHeader">
        <h2>{Constants.locstr.link.linkSettings}</h2>
        <table>
          <tbody>
            <tr>
              <td>
                <label>{Constants.locstr.link.linkImageUrl}: </label>
              </td>
              <td>
                {getTooltipped(
                  <input
                    type="text"
                    id="linkImageUrlInput"
                    placeholder={Constants.locstr.link.placeHolderLinkImageUrl}
                    value={thumbnail}
                    onChange={e => this.setContent.call(this, 'thumbnail', e.target.value)}
                    onKeyPress={noSubmitOnEnter}
                  />
                  , Constants.locstr.link.ttLinkImageUrl)}
                <div style={{ marginLeft: 20, marginRight: 20, display: 'inline' }}>OR</div>
                {getTooltipped(
                  <button type="button" target="linkImageUrlInput" data-type="image"
                    className="button mpat-insert-media white_blue">{Constants.locstr.link.chooseLinkImage}
                  </button>
                  , Constants.locstr.link.ttChooseLinkImage)}
              </td>
            </tr>
            <tr>
              <td>
                <label>{Constants.locstr.link.linkLabel}: </label>
              </td>
              <td>
              {getTooltipped(
                <input type="text" placeholder={Constants.locstr.link.placeHolderLinkLabel} value={label}
                  onKeyPress={noSubmitOnEnter}
                  onChange={e => this.setContent.call(this, 'label', e.target.value)} />
                  , Constants.locstr.link.ttLinkLabel)}
              </td>
            </tr>
            <tr>
              <td>
                <label>{Constants.locstr.link.linkTarget}: </label>
              </td>
              <td>
              {getTooltipped(
                <input type="text" placeholder={Constants.locstr.link.placeHolderLinkUrl} value={url}
                  onKeyPress={noSubmitOnEnter}
                  onChange={e => this.setContent.call(this, 'url', e.target.value)} />
                  , Constants.locstr.link.ttLinkTarget)}
              </td>
            </tr>
            <tr>
              <td>
                <label>{Constants.locstr.link.pages}: </label>
              </td>
              <td>
              {getTooltipped(
                <PageSelector
                  selectedPage={url}
                  callbackFunction={this.setPageCallbackFunction}
                />
                  , Constants.locstr.link.ttPages)}
              </td>
            </tr>
            <tr>
              <td>
                <label>{Constants.locstr.link.imageLayoutCover}: </label>
              </td>
              <td>
              {getTooltipped(
                <input type="checkbox" checked={cover}
                  onChange={e => this.setContent.call(this, 'cover', e.target.checked)} />
                  , Constants.locstr.link.ttImageLayoutCover)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}


componentLoader.registerComponent(
  'link',
  { edit, preview },
  {
    isHotSpottable: false,
    isScrollable: false,
    isStylable: true
  },
  {
    navigable: true
  }
);
