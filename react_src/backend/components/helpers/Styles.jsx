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
 * Benedikt Vogel 	 (vogel@irt.de)
 * Stefano Miccoli (stefano.miccoli@finconsgroup.com)
 * Marco Ferrari (marco.ferrari@finconsgroup.com)
 **/
import React, { PropTypes } from 'react';
import { noSubmitOnEnter } from '../../utils';
import { getTooltipped } from '../../tooltipper.jsx';
import ChromePicker from './Chrome';
import Constants from '../../../constants';

const i18n = Constants.locstr.styles;

export class Styles extends React.PureComponent {

  static propTypes = {
    callback: PropTypes.func,
    styleValues: PropTypes.object,
    styleDefinitions: PropTypes.object
  };

  static defaultProps = {
    callback: () => { },
    styleValues: {
      container: {}
    },
    styleDefinitions: {
      container: {}
    }
  };

  supportedFormTypes = {
    text: (({ defaultValue, currentValue, itemName, propertyName, placeholder, sanitizeValue = (v) => (v), sanitizeCallback = (e) => (e.target.value) }) => (
      getTooltipped(<input
        type="text"
        placeholder={placeholder}
        defaultValue={sanitizeValue(currentValue || defaultValue || '')}
        onChange={e => this.props.callback({ [itemName]: { [propertyName]: sanitizeCallback(e) } })}
        onKeyPress={noSubmitOnEnter}
      />, i18n.ttSize)
    )),
    number: (({ defaultValue, currentValue, itemName, propertyName, placeholder, minValue, maxValue, sanitizeValue = (v) => (v), sanitizeCallback = (e) => (e.target.value) }) => (
      getTooltipped(<input
        type="number"
        min={minValue}
        max={maxValue}
        placeholder={placeholder}
        defaultValue={sanitizeValue(currentValue || defaultValue || '')}
        onChange={e => this.props.callback({ [itemName]: { [propertyName]: sanitizeCallback(e) } })}
        onKeyPress={noSubmitOnEnter}
      />,
      placeholder)
    )),
    color: (({defaultValue, currentValue, itemName, propertyName, sanitizeValue = (v) => (v), sanitizeCallback = (e) => (`rgba(${e.rgb.r},${e.rgb.g},${e.rgb.b},${e.rgb.a})`)}) => (
        <ChromePicker
          color={sanitizeValue(currentValue || defaultValue || 'black')}
          onChangeComplete={e => this.props.callback({[itemName]: {[propertyName]: sanitizeCallback(e)}})}
        />
    )),
    select: (({ defaultValue, currentValue, itemName, propertyName, options, sanitizeValue = (v) => (v), sanitizeCallback = (e) => (e.target.value) }) => (
      getTooltipped(<select
        defaultValue={sanitizeValue(currentValue || defaultValue || '')}
        onChange={e => this.props.callback({ [itemName]: { [propertyName]: sanitizeCallback(e) } })}
        onKeyPress={noSubmitOnEnter}>
        <option key={'empty'}>--{i18n.choose}--</option>
        {options.map((value) => (
          <option key={value} value={value}>{value}</option>
        ))}
      </select>,i18n.ttChoose)
    )),
    image: (({ defaultValue, currentValue, itemName, propertyName, sanitizeValue = (v) => (v), sanitizeCallback = (e) => (e.target.value) }) => (
      getTooltipped(<div>
        <input
          type="text"
          id={`${itemName}-${propertyName}-image-selector`}
          defaultValue={sanitizeValue(currentValue || defaultValue || '')}
          onChange={e => this.props.callback({ [itemName]: { [propertyName]: sanitizeCallback(e) } })}
          placeholder={i18n.typeUrlOrSelectMedia}
          onKeyPress={noSubmitOnEnter}
        />
        <button
          type="button"
          target={`${itemName}-${propertyName}-image-selector`}
          className="button mpat-insert-media white_blue"
          data-type="image"
        >Library</button>
      </div>, i18n.ttImage)
    ))
  }

  createTds(styleDefinitions, styleValues, callbackFunction, tds = []) {

    Object.keys(styleDefinitions).forEach((itemKey) => {
      const styles = styleDefinitions[itemKey];
      Object.keys(styles).forEach((styleName) => {
        const { label, fieldType, fieldProps = {}, sanitizeValue, sanitizeCallback, prefix = "", suffix = "" } = styles[styleName];
        const $component = this.supportedFormTypes[fieldType] || (() => (<div>Field of type {fieldType} is not supported.</div>));
        if (fieldType === 'separator') {
          tds.push(
            <td colSpan="2" key={`separator-${label}`}>
              <h2>{label}</h2>
              {fieldProps.description && <small>{fieldProps.description}</small>}
            </td>,
            <td style={{ display: 'none' }} key={`${label}`}></td>
          );
        } else {
          tds.push(
            <td key={`label-${fieldType}-${styleName}`}><label>{label}</label></td>,
            <td key={`${fieldType}-${styleName}`}>
              {prefix}&nbsp;
                              <$component
                {...fieldProps}
                currentValue={styleValues[itemKey] && styleValues[itemKey][styleName]}
                itemName={itemKey}
                propertyName={styleName}
                sanitizeValue={sanitizeValue}
                sanitizeCallback={sanitizeCallback} />
              &nbsp;{suffix}
            </td>
          );
        }
      });
    })
    return tds;
  }

  pack(tds) {
    const max = Math.floor(tds.length / 2);
    let trs = [];
    for (let i = 0; i < max; i++) {
      trs.push(
        <tr key={i}>
          {tds.shift()}
          {tds.shift()}
        </tr>
      );
    }
    if (tds.length !== 0) {
      trs.push(
        <tr key={max}>
          {tds.shift()}
        </tr>
      );
    }
    return trs;
  }

  render() {
    const trs = this.pack(this.createTds(this.props.styleDefinitions, this.props.styleValues, this.props.callback, []));
    return (<table><tbody>{trs}</tbody></table>);
  }
}
export function colorToRgba(color) {
  return `rgba(${color.rgb.r},${color.rgb.g},${color.rgb.b},${color.rgb.a})`;
}

export class StylesPopup extends React.PureComponent {

  static propTypes = {
    callback: PropTypes.func,
    styleValues: PropTypes.object,
    styleDefinitions: PropTypes.object
  };

  static defaultProps = {
    callback: () => { },
    styleValues: {
      container: {}
    },
    styleDefinitions: {
      container: {}
    }
  };

  render() {
    return (
      <div>
        <div id="styleEditor" className="editHeader">
          <h2>{this.props.title}</h2>
          <Styles
            callback={this.props.callback}
            styleValues={this.props.styleValues}
            styleDefinitions={this.props.styleDefinitions}
          />
          <table id="styleControls">
            <tbody>
              <tr>
                <td>
                  <button
                    type="button"
                    className="white_blue done_button"
                    id="done"
                    onClick={() => this.props.popup.close()}
                  >
                    {Constants.locstr.stylesPopup.done}
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}
