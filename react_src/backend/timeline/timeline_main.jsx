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
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import TimeLineContainer from './redux/TimeLineContainer';
import store from './redux/TimeLineStore';

function htmlbase() {
  document.getElementById('footer-upgrade').remove();
  document.getElementById('footer-thankyou').remove();
  const wpbodycontent = document.getElementById('wpbody-content');
  const mpatElements = document.createElement('div');
  mpatElements.id = 'mpat_elements';
  mpatElements.className = 'mpat';
  wpbodycontent.appendChild(mpatElements);
  // console.log('WordPress body content DIV created');
  return mpatElements;
}


ReactDOM.render(
  <Provider store={store}>
    <TimeLineContainer />
  </Provider>,
  htmlbase());
