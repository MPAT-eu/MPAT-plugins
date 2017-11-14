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
import axios from 'axios';
import { componentLoader } from '../../../ComponentLoader';
import { openMediaGallery } from '../../utils';
import { getTooltipped } from '../../tooltipper.jsx';
import ImageCropper from '../ImageCropper';
// eslint-disable-next-line
import _reactCropStyle from 'react-image-crop/dist/ReactCrop.css';
import Constants from '../../../constants';

const i18n = Constants.locstr.image;

function edit(params) {
  const { id, data, changeAreaContent, context, stateId } = params;
  return (
    <ImageEdit id={id} {...data} context={context} changeAreaContent={changeAreaContent} />
  );
}

function preview(content = {}) {
  const imgUrl = (content.data) ? (content.data.imgUrl) : '';
  return (
    <div className="mpat-content-preview imagecontent-preview">
      <div className="mpat-image-preview" style={{ backgroundImage: `url(${imgUrl})` }} />
    </div>
  );
}

function onEditorLoaded() {
  window.scrollTo(0, document.body.scrollHeight);
}

// TODO: check browsers compatibility
class ImageEdit extends React.PureComponent {

  static propTypes = {
    imgUrl: Types.string
  };

  static defaultProps = {
    imgUrl: '',
    postid: ''
  };

  constructor(props) {
    super(props);
    autobind(this);
    this.state = {
      crop: {},
      nonce: false,
      cropDisabled: false,
      spinnerUploadImage: null,

    };
  }

  onCropComplete(newAttachmentInfo) {
    this.props.changeAreaContent({
      imgUrl: newAttachmentInfo.url,
      postid: this.props.postid
    })
  }

  mediaGalleryCallback(imgData) {
    this.props.changeAreaContent(
      {
        imgUrl: imgData.imgUrl,
        postid: imgData.id
      });
  }

  setContent(key, value) {
    this.props.changeAreaContent({ [key]: value });
  }

  setImageUrl() {
    this.setState(
      {
        cropDisabled: true,
        spinnerUploadImage: `${window.siteurl}/wp-admin/images/wpspin_light.gif`
      });
    const imageUrl = this.props.imgUrl;
    const reqURL = `${ajaxurl}?action=mpat_insert_image_from_url&url=${imageUrl}`;
    axios.get(reqURL).then((result) => {
      if (result.data.data) {
        this.props.changeAreaContent(
          {
            imgUrl: imageUrl,
            postid: result.data.data.postid
          });
        this.setState(
          {
            cropDisabled: null,
            spinnerUploadImage: null
          });
      } else {
        console.log(result);
      }
    });
  }

  render() {
    return (
      <div className="component editHeader">
        <h2>{i18n.title}</h2>
        <table>
          <tbody>
            <tr>
              <td>
                <label>{i18n.url}: </label>
              </td>
              <td>
                {getTooltipped(
                  <input
                    type="text"
                    id="imageUrlInput"
                    placeholder={i18n.url}
                    value={this.props.imgUrl}
                    style={{ width: 250 }}
                    onChange={e => this.setContent("imgUrl", e.target.value)}
                  />
                  , i18n.ttUrl)}
                &nbsp;&nbsp;
              {getTooltipped(
                  <button type="button" target="imageUrlInput" className="button white_blue"
                    onClick={() => this.setImageUrl()}>{i18n.upload}
                    <img src={this.state.spinnerUploadImage} />
                  </button>
                  , i18n.ttUploadImg)}
              </td>
            </tr>

            <tr>
              <td><label>{i18n.chooseFromLibrary}</label></td>
              <td>
                {getTooltipped(
                  <button
                    type="button"
                    target="imageUrlInput"
                    className="button white_blue"
                    onClick={() => openMediaGallery(this.mediaGalleryCallback, "image")}
                  >
                    {i18n.choose}
                  </button>
                  , i18n.ttChooseImg)}
              </td>
            </tr>
            <tr>
              <td></td>
              <td>
                <ImageCropper
                  attachmentId={this.props.postid}
                  context={this.props.context}
                  onCropComplete={this.onCropComplete}
                  onEditorLoaded={onEditorLoaded}
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

componentLoader.registerComponent(
  'image',
  { edit, preview },
  {
    isHotSpottable: true,
    hasNavigableGUI: true
  }
);
