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
 *
 **/
import { log } from './utils';

const eventHandlers = {};
let navModel;

export function registerNavigationModel(model) {
  navModel = model;
}

export function triggerEvent(name, e) {
  log(`event: ${name}`);
  if (Array.isArray(eventHandlers[name])) {
    navModel && navModel.handleEvent(e, name, eventHandlers[name]);
  }
}

document.addEventListener('DOMContentLoaded', () => {
    // TODO properly map this
  const mapKeyToEvent = event => event;
  document.onkeydown = (e) => {
    const event = mapKeyToEvent(e.keyCode);
    e.stopPropagation();
    e.preventDefault();
    triggerEvent(event, e);
  };
});

export function registerHandlers(identifier, handlers) {
  handlers.forEach(({ event, tag, handler }) => {
    const evs = Array.isArray(event) ? event : [event];
    evs.forEach((ev) => {
      if (!Array.isArray(eventHandlers[ev])) {
        eventHandlers[ev] = [];
      }
      eventHandlers[ev].push({ identifier, tag, handler });
    });
  });
}

export function unregisterHandlers(_identifier) {
  Object.keys(eventHandlers).forEach((event) => {
    eventHandlers[event] = eventHandlers[event].filter(
      ({ identifier }) => identifier !== _identifier
    );
  });
}
