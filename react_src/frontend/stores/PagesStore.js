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
 * Stefano Miccoli (stefano.miccoli@finconsgroup.com)
 **/
import axios from 'axios';

function pendingPage(id) {
    
  const reqUrl = `${window.wpApiSettings.root}${window.wpApiSettings.versionString}pages/${id}`;
  return axios.get(reqUrl).then(response => new Promise((resolve, reject) => {
    if (response.data && response.data.mpat_content) {
      // data should be data, not meta because data represents all data related to page,
      // while meta represents only information about post meta.
      // added page_url individually for legay compatibility, should be refactored...
      resolve({ 
          id, 
          data: response.data.mpat_content, 
          page_url: response.data.link, 
          page_title: response.data.title.rendered 
      });
      if (response.data.mpat_content.background != undefined) {
        // this way browser preload image and if we are lucky 
        // and TV ram is not full, at next transition we wont neet
        // to wait to load the image because it will be fetched from memory
        let i = new Image();
        i.src = response.data.mpat_content.background;
      }
    } else {
      reject(`could not load page with id: ${id}`);
    }
  }));
}

export default class PagesStore {

  constructor(pageData) {
    const pageId = pageData.id;
    this.history = [pageId];
    // sooner or later we will get rid of the meta/data dilemma...
    pageData.data = pageData.meta;
    this.currentPageInfo = pageData;
    this.pages = {
            pageId: new Promise(r => r(pageData))
    };
  }

  loadPage(pageId) {
      let pageData = {};
    // cache pages to avoid useless ajax calls the next times
    if (this.pages[pageId]) {
        pageData = this.pages[pageId];
        console.log("cached page");
    } else {
        pageData = pendingPage(pageId);
        this.pages[pageId] = pageData;
        console.log("load page");
    }
    console.log(this.pages);
    return pageData;
  }
  
  getPage(pageId) {
      this.history.push(pageId);
      console.log(this.history);
      const page = this.loadPage(pageId);
      page.then((page) => {
          this.currentPageInfo = page;
      });
      return page;
  }
  
  getPrevious() {
      // remove current page from history
      const current = this.history.pop();
      const previous = this.history.pop();
      return (previous) ? this.getPage(previous) : null;
  }
  
  getCurrentPage() {
      return this.currentPageInfo;
  }
}

