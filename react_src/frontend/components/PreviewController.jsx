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
import DefaultNavigationModel from '../DefaultNavigationModel';
import PageWrapper from './PageWrapper';
import { createHandler, handlersWithTag, log } from '../utils';
import { registerHandlers, registerNavigationModel, unregisterHandlers } from '../RemoteBinding';
import { application } from '../appData';

let current;

export function setCurrentControllerState(newData) {
  current.setState({page: {data: newData}});
}

export class PreviewController extends React.Component {

  constructor(props) {
    super(props);
    autobind(this);
    registerNavigationModel(new DefaultNavigationModel());
    this.state = {
      page: {
          data: application.post.meta
      },
    };
    current = this;
  }

  render() {
    const { page } = this.state;
    return (
      <div>
        <PageWrapper data={page.data}/>
      </div>
    );
  }

}
