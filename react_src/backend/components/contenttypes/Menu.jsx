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
 **/
import React, { PropTypes as Types } from 'react';
import { Sortable } from 'react-sortable';
import autobind from 'class-autobind';
import { componentLoader } from '../../../ComponentLoader';
import { ComponentStateSelector } from '../helpers/Inputs';
import { noSubmitOnEnter } from '../../utils';
import { generateId } from '../../../functions';
import { getTooltipped } from '../../tooltipper';
import PageSelector from '../helpers/PageSelector';
import Constants from '../../../constants';

const i18n = Constants.locstr.menu;

function editView(params) {
  const { id, data, changeAreaContent, getComponentStates } = params;
  return (
    // FIXME put the content directly as props, instead of wrapping it into the 'content' prop
    <MenuEdit
      id={id}
      {...data}
      changeAreaContent={changeAreaContent}
      getComponentStates={getComponentStates}
    />
  );
}

function preview(content = {}) {
  const items = (content.data) ? content.data.listArray : [];
  const style = {
    display: 'inline-block',
    margin: '0 20px 0 0'
  };
  return (
    <div className="mpat-content-preview launchercontent-preview">
      <ul>
        {items.map(item => (
          <li key={item.id} style={style}>
            ( {item.remoteKey.replace(/VK_/g, '')}) {item.description} </li>
        ))}
      </ul>
    </div>
  );
}

const itemType = Types.shape(
  {
    appUrl: Types.string,
    description: Types.string,
    remoteKey: Types.string,
    role: Types.string,
    id: Types.string
  });

const createDefaultItem = () => ({
  appUrl: '',
  description: '',
  remoteKey: '',
  role: 'link',
  id: generateId()
});

class MenuEdit extends React.PureComponent {

  static propTypes = {
    changeAreaContent: React.PropTypes.func.isRequired,
    orientation: Types.oneOf(['horizontal', 'vertical']),
    loop: Types.bool,
    sidemenu: Types.bool,
    showButtons: Types.bool,
    title: Types.string,
    listArray: Types.arrayOf(itemType)
  };

  static defaultProps = {
    orientation: 'horizontal',
    loop: false,
    title: '',
    sidemenu: false,
    showButtons: false,
    listArray: [createDefaultItem()]
  };

  constructor(props) {
    super(props);
    autobind(this);
    const collapsed = props.listArray.reduce((result, item) => Object.assign({}, result, { [item.id]: false }), {});
    this.state = {
      draggingIndex: null,
      collapsed
    };
  }

  componentDidMount() {
    this.props.changeAreaContent(
      {
        orientation: this.props.orientation,
        loop: this.props.loop,
        sidemenu: this.props.sidemenu,
        showButtons: this.props.showButtons,
        listArray: this.props.listArray
      });
  }

  setContent(key, value, itemId = false) {
    if (itemId) {
      const { listArray } = this.props;
      const idx = listArray.findIndex(({ id }) => id === itemId);
      listArray[idx][key] = value;
      if (key === 'description') {
        listArray[idx].descriptionEdited = (value !== '');
      }
      this.props.changeAreaContent({ listArray });
    } else {
      const res = { [key]: value };
      if (key === 'description') {
        res.descriptionEdited = (value !== '');
      }
      this.props.changeAreaContent(res);
    }
  }

  setPageCallbackFunction(itemId, selectedPage) {
    if (this.props.listArray.find(d => d.id === itemId).descriptionEdited) {
      this.updateItem(
        {
          appUrl: selectedPage.url,
          id: itemId
        });
    } else {
      this.updateItem(
        {
          appUrl: selectedPage.url,
          description: selectedPage.title,
          id: itemId
        });
    }
  }

  toggleElementView(id) {
    const collapsed = this.state.collapsed;
    collapsed[id] = !collapsed[id];
    this.setState(collapsed);
  }

  addItem(index) {
    const { listArray } = this.props;
    listArray.splice(index + 1, 0, createDefaultItem());
    this.props.changeAreaContent({ listArray });
  }

  deleteItem(itemId) {
    let { listArray } = this.props;
    const idx = listArray.findIndex(({ id }) => id === itemId);
    listArray = listArray.concat();
    listArray.splice(idx, 1);
    this.props.changeAreaContent({ listArray });
  }

  /* guess this just updates the state of the currently dragged item*/

  updateState(obj) {
    this.setState(obj);
  }

  updateItem(item) {
    const listArray = [...this.props.listArray];
    const idx = listArray.findIndex(curItem => item.id === curItem.id);
    listArray[idx] = Object.assign({}, listArray[idx], item);
    this.props.changeAreaContent({ listArray });
  }

