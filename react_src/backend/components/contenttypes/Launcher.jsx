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
 * Jean-Claude Dufourd (jean-claude.dufourd@telecom-paristech.fr
 * Stefano Miccoli (stefano.miccoli@finconsgroup.com)
 * Marco Ferrari (marco.ferrari@finconsgroup.com)
 * 
 **/
import React, { PropTypes as Types } from 'react';
import { Sortable } from 'react-sortable';
import autobind from 'class-autobind';
import { noSubmitOnEnter } from '../../utils';
import { generateId } from '../../../functions';
import { getTooltipped } from '../../tooltipper';
import { ComponentStateSelector } from '../helpers/Inputs';
import { componentLoader } from '../../../ComponentLoader';
import PageSelector from '../helpers/PageSelector';
import Constants from '../../../constants';

const i18n = Constants.locstr.launcher.backend;

function edit(params) {
  const { id, data, changeAreaContent, chooseTargetComponent, getComponentStates } = params;
  // FIXME empty content should come as undefined, not as empty string
  return (
    <LauncherEdit
      id={id}
      {...(data === '' ? undefined : data)}
      changeAreaContent={changeAreaContent}
      chooseTargetComponent={chooseTargetComponent}
      getComponentStates={getComponentStates}
    />
  );
}

function preview(content = {}) {
  if (this.props.listArray !== undefined) {
    const items = (content.data && content.data.listArray) ? content.data.listArray : [];
    return (
      <div
        style={{ backgroundColor: (content.data) ? content.data.bgColor : '' }}
        className="launchercontent-preview"
      >
        {items.map(item => <img key={item.id} src={item.thumbnail} height="100" width="100" role="presentation" />)}
      </div>
    );
  } console.log('Launcher got no props.listArray');
}

const itemType = Types.shape(
  {
    title: Types.string,
    appUrl: Types.string,
    description: Types.string,
    thumbnail: Types.string,
    id: Types.string
  });

function createDefaultItem() {
  return {
    title: '',
    appUrl: '',
    description: '',
    thumbnail: '',
    id: generateId()
  };
}

class LauncherEdit extends React.PureComponent {

  static propTypes = {
    id: Types.string.isRequired,
    orientation: Types.oneOf(['horizontal', 'vertical']),
    elementFormat: Types.oneOf(['landscape', 'square', 'portrait', 'squareInfo']),
    style: Types.string,
    scrollStyle: Types.oneOf(['carousel', 'pagination']),
    paginationLoop: Types.bool,
    paginationInfo: Types.bool,
    listArray: Types.arrayOf(itemType),
    changeAreaContent: Types.func.isRequired
  };

  static defaultProps = {
    orientation: 'horizontal',
    elementFormat: 'landscape',
    style: 'standard',
    scrollStyle: 'pagination',
    paginationLoop: false,
    paginationInfo: true,
    listArray: [createDefaultItem()]
  };

  constructor() {
    super();
    autobind(this);
    // FIXME if the content is empty, it should come as undefined and not as an empty string
    this.state = {
      draggingIndex: null
    };
  }

  onChooseTargetComponent = (targetId) => {
    this.setContent('targetComponent', targetId);
  };

  setContent(key, value, itemId = false) {
    if (itemId) {
      let { listArray } = this.props;
      const idx = listArray.findIndex(({ id }) => id === itemId);
      listArray = listArray.concat();
      listArray[idx][key] = value;
      if (key === 'title') {
        listArray[idx].titleEdited = (value !== '');
      }
      this.props.changeAreaContent({ listArray });
    } else {
      const res = { [key]: value };
      if (key === 'title') {
        res.titleEdited = (value !== '');
      }
      this.props.changeAreaContent(res);
    }
  }

  setPageCallbackFunction(itemId, selectedPage) {
    if (this.props.listArray.find(d => d.id === itemId).titleEdited) {
      this.updateItem(
        {
          appUrl: selectedPage.url,
          id: itemId
        });
    } else {
      this.updateItem(
        {
          appUrl: selectedPage.url,
          title: selectedPage.title,
          id: itemId
        });
    }
  }

  deleteItem(itemId) {
    let { listArray } = this.props;
    const idx = listArray.findIndex(({ id }) => id === itemId);
    listArray = listArray.concat();
    listArray.splice(idx, 1);
    this.props.changeAreaContent({ listArray });
  }

  addItem(e) {
    e.preventDefault();
    let { listArray } = this.props;
    listArray = listArray.concat([createDefaultItem()]);
    this.props.changeAreaContent({ listArray });
  }

  /* guess this just updates the state of the currently dragged item*/
  updateState(obj) {
    this.setState(obj);
  }

  updateItem(item) {
    const { listArray } = this.props;
    const idx = listArray.findIndex(curItem => item.id === curItem.id);
    listArray[idx] = Object.assign({}, listArray[idx], item);
    this.props.changeAreaContent({ listArray });
  }

  sharedProps() {
    return {
      updateItem: this.updateItem
    };
  }

  render() {
    const { orientation, elementFormat, style, scrollStyle, paginationLoop, paginationInfo } = this.props;
    return (
      <div className="component editHeader">
        <h2>{i18n.launcherSettings}</h2>
        <div style={{ float: 'right', width: 300 }}>
          <div className="launcher-tooltips notice" style={{ float: 'right', width: 300 }}>
            <div className="dashicons dashicons-editor-help" />
            <p>{i18n.toLinkAPage}</p>
            <p><b>?{this.props.id} ={'<Page Number>'}</b></p>
          </div>
          {getTooltipped(
            <span onClick={this.addItem} style={{ float: 'right' }}>
              <svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
                <path d="M50.49,22.85A28.25,28.25,0,1,0,78.74,51.1,28.29,28.29,0,0,0,50.49,22.85Zm0,52.94A24.69,24.69,0,1,1,75.17,51.1,24.71,24.71,0,0,1,50.49,75.79Z" />
                <path d="M64.47,49.31H52.27V37.12a1.78,1.78,0,1,0-3.57,0V49.31H36.51a1.78,1.78,0,0,0,0,3.57H48.7V65.08a1.78,1.78,0,0,0,3.57,0V52.88H64.47a1.78,1.78,0,0,0,0-3.57Z" />
              </svg>
              {i18n.addLauncherElement}
            </span>
          , i18n.ttAddLauncherElement)}
        </div>
        <table>
          <tbody>
            <tr>
              <td>
                <label>{i18n.menuOrient}: </label>
              </td>
              <td>
                {getTooltipped(
                  <select
                    value={orientation}
                    onChange={e => this.setContent('orientation', e.target.value)}
                  >
                    <option value="horizontal">{i18n.horizontal}</option>
                    <option value="vertical">{i18n.vertical}</option>
                  </select>
                  , i18n.ttMenuOrientation)}
              </td>
            </tr>
            <tr>
              <td>
                <label>{i18n.format}: </label>
              </td>
              <td>
                {getTooltipped(
                  <select
                    value={elementFormat}
                    onChange={e => this.setContent('elementFormat', e.target.value)}
                  >
                    <option value="landscape">{i18n.landscape}</option>
                    <option value="square">{i18n.square}</option>
                    {/* <option disabled value="squareInfo">{i18n.squareWithInfo}</option>
                    <option disabled value="portrait">{i18n.portrait}</option> */}
                  </select>
                  , i18n.ttElementFormat)}
              </td>
            </tr>
            <tr>
              <td>
                <label>{i18n.launcherStyle}: </label>
              </td>
              <td>
                {getTooltipped(
                  <select value={style} onChange={e => this.setContent('style', e.target.value)}>
                    <option value="standard">{i18n.optionStandard}</option>
                    <option value="arte">{i18n.optionArte}</option>
                  </select>
                  , i18n.ttLauncherStyle)}
              </td>
            </tr>
            <tr>
              <td>
                <label>{i18n.scrollStyle}: </label>
              </td>
              <td>
                {getTooltipped(
                  <select
                    value={scrollStyle}
                    onChange={e => this.setContent('scrollStyle', e.target.value)}
                  >
                    <option value="carousel">{i18n.optionCarousel}</option>
                    <option value="pagination">{i18n.optionPagination}</option>
                  </select>
                  , i18n.ttScrollStyle)}
              </td>
            </tr>
            {scrollStyle === 'pagination' &&
              <tr>
                <td>
                  <label>{i18n.paginationLoop}: </label>
                </td>
                <td>
                  <input
                    type="checkbox"
                    checked={paginationLoop}
                    onChange={e => this.setContent('paginationLoop', e.target.checked)}
                  />
                </td>
              </tr>
            }
            {scrollStyle === 'pagination' &&
              <tr>
                <td>
                  <label>{i18n.showPaginationInfo}: </label>
                </td>
                <td>
                  {getTooltipped(
                    <input
                      type="checkbox"
                      checked={paginationInfo}
                      onChange={e => this.setContent('paginationInfo', e.target.checked)}
                    />
                    , i18n.ttShowPaginationInfo)}
                </td>
              </tr>
            }
            {scrollStyle === 'pagination' &&
              [['nCols', 'Columns'], ['nRows', 'Rows']].map(([key, label]) => (
                <tr key={key}>
                  <td>
                    <label>-&nbsp;{label}</label>
                  </td>
                  <td>
                    &nbsp;&nbsp;
                    <select
                      key={key} value={this.props[key]}
                      onChange={e => this.setContent(key, e.target.value)}
                    >
                      {[1, 2, 3, 4, 5].map(i => (
                        <option key={i} value={i}>{i}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        <div>
          {this.props.listArray.map((item, i) => {
            const props = {
              ...item,
              sharedProps: this.sharedProps(),
              setContent: this.setContent,
              setPageCallbackFunction: this.setPageCallbackFunction,
              deleteItem: this.deleteItem,
              addItem: this.addItem,
              getTargetComponentStates: this.props.targetComponent &&
              this.props.getComponentStates.bind(null, this.props.targetComponent)

            };
            return (
              /*
                Issue MPAT-158: sorting items in firefox leads to redirects to about:blank
                workaround while waiting for a fix from react-sortable
                TODO check if version later than 1.1.0 implements the bugfix and then remove
                this workaround
              */
              <SortableLauncherElement
                key={i}
                lock="horizontal"
                updateState={this.updateState}
                items={this.props.listArray}
                draggingIndex={this.state.draggingIndex}
                sortId={i}
                outline="list"
                childProps={{
                  onDrop: (e) => {
                    e.preventDefault();
                  }
                }}
              >
                {props}
              </SortableLauncherElement>
            );
          })}
        </div>
      </div>
    );
  }
}

function LauncherElement(props) {
  const option = obj =>
    <option key={obj.key} disabled={obj.disabled} value={obj.key}>{obj.label}</option>;
  const { id, title, appUrl, description, thumbnail, sharedProps, setContent, deleteItem, addItem,
    setPageCallbackFunction, roleData = {}, getTargetComponentStates, role = 'link', contentIcon = ''
    } = props.children;
  const buttonid = `launcherThumbnailInput${id}`;
  const mediaGalleryCallback = function mediaGalleryCallback(imgData) {
    setContent('thumbnail', imgData.imgUrl, id);
  };
  const setStateContent = function setStateContent(stateData) {
    setContent('roleData', stateData, id);
  };

  const states = getTargetComponentStates && getTargetComponentStates();
  return (
    <div
      {...props}
      className="list-item"
      style={{
        border: '2px #ddd solid',
        background: '#eee',
        padding: '5px',
        margin: '5px',
        position: 'relative'
      }}
    >
      <table>
        <tbody>
          <tr>
            <td>
              <label>{i18n.launcherThumbnail}: </label>
            </td>
            <td>
              {getTooltipped(
                <input
                  type="text"
                  id={buttonid}
                  placeholder={i18n.launcherThumbnailUrl}
                  value={thumbnail}
                  onChange={e => setContent('thumbnail', e.target.value, id)}
                  onKeyPress={noSubmitOnEnter}
                />
              , i18n.ttThumbnailUrl)}
              <p className="" style={{ display: 'inline-block', margin: '0 15px 0 10px' }}>OR</p>
              {getTooltipped(
                <button
                  type="button"
                  target={buttonid}
                  className="button mpat-insert-media white_blue"
                  data-type="image"
                >{i18n.chooseThumbnail}</button>
              , i18n.ttThumbnailChoose)}
            </td>
          </tr>
          <tr>
            <td>
              <label>{i18n.title}: </label>
            </td>
            <td>
              {getTooltipped(
                <input
                  type="text"
                  placeholder={i18n.launcherTitle}
                  value={title}
                  onChange={e => setContent('title', e.target.value, id)}
                  onKeyPress={noSubmitOnEnter}
                />
              , i18n.ttTitle)}
            </td>
          </tr>
          <tr>
            <td>
              <label>{i18n.role}: </label>
            </td>
            <td>
              {getTooltipped(
                <select value={role} onChange={e => setContent('role', e.target.value, id)}>
                  <option value="link">{i18n.link}</option>
                  <option disabled={!states} value="control">
                    {i18n.controlTargetComponent} {!states && '(Choose target first!)'}
                  </option>
                </select>
              , i18n.ttRole)}
            </td>
          </tr>
          {role === 'link' &&
            <tr>
              <td>
                <label>Url: </label>
              </td>
              <td>
                {getTooltipped(
                  <input
                    type="text"
                    placeholder={i18n.launcherTargetUrl}
                    value={appUrl}
                    onChange={e => setContent('appUrl', e.target.value, id)}
                    onKeyPress={noSubmitOnEnter}
                  />
                , i18n.ttUrl)}
              </td>
            </tr>
          }
          {role === 'link' &&
            <tr>
              <td>
                <label>{i18n.pages}: </label>
              </td>
              <td>
                {getTooltipped(
                  <PageSelector
                    selectedPage={appUrl}
                    callbackFunction={setPageCallbackFunction.bind(null, id)}
                  />
                , i18n.ttPages)}
              </td >
            </tr >
          }
          {role === 'control' &&
            <tr>
              <td>
                <label>{i18n.state}: </label>
              </td>
              <td>
                {getTooltipped(
                  <ComponentStateSelector
                    onChangeState={setStateContent}
                    targetState={roleData.targetState}
                    triggerAction={roleData.triggerAction}
                    states={states}
                  />
                , i18n.ttComponent)}
              </td>
            </tr>
          }
          <tr>
            <td>
              <label>{i18n.description}: </label>
            </td>
            <td>
              {getTooltipped(
                <input
                  type="text"
                  placeholder={i18n.launcherDescription}
                  value={description}
                  onChange={e => setContent('description', e.target.value, id)}
                  onKeyPress={noSubmitOnEnter}
                />
              , i18n.ttDescription)}
            </td>
          </tr>
          <tr>
            <td>
              <label>{i18n.optionalContentIcon}:</label>
            </td>
            <td>
              {getTooltipped(
                <select value={contentIcon} onChange={e => setContent('contentIcon', e.target.value, id)}>
                  <option key={0} value="">({i18n.none})</option>
                  <option key={1} value="hotspot_icon_audio">{i18n.audio}</option>
                  <option key={2} value="hotspot_icon_link">{i18n.link}</option>
                  <option key={3} value="hotspot_icon_picture">{i18n.picture}</option>
                  <option key={4} value="hotspot_icon_text">{i18n.text}</option>
                  <option key={5} value="hotspot_icon_video">{i18n.video}</option>
                </select>
                , i18n.ttOptionalContentIcon)}
            </td>
          </tr>
        </tbody>
      </table>
      <hr style={{ marginTop: 15, marginBottom: 20 }} />
      <span onClick={() => deleteItem(id)} style={{ position: 'absolute', right: 5 }}>
        <svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
          <path d="M68.26,31.71h-35a1.78,1.78,0,0,0-1.78,1.94l3.78,44.48A1.78,1.78,0,0,0,37,79.76H64.49a1.78,1.78,0,0,0,1.78-1.63L70,33.65a1.78,1.78,0,0,0-1.78-1.94ZM62.85,76.19H38.64L35.17,35.28H66.32Z" />
          <path d="M69.17,26.34H52.53V24.23a1.78,1.78,0,0,0-3.57,0v2.11H32.32a1.78,1.78,0,0,0,0,3.57H69.17a1.78,1.78,0,1,0,0-3.57Z" />
          <path d="M41.31,72a1.78,1.78,0,0,0,1.78,1.63h.16a1.78,1.78,0,0,0,1.62-1.93L42.18,40.53a1.78,1.78,0,0,0-3.56.31Z" />
          <path d="M58.24,73.67h.16A1.78,1.78,0,0,0,60.17,72l2.68-31.22a1.78,1.78,0,1,0-3.56-.31L56.62,71.74A1.78,1.78,0,0,0,58.24,73.67Z" />
          <path d="M50.74,73.68a1.79,1.79,0,0,0,1.78-1.78V40.61a1.78,1.78,0,1,0-3.57,0V71.89A1.79,1.79,0,0,0,50.74,73.68Z" />
        </svg>
        {i18n.deleteLauncherElement}
      </span>
      <span onClick={addItem}style={{ marginLeft: 10 }}>
        <svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
          <path d="M50.49,22.85A28.25,28.25,0,1,0,78.74,51.1,28.29,28.29,0,0,0,50.49,22.85Zm0,52.94A24.69,24.69,0,1,1,75.17,51.1,24.71,24.71,0,0,1,50.49,75.79Z" />
          <path d="M64.47,49.31H52.27V37.12a1.78,1.78,0,1,0-3.57,0V49.31H36.51a1.78,1.78,0,0,0,0,3.57H48.7V65.08a1.78,1.78,0,0,0,3.57,0V52.88H64.47a1.78,1.78,0,0,0,0-3.57Z" />
        </svg>
        {i18n.addLauncherElement}
      </span>
    </div>
  );
}

LauncherElement.propTypes = {
  children: itemType
};


LauncherElement.prototype.displayName = 'SortableLauncherElement';

const SortableLauncherElement = Sortable(LauncherElement);

componentLoader.registerComponent(
  'launcher',
  { edit, preview },
  {
    isHotSpottable: false,
    isScrollable: true,
    hasNavigableGUI: false,
    isStylable: true,
    isComponentTrigger: true
  },
  {
    navigable: true
  },
  {
    itemActive: {
      containerTitle: {
        label: 'Active item specific styles',
        fieldType: 'separator'
      },
      fontSize: {
        label: 'Font Size',
        fieldType: 'number',
        fieldProps: {
          placeholder: 'size in px',
          minValue: 10,
          maxValue: 50
        },
        suffix: 'px',
        sanitizeValue: v => (v.substring(0, v.indexOf('px')) || ''),
        sanitizeCallback: e => (`${e.target.value}px`)
      },
      fontWeight: {
        label: 'Text Weight',
        fieldType: 'select',
        fieldProps: {
          options: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
          placeholder: 'number form 100 to 900'
        }
      },
      backgroundColor: {
        label: 'Background Color',
        fieldType: 'color'
      },
      borderColor: {
        label: 'Border Color',
        fieldType: 'color'
      },
      borderWidth: {
        label: 'Border Width',
        fieldType: 'number',
        fieldProps: {
          placeholder: 'size in px'
        },
        suffix: 'px',
        sanitizeValue: v => (v.substring(0, v.indexOf('px')) || ''),
        sanitizeCallback: e => (`${e.target.value}px`)
      },
      borderStyle: {
        label: 'Border Style',
        fieldType: 'select',
        fieldProps: {
          options: ['dotted', 'dashed', 'solid', 'double', 'groove', 'ridge', 'inset', 'outset', 'none', 'hidden']
        }
      }
    }
  }
);
