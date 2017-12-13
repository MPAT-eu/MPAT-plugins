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
 * Jean-Philippe Ruijs (github.com/jeanphilipperuijs)
 * Marco Ferrari (marco.ferrari@finconsgroup.com)
 **/
import deepAssign from 'assign-deep';
import { layouts } from './appData';
/*
export function classnames(classes) {
  return Object.keys(classes).filter(className => classes[className]).join(' ');
}

export function generateId() {
  return `_${Math.random().toString(36).substr(2, 9)}`;
}
*/
export function getLayoutById(layoutId) {
  return layouts.find(({ id }) => id === parseInt(layoutId, 10));
}

export const identity = x => x;

// FIXME this is not used anywhere
export const giveActions = actions => props => ({ ...props, actions });

export function wait(ms) {
  return new Promise(resolve => window.setTimeout(resolve, ms));
}

export function createReducer(initialState, config) {
  return (state = initialState, action) => {
    if (typeof config[action.type] === 'function') {
      const ret = config[action.type](state, action.payload, action.meta);
      if (ret !== undefined) {
        return ret;
      }
    }
    return state;
  };
}

export function mergeState(reducer) {
  return (state, payload, meta) => deepAssign({}, state, reducer(payload, meta));
}

export function openMediaGallery(callbackFunction, type = undefined, multiple = false) {
  const options = {
    frame: 'post',
    state: 'insert',
    title: wp.media.view.l10n.addMedia,
    multiple,
    library: { type }
  };

  const frame = wp.media(options);

  frame.on('insert', () => {
    const selection = frame.state().get('selection');
    selection.each((attachment) => {
      callbackFunction({
        imgUrl: (attachment.attributes.sizes.large ? attachment.attributes.sizes.large.url : attachment.attributes.sizes.full.url),
        id: attachment.id,
        fullImgUrl: attachment.attributes.sizes.full.url
      });
    });
  });

  frame.open();
}

export function noSubmitOnEnter(ev) {
  const keyCode = ev.which || ev.keyCode;
  // console.log('nosubmit receives '+keyCode);
  if (keyCode === 13) {
    ev.preventDefault();
    return false;
  }
}


/**
 * string formatted date string
 * @param {*} d
 */
function getDate(d) {
  return new Date(d).toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, '$1');
}

/**
 * Generate XML formatted event
 * @param {*} timestamp
 * @param {*} value
 * @author Jean-Philippe Ruijs
 */
export function getEvent(t, v) {
  return `\t<event timestamp="${timestamp}" value="${value}"/>`;
}


/**
 * Generate a DSMCC streamevent formatted in XML string
 * @param {*} componentTag
 * @param {*} streamEventId
 * @param {*} streamEventName
 * @author Jean-Philippe Ruijs
 */
export function getDsmcc(componentTag, streamEventId, streamEventName) {
  return `<dsmcc xmlns="urn:dvb:mis:dsmcc:2009">
  <dsmcc_object component_tag="${componentTag}">
    <stream_event stream_event_id="${streamEventId}" stream_event_name="${streamEventName}"/>
  </dsmcc_object>
</dsmcc>`;
}

/**
 * Adds suffix 'mpat' to className of elements with id 'wpbody-content'.
 * Used by:
 * - AppManager
 * - PageEditor
 * - LayoutView
 * @author Jean-Philippe Ruijs
 */
export function mpat_css() {
  const element = document.getElementById('wpbody-content');
  const className = element.className;
  if (className.indexOf('mpat') < 0) element.className += ' mpat';
}
