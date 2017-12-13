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
 * Miggi Zwicklbauer (miggi.zwicklbauer@fokus.fraunhofer.de)
 * Thomas Tröllmich  (thomas.troellmich@fokus.fraunhofer.de)
 *
 **/
import { PropTypes as Types } from 'react';

export const pageElemContainerType = {
  active: Types.bool.isRequired,
  focused: Types.bool.isRequired,
  hotSpotMeta: Types.shape({
    isHotSpot: Types.bool.isRequired
  }),
  queryParams: Types.objectOf(Types.string),
  allowMedia: Types.bool
};

export const pageElemType = {
  ...pageElemContainerType,
  id: Types.string.isRequired,
  position: Types.shape({
    width: Types.number.isRequired,
    height: Types.number.isRequired
  }).isRequired,
  navigable: Types.bool.isRequired
};

export const pageElemDefaults = {
  active: false,
  allowMedia: true,
  queryParams: {},
  hotSpotMeta: {
    isHotSpot: false
  }
};
