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
 * Jean-Philippe Ruijs (jean-philippe.ruijs@telecom.paristech.fr)
 *
 **/
import React from 'react';

export default function ButtonWP({ value, title, action, bgColor }) {
  return (
    <input
      type="button"
      className="timeline-button"
      value={value}
      title={title}
      onClick={action}
      style={{ backgroundColor: bgColor }}
    />
  );
}

ButtonWP.propTypes = {
  value: React.PropTypes.string,
  title: React.PropTypes.string,
  action: React.PropTypes.func,
  bgColor: React.PropTypes.string
};
