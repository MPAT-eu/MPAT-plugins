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
 * Jean-Claude Dufourd (jean-claude.dufourd@telecom-paristech.fr
 *
 **/
import React from 'react';
import autobind from 'class-autobind';
import DefaultNavigationModel from '../DefaultNavigationModel';
import PageWrapper from './PageWrapper';
import { createHandler, handlersWithTag, log } from '../utils';
import { registerHandlers, registerNavigationModel, unregisterHandlers } from '../RemoteBinding';
import { application } from '../appData';

let current;
let future = null;

export function setCurrentControllerState(newData) {
  if (current) current.setState({ page: { data: newData } });
  else {
    future = newData;
  }
}

export class PreviewController extends React.Component {

  constructor(props) {
    super(props);
    autobind(this);
    registerNavigationModel(new DefaultNavigationModel());
    this.state = {
      page: {
        data: application.post.meta
      }
    };
  }

  componentDidMount() {
    current = this;
    if (future) {
      this.setState({ page: { data: future } });
      future = null;
    }
  }

  render() {
    const { page } = this.state;
    return (
      <div>
        <PageWrapper data={page.data} />
      </div>
    );
  }

}
