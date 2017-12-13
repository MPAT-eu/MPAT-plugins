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
 * Jean-Claude Dufourd (jean-claude.dufourd@telecom-paristech.fr
 * Stefano Miccoli (stefano.miccoli@finconsgroup.com)
 **/
import React from 'react';
import Page from './Page';

function sanitizeData(data) {
  if (!data) {
    data = { layout: [], content: {} }; // eslint-disable-line
  }
  // TODO insert proper default values;
  if (!data.layout) {
    data.layout = []; // eslint-disable-line
  }
  if (!data.content) {
    data.content = {}; // eslint-disable-line
  }
  if (!data.styles) {
    data.styles = {}; // eslint-disable-line
  }
  return data;
}

export default function PageWrapper({
        style,
        data,
        pageUtils = {
          getCurrentPage: () => {},
          goToPage: () => {},
          goToPreviousPage: () => {},
          performAction: () => {}
        }
    }) {
  return (
    <div style={style}>
      <Page {...sanitizeData(data)} allowMedia={false} pageUtils={pageUtils} />
    </div>
  );
}

PageWrapper.propTypes = {
  pageUtils: React.PropTypes.object
};
