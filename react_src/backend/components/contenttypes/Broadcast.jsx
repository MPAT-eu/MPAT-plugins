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
 * Jean-Philippe Ruijs (github.com/jeanphilipperuijs)
 *
 **/
import React from 'react';
import { VideoIcon } from '../icons';
import { componentLoader } from '../../../ComponentLoader';
import Constants from '../../../constants';


function edit(params) {
  const { id, data } = params;
  return (
    <Broadcast id={id} content={data} />
  );
}

function preview() {
  const divStyle = { backgroundColor: 'black' };

  return (
    <div className="mpat-content-preview videocontent-preview" style={divStyle}>
      <VideoIcon />
    </div>
  );
}


function Broadcast() {
  return (
    <div className="component">
      <div>
        <p className="notice">
          {Constants.locstr.broadcast.notice1}<br />
          {Constants.locstr.broadcast.notice2}&nbsp;
          <a href={Constants.third_party_url.firehbbtv} target="blank">
            FireHbbTV
          </a>&nbsp;
          {Constants.locstr.broadcast.notice3}
        </p>
      </div>
    </div>
  );
}

componentLoader.registerComponent(
  'broadcast',
  { edit, preview }
);

