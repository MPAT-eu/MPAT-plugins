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
 *
 **/
import React from 'react';
import autobind from 'class-autobind';
import TinyMCE from 'react-tinymce';

import { ColorInput } from '../helpers/Inputs';
import { componentLoader } from '../../../ComponentLoader';
import Constants from '../../../constants';
import { getTooltipped } from '../../tooltipper.jsx';

const i18n = Constants.locstr.scrolledText;

function editView(params) {
  const { id, data, changeAreaContent, context, stateId } = params;

  let text = '';
  let unfocussedArrowColor = '#888888';
  let focussedArrowColor = '#43B4F9';
  let arrowsPosition = 'ONTEXTRIGHT';
  if (typeof data === 'object') {
    if (data.unfocussedArrowColor) {
      unfocussedArrowColor = data.unfocussedArrowColor;
    }
    if (data.focussedArrowColor) {
      focussedArrowColor = data.focussedArrowColor;
    }
    if (data.text) {
      text = data.text;
    }
    if (data.arrowsPosition) {
      arrowsPosition = data.arrowsPosition;
    }
  }
  return (
    <ScrolledTextEdit
      id={id}
      content={{ text, unfocussedArrowColor, focussedArrowColor, arrowsPosition }}
      changeAreaContent={changeAreaContent}
    />
  );
}
function preview(content = {}) {
  /*
   * mpat-frontend-preview and mpat-content-preview need to be merged
   * but to be fast it is applied only to text and maybe other selected
   * components
   */
  return (
    <div
      style={{ backgroundColor: (content.data) ? content.data.bgColor : '' }}
      className="mpat-frontend-preview mpat-content-preview textcontent-preview"
      dangerouslySetInnerHTML={{ __html: (content.data) ? content.data.text : '' }}
    />
  );
}


class ScrolledTextEdit extends React.PureComponent {

  /*eslint-disable*/
  static propTypes = {
    changeAreaContent: React.PropTypes.func,
    content: React.PropTypes.object
  };
  /*eslint-enable*/

  constructor() {
    super();
    autobind(this);
  }

  onChange(key, value) {
    this.props.changeAreaContent({ [key]: value });
  }

  render() {
    return (
      <div>
        <div className="component editHeader">
          <h2>{i18n.title}</h2>
          <table>
            <tbody>
              <tr>
                <td>
                  <label>{i18n.arrowColor}: </label>
                </td>
                <td>
                  {getTooltipped(
                    <ColorInput
                      value={this.props.content.unfocussedArrowColor}
                      onChange={e => this.onChange('unfocussedArrowColor', e.target.value)}
                    />
                    , i18n.ttArrowColor)}
                </td>
              </tr>
              <tr>
                <td>
                  <label>{i18n.activeArrowColor}: </label>
                </td>
                <td>
                  {getTooltipped(
                    <ColorInput
                      value={this.props.content.focussedArrowColor}
                      onChange={e => this.onChange('focussedArrowColor', e.target.value)}
                    />
                    , i18n.ttActiveArrowColor)}
                </td>
              </tr>
              <tr>
                <td>
                  <label>{i18n.arrowPlacement}: </label>
                </td>
                <td>
                  {getTooltipped(
                    <select
                      value={this.props.content.arrowsPosition}
                      onChange={e => this.onChange('arrowsPosition', e.target.value)}
                    >
                      <option key={0} value="ONTEXTLEFT">{i18n.onText}, {i18n.left}</option>
                      <option key={1} default value="ONTEXTRIGHT">{i18n.onText}, {i18n.right}</option>
                      <option key={2} value="ABOVEBELOWLEFT">{i18n.aboveBelow}, {i18n.left}</option>
                      <option key={3} value="ABOVEBELOWRIGHT">{i18n.aboveBelow}, {i18n.right}</option>
                      <option key={4} value="OUTSIDELEFT">{i18n.outside}, {i18n.left}</option>
                      <option key={5} value="OUTSIDERIGHT">{i18n.outside}, {i18n.right}</option>
                      <option key={6} value="NOARROWS">{i18n.noArrows}</option>
                    </select>
                    , i18n.ttArrowPosition)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="tinymcecontainer">
          <TinyMCE
            config={{ entity_encoding: 'raw' }}
            content={this.props.content.text}
            onChange={e => this.onChange('text', e.target.getContent())}
          />
        </div>
      </div>
    );
  }
}

componentLoader.registerComponent(
  'scrolledtext', {
    edit: editView,
    preview
  }, {
    isHotSpottable: false,
    isScrollable: false, // do not show the option
    hasNavigableGUI: false,
    isStylable: true
  }, {
    navigable: true
  }
);
