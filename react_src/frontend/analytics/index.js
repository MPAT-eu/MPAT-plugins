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
 * Benedikt Vogel 	 (vogel@irt.de)
 * Stefano Miccoli (stefano.miccoli@finconsgroup.com)
 **/
import Cookies from 'js-cookie';
import { log } from '../utils';
import Piwik from './piwik';

new Piwik();

let trackingEnabled = Cookies.get('trackingEnabled') !== 'false';
// custom handling of document url to be forced on those navigation models
// which perform async load of pages, such as slideflow
let analyticsCurrentPage = document.location.href;

export function setTrackingEnabled(enabled) {
  trackingEnabled = enabled;
  Cookies.set('trackingEnabled', enabled);
}

export function isTrackingEnabled() {
  return trackingEnabled;
}

export function trackPageview(pageUrl, pageTitle = '') {
  if (!trackingEnabled) return;
  analyticsCurrentPage = pageUrl;
  // create and dispatch the event
  log(`tracking pageview ${pageUrl}`);
  try {
    const event = new CustomEvent('onMPATpageview', {
      detail: {
        page: pageUrl,
        title: pageTitle
      }
    });
    window.dispatchEvent(event);
  } catch (e) {
    log('custom event crash *onMPATpageview*');
  }
}

export function trackAction(category, action, name = '', value = '') {
  if (!trackingEnabled) return;
  // create and dispatch the event
  //log(`tracking action - category: ${category} action: ${action} name: ${name} value: ${value}`);
  try {
    const event = new CustomEvent('onMPATevent', {
      detail: {
        page: analyticsCurrentPage,
        category,
        action,
        name,
        value
      }
    });
    window.dispatchEvent(event);
  } catch (e) {
    log('custom event crash *onMPATevent*');
  }
}
