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
 * Benedikt Vogel 	 (vogel@irt.de)
 *
 **/
import React from 'react';
import HotSpotEdit from '../HotSpotEdit';
import { componentLoader } from '../../../ComponentLoader';
import Constants from '../../../constants';
import { noSubmitOnEnter } from '../../utils';
import { getTooltipped } from '../../tooltipper.jsx';
import Popup from 'react-popup';
import { StylesPopup } from '../helpers/Styles';

const i18n = Constants.locstr.componentEditor;

function getContentTypeView(id, content, changeAreaStateContent, curEditContext, stateId,
  getComponentStates) {
  const { type = 'text', data } = content;

  const params = {
    id,
    data,
    changeAreaContent: changeAreaStateContent,
    context: curEditContext,
    stateId,
    getComponentStates
  };

  // renderComponent return React.createElement
  // console.log('getContentTypeView',params);
  return componentLoader.renderComponent(type, 'edit', params);
}

/*
function update(e) {
    e.preventDefault();
    document.getElementById('publish').click();
}
*/

export default class ComponentEditor extends React.PureComponent {
  static propTypes = {
    changeAreaStateType: React.PropTypes.func,
    changeAreaStateMeta: React.PropTypes.func,
    changeAreaStateContent: React.PropTypes.func,
    changeAreaStateStyle: React.PropTypes.func,
    getComponentStates: React.PropTypes.func
  };

  constructor() {
    super();
    this.state = { override: false };
  }

  getComponentStyleEditView = (enableEdit = true) => {
    const { changeAreaStateStyle, content } = this.props;
    const styleDefinitions = componentLoader.getComponentStyles(content.type);
    return (
        /*<td id="editStylesTD">*/
        <button
          type="button"
          className="button white_blue"
          id="styleEditButton"
          onClick={(e) => Popup.create(
            {
              content: (
                <StylesPopup
                  title={i18n.editComponentStyle}
                  popup={Popup}
                  callback={changeAreaStateStyle}
                  styleValues={content.styles}
                  styleDefinitions={styleDefinitions}
                />
              )
            })}
        >
          {i18n.editInner}
        </button>
    /* </td>*/
    );
  };

