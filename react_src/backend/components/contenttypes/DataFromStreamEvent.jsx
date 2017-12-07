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
import OptionIO from '../../../OptionIO';

function editView(params) {
  const { data, changeAreaContent, stateId } = params;
  let streameventname = 'id1';
  let streameventid = 1;
  let componenttag = 9;
  let initialtext = '';
  let template = '';
  if (typeof data === 'object') {
    if (data.streameventname) {
      streameventname = data.streameventname;
    }
    if (data.streameventid) {
      streameventid = data.streameventid;
    }
    if (data.componenttag) {
      componenttag = data.componenttag;
    }
    if (data.initialtext) {
      initialtext = data.initialtext;
    }
    if (data.template) {
      template = data.template;
    }
  }
  return (
    <DataFromStreamEventEdit stateId={stateId + params.id} {...{ streameventname, streameventid,
      componenttag, initialtext, template }} changeAreaContent={changeAreaContent} />
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
 * The DataFromStreamEvent compoment is a variant of the Text component whose content is grabbed from
 * a HbbTV Stream Event
 *
 * Using this component is incompatible with using the TimeLine, unless the same event options
 * are used in both
 */
class DataFromStreamEventEdit extends React.PureComponent {

  static propTypes = {
    content: {
      initialtext: React.PropTypes.string,
      streameventname: React.PropTypes.string,
      streameventid: React.PropTypes.number,
      componenttag: React.PropTypes.number,
      template: React.PropTypes.string
    }
  };

  static defaultProps = {
    content: {
      streameventid: 1,
      streameventname: 'id1',
      initialtext: '',
      componenttag: 9,
      template: ''
    }
  };

  constructor() {
    super();
    autobind(this);
  }

  onChange(key, value) {
    this.props.changeAreaContent({ [key]: value });
    if (key === 'initialtext' || key === 'template') return;
    const tag = (key === 'componenttag' ? value : this.props.content.componenttag);
    const id = (key === 'streameventid' ? value : this.props.content.streameventid);
    const name = (key === 'streameventname' ? value : this.props.content.streameventname);
    OptionIO.getCommon().put(
      'dsmcc',
      { tag, id, name },
      () => {},
      (e) => {
        console.log(e);
      }
    );
  }

  render() {
    const { stateId } = this.props;
    const { componenttag, streameventname, streameventid, initialtext, template } = this.props.content;
    return (
      <div>
        <table>
          <tbody>
          <tr>
            <td>
              <label>Stream Event id:</label>
            </td>
            <td>
              <input
                type="number"
                key={stateId}
                defaultValue={streameventid}
                onChange={e => this.onChange('streameventid', e.target.value)}
              />
            </td>
            <td/>
            <td>
              <label>Stream Event name:</label>
            </td>
            <td>
              <input
                type="text"
                key={stateId+1}
                defaultValue={streameventname}
                onChange={e => this.onChange('streameventname', e.target.value)}
              />
            </td>
          </tr>
          <tr>
            <td>
              <label>Component tag:</label>
            </td>
            <td>
              <input
                type="number"
                key={stateId+2}
                defaultValue={componenttag}
                onChange={e => this.onChange('componenttag', e.target.value)}
              />
            </td>
            <td/>
            <td>
              <label>Initial text:</label>
            </td>
            <td>
              <input
                type="text"
                key={stateId+3}
                defaultValue={initialtext}
                onChange={e => this.onChange('initialtext', e.target.value)}
              /></td>
          </tr>
          <tr>
            <td>
              <label>Optional template:</label>
            </td>
            <td>
              <input
                type="text"
                key={stateId+4}
                defaultValue={template}
                onChange={e => this.onChange('template', e.target.value)}
                style={{width: 800}}
              /></td>
          </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

componentLoader.registerComponent(
  'datafromstreamevent',
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
