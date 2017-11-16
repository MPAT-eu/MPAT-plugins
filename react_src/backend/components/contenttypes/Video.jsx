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
 * Stefano Miccoli (stefano.miccoli@finconsgroup.com)
 * Marco Ferrari (marco.ferrari@finconsgroup.com)
 **/
import React from 'react';
import { componentLoader } from '../../../ComponentLoader';
import { openMediaGallery } from '../../utils';
import AssetFinder from '../helpers/Inputs';
import autobind from 'class-autobind';
import { noSubmitOnEnter } from '../../utils';

import Constants from '../../../constants';
const i18n = Constants.locstr.video;

function editView(params) {
  const { id, data, changeAreaContent, context, stateId } = params;
  return (
    <VideoEdit id={id} {...data} changeAreaContent={changeAreaContent} />
  );
}

function preview(content = {}) {
  const thumbnail = (content.data) ? (content.data.thumbnail) : '';
  return (
    <div className="mpat-content-preview videocontent-preview">
      <div className="mpat-image-preview" style={{ backgroundImage: `url(${thumbnail})` }} />
    </div>
  );
}


class VideoEdit extends React.PureComponent {

  static defaultProps = {
    url: '',
    autostart: false,
    loop: false,
    live: false,
    fullscreen: false,
    zoom: false,
    playIcon: true,
    showNavBar: true,
    thumbnail: '',
    asset: ''
  };

  constructor() {
    super();
    autobind(this);
  }

  setContent(key, value) {
    if (key === "url" || key === "thumbnail") {
      this.props.changeAreaContent({
        [key]: value,
        'asset': '',
      });
    } else {
      this.props.changeAreaContent({ [key]: value });
    }
  }

  setAsset(value, item) {
    if (item === null) {
      this.props.changeAreaContent({ 'asset': value });
    } else {
      this.props.changeAreaContent({
        'asset': item.meta["_tva_title"],
        'url': item.meta["_tva_hbbtv_reference_video_url"][0],
        'thumbnail': item.meta["_tva_preview_image"][0]
      });
    }
  }
  render() {
    const { url, autostart, loop, live, fullscreen, zoom, playIcon, showNavBar, thumbnail, asset } = this.props;
    return (
      <div className="component editHeader">
        <h2>{i18n.title}</h2>
        <table>
          <tbody>
            <tr>
              <td>
                <label>{i18n.asset}: </label>
              </td>
              <td>
                <AssetFinder value={asset} onSelect={this.setAsset} onChange={this.setAsset} />
              </td>
            </tr>
            <tr>
              <td>
                <label>{i18n.src}: </label>
              </td>
              <td>
                <input
                  type="text"
                  id="videoUrlInput"
                  placeholder={i18n.placeHolderSrc}
                  value={url}
                  onKeyPress={noSubmitOnEnter}
                  onChange={e => this.setContent('url', e.target.value)}
                />
                <span className="padded_or">{i18n.or}</span>
                <button type="button" target="videoUrlInput"
                  className="button mpat-insert-media white_blue" data-type="video">
                  {i18n.chooseVideo}
                </button>
              </td>
            </tr>
            <tr>
              <td>
                <label>{i18n.thumbnail}: </label>
              </td>
              <td>
                <input
                  type="text"
                  id="videoThumbnailInput"
                  placeholder={i18n.placeHolderThumbnail}
                  value={thumbnail}
                  onKeyPress={noSubmitOnEnter}
                  onChange={e => this.setContent('thumbnail', e.target.value)}
                />
                <span className="padded_or">{i18n.or}</span>
                <button type="button" target="videoThumbnailInput"
                  className="button mpat-insert-media white_blue" data-type="image">
                  {i18n.chooseThumbnail}
                </button>
              </td>
            </tr>
            <tr>
              <td>
                <label>{i18n.autoPlay}: </label>
              </td>
              <td>
                <input type="checkbox" checked={autostart}
                  onChange={e => this.setContent('autostart', e.target.checked)} />
                &nbsp;({i18n.startPlaybackWhenPage})
            </td>
            </tr>
            <tr>
              <td>
                <label>{i18n.repeat}: </label>
              </td>
              <td>
                <input type="checkbox" checked={loop}
                  onChange={e => this.setContent('loop', e.target.checked)} />
                ({i18n.loop})
            </td>
            </tr>
            <tr>
              <td>
                {/* TODO i18n */}
                <label>Live: </label>
              </td>
              <td>
                <input type="checkbox" checked={live}
                  onChange={e => this.setContent('live', e.target.checked)} />
                {/* TODO i18n */}
                ({ })
            </td>
            </tr>
            <tr>
              <td>
                <label>{i18n.fullscreenStart}: </label>
              </td>
              <td>
                <input type="checkbox" checked={fullscreen}
                  onChange={e => this.setContent('fullscreen', e.target.checked)} />
                ({i18n.startVideoFullScr})
            </td>
            </tr>
            <tr>
              <td>
                <label>{i18n.removeBlackBars}: </label>
              </td>
              <td>
                <input type="checkbox" checked={zoom}
                  onChange={e => this.setContent('zoom', e.target.checked)} />
                ({i18n.zoomVideo})
            </td>
            </tr>
            <tr>
              <td>
                <label>{i18n.playIcon}</label>
              </td>
              <td>
                <input type="checkbox" checked={playIcon}
                  onChange={e => this.setContent('playIcon', e.target.checked)} />
                ({i18n.showPlayIcon})
            </td>
            </tr>
            <tr>
              <td>
                <label>{i18n.showNavBar}</label>
              </td>
              <td>
                <input type="checkbox" checked={showNavBar}
                  onChange={e => this.setContent('showNavBar', e.target.checked)} />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}


componentLoader.registerComponent(
  'video', {
    edit: editView,
    preview
  }, {
    isHotSpottable: true,
    isScrollable: false,
    hasNavigableGUI: true,
    isStylable: false
  }, {
    navigable: true
  }
);