  render() {
    const {
      id,
      stateId,
      content,
      changeAreaStateType,
      changeAreaStateMeta,
      changeAreaStateContent,
      changeAreaStateStyle,
      curEditContext,
      getComponentStates,
      model,
      editMode
    } = this.props;

    const { cloneModel, type: componentType, data: componentData } = content;
    const defaultSettings = componentLoader.getComponentDefaults(componentType);
    const settings = Object.assign({}, defaultSettings, content);
    /*
    enable editing:
     - if this is the target of a clone component (cloneModel=true), it is not editable
       - unless the override checkbox has been ticked
    */
    const enableEdit = !cloneModel || this.state.override;
    /*
    enable style editing:
    if there is a model object, and editableStyles is false for this box, then no
    */
    const enableStyleEdit = editMode === 'editModel' ||
      !(model && model[id].editableStyles === false);
    let selectableComponentTypes = componentLoader.getComponents().map(a => a.type);
    if (model && editMode !== 'editModel') {
      const allowed = model[id].types;
      if (!allowed.ANY) {
        selectableComponentTypes = Object.keys(allowed);
      }
    }

    const availableViews = componentLoader.getFrontendViews(componentType);
    const componentOptions = componentLoader.getComponentOptions(componentType);

    const tds = [];
    // first we show properties that are ALWAYS visible
    tds.push(
      <td><label>{i18n.componentLabel}: </label></td>,
      <td>
        {getTooltipped(
          <input
            type="text"
            value={settings.componentTitle}
            onChange={e => enableEdit && changeAreaStateMeta('componentTitle', e.target.value)}
            onKeyPress={noSubmitOnEnter}
          />
          , i18n.ttLabel)}
      </td>
    );
    tds.push(
      <td><label>{i18n.componentType}: </label></td>,
      <td>
        {getTooltipped(
          <select
            onChange={e => enableEdit && changeAreaStateType(e.target.value)}
            value={componentType}
          >
            {selectableComponentTypes.map((obj, i) => <option key={i} value={obj}>{obj}</option>)}
          </select>
          , i18n.ttType)}
      </td>
    );
    tds.push(
      <td><label>{i18n.chooseView}: </label></td>,
      <td>
        {getTooltipped(
          <select
            onChange={e => enableEdit && changeAreaStateMeta('frontendView', e.target.value)}
            value={settings.frontendView}
          >
            <option key="0" value="">{'default'}</option>
            {availableViews.map(view => <option key={view} value={view}>{view}</option>)}
          </select>
          , i18n.ttView)}
      </td>
    );
    tds.push(
      <td><label>{i18n.hideFocus}: </label></td>,
      <td>
        {getTooltipped(
          <input
            type="checkbox"
            checked={settings.dontVisualizeFocus}
            onChange={e => enableEdit && changeAreaStateMeta('dontVisualizeFocus', e.target.checked)}
          />
          , i18n.ttFocus)}
      </td>
    );

    // Then we show props that depend on specific component definition
    if (componentOptions.hasNavigableGUI) {
      tds.push(
        <td><label>{i18n.navigable}: </label></td>,
        <td>
          {getTooltipped(
            <input
              type="checkbox"
              checked={settings.navigable}
              onChange={e => enableEdit && changeAreaStateMeta('navigable', e.target.checked)}
            />
            , i18n.ttNavigable)}
        </td>
      );
    }

    if (componentOptions.isScrollable) {
      tds.push(
        <td><label>{i18n.scrollable}: </label></td>,
        <td>
          {getTooltipped(
            <input
              type="checkbox"
              checked={settings.scrollable}
              onChange={e => enableEdit && changeAreaStateMeta('scrollable', e.target.checked)}
            />
            , i18n.ttScrollable)}
        </td>
      );
    }

    if (componentOptions.isHotSpottable) {
      tds.push(
        <td><label>{i18n.hotSpot}: </label></td>,

        <td id="hseCheckWrap">
          {getTooltipped(
            <HotSpotEdit
              type={componentType}
              save={(data) => {
                enableEdit && changeAreaStateMeta('hotSpotMeta', data);
              }}
              data={settings.hotSpotMeta}
              meta={curEditContext}
            />
            , i18n.ttHotSpot)}
        </td>
      );
    }

    if (componentOptions.isStylable && enableEdit && enableStyleEdit) {
      tds.push(
        <td><label>{i18n.titleComponentStyle}: </label></td>,
        <td>{getTooltipped(this.getComponentStyleEditView(enableEdit), i18n.ttEditStyle)}</td>
      );
    }

    if (componentOptions.isComponentTrigger) {
      const areas = this.props.getAreas();
      tds.push(
        <td><label>Target Component: </label></td>,
        <td>
          {getTooltipped(
            <select
              onChange={e => enableEdit && changeAreaStateContent({ targetComponent: e.target.value })}
              value={(componentData && componentData.targetComponent) || ''}
            >
              <option key="0" value="">{'none'}</option>
              {areas.map((area, i) => <option key={area.key} value={area.key}>{area.label}</option>)}
            </select>
            , i18n.ttTargetComponent)}
        </td >
      );
    }

    const trs = [];
    // if we stop when lenth > 4, and then we print just 2, if tds are even we miss the last one...
    while (tds.length >= 4) {
      trs.push(
        <tr key={`${componentType}${trs.length}`}>
          {tds.shift()}
          {tds.shift()}
          <td>&nbsp;&nbsp;</td>
          {tds.shift()}
          {tds.shift()}
        </tr>
      );
    }
    if (tds.length > 0) {
      trs.push(
        <tr key={`${componentType}${trs.length}`}>
          {tds.shift()}
          {tds.shift()}
          <td>&nbsp;&nbsp;</td>
          <td />
          <td />
        </tr>
      );
    }
    return (
      <div>
        <div className="editHeader" style={{ paddingTop: 10 }}>
          <table>
            <tbody>
              {!enableEdit &&
                <tr key="0">
                  <td>
                    <span style={{ color: 'red', fontWeight: 900 }}>
                      {i18n.thisIsAModel}
                    </span>
                  </td>
                  <td>
                    <span style={{ color: 'red', fontWeight: 900 }}>
                      {i18n.editProtected}
                    </span>
                  </td>
                  <td />
                  <td>
                    <span style={{ color: 'red', fontWeight: 900 }}>
                      {i18n.editStubborn}
                    </span>
                  </td>
                  <td>
                    <input
                      type="checkbox"
                      onChange={() => this.setState({ override: true })}
                    />
                  </td>
                </tr>}
              {trs}
            </tbody>
          </table>
        </div>
        {enableEdit &&
          getContentTypeView(id, content, changeAreaStateContent, curEditContext, stateId,
            getComponentStates, enableEdit)}
      </div>
    );
  }
}
