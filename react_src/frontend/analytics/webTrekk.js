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

/* global WebTrekk*/
export default class WebTrekk {

    constructor() {
        window.addEventListener('onMPATpageview', WebTrekk.trackPageview);
        // window.addEventListener('onMPATevent', webTrekk.trackAction);
        WebTrekk.trackingImg = document.createElement("img");
    }

    static trackPageview(eventHandler) {

    const track = () => {    
        if(typeof mpatWebTrekkConfig === 'undefined') return;
        const {url,cat1, cat2, cat3, cat4, siteid} = mpatWebTrekkConfig;
        if(!(url && cat1 && cat2 && cat3 && cat4 && siteid)){
            log('tried webtrekk but some params are not set. please set it up correctly');
          //  log(JSON.stringify(mpatWebTrekkConfig));
        }

        // initial site view event titel is empty
        const title = document.getElementsByTagName('Title')[0].innerText;
        eventHandler.detail.title = eventHandler.detail.title ? eventHandler.detail.title : title;

        const trackingUrl = url
            .replace(/#siteId#/g, siteid)
            .replace(/#cat1#/g, cat1)
            .replace(/#cat2#/g, cat2)
            .replace(/#cat3#/g, cat3)
            .replace(/#cat4#/g, cat4)
            .replace(/#cat5#/g, eventHandler.detail.title)
            .replace(/#page#/g, eventHandler.detail.page);
        // fire and forget
        WebTrekk.trackingImg.src = trackingUrl;
        log(`webTrekk: trackpageview (${eventHandler.detail.page} ${eventHandler.detail.title})`);
    }
    setTimeout(track, 0);

    }
}
