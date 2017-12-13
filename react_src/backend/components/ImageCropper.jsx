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
 * Jean-Philippe Ruijs (github.com/jeanphilipperuijs)
 * Stefano Miccoli (stefano.miccoli@finconsgroup.com)
 * Marco Ferrari (marco.ferrari@finconsgroup.com)
 **/
import React from 'react';
import autobind from 'class-autobind';
import ReactCrop from 'react-image-crop';
import axios from 'axios';
import { getTooltipped } from '../tooltipper.jsx';
import Constants from '../../constants';

const i18n = Constants.locstr.imageCropper;
// require('react-image-crop/dist/ReactCrop.css');

function getPreviewImageUrl(nonce, attachmentId) {
  return `${window.window.ajaxurl}?action=imgedit-preview&_ajax_nonce=${nonce}&postid=${attachmentId}&t=${Date.now()}`;
}

// TODO: check browsers compatibility
class ImageCropper extends React.PureComponent {

  constructor(props) {
    super(props);
    autobind(this);
    let newState = {};
    newState = {
      ...props,
      nonce: false,
      cropDisabled: false,
      restoreButtonSpinner: false,
      saveButtonSpinner: false,
      crop: {},
      imgPreview: props.imageSpinner
    };

    if (props.context) {
      newState.defaultCrop.aspect = (props.context.w / props.context.h);
    }
    this.state = newState;
  }

