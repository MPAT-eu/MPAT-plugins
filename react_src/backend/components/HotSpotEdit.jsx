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
 * Benedikt Vogel 	 (vogel@irt.de)
 *
 **/
import React, { PropTypes as Types } from 'react';
import Popup from 'react-popup';
import autobind from 'class-autobind';
import ChromePicker from './helpers/Chrome';
import { openMediaGallery, noSubmitOnEnter } from '../utils';
import Constants from '../../constants';
import { colorToRgba } from './helpers/Styles';

const i18n = Constants.locstr;

export default class HotSpotEdit extends React.Component {

  static defaultProps = {
    data: {
      active_bg: Constants.styleguide.color.background.light,
      active_fill: Constants.styleguide.color.hover.blue,
      active_icon: '',
      focused_bg: Constants.styleguide.color.background.light,
      focused_fill: Constants.styleguide.color.pressed.blue,
      focused_icon: '',
      normal_bg: Constants.styleguide.color.background.dark,
      normal_fill: Constants.styleguide.color.normal.blue,
      normal_icon: '',
      position: '',
      width: 220,
      height: '',
      type: ''
    }
  };

  static propTypes = {
    save: Types.func,
    meta: React.PropTypes.shape({ y: Types.number }),
    data: React.PropTypes.shape({
      active_bg: Types.string,
      active_fill: Types.string,
      active_icon: Types.string,
      focused_bg: Types.string,
      focused_fill: Types.string,
      focused_icon: Types.string,
      normal_bg: Types.string,
      normal_fill: Types.string,
      normal_icon: Types.string,
      position: Types.string,
      height: Types.string,
      type: Types.string
    })
  };

  constructor(props) {
    super(props);
    autobind(this);
    const data = this.props.data;
    const genericPosition = this.props.meta.y * 10 > Constants.tv.resolutions.hdready.height / 2 ? 'upper' : 'lower';
    data.position = this.props.data.position ? this.props.data.position : genericPosition;
    this.state = { data };
  }

  save(key, value) {
    const data = this.state.data;
    data[key] = value;
    this.props.save(data);
    this.setState({ data });
  }

  toggleView(e) {
    e.preventDefault();
    Popup.create(
      { content: <HsForm save={this.save} data={this.state.data} /> }
    );
  }

  render() {
    let content = null;
    const style = !this.state.data.isHotSpot ? {} : { background: '#F4F4F4', padding: '0px' };
    const btnOrContent = <button onClick={this.toggleView} className="white_blue">{i18n.hotSpotEdit.edit}...</button>;
    if (this.state.data.isHotSpot) {
      content = (['text', 'video', 'audio', 'link', 'image'].indexOf(this.props.type) === -1) ?
        <Warning /> : btnOrContent;
    }
    return (
      <div style={style}>
        <input type="checkbox" checked={this.state.data.isHotSpot} onChange={(e) => { this.save('isHotSpot', !!e.target.checked); }} />
        {content}
      </div>
    );
  }
}

function Warning() {
  return <div style={{ color: `${Constants.styleguide.color.warning.text}` }}>{i18n.warning}</div>;
}

class HsForm extends React.Component {

  static propTypes = {
    save: React.PropTypes.func,
    data: React.PropTypes.shape({
      width: Types.string,
      normal_icon: Types.string,
      active_icon: Types.string,
      focused_icon: Types.string,
      height: Types.string,
      staticLeft: Types.string,
      staticTop: Types.string,
      position: Types.string,
      remoteKey: Types.string
    })
  };

  constructor(props) {
    super(props);
    autobind(this);
    this.state = {
      data: this.props.data
    };
  }

  savePosition(e) {
    this.props.save('position', e.target.value);
    const data = this.state.data;
    data.position = e.target.value;
    this.setState({ data });
  }

