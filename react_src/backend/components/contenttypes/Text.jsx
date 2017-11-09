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
 *
 **/
import React from 'react';
import autobind from 'class-autobind';
import TinyMCE from 'react-tinymce';
import { componentLoader } from '../../../ComponentLoader';

function editView(params) {
  const { data, changeAreaContent, stateId } = params;
  let text = '';
  if (typeof data === 'object') {
    if (data.text) {
      text = data.text;
    }
  }
  return (
    <TextEdit stateId={stateId + params.id} {...{ text }} changeAreaContent={changeAreaContent} />
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
      dangerouslySetInnerHTML={{ __html: ( content.data ) ? ( content.data.text ) : '' }}
    />
  );
}


class TextEdit extends React.PureComponent {

  static defaultProps = {
    content: {
      text: ''
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
    const { text, stateId } = this.props; // bgColor
    return (
      <div className="tinymcecontainer">
        <TinyMCE
          key={stateId}
          config={{
            plugins: 'image',
            entity_encoding: 'raw'
          }}
          content={text}
          onChange={e => this.onChange('text', e.target.getContent())}
        />
      </div>
    );
  }
}

componentLoader.registerComponent(
  'text',
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
