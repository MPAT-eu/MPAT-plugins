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
 * Jean-Philippe Ruijs (github.com/jeanphilipperuijs)
 * Stefano Miccoli (stefano.miccoli@finconsgroup.com)
 * Marco Ferrari (marco.ferrari@finconsgroup.com)
 *
 **/
import React from 'react';
import ReactDOM from 'react-dom';
import { applyMiddleware, createStore, compose } from 'redux';
import { Provider } from 'react-redux';
import Popup from 'react-popup';
import { } from 'react-resizable/css/styles.css';
/*
 TODO i didnt know where to put this,
 but we have to use the style loader
 here in order to get independent from the node_modules folder
 */
import thunk from 'redux-thunk';

import { updatePreview } from './components/pageeditor/Preview';

import LayoutBuilder from './components/LayoutBuilder';
import PageEditorContainer from './containers/PageEditorContainer';
import Resizable from './components/helpers/Resizable';
import { post, layouts } from './appData';
import reducer from './reducers/index';
import { componentLoader } from '../ComponentLoader';
import { openMediaGallery } from './utils';
import Constants from '../constants';

const layoutParams = {
  width: Constants.tv.resolutions.hdready.width,
  height: Constants.tv.resolutions.hdready.height
};

// TODO Create Flux-Store for LayoutBuilder
const meta = (!Array.isArray(post.meta) && post.meta ? post.meta : {});

window.onload = function onload() {
  const layoutBuilderContainer = document.getElementsByClassName('layout-builder-container')[0];
  if (layoutBuilderContainer) {
    ReactDOM.render(
      <div>
        <Popup />
        <Resizable container={layoutBuilderContainer}>
          <LayoutBuilder
            meta={meta}
            {...layoutParams}
          />
        </Resizable>
      </div>,
      layoutBuilderContainer);
     // var $ = jQuery;
     // $('#slugdiv-hide, #members-cp-hide').prop('checked', false);
     // $('.columns-prefs-1 input').click();
  }

  const contentEditorContainer = document.getElementsByClassName('content-editor-container')[0];
  if (contentEditorContainer) {
    /*eslint-disable*/
    const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
    /*eslint-enable*/
    // const logger = createLogger();
    const pageStore = createStore(
        reducer,
        composeEnhancers(applyMiddleware(thunk, /* logger */))
      );
    ReactDOM.render(
      <div>
        <Popup />
        <Provider store={pageStore} >
          <Resizable container={contentEditorContainer}>
            <PageEditorContainer
              {...layoutParams}
              layoutId={meta.layoutId}
              availableLayouts={layouts}
            />
          </Resizable>
        </Provider>
      </div>,
      contentEditorContainer);
  }
};

window.drawComponent = function drawComponent(ctx, x, y, w, h, text="") {
  ctx.fillStyle = '#333';
  ctx.fillRect(x, y, w, h);
  ctx.strokeStyle = '#AAA';
  ctx.strokeRect(x, y, w, h);
  ctx.textBaseline = 'middle';
  ctx.font = '22px Arial';
  ctx.fillStyle = '#F90';
  const textX = x+w/2 - ctx.measureText(text).width/2;
  const textY = y+h/2;
  ctx.fillText(text, textX, textY);
};

// export react and componentLoader, this permit to import them from external components
module.exports = {
  React,
  ReactDOM,
  componentAPI: componentLoader,
  utils: {
      openMediaGallery
  }
  //analyticsAPI: object

};
