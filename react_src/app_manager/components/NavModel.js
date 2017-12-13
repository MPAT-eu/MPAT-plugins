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
 * Jean-Philippe Ruijs (github.com/jeanphilipperuijs)
 *
 **/
import React from 'react';
import autobind from 'class-autobind';
import { componentLoader } from '../../ComponentLoader';
import ComponentToggle from './ComponentToggle';
import constants from '../../constants';

const i18n = constants.locstr.navModel;

export default class NavModel extends React.Component {

  constructor(props) {
    super(props);
    autobind(this);
    this.state = {
      selectedNavModel: this.props.selectedNavModel,
      disabledComponents: this.props.disabledComponents
    };
  }

  componentDidMount() {
    this.showHideSlideflow();
  }

  showHideSlideflow() {
    jQuery("[name*='slideflow']").closest('tr').css({ display: (this.state.selectedNavModel == 'slideflow' ? 'table-row' : 'none') });
    // document.getElementById('application-manager-container').parentNode.parentNode.style.display = (this.state.selectedNavModel == 'slideflow' ? 'table-row' : 'none');
  }

  updateState(obj) {
    if (typeof obj.componentName !== 'undefined') {
      const componentName = obj.componentName;
      const disabledIndex = this.state.disabledComponents.indexOf(componentName);
      const currentlyDisabled = disabledIndex > -1;
      const willBeDisabled = !obj.enabled;
      obj = this.state;
      if (willBeDisabled && !currentlyDisabled) { // add to disabled list
        obj.disabledComponents.push(componentName);
      } else if (currentlyDisabled && !willBeDisabled) { // remove from disabled list
        obj.disabledComponents.splice(disabledIndex, 1);
      }
    }
    this.setState(obj, this.showHideSlideflow);
  }

  render() {
    return (
      <div>
        <NavSelector
          navModels={this.props.navModels}
          selectedNavModel={this.state.selectedNavModel}
          updateState={this.updateState}
        />
        <DescriptionBox
          navModels={this.props.navModels}
          selectedNavModel={this.state.selectedNavModel}
          disabledComponents={this.state.disabledComponents}
          updateState={this.updateState}
        />
      </div>
    );
  }
}

let caretPosition = 0;

class NavSelector extends React.Component {
  constructor(props) {
    super(props);
    autobind(this);
  }

  render() {
    const navOptions = Object.keys(this.props.navModels).map((item, i) => (
      <NavOption
        key={i}
        name={item}
        selectedNavModel={this.props.selectedNavModel}
        updateState={this.props.updateState}
      />
      ));
    navOptions.push(
      <div
        key="10000"
        id="navmodelcaret"
        className="navmodelcaret"
        style={{ left: caretPosition }}
      />
    );
    return (
      <div className="nav-selector">{navOptions}</div>
    );
  }
}

class NavOption extends React.Component {
  constructor(props) {
    super(props);
    autobind(this);
  }

  selectNavOption(e) {
    this.props.updateState({ selectedNavModel: this.props.name });
    this.updateCaret(e.target);
  }

  componentDidMount() {
    if (this.props.selectedNavModel == this.props.name) {
      this.updateCaret(document.getElementById(`nav-${this.props.name}`));
    }
  }

  updateCaret(e) {
    caretPosition = Math.round((e.offsetWidth / 2) + e.offsetLeft);
    document.getElementById('navmodelcaret').style.left = `${caretPosition}px`;
  }

  render() {
    return (
      <div
        id={`nav-${this.props.name}`}
        className={this.props.selectedNavModel == this.props.name ? 'selected' : ''}
        onClick={this.selectNavOption}
      >
        <input
          type="radio"
          name="mpat_application_manager[navigation_model]"
          value={this.props.name}
          onChange={function () {
          }} // prop must be set but this is handled in the NavModel
          checked={this.props.selectedNavModel == this.props.name}
        />

        { ucwords(this.props.name) }
      </div>
    );
  }
}

class DescriptionBox extends React.Component {
  constructor(props) {
    super(props);
    autobind(this);
  }

  render() {
    const components = componentLoader.getComponents().map((item, i) => (
      <ComponentToggle
        key={i}
        enabled={this.props.disabledComponents.indexOf(item.type) < 0}
        updateState={this.props.updateState}
        name={item.type}
      />
      ));// "icons_placeholder_image.svg"
    return (
      <div className="description">
        <table>
          <tbody>
            <tr>
              <th className="app-type-title">{ucwords(this.props.selectedNavModel)}</th>
              <th>{i18n.sampleApp}</th>
              <th>{i18n.components}</th>
            </tr>
            <tr>
              <td
                className="app-type-description"
                dangerouslySetInnerHTML={{ __html: this.props.navModels[this.props.selectedNavModel] }}
              />
              <td className="app-type-image">
                <img
                  className="description-img"
                  src={`${window.assetsPath}nav_${this.props.selectedNavModel}.png`}
                  role="presentation"
                />
              </td>
              <td>{components}</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

function ucwords(phrase) {
  return phrase.toLowerCase().replace(/\b[a-z]/g, letter => letter.toUpperCase());
}
