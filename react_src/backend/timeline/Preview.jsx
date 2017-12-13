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
 * Jean-Claude Dufourd (Telecom ParisTech)
 **/
import React from 'react';

function findRelevantHit(storeState, x) {
  return storeState.ranges.find(value =>
                                  ((value.type === 'TimeEvent' ||
                                    value.type === 'MediaEvent')
                                    && value.start < x
                                    && value.start + value.width > x));
}

export default function Preview(props) {
  const storeState = props.storeState;
  let url = '';
  let urlback = '';
  const back = storeState.backComponent;
  if (back) {
    urlback = `${back.guid}#preview`;
  }
  const marker = storeState.marker;
  if (marker) {
    const x = marker.pixel;
    const hit = findRelevantHit(storeState, x);
    if (hit) {
      url = `${hit.url}#preview`;
    } else {
      url = '';
    }
  }
  return (
    <div className="previewarea">
      <iframe id="previewareaiframeback" src={urlback} />
      <iframe src={url} />
    </div>
  );
}

Preview.propTypes = {
  /*eslint-disable*/
  storeState: React.PropTypes.object.isRequired,
  /*eslint-enable*/
};

