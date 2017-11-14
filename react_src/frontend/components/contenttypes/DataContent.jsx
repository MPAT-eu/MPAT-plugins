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
 * Jean-Claude Dufourd (jean-claude.dufourd@telecom-paristech.fr
 **/
import React, { PropTypes as Types } from 'react';
import axios from 'axios';

import { componentLoader } from '../../../ComponentLoader';

function refresh(url, time, that) {
  axios.get(url).then((o) => {
    that.setState({data: o.data});
  }).catch((error) => {
    that.setState({data: "error fetching data"});
    console.log(error);
  });
  setTimeout(function () {refresh(url, time, that);}, time);
}

class DataContent extends React.Component {

  static propTypes = {
    origin: Types.string,
    period: Types.oneOfType([Types.number, Types.string])
  };

  constructor(props) {
    super(props);
    this.state = {
      id: "m"+Math.floor(Math.random()*1000000),
      data: ""
    };
    axios.get(props.origin).then((o) => {
      this.setState({data: o.data});
    }).catch((error) => {
      this.setState({data: "error fetching data"});
      //console.log(error);
    });
    if (props.period > 0) {
      refresh(props.origin, props.period * 1000, this);
    }
  }

  render() {
    return (
      <div className="page-element-content text-content" style={{ overflow: 'hidden' }}>
        {this.state.data}
      </div>
    );
  }

}
componentLoader.registerComponent('data', { view: DataContent }, {
  isStylable: true
});