  componentDidMount() {
    this.initializeImageEditor();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.attachmentId !== this.props.attachmentId) {
      this.setState({
        imgPreview: this.props.imageSpinner,
        cropDisabled: false
      });
      const reqURL = `${window.window.ajaxurl}?action=mpat_image_editor_nonce&id=${nextProps.attachmentId}`;
      const that = this;

      axios.get(reqURL).then((result) => {
        if (result.data.data) {
          const nonce = result.data.data;

          this.setState({
            attachmentId: nextProps.attachmentId,
            nonce,
            imgPreview: getPreviewImageUrl(nonce, nextProps.attachmentId),
            cropDisabled: false
          });
        }
      });
    }
  }

  // callback to completed image load in react crop, used to properly enable
  // area selection
  onImageLoaded(crop, image, pixelCrop) {
    const newState = { pixelCrop };
    if (this.state.imgPreview !== this.props.imageSpinner && this.state.imgPreview !== this.props.previewImagePlaceholder) {
      newState.crop = this.state.defaultCrop;
      if (this.state.currentCropRatio) {
        newState.crop.aspect = this.state.currentCropRatio;
      }
    }

    this.setState(newState);

    this.props.onImageLoaded({
      crop,
      image,
      pixelCrop
    });
  }

  // change crop area ratio and position after selection from combobox
  setAspect(val) {
    const value = val === 'null' ? null : val;

    this.setState({
      currentCropRatio: value,
      crop: {
        aspect: value,
        width: 10,
        x: 0,
        y: 0
      }
    });
  }

  // Standard WP action imgedit-preview generate a preview image for give attachmentid,
  // with the biggest of dimensions set at 400px (used in image crop editor also by standard WP editor)
  // we add a timestamp (milliseconds) to be sure to fool React Crop and tell him to reload
  // the image (since the url is changed)

  initializeImageEditor() {
    const reqURL = `${window.window.ajaxurl}?action=mpat_image_editor_nonce&id=${this.state.attachmentId}`;
    const that = this;

    axios.get(reqURL).then((result) => {
      if (result.data.data) {
        const nonce = result.data.data;
        let img;
        let cropDisabledState;

        if (that.state.attachmentId === '') {
          img = that.props.previewImagePlaceholder;
          cropDisabledState = true;
        } else {
          img = getPreviewImageUrl(nonce, that.state.attachmentId);
          cropDisabledState = false;
        }

        that.setState({
          cropDisabled: cropDisabledState,
          nonce,
          imgPreview: img
        });

        that.props.onEditorLoaded({
          attachmentId: that.state.attachmentId,
          cropDisabled: that.state.cropDisabled,
          imgPreview: that.state.imgPreview
        });
      } else {
        console.log(result);
      }
    }).catch((error) => {
      console.log(error);
    });
  }

  // Handle image crop operation
  saveImage() {
    const that = this;

    // disable editor while cropping
    this.setState({
      cropDisabled: true,
      saveButtonSpinner: true
    });

    // settings crop coordinates as expected by WP
    const history = [
      {
        c: {
          x: Math.round(this.state.pixelCrop.x),
          y: Math.round(this.state.pixelCrop.y),
          w: Math.round(this.state.pixelCrop.width),
          h: Math.round(this.state.pixelCrop.height)
        }
      }
    ];

    // prepare async post data
    const data = new URLSearchParams();
    data.append('action', 'image-editor');
    data.append('_ajax_nonce', this.state.nonce);
    data.append('postid', this.state.attachmentId);
    data.append('history', JSON.stringify(history));
    data.append('target', 'all');
    data.append('do', 'save');

    // submit image crop information to standard WP action
    axios.post(window.ajaxurl, data).then(() => {
      // after crop completed get updated image information from WP
      // we cannot rely on returned image, since it might not be the full one.
      const imageEndpoint = `${window.wpApiSettings.root + window.wpApiSettings.versionString}media/${that.state.attachmentId}`;
      axios.get(imageEndpoint, { headers: { 'X-WP-Nonce': window.wpApiSettings.nonce } }).then((result) => {
        const media = result.data.media_details;
        let imageUrl = media.sizes.full.source_url;

        if (media.sizes.large) {
          if ((media.width > media.sizes.large.width) && (media.height > media.sizes.large.height)) { imageUrl = media.sizes.large.source_url; }
        }
        if (imageUrl) {
          // reload preview image (based on new cropped version) and re enable editor
          that.setState({
            imgPreview: getPreviewImageUrl(that.state.nonce, that.state.attachmentId),
            cropDisabled: false,
            saveButtonSpinner: false,
            crop: {
              aspect: that.state.crop.aspect,
              width: 10,
              x: 0,
              y: 0
            }
          });

          // trigger callback with cropped image data to parent component
          that.props.onCropComplete({
            id: that.state.attachmentId, // same result.data.id
            url: imageUrl,
            width: result.data.media_details.width,
            height: result.data.media_details.height
          });
        } else {
          console.log(result);
        }
      }).catch((error) => {
        console.log(error);
      });
    }).catch((error) => {
      console.log(error);
    });
  }

  // Handle image restore operation
  restoreImage() {
    const that = this;

    // disable editor while cropping
    this.setState({
      cropDisabled: true,
      restoreButtonSpinner: true
    });

    // prepare async post data
    const data = new URLSearchParams();
    data.append('action', 'image-editor');
    data.append('_ajax_nonce', this.state.nonce);
    data.append('postid', this.state.attachmentId);
    data.append('do', 'restore');

    // submit image information to standard WP action for image crop restore
    axios.post(window.ajaxurl, data).then(() => {
      // after image restore get updated image information from WP. By default wordpress returns
      // complete HTML to reload editor, we call the REST endpoint and get updated image info
      const imageEndpoint = `${window.wpApiSettings.root + window.wpApiSettings.versionString}media/${that.state.attachmentId}`;
      axios.get(imageEndpoint, { headers: { 'X-WP-Nonce': window.wpApiSettings.nonce } }).then((result) => {
        const imageUrl = (result.data.media_details.sizes.large ? result.data.media_details.sizes.large.source_url : result.data.media_details.sizes.full.source_url);
        if (imageUrl) {
          // reload preview image (based on new cropped version) and re enable editor
          that.setState({
            imgPreview: getPreviewImageUrl(that.state.nonce, that.state.attachmentId),
            cropDisabled: false,
            restoreButtonSpinner: false
          });

          // trigger callback with restored image data to parent component
          that.props.onCropComplete({
            id: that.state.attachmentId, // same result.data.id
            url: imageUrl,
            width: result.data.media_details.width,
            height: result.data.media_details.height
          });
        } else {
          console.log(result);
        }
      });
    }).catch((error) => {
      console.log(error);
    });
  }

  // callback to React Crop
  changeImageSize(crop, pixelCrop) {
    this.setState({
      crop,
      pixelCrop
    });
  }

  // And there was the cropper!!!
  render() {
    /* standard aspect ratios clone (otherwise it will overwrite props) */
    const ratioValues = this.props.ratioValues.slice();
    /* if context specified add related aspect ratio as first choice */
    if (this.props.context) {
      ratioValues.unshift({ key: 0, label: 'Crop Ratio' }); // 0 = key that does not already exist
    }

    return (
      <div className="component">
        <h2>{i18n.cropImage}</h2>
        <div className="componentSettings">

          <table>
            <tbody>
              <tr>
                <td>
                  {getTooltipped(
                    <button type="button" className="button white_blue" disabled={this.state.cropDisabled} onClick={this.restoreImage}>
                      {i18n.restore} <img src={(this.state.restoreButtonSpinner) ? this.props.buttonSpinner : null} role="presentation" />
                    </button>
                  , i18n.ttRestore)}
                </td>
                <td>
                  {getTooltipped(
                    <button type="button" className="button white_blue" disabled={this.state.cropDisabled || !this.state.pixelCrop} onClick={this.saveImage}>
                      {i18n.crop} <img src={(this.state.saveButtonSpinner) ? this.props.buttonSpinner : null} role="presentation" />
                    </button>
                  , i18n.ttCrop)}
                </td>
                <td>
                  {getTooltipped(
                    <select value={this.state.currentCropRatio} disabled={this.state.cropDisabled} onChange={e => that.setAspect(e.target.value)}>
                      {ratioValues.map(obj => <option key={obj.key} value={obj.key}>{obj.label}</option>)}
                    </select>
                  , i18n.ttCropRatio)}
                </td>
              </tr>
            </tbody>
          </table>

          <ReactCrop
            disabled={this.state.cropDisabled}
            src={this.state.imgPreview}
            crop={this.state.crop}
            onComplete={this.changeImageSize}
            onImageLoaded={this.onImageLoaded}
          />
        </div>
      </div>
    );
  }
}

ImageCropper.propTypes = {
  attachmentId: React.PropTypes.string,
  defaultCrop: React.PropTypes.object,
  ratioValues: React.PropTypes.array,
  onImageLoaded: React.PropTypes.func,
  buttonSpinner: React.PropTypes.string
};

ImageCropper.defaultProps = {
  attachmentId: null,
  defaultCrop: {
    aspect: 1,
    width: 10,
    x: 0,
    y: 0
  },
  ratioValues: [
    { key: 16 / 9, label: '16:9' },
    { key: 4 / 3, label: '4:3' },
    { key: 3 / 2, label: '3:2' },
    { key: 3 / 4, label: '3:4' },
    { key: 2 / 3, label: '2:3' },
    { key: 'null', label: i18n.free }
  ],
  buttonSpinner: `${window.siteurl}/wp-admin/images/wpspin_light.gif`,
  imageSpinner: `${window.siteurl}/wp-admin/images/wpspin_light-2x.gif`,
  previewImagePlaceholder: `${window.corepluginurl}assets/select-image.png`,
  onCropComplete() { },
  onEditorLoaded() { },
  onImageLoaded() { }
};

export default ImageCropper;
