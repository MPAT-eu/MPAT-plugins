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
 * Jean-Philippe Ruijs (github.com/jeanphilipperuijs)
 *
 **/
import React from 'react';
import ReactDOM from 'react-dom';
import AppManager from './components/AppManager';
import NavModel from './components/NavModel';
import constants from '../constants';
import { mpat_css } from '../backend/utils';

const navContainer = document.getElementById('application-navigation-container');
const container = document.getElementById('application-manager-container');

window.disabledComponents = ['cshw']; // testing

mpat_css();

ReactDOM.render(
  <NavModel
    {...{
      navModels: constants.locstr.appMgr.navModels,
      selectedNavModel: window.selectedNavModel,
      disabledComponents: window.disabledComponents
    }}
  />, navContainer);

ReactDOM.render(<AppManager data={{ pagesOrder: window.pagesOrder, selectedNavModel: window.selectedNavModel }} />, container);
