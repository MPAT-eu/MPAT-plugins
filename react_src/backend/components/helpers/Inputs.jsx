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
 *
 **/
import React, { PropTypes as Types } from 'react';
import { noSubmitOnEnter } from '../../utils';
import { classnames } from '../../../functions';
import Autocomplete from 'react-autocomplete';
import axios from 'axios';
import autobind from 'class-autobind';
import Constants from '../../../constants';

const i18n = Constants.locstr.componentStateSelector;

//* ************COLOR INPUT************************
function isValidColor(color) {
  // FIXME SOMEDAY
  // may produce false positives
  return (
    color.match(/^#[0-9a-f]{3,6}$/i) ||
    color.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/i) ||
    color.match(/^rgba\((\d+),\s*(\d+),\s*(\d+),\s*(\d+(.\d+)?)\)$/i) ||
    false
  ) && true;
}

export function ColorInput({ label, className, placeholder = 'HEX, RGB / RGBA', value = '', onChange, style }) {
  const valid = isValidColor(value);
  return (
    <div className={className ? `${className} color-input` : 'color-input'}>
      {label}
      {label && <br />}
      <input
        type="text"
        className={classnames({ invalid: !valid && value })} {...{ placeholder, value, onChange }}
        onKeyPress={noSubmitOnEnter}
      />
      {valid &&
        <div style={{ backgroundColor: value }} className="color-preview" />
      }
    </div>
  );
}

ColorInput.propTypes = {
  label: React.PropTypes.string,
  className: React.PropTypes.string,
  onChange: React.PropTypes.func,
  value: React.PropTypes.string,
  placeholder: React.PropTypes.string
};

export function TextInput({ label, onChange, value = '', placeholder = '' }) {
  return (
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      onKeyPress={noSubmitOnEnter}
    />
  );
}

TextInput.propTypes = {
  label: React.PropTypes.string,
  onChange: React.PropTypes.func,
  value: React.PropTypes.string,
  placeholder: React.PropTypes.string
};

export function BooleanInput({ label, label2, onChange, value = '', placeholder = '' }) {
  return (
    <div className="boolean-input">
      {label}
      {label && <br />}
      {label2}
      {label2 && <br />}
      <input
        type="checkbox"
        placeholder={placeholder}
        checked={value}
        onChange={onChange}
      />
    </div>
  );
}

BooleanInput.propTypes = {
  label: React.PropTypes.string,
  label2: React.PropTypes.string,
  onChange: React.PropTypes.func,
  value: React.PropTypes.string,
  placeholder: React.PropTypes.string
};

export function SelectInput(props) {
  const { label, options, onChange } = props;
  const selected = props.value;
  return (
    <div>
      {label}<br />
      <select value={selected} onChange={onChange}>
        {options.map(({ value, name, disabled = false }, i) => (
          <option key={i} value={value} disabled={disabled}>{name}</option>
        ))}
      </select>
    </div>
  );
  if (props.tr) {
    return (
      <tr>
        <td>
          <label>{label}: </label>
        </td>
        <td>{sel}</td>
      </tr>
    );
  } else {
    return (
      <div>
        {label}
        {sel}
      </div>
    );
  }
}

SelectInput.propTypes = {
  label: React.PropTypes.string,
  onChange: React.PropTypes.func,
  value: React.PropTypes.string,
  options: React.PropTypes.array
};

export function ComponentStateSelector(props) {
  // setting default values here because defaultProps not working
  const {
    onChangeState = {},
    states = {},
    targetState = '',
    triggerAction = '',
    stateTriggerActions = {
      enter: i18n.enter,
      focus: i18n.focus
    }
  } = props;

  return (
    <div>
      <select
        value={targetState}
        onChange={
          e => onChangeState({
            targetState: e.target.value, targetLabel: states[e.target.value],
            triggerAction: triggerAction
          })
        }
      >
        <option key='_0'>-- Choose a state --</option>
        {Object.keys(states).map(key => (
          <option key={key} value={key}>{states[key]}</option>
        ))}
      </select>
      <select
        value={triggerAction}
        onChange={
          e => onChangeState({
            targetState: targetState, targetLabel: states[targetState],
            triggerAction: e.target.value
          })
        }
      >
        <option key='_0'>-- {i18n.chooseAnAction} --</option>
        {Object.keys(stateTriggerActions).map(key => (
          <option key={key} value={key}>{stateTriggerActions[key]}</option>
        ))}
      </select>
    </div>
  );
}

ComponentStateSelector.propTypes = {
  onChangeState: React.PropTypes.func,
  states: React.PropTypes.object,
  stateTriggerActions: React.PropTypes.object,
  targetState: React.PropTypes.string,
  triggerAction: React.PropTypes.string
};



