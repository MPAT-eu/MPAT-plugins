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
 * Benedikt Vogel    (vogel@irt.de)
 * Jean-Claude Dufourd (jean-claude.dufourd@telecom-paristech.fr
 *
 **/
import { decode } from 'querystring';
/*
export function classnames(classes) {
  return Object.keys(classes).filter(className => classes[className]).join(' ');
}

export function generateId() {
  return `_${Math.random().toString(36).substr(2, 9)}`;
}
*/
export function createTaggedHandler(tag, event, handler) {
  return { tag, event, handler };
}
export function createHandler(event, handler) {
  return { event, handler };
}

export function handlersWithTag(tag, handlers) {
  return handlers.map(handler => ({ ...handler, tag }));
}

export function getQueryParams() {
  let qs = window.location.href;
  qs = qs.substr(qs.indexOf('?') + 1);
  return decode(qs);
}

// DEBUG Utils

let debugConsole;

if (DEBUG) {
  const main = document.getElementById('main');
  debugConsole = document.createElement('div');
  debugConsole.id = 'console';
  main.parentNode.insertBefore(debugConsole, main.nextSibling);
}

export function log(msg) {
  window.TVDebugServerInterface.log(msg);
  if (DEBUG) {
    if (window.console && window.console.log) {
      window.console.log(msg);
    }
    try {
      if (debugConsole) {
        debugConsole.innerHTML = `${msg}<br/>${debugConsole.innerHTML}`;
      }
    } catch (err) {
      if (window.console && window.console.log) {
        window.console.log(err);
      }
    }
  }
}

export function toggleConsole() {
  if (DEBUG) {
    const consoleDiv = document.getElementById('console');
    if (consoleDiv) {
      if (consoleDiv.style.display === '' || consoleDiv.style.display === 'block') {
        consoleDiv.style.display = 'none';
      } else {
        consoleDiv.style.display = 'block';
      }
    }
  }
  return false;
}

export function mapArgs(fn, mp) {
  return (...args) => mp(...fn(...args));
}

export function getStyleRuleValue(style, selector) {
  let value = null;
  for (let i = 0; i < document.styleSheets.length; i++) {
    const mysheet = document.styleSheets[i];
    const myrules = mysheet.cssRules ? mysheet.cssRules : mysheet.rules;
    for (let j = 0; j < myrules.length; j++) {
      if (myrules[j].selectorText &&
          myrules[j].selectorText.toLowerCase() === selector &&
          myrules[j].style[style] !== '') {
        value = myrules[j].style[style];
      }
    }
  }
  // console.log("final value for "+selector+" is "+value);
  return value;
}

