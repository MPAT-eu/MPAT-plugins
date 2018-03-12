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
 * Benedikt Vogel  (vogel@irt.de)
 * Stefano Miccoli (stefano.miccoli@finconsgroup.com)
 **/
import { log } from '../utils';

/* global _paq*/
export default class piwik {

  constructor() {
    window.addEventListener('onMPATpageview', this.trackPageview);
    window.addEventListener('onMPATevent', this.trackAction);
  }

// trackAction({detail: {page:"", category: "", action: "", name: "", value: ""}})
  static trackAction(eventHandler) {
    if (typeof _paq !== 'undefined') {
      _paq.push(['setCustomUrl', eventHandler.detail.page]);
      _paq.push(['trackEvent', eventHandler.detail.category, eventHandler.detail.action, eventHandler.detail.name, eventHandler.detail.value]);
      log(`PIWIK: trackevent (${eventHandler.detail.category} ${eventHandler.detail.action} ${eventHandler.detail.name} ${eventHandler.detail.value})`);
    }
  }

// trackPageView({detail: {page:"", title: ""}})
  static trackPageview(eventHandler) {
    if (typeof _paq !== 'undefined') {
      _paq.push(['setDocumentTitle', eventHandler.detail.title]);
      _paq.push(['setCustomUrl', eventHandler.detail.page]);
      _paq.push(['trackPageView']);
      log(`PIWIK: trackpageview (${eventHandler.detail.page} ${eventHandler.detail.title})`);
    }
  }
}
