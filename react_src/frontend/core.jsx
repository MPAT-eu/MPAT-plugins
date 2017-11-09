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
import ReactDOM from 'react-dom';

import SlideFlowController from './components/SlideFlowController';
import TimeLineController from './components/TimeLineController';
import WebsiteController from './components/WebsiteController';
import { PreviewController, setCurrentControllerState } from './components/PreviewController';
import { createTaggedHandler, toggleConsole, log } from './utils';
import { registerHandlers, unregisterHandlers } from './RemoteBinding';
import { application, adaptPost, update } from './appData';
import { componentLoader } from '../ComponentLoader';
import { trackPageview, trackAction } from './analytics/index';
import Video from './components/Video';

const main = document.getElementById('main');

window.onload = function onloadMPAT() {
  try {
    let Controller;
    if (application.application_manager.navigation_model === 'slideflow') {
      application.post = adaptPost(application.Post);
      Controller = SlideFlowController;
    } else if (application.application_manager.navigation_model === 'timeline' &&
               application.TimeLineInfoString) {
      Controller = TimeLineController;
    } else if (application.application_manager.navigation_model === 'preview') {
      application.post = adaptPost(application.Post);
      Controller = PreviewController;
    } else {
      application.post = adaptPost(application.Post);
      Controller = WebsiteController;
    }
    if (DEBUG) {
      registerHandlers('console', [createTaggedHandler('always', KeyEvent.VK_6, toggleConsole)]);
    }
    ReactDOM.render(<Controller />, main);
  } catch (err) {
    log(`${err.name}: ${err.message}`);
    log(err.stack);
    log(err);
  }
};

function previewRender() {
  // update application in appData
  update();
  // adapt the post
  application.post = adaptPost(application.Post);
  // send the new data to the controller
  setCurrentControllerState(application.post.meta);
}

// export react and componentLoader, this permit to import them from external components
module.exports = {
  React,
  ReactDOM,
  application,
  previewRender,
  componentAPI: componentLoader,
  utils: {
    Video
  },
  KeyBindingAPI: {
    registerHandlers,
    unregisterHandlers
  },
  analyticsAPI: {
    trackPageview,
    trackAction,
  },
};