  sharedProps() {
    return {
      updateItem: this.updateItem,
      remoteKeys: [
        { key: '', label: 'Select Remote Button' },
        { key: 'VK_0', label: '0', disabled: false },
        { key: 'VK_1', label: '1', disabled: false },
        { key: 'VK_2', label: '2', disabled: false },
        { key: 'VK_3', label: '3', disabled: false },
        { key: 'VK_4', label: '4', disabled: false },
        { key: 'VK_5', label: '5', disabled: false },
        { key: 'VK_6', label: '6', disabled: false },
        { key: 'VK_7', label: '7', disabled: false },
        { key: 'VK_8', label: '8', disabled: false },
        { key: 'VK_9', label: '9', disabled: false },
        { key: 'VK_RED', label: 'red', disabled: false },
        { key: 'VK_YELLOW', label: 'yellow', disabled: false },
        { key: 'VK_GREEN', label: 'green', disabled: false },
        { key: 'VK_BLUE', label: 'blue', disabled: false },
        { key: 'VK_BACK', label: 'back', disabled: false },
        { key: 'VK_OK', label: 'ok', disabled: false }
      ]
    };
  }

  render() {
    const { orientation, showButtons, loop, listArray, sidemenu, title } = this.props;
    return (
      <div className="component editHeader">
        <h2>{i18n.menuSettings}</h2>
        <table>
          <tbody>
            <tr>
              <td>
                <label>{i18n.title}: </label>
              </td>
              <td>
                {getTooltipped(
                  <input
                    type="text" value={title}
                    onChange={e => this.setContent.call(this, 'title', e.target.value)}
                  />
                  , i18n.ttTitle)}
              </td>
            </tr>
            <tr>
              <td>
                <label>{i18n.sideMenu}: </label>
              </td>
              <td>
                {getTooltipped(
                  <input
                    type="checkbox" id="sidemenu" name="sidemenu" checked={sidemenu}
                    onChange={e => this.setContent.call(this, 'sidemenu', e.target.checked)}
                  />
                  /* &nbsp; ( {i18n.showAsSideMenu} )*/
                  , i18n.ttSideMenu)}
              </td>
            </tr>
            <tr>
              <td>
                <label>{i18n.menuOrient}: </label>
              </td>
              <td>
                {getTooltipped(
                  <select
                    value={orientation}
                    onChange={e => this.setContent.call(this, 'orientation', e.target.value)}
                  >
                    <option value="horizontal">{i18n.horizontal}</option>
                    <option value="vertical">{i18n.vertical}</option>
                  </select>
                  , i18n.ttMenuOrient)}
              </td>
            </tr>
            <tr>
              <td>
                <label>Loop: </label>
              </td>
              <td>
                {getTooltipped(
                  <input
                    type="checkbox" id="loop" name="loop" checked={loop}
                    onChange={e => this.setContent.call(this, 'loop', e.target.checked)}
                  />
                  /* &nbsp; ( {i18n.restart} )*/
                  , i18n.ttLoop)}
              </td>
            </tr>
            <tr>
              <td>
                <label>{i18n.showButtons}: </label>
              </td>
              <td>
                {getTooltipped(
                  <input
                    type="checkbox" id="showButtons" name="showButtons" checked={showButtons}
                    onChange={e => this.setContent.call(this, 'showButtons', e.target.checked)}
                  />
                  /* &nbsp; ( {i18n.showRemoteKeys} )*/
                  , i18n.ttShowButtons)}
              </td>
            </tr>
          </tbody>
        </table>
        <div style={{ marginTop: '20px' }}>
          <div className="list-add-element" onClick={() => this.addItem(-1)}>
            <span>
              <svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
                <path d="M50.49,22.85A28.25,28.25,0,1,0,78.74,51.1,28.29,28.29,0,0,0,50.49,22.85Zm0,52.94A24.69,24.69,0,1,1,75.17,51.1,24.71,24.71,0,0,1,50.49,75.79Z" />
                <path d="M64.47,49.31H52.27V37.12a1.78,1.78,0,1,0-3.57,0V49.31H36.51a1.78,1.78,0,0,0,0,3.57H48.7V65.08a1.78,1.78,0,0,0,3.57,0V52.88H64.47a1.78,1.78,0,0,0,0-3.57Z" />
              </svg>
            </span>
            <p>{i18n.addItem}</p>
          </div>
          {listArray.map((item, i) => {
            const props = {
              ...item,
              collapsed: this.state.collapsed[item.id],
              toggleElementView: this.toggleElementView,
              sharedProps: this.sharedProps(),
              setContent: this.setContent,
              setPageCallbackFunction: this.setPageCallbackFunction,
              deleteItem: this.deleteItem,
              addItem: this.addItem,
              getTargetComponentStates: this.props.targetComponent &&
                this.props.getComponentStates.bind(null, this.props.targetComponent)
            };
            return (
              <SortableMenuElement
                key={i}
                lock="horizontal"
                updateState={this.updateState}
                items={listArray}
                draggingIndex={this.state.draggingIndex}
                sortId={i}
                outline="list"
                /*
                 Issue MPAT-158: sorting items in firefox leads to redirects to about:blank
                 workaround while waiting for a fix from react-sortable
                 TODO check if version later than 1.1.0 implements the bugfix and then
                 remove this workaround
                 */ // sorting items in firefox leads to redirects to about:blank
                childProps={{
                  onDrop(e) {
                    e.preventDefault();
                  }
                }}
              >
                {props}
              </SortableMenuElement>
            );
          })}

        </div>
      </div>
    );
  }
}

