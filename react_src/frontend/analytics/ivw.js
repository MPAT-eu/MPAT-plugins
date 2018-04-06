/**
 *
 * Copyright (c) 2017 MPAT Consortium , All rights reserved.
 * Fraunhofer FOKUS, Fincons Group, Telecom ParisTech, IRT,
 * Lancaster University, Leadin, RBB, Mediaset
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
 * Benedikt Vogel  (vogel@irt.de)
 **/
import { log } from '../utils';

/* global iom*/
export default class ivw {

  constructor() {
    window.addEventListener('onMPATpageview', ivw.trackPageview);
    window.addEventListener('onMPATevent', ivw.trackAction);
  }

  static trackAction(eventHandler) {
    const mapper = (eventAction) => {
      const ivw2MpatEvents = {
        '': 'inst',
        '': 'init',
        '': 'open',
        '': 'clse',
        play: 'play',
        '': 'resm',
        stop: 'stop',
        ff: 'fowa',
        rw: 'bakw',
        '': 'recd',
        paus: 'paus',
        '': 'forg',
        '': 'bakg',
        '': 'dele',
        '': 'refr',
        '': 'kill',
        '': 'view',
        '': 'alve',
        '': 'fini',
        '': 'mute',
        '': 'aforg',
        '': 'abakg',
        '': 'aclse',
        '': 'sple',
        '': 'scvl',
        '': 'serr',
        '': 'spyr',
        '': 'smdr',
        '': 'sfpl',
        '': 'sfqt',
        '': 'ssqt',
        '': 'stqt',
        '': 'soqt',
        '': 'sofc',
        '': 'scfc',
        '': 'scqt',
        '': 'splr',
        '': 'spli',
        '': 'sprs',
        '': 'spre',
        '': 'smrs'
        // no idea what ivw is doing with this events
        // just docu some mpat events
        /*
        list: 'smre',
        down: 'sors',
        up: 'sore',
        prev: 'sack',
        next: 'sapl',
        controll: 'sapa',
        goto: 'snsp'
        */
      };
      return ivw2MpatEvents[eventAction];
    };

    if (typeof iom !== 'undefined') {
      setTimeout(() => {
        const ivwEvent = mapper(eventHandler.detail.action);
        if (!ivwEvent) return;
        iom.event(ivwEvent);
        log(`IVW: trackevent (${eventHandler.detail.category} ${eventHandler.detail.action} ${eventHandler.detail.name} ${eventHandler.detail.value})`);
      }, 0);
    }
  }

  static trackPageview(eventHandler) {
    if (typeof iom !== 'undefined') {
      setTimeout(() => {
        iom.event('view');
        log(`IVW: trackpageview (${eventHandler.detail.page} ${eventHandler.detail.title})`);
      }, 0);
    }
  }
}