export default class AssetFinder extends React.PureComponent {

  static propTypes = {
    asset: Types.string,
    onSelect: Types.func,
    onChange: Types.func
  }
  constructor() {
    super();
    autobind(this);
  }


  componentDidMount() {
    const assets_types = window.assets;

    this.setState({
      asset_type_selected: '',
      asset_category_selected: '',
      assets_types: assets_types,
      value: this.props.value,
      loading: false
    });
    const assets_categories = this.getTaxonomy();
  }


  getTaxonomy() {
    const base = 'tva_structure';
    const that = this;
    axios.get(wpApiSettings.root + wpApiSettings.versionString + base,
      {
        params: {
          per_page: 20
        }
      })
      .then(function (response) {
        that.setState({ assets_categories: response.data });
        return response.data;
      });
  }

  getAssets(base = 'mpat_asset_tva', per_page, offset, order, search, page, orderby) {

    let param_search = (search == ' ' || search == '') ? this.state.asset_category_selected : search;
    if (param_search == 'tva_categories') {
      param_search = '';
    }
    const that = this;
    axios.get(wpApiSettings.root + wpApiSettings.versionString + base,
      {
        params: {
          per_page: per_page,
          offset: offset,
          page: page,
          search: param_search,
          order: order,
          orderby: orderby
        }
      })
      .then(function (response) {
        const items = response.data;
        if (that.state && that.state.asset_category_selected !== 'tva_categories') {
          const items_in_category = [];
          items.forEach(item => {
            if (item.meta['_tva_folder'] == that.state.asset_category_selected) {
              items_in_category.push(item);
            }
          });
          that.setState({ items: items_in_category });
        } else {
          that.setState({ items: response.data });
        }
        return response.data;
      });
  }

  request(value, callback) {
    if (value === '')
      return this.getAssets(this.state.asset_type_selected)

    setTimeout(() => {
      callback(this.getAssets(this.state.asset_type_selected, 50, 0, 'asc', value))
    }, 500);
  }

  changeAsset(value) {
    const items = this.getAssets(value);
    this.setState({
      asset_type_selected: value
    });
  }

  changeCategory(value) {

    const items = this.getAssets(this.state.asset_type_selected, 50, 0, 'asc', value);
    this.setState({
      asset_category_selected: value,
      value: null
    });
  }

  itemSelected(value, item) {
    this.props.onSelect(value, item);
    this.setState({ value: value.meta['_tva_title'], items: [item] });
  }

  itemChanged(event, value) {
    this.props.onChange(value);
    this.setState({ value, loading: true })
    this.request(value, (items) => {
      this.setState({ items: items, loading: false })
    })
  }


  render() {
    return (
      <div>
        <select
          onChange={e => this.changeAsset(e.target.value)}
          defaultValue='mpat_asset_tva'
        >
          <option disabled value='mpat_asset_tva'> Select type</option>
          {this.state &&
            this.state.assets_types.map((mpat_asset) => (
              <option key={mpat_asset} value={mpat_asset}> {mpat_asset}</option>
            ))
          }
        </select>
        <select
          onChange={e => this.changeCategory(e.target.value)}
          defaultValue='tva_categories'
        >
          <option value='tva_categories'>All categories</option>
          {this.state && this.state.assets_categories && this.state.asset_type_selected !== '' &&
            this.state.assets_categories.map((category) => (
              <option key={category.name} value={category.name}>{category.name}</option>
            ))
          }
        </select>
        {this.state &&
          <div className="autocomplete-container">
            <Autocomplete
              value={this.state.value}
              items={this.state.items ? this.state.items : []}
              inputProps={{
                disabled: this.state.asset_type_selected !== '' ? false : true,
                type: 'text',
                placeholder: i18n.assetFinderPlaceholder,
                name: 'assets',
                id: 'assets-autocomplete'
              }}

              getItemValue={(item) => item}
              menuStyle={{
                left: '0px',
                top: '50px',
                borderRadius: '3px',
                boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)',
                background: 'rgba(255, 255, 255, 0.9)',
                padding: '2px 0',
                fontSize: '90%',
                lineHeight: '30px',
                position: 'absolute',
                overflow: 'auto',

              }}
              autoHighlight={true}

              onSelect={this.itemSelected}
              onChange={this.itemChanged}

              renderItem={(item, isHighlighted) => (

                <div style={isHighlighted ? { backgroundColor: 'rgba(67, 180, 249, 0.48)' } : {}}
                  key={item.id}
                  id={item.id}
                >{item.meta['_tva_title']}</div>
              )}
            />
          </div>
        }
      </div>
    );
  }
}