function MenuElement(props) {
  const keyOption = obj =>
    <option key={obj.key} disabled={obj.disabled} value={obj.key}>{obj.label}</option>;
  const { id, appUrl, description, remoteKey, sharedProps, setContent, setPageCallbackFunction,
      deleteItem, addItem, getTargetComponentStates, role = 'link', stateData = {}, appData = {},
      aitData = {}, collapsed, toggleElementView
    } = props.children;
  const isRed = (remoteKey === 'VK_RED');
  const states = getTargetComponentStates && getTargetComponentStates();
  const setStateContent = function (stateData) {
    setContent('stateData', stateData, id);
    setContent('description', stateData.targetLabel, id);
  };
  const applicationActions = [
    { key: '', label: i18n.selectAction },
    { key: 'back', label: i18n.goToPrevPage, disabled: false },
    { key: 'toggle', label: i18n.toggleApplication, disabled: !(['VK_RED', 'VK_YELLOW', 'VK_BLUE', 'VK_GREEN'].includes(remoteKey)) }
  ];

  const changeButton = function (key) {
    if (key === 'VK_RED') {
      setContent('appUrl', '', id);
    }
    setContent('remoteKey', key, id);
  };

  return (
    <div>
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
        {collapsed &&
        <div className="list-item-collapsed">
          <div><label>{remoteKey.replace('VK_', '')}</label></div>
          <label>{description}</label>
          <div onClick={() => toggleElementView(id)} className="dashicons dashicons-arrow-down-alt2" />
        </div>
        }
        {!collapsed &&
        <table>
          <tbody>
            <tr>
              <td>
                <label>{i18n.label}: </label>
              </td>
              <td>
                {getTooltipped(
                  <input
                    type="text"
                    placeholder={i18n.placeHolderLabel}
                    value={description}
                    onChange={e => setContent('description', e.target.value, id)}
                    onKeyPress={noSubmitOnEnter}
                  />
                  , i18n.ttLabel)}
              </td>
            </tr>
            <tr>
              <td>
                <label>{i18n.remoteKey}: </label>
              </td>
              <td>
                {getTooltipped(
                  <select value={remoteKey} onChange={e => changeButton(e.target.value)}>
                    {sharedProps.remoteKeys.map(keyOption)}
                  </select>/* &nbsp; ( {i18n.remoteControlKey} )*/
                  , i18n.ttRemoteControlKey)}
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
                    <option value="application">{i18n.controlApplication}</option>
                    <option disabled={!states} value="control">{i18n.controlTargetComponent} {!states && '(Choose target first!)'}</option>
                    <option value="ait">{i18n.launchAppViaAIT}</option>
                  </select>
                  , i18n.ttRole)}
              </td>
            </tr>
            {role === 'link' &&
              <tr>
                <td>
                  <label htmlFor="targetUrlTextField">{i18n.url}: </label>
                </td>
                <td>
                  {getTooltipped(
                    <input
                      id="targetUrlTextField"
                      type="text"
                      placeholder={i18n.placeHoldeUrl}
                      disabled={isRed}
                      value={appUrl}
                      onChange={(e) => { setContent('appUrl', e.target.value, id); }}
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
                      disabled={isRed}
                      callbackFunction={setPageCallbackFunction.bind(null, id)}
                    />
                    , i18n.ttPages)}
                </td>
              </tr>
            }
            {role === 'ait' &&
              <tr>
                <td>
                  <label>{i18n.appId}: </label>
                </td>
                <td>
                  {getTooltipped(
                    <input
                      type="text"
                      value={aitData.appId}
                      onChange={e => setContent('aitData', {
                        action: 'launchApplication',
                        appId: e.target.value,
                        fallbackUrl: aitData.fallbackUrl
                      }, id)}
                      onKeyPress={noSubmitOnEnter}
                    />
                    , i18n.ttAppId)}
                </td>
              </tr>
            }
            {role === 'ait' &&
              <tr>
                <td>
                  <label>{i18n.fallbackUrl}: </label>
                </td>
                <td>
                  {getTooltipped(
                    <input
                      type="text"
                      value={aitData.fallbackUrl}
                      onChange={e => setContent('aitData', {
                        action: 'launchApplication',
                        appId: aitData.appId,
                        fallbackUrl: e.target.value
                      }, id)}
                      onKeyPress={noSubmitOnEnter}
                    />
                    , i18n.ttFallbackUrl)}
                </td>
              </tr>
            }
            {role === 'application' &&
              <tr>
                <td>
                  <label>{i18n.appAction}: </label>
                </td>
                <td>
                  {getTooltipped(
                    <select
                      value={appData.action}
                      onChange={e => setContent('appData', { action: e.target.value }, id)}
                    >
                      {applicationActions.map(keyOption)}
                    </select>
                    , i18n.ttAppAction)}
                </td>
              </tr>
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
                      targetState={stateData.targetState}
                      triggerAction={stateData.triggerAction}
                      states={states}
                    />
                    , i18n.ttState)}
                </td>
              </tr>
            }
          </tbody>
        </table>
        }
        {!collapsed &&
        <div onClick={() => toggleElementView(id)} className="dashicons dashicons-arrow-up-alt2" />
        }
        {!collapsed &&
        getTooltipped(
          <span onClick={() => deleteItem(id)} style={{ position: 'absolute', right: 5, bottom: 5 }}>
            <svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
              <path d="M68.26,31.71h-35a1.78,1.78,0,0,0-1.78,1.94l3.78,44.48A1.78,1.78,0,0,0,37,79.76H64.49a1.78,1.78,0,0,0,1.78-1.63L70,33.65a1.78,1.78,0,0,0-1.78-1.94ZM62.85,76.19H38.64L35.17,35.28H66.32Z" />
              <path d="M69.17,26.34H52.53V24.23a1.78,1.78,0,0,0-3.57,0v2.11H32.32a1.78,1.78,0,0,0,0,3.57H69.17a1.78,1.78,0,1,0,0-3.57Z" />
              <path d="M41.31,72a1.78,1.78,0,0,0,1.78,1.63h.16a1.78,1.78,0,0,0,1.62-1.93L42.18,40.53a1.78,1.78,0,0,0-3.56.31Z" />
              <path d="M58.24,73.67h.16A1.78,1.78,0,0,0,60.17,72l2.68-31.22a1.78,1.78,0,1,0-3.56-.31L56.62,71.74A1.78,1.78,0,0,0,58.24,73.67Z" />
              <path d="M50.74,73.68a1.79,1.79,0,0,0,1.78-1.78V40.61a1.78,1.78,0,1,0-3.57,0V71.89A1.79,1.79,0,0,0,50.74,73.68Z" />
            </svg>
            {i18n.deleteItem}
          </span>
          , i18n.ttDeleteItem)
        }
      </div>
      <div className="list-add-element" onClick={() => addItem(props['data-id'])}>
        <span>
          <svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
            <path d="M50.49,22.85A28.25,28.25,0,1,0,78.74,51.1,28.29,28.29,0,0,0,50.49,22.85Zm0,52.94A24.69,24.69,0,1,1,75.17,51.1,24.71,24.71,0,0,1,50.49,75.79Z" />
            <path d="M64.47,49.31H52.27V37.12a1.78,1.78,0,1,0-3.57,0V49.31H36.51a1.78,1.78,0,0,0,0,3.57H48.7V65.08a1.78,1.78,0,0,0,3.57,0V52.88H64.47a1.78,1.78,0,0,0,0-3.57Z" />
          </svg>
        </span>
        <p>{i18n.addItem}</p>
      </div>
    </div>
  );
}

MenuElement.propTypes = {
  children: itemType
};

MenuElement.prototype.displayName = 'SortableMenuElement';

const SortableMenuElement = Sortable(MenuElement);
componentLoader.registerComponent('menu',
  {
    edit: editView,
    preview
  }, {
    isHotSpottable: false,
    isScrollable: true,
    hasNavigableGUI: true,
    isStylable: true,
    isComponentTrigger: true
  }, {
    navigable: true
  }, {
    activeItem: {
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
      lineHeight: {
        label: 'Line Height',
        fieldType: 'number',
        fieldProps: {
          placeholder: 'size in px',
          minValue: 0,
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
      color: {
        label: 'Text color',
        fieldType: 'color'
      },
      backgroundColor: {
        label: 'Background Color',
        fieldType: 'color'
      }
    }
  }
);
