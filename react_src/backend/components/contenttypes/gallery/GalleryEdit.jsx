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
 * Jean-Philippe Ruijs (github.com/jeanphilipperuijs)
 * Jean-Claude Dufourd (jean-claude.dufourd@telecom-paristech.fr
 * Stefano Miccoli (stefano.miccoli@finconsgroup.com)
 * Marco Ferrari (marco.ferrari@finconsgroup.com)
 **/
import React, { PropTypes as Types } from 'react';
import autobind from 'class-autobind';
import { Sortable } from 'react-sortable';
import { noSubmitOnEnter, openMediaGallery } from '../../../utils';
import { generateId } from '../../../../functions';
import { getTooltipped } from '../../../tooltipper.jsx';
import constants from '../../../../constants';
import ImageCropper from '../../ImageCropper';
import { EditIcon, TrashBinIcon } from '../../icons';

const i18n = constants.locstr.gallery;

function GalleryElement(props) {
  const { image, openCropEditor, deleteImage, active } = props.children;
  return (
    <div
      {...props}
      className="grid-item"
      style={{
        position: 'relative',
        display: 'inline-block',
        border: '2px #ccc solid',
        background: (active) ? '#fff' : '#ddd',
        padding: '5px',
        margin: '10px',
        lineHeight: 0
      }}
    >
      <img
        src={image.attachmentUrl}
        style={{ maxWidth: '140px', height: 'auto', position: 'relative' }}
      />
      <div onClick={() => openCropEditor(image)} className="galleryItemCrop" title="Crop Image">
        <EditIcon />
      </div>
      <div
        onClick={() => deleteImage(image.id)}
        className="galleryItemRemove cross_link delete"
        title={i18n.removeImage}
      />
    </div>
  );
}

GalleryElement.prototype.displayName = 'SortableGalleryElement';

const SortableGalleryElement = Sortable(GalleryElement);

function instantiateImage() {
  return {
    attachmentUrl: '',
    attachmentId: null,
    id: generateId()
  };
}

function onEditorLoaded() {
  window.scrollTo(0, document.body.scrollHeight);
}

// TODO: check browsers compatibility
export default class GalleryEdit extends React.PureComponent {

  static propTypes = {
    id: Types.string.isRequired,
    // TODO
    images: Types.array,
    orientation: Types.string,
    fitContainer: Types.bool,
    autoplayInterval: Types.string,
    autoplay: Types.bool,
    dots: Types.bool,
    arrows: Types.bool,
    loop: Types.bool,
    mediaKeys: Types.bool
  };

  static defaultProps = {
    images: [],
    orientation: 'horizontal',
    fitContainer: true,
    autoplayInterval: '1000',
    autoplay: false,
    dots: false,
    arrows: false,
    loop: false,
    mediaKeys: false
  };

  constructor(props) {
    super(props);
    autobind(this);
    this.state = {
      draggingIndex: null,
      activeEditor: null
    };
  }

  componentWillReceiveProps(nextProps) {
    let closeCrop = true;
    if (this.state) {
      if (this.state.activeEditor != null) {
        const that = this;
        nextProps.images.forEach(function (value) {

          if (value.attachmentId == that.state.activeEditor.attachmentId) {
            closeCrop = false;
          }
        });
        if (closeCrop == true) {
          this.setState({ activeEditor: null })
        }
      }
    }
  }

  onCropComplete(newAttachmentInfo) {
    const image = this.state.activeEditor;
    image.attachmentUrl = newAttachmentInfo.url;
    this.setImageContent(image.id, image);
  }

  getImageIndex(imageId) {
    return this.props.images.findIndex(({ id }) => id === imageId);
  }

  setImageContent(imageId, data) {
    let { images } = this.props;
    const idx = this.getImageIndex(imageId);
    images = images.concat();
    images[idx] = data;
    this.props.changeAreaContent({ images });
  }

  setProperty(key, value) {
    this.props.changeAreaContent({ [key]: value });
  }

  updateState(obj) {
    this.setState(obj);
  }

  deleteImage(imageId) {
    let { images } = this.props;
    const state = this.state;
    const idx = this.getImageIndex(imageId);
    if (state.activeEditor && state.activeEditor.id === images[idx].id) {
      state.activeEditor = null;
    }
    images = images.concat();
    images.splice(idx, 1);
    this.setState(state);
    this.props.changeAreaContent({ images });
  }

  mediaGalleryCallback(imgData) {
    let { images } = this.props;
    const newImage = instantiateImage();
    newImage.attachmentUrl = imgData.imgUrl;
    newImage.attachmentId = imgData.id;
    images = images.concat([newImage]);
    this.props.changeAreaContent({ images });
  }

  // toggle image crop editor
  openCropEditor(imageItem) {
    if (this.state.activeEditor) {
      this.setState({ activeEditor: null }, () => {
        this.setState({ activeEditor: imageItem });
      });
    } else {
      this.setState({ activeEditor: imageItem }, () => { });
    }
  }

  closeCropEditor() {
    this.setState({ activeEditor: null });
  }

  emptyGallery() {
    this.setState({ content: { images: [] } });
    window.document.getElementById('selectedImagesWrapper').innerHTML = "";
  }

  render() {
    const { images, orientation, fitContainer, autoplay, dots, arrows, loop, mediaKeys, autoplayInterval } = this.props;
    return (
      <div className="component editHeader">
        <h2>{i18n.gallerySettings}</h2>
        <table>
          <tbody>
            <tr>
              <td>
                <label>{i18n.orientation}: </label>
              </td>
              <td>
                {getTooltipped(
                  <select
                    value={orientation}
                    onChange={e => this.setProperty.call(this, 'orientation', e.target.value)}
                  >
                    <option value="horizontal">{i18n.horizontal}</option>
                    <option value="vertical">{i18n.vertical}</option>
                  </select>
                  , i18n.ttOrient)}
              </td>
            </tr>
            <tr>
              <td>
                <label>{i18n.imageCover}: </label>
              </td>
              <td>
                {getTooltipped(
                  <input
                    type="checkbox"
                    checked={fitContainer}
                    onChange={e => this.setProperty.call(this, 'fitContainer', e.target.checked)}
                  />
                  , i18n.ttImageCover)}
                {/*&nbsp;({i18n.zoomToFit})*/}
              </td>
            </tr>
            <tr>
              <td>
                <label>{i18n.autoPlay}: </label>
              </td>
              <td>
                {getTooltipped(
                  <div>
                    <input
                      type="checkbox"
                      checked={autoplay}
                      onChange={e => this.setProperty.call(this, 'autoplay', e.target.checked)}
                    />
                    &nbsp;&nbsp;
                    <input
                      type="number"
                      min={0}
                      max={10000}
                      step={100}
                      value={Number(autoplayInterval)}
                      disabled={!autoplay}
                      onChange={e => this.setProperty.call(this, 'autoplayInterval', e.target.value)}
                      onKeyPress={noSubmitOnEnter}
                    />
                  </div>, i18n.ttAutoplay)}
              </td>
            </tr>
            <tr>
              <td>
                <label>{i18n.repeat}: </label>
              </td>
              <td>
                {getTooltipped(
                  <input
                    type="checkbox"
                    checked={loop}
                    onChange={e => this.setProperty.call(this, 'loop', e.target.checked)}
                  />
                  , i18n.ttRepeat)}
              </td>
            </tr>
            <tr>
              <td>
                <label>{i18n.useMediaKeys}: </label>
              </td>
              <td>
                {getTooltipped(
                  <input
                    type="checkbox"
                    checked={mediaKeys}
                    onChange={e => this.setProperty.call(this, 'mediaKeys', e.target.checked)}
                  />
                  , i18n.ttUseMediaKeys)}
              </td>
            </tr>
            <tr>
              <td>
                <label>{i18n.dots}: </label>
              </td>
              <td>
                {getTooltipped(
                  <input
                    type="checkbox"
                    checked={dots}
                    onChange={e => this.setProperty.call(this, 'dots', e.target.checked)}
                  />
                  , i18n.ttDots)}
              </td>
            </tr>
            <tr>
              <td>
                <label>{i18n.arrows}: </label>
              </td>
              <td>
                {getTooltipped(
                  <input
                    type="checkbox"
                    checked={arrows}
                    onChange={e => this.setProperty.call(this, 'arrows', e.target.checked)}
                  />
                  , i18n.ttArrows)}
              </td>
            </tr>
          </tbody>
        </table>
        <div>

          <button
            type="button"
            className="button white_blue"
            onClick={() => openMediaGallery(this.mediaGalleryCallback, "image", true)}
          >
            {i18n.chooseImages}
          </button>
          &nbsp;&nbsp;
          {getTooltipped(
            <button
              type="button"
              disabled={!images.length}
              className="button white_blue"
              onClick={() => this.emptyGallery()}
            >
              {i18n.clearSelections}
            </button>
            , i18n.ttClear)}
          <div
            id="selectedImagesWrapper"
            style={{
              border: '2px #ddd solid',
              background: '#eee',
              padding: '5px',
              margin: '20px 0'
            }}
          >
            {(images.length) ? images.map((item, i) => {
              const props = {
                image: item,
                deleteImage: this.deleteImage,
                openCropEditor: this.openCropEditor,
                active: (this.state.activeEditor && this.state.activeEditor.id === item.id)
              };
              return (
                <SortableGalleryElement
                  key={i}
                  updateState={this.updateState}
                  items={images}
                  draggingIndex={this.state.draggingIndex}
                  sortId={i}
                  outline="list"
                  /*
                   Issue MPAT-158: sorting items in firefox leads to redirects to about:blank
                   workaround while waiting for a fix from react-sortable
                   TODO check if version later than 1.1.0 implements the bugfix and then
                   remove this workaround
                   */
                  // sorting items in firefox leads to redirects to about:blank
                  childProps={{
                    onDrop(e) {
                      e.preventDefault();
                    }
                  }}
                >
                  {props}
                </SortableGalleryElement>
              );
            })
              :
              <div style={{ textAlign: 'center' }}>{i18n.noImages}</div>}
          </div>
          {
            (this.state.activeEditor) ?
              <div id="imageCropper">
                <br />
                <button
                  type="button"
                  className="button white_blue"
                  onClick={() => this.closeCropEditor()}
                >
                  {i18n.closeCropEditor}
                </button>
                <br />
                <ImageCropper
                  attachmentId={this.state.activeEditor.attachmentId}
                  context={this.props.context}
                  onCropComplete={this.onCropComplete}
                  onEditorLoaded={onEditorLoaded}
                />
              </div> :
              ''
          }
        </div>
      </div>
    );
  }
}
