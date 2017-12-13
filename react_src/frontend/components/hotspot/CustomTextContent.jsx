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
 * Benedikt Vogel 	 (vogel@irt.de)
 *
 **/
import React, { PropTypes as Types } from 'react';

export default function CustomTextContent({
  text = ''
}) {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        zIndex: 301,
        overflow: 'hidden',
        textOverflow: 'ellipsis'
      }}
    >
      <div dangerouslySetInnerHTML={{ __html: text }} />
    </div>
  );
}

CustomTextContent.propTypes = {
  bgColor: Types.string,
  text: Types.string
};