  render() {
    // return <div></div>
    return (
      <div>
        <h2>{i18n.hotSpotEdit.title}</h2>
        <div className="editHeader" style={{ width: 700, height: 600, overflow: 'auto' }}>
          <table>
            <tbody>
              <tr>
                <th colSpan="2" >{i18n.hotSpotEdit.active}</th>
              </tr>
              <tr>
                <td>
                  <label>{i18n.hotSpotEdit.background}: </label>
                </td>
                <td>
                  <ChromePicker
                    color={this.props.data.active_bg}
                    onChangeComplete={c => this.props.save('active_bg', colorToRgba(c))}
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <label>{i18n.hotSpotEdit.icon}: </label>
                </td>
                <td>
                  <ChromePicker
                    color={this.props.data.active_fill}
                    onChangeComplete={c => this.props.save('active_fill', colorToRgba(c))}
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <label>{i18n.hotSpotEdit.orCustomFile}: </label>
                </td>
                <td>
                  <IconSelector type="active_icon" data={this.props.data} save={this.props.save} />
                </td>
              </tr>
              <tr>
                <th colSpan="2">Focused</th>
              </tr>
              <tr>
                <td>
                  <label>{i18n.hotSpotEdit.background}: </label>
                </td>
                <td>
                  <ChromePicker
                    color={this.props.data.focused_bg}
                    onChangeComplete={c => this.props.save('focused_bg', colorToRgba(c))}
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <label>{i18n.hotSpotEdit.icon}: </label>
                </td>
                <td>
                  <ChromePicker
                    color={this.props.data.focused_fill}
                    onChangeComplete={c => this.props.save('focused_fill', colorToRgba(c))}
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <label>{i18n.hotSpotEdit.orCustomFile}: </label>
                </td>
                <td>
                  <IconSelector type="focused_icon" data={this.props.data} save={this.props.save} />
                </td>
              </tr>
              <tr>
                <th colSpan="2">{i18n.hotSpotEdit.normal}</th>
              </tr>
              <tr>
                <td>
                  <label>{i18n.hotSpotEdit.background}: </label>
                </td>
                <td>
                  <ChromePicker
                    color={this.props.data.normal_bg}
                    onChangeComplete={c => this.props.save('normal_bg', colorToRgba(c))}
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <label>{i18n.hotSpotEdit.iconColour}: </label>
                </td>
                <td>
                  <ChromePicker
                    color={this.props.data.normal_fill}
                    onChangeComplete={c => this.props.save('normal_fill', colorToRgba(c))}
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <label>{i18n.hotSpotEdit.orCustomFile}: </label>
                </td>
                <td>
                  <IconSelector type="normal_icon" data={this.props.data} save={this.props.save} />
                </td>
              </tr>
              <tr>
                <th colSpan="2">{i18n.hotSpotEdit.contentPosition}</th>
              </tr>
              <tr>
                <td>
                  <label>{i18n.hotSpotEdit.location}: </label>
                </td>
                <td>
                  <select
                    onChange={e => this.savePosition(e)}
                    defaultValue={this.props.data.position}
                  >
                    <option value="upper">{i18n.hotSpotEdit.overTheIcon}</option>
                    <option value="lower">{i18n.hotSpotEdit.underTheIcon}</option>
                    <option value="static">{i18n.hotSpotEdit.static}</option>
                  </select>
                </td>
              </tr>{ this.state.data.position === 'static' && (
                <tr>
                  <th colSpan="2">{i18n.hotSpotEdit.staticContentPosition}</th>
                </tr>
              )}{ this.state.data.position === 'static' && (
                <tr>
                  <td>
                    <label>{i18n.hotSpotEdit.top}: </label>
                  </td>
                  <td>
                    <input
                      type="text"
                      onChange={(e) => { this.props.save('staticTop', e.target.value); }}
                      defaultValue={this.props.data.staticTop}
                      onKeyPress={noSubmitOnEnter}
                    />
                  </td>
                </tr>
              )}{ this.state.data.position === 'static' && (
                <tr>
                  <td>
                    <label>{i18n.hotSpotEdit.left}: </label>
                  </td>
                  <td>
                    <input
                      type="text"
                      onKeyPress={noSubmitOnEnter}
                      onChange={(e) => { this.props.save('staticLeft', e.target.value); }}
                      defaultValue={this.props.data.staticLeft}
                    />
                  </td>
                </tr>
              )}<tr>
                <th colSpan="2">{i18n.hotSpotEdit.contentSize}</th>
              </tr>
              <tr>
                <td>
                  <label>{i18n.hotSpotEdit.width}: </label>
                </td>
                <td>
                  <input
                    type="text"
                    onChange={e => this.props.save('width', e.target.value)}
                    defaultValue={this.props.data.width}
                    onKeyPress={noSubmitOnEnter}
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <label>{i18n.hotSpotEdit.height}: </label>
                </td>
                <td>
                  <input
                    type="text"
                    onChange={e => this.props.save('height', e.target.value)}
                    onKeyPress={noSubmitOnEnter}
                    defaultValue={this.props.data.height}
                  />
                  {i18n.hotSpotEdit.ifEmptyFitContent}
                </td>
              </tr>
              <tr>
                <td>
                  <label>{i18n.hotSpotEdit.keyBinding}: </label>
                </td>
                <td>
                  <KeyBinding
                    data={this.props.data}
                    save={this.props.save}
                    remoteKey={this.props.data.remoteKey}
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <button className="hard-right blue_white" onClick={Popup.close}>{i18n.hotSpotEdit.done}</button>
      </div>
    );
  }
}


function IconSelector({ type, data, save }) {
  const prefix = 'custom_';
  const openMedia = () => {
    openMediaGallery((imgData) => {
      save(prefix + type, imgData.imgUrl);
    });
  };
  return (
    <div>
      <b>- {i18n.hotSpotEdit.or} - </b>  (<i>{i18n.hotSpotEdit.defaultIfAvailable}</i>)<br />
      <div style={{ width: '20%', display: 'inline-block' }}>{i18n.hotSpotEdit.customIcon}:</div>
      <input
        type="text"
        onChange={(e) => { save(prefix + type, e.target.value); }}
        value={data[prefix + type]}
        onKeyPress={noSubmitOnEnter}
      />
      &nbsp;&nbsp;<button type="button" className="button white_blue" onClick={openMedia}>{i18n.hotSpotEdit.choose}</button>
      &nbsp;&nbsp;{ data[prefix + type] && <img src={data[prefix + type]} style={{ height: '46px', verticalAlign: 'bottom' }} role="presentation" /> }
    </div>
  );
}


function KeyBinding({ save, remoteKey }) {
    /*
  propTypes = {
    save: React.PropTypes.func,
    remoteKey: React.PropTypes.string
  }; */
  const keys = [
      { key: '', label: `--${i18n.hotSpotEdit.selectRemoteButton}--` },
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
      /* { key: 'VK_RED', label: 'red', disabled: false },*/
      { key: 'VK_YELLOW', label: 'yellow', disabled: false },
      { key: 'VK_GREEN', label: 'green', disabled: false },
      { key: 'VK_BLUE', label: 'blue', disabled: false }
  ];
  const keyOption = item =>
    <option
      key={item.key}
      disabled={item.disabled}
      value={item.key}
    > {item.label}
    </option>;
  return (
    <select value={remoteKey} onChange={e => save('remoteKey', e.target.value)}>
      {keys.map(keyOption)}
    </select>
  );
}
