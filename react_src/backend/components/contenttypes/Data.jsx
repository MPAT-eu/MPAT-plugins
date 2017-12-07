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
 * Authors:
 * Jean-Claude Dufourd (jean-claude.dufourd@telecom-paristech.fr
 **/
import React from 'react';
import autobind from 'class-autobind';
import { componentLoader } from '../../../ComponentLoader';

function editView(params) {
  const { data, changeAreaContent, stateId } = params;
  let origin = '';
  let period = '';
  let template = '';
  if (typeof data === 'object') {
    if (data.origin) {
      origin = data.origin;
    }
    if (data.period) {
      period = data.period;
    }
    if (data.template) {
      template = data.template;
    }
  }
  return (
    <DataEdit stateId={stateId + params.id} {...{ template, origin, period }}
              changeAreaContent={changeAreaContent} />
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
      style={{ overflow: 'hidden' }}
      className="mpat-frontend-preview mpat-content-preview textcontent-preview"
      dangerouslySetInnerHTML={{ __html: ( content.data ) ? ( content.data.origin ) : '' }}
    />
  );
}

/**
 * The Data compoment is a variant of the Text component whose content is grabbed from
 * a URL. The URL should be that of a web service which delivers a piece of text or a
 * HTML fragment
 */
class DataEdit extends React.PureComponent {

  static defaultProps = {
    content: {
      origin: '',
      template: '',
      period: 0
    }
  };

  constructor() {
    super();
    autobind(this);
  }

  onChange(key, value) {
    this.props.changeAreaContent({ [key]: value });
  }

  render() {
    const { origin, template, period, stateId } = this.props; // bgColor
    return (
      <div>
        <table>
          <tbody>
          <tr>
            <td>
              <label>External API URL:</label>
            </td>
            <td>
              <input
                type="text"
                key={stateId}
                defaultValue={origin}
                onChange={e => this.onChange('origin', e.target.value)}
                style={{width: 800}}
              /></td>
          </tr>
          <tr>
            <td>
              <label>Optional template:</label>
            </td>
            <td>
              <input
                type="text"
                key={stateId+1}
                defaultValue={template}
                onChange={e => this.onChange('template', e.target.value)}
                style={{width: 800}}
              /></td>
          </tr>
          <tr>
            <td>
              <label>
                Periodic refresh in <br/> seconds (0 for none):
              </label>
            </td>
            <td>
              <input
                type="number"
                key={stateId+2}
                defaultValue={period}
                onChange={e => this.onChange('period', e.target.value)}
              /></td>
          </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

componentLoader.registerComponent(
  'data',
  {
    edit: editView,
    preview
  }, {
    isHotSpottable: true,
    isScrollable: false,
    hasNavigableGUI: true,
    navigableDefault: false,
    isStylable: true
  }
);
