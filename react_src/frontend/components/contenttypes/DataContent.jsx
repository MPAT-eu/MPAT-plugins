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
 * Authors:
 * Jean-Claude Dufourd (jean-claude.dufourd@telecom-paristech.fr
 *
 **/
import React, { PropTypes as Types } from 'react';
import axios from 'axios';

import { componentLoader } from '../../../ComponentLoader';

function refresh(url, time, that) {
  axios.get(url).then((o) => {
    that.setState({ data: o.data });
  }).catch((error) => {
    that.setState({ data: 'error fetching data' });
    console.log(error);
  });
  setTimeout(() => { refresh(url, time, that); }, time);
}

/**
 * The Data compoment is a variant of the Text component whose content is grabbed from
 * a URL. The URL should be that of a web service which delivers a piece of text or a
 * HTML fragment
 */
class DataContent extends React.Component {

  static propTypes = {
    origin: Types.string,
    template: Types.string,
    period: Types.oneOfType([Types.number, Types.string])
  };

  constructor(props) {
    super(props);
    this.state = {
      id: `m${Math.floor(Math.random() * 1000000)}`,
      data: ''
    };
    axios.get(props.origin).then((o) => {
      let str = o.data;
      if (props.template && props.template !== '') {
        str = props.template.replace(/\{\{(\w*)\}\}/g, (match, id) => o.data[id]);
      }
      this.setState({ data: str });
    }).catch((error) => {
      this.setState({ data: 'error fetching data' });
      console.log(error);
    });
    if (props.period > 0) {
      refresh(props.origin, props.period * 1000, this);
    }
  }

  render() {
    return (
      <div
        className="page-element-content text-content"
        style={{ overflow: 'hidden' }}
        dangerouslySetInnerHTML={{ __html: this.state.data }}
      />
    );
  }

}
componentLoader.registerComponent('data', { view: DataContent }, {
  isStylable: true
});
