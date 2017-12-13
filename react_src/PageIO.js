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
 * Jean-Claude Dufourd (jean-claude.dufourd@telecom-paristech.fr
 *
 **/
import axios from 'axios';

/*
 * This component loads the page information from within JS using the WP REST API
 * and AJAX
 * This is shared by the components Menu, Clone as well as the Preview window.
 *
 * API:
 * - PageIO.getCommon() gets the shared object
 * - get(success, error) gets pages already loaded or load new ones
 * - put(pageId, newContent, success, error)
 * - post(newContent, onSuccess, onError)
 * - reload(onSuccess, onError) always gets new pages
 *
 * Author: JC Dufourd, Telecom ParisTech
 */
export default class PageIO {

  static needInit = true;
  static loader = null;
  static pagesRestUrl = null;
  static restUrl = null;

  // internal
  static init() {
    PageIO.pagesRestUrl = `${window.wpApiSettings.root}${window.wpApiSettings.versionString}pages`;
    const pp = 'per_page=100'; // 100 is max limit (default?)
    PageIO.restUrl = `${PageIO.pagesRestUrl}`;
    if (PageIO.pagesRestUrl.indexOf('?') > 0) {
      PageIO.restUrl = `${PageIO.pagesRestUrl}&${pp}`;
    } else {
      PageIO.restUrl = `${PageIO.pagesRestUrl}?${pp}`;
    }
    axios.defaults.headers.common['X-WP-Nonce'] = window.wpApiSettings.nonce;
    PageIO.needInit = false;
  }

  // gets the shared object to load pages
  static getCommon() {
    if (PageIO.loader === null) {
      PageIO.loader = new PageIO();
    }
    return PageIO.loader;
  }

  pages = null;
  error = null;

  constructor() {
    if (PageIO.needInit) {
      PageIO.init();
    }
  }

  /*
   * reloads the pages unconditionnaly
   */
  reload(onSuccess, onError) {
    axios
      .get(PageIO.restUrl, {})
      .then((v) => {
        this.pages = v.data;
        onSuccess.call(null, v.data);
      })
      .catch((e) => {
        this.error = e;
        if (onError) onError.call(null, e);
        if (e.response) {
          // The request was made, but the server responded with a status code
          // that falls out of the range of 2xx
          console.log('Error', e.response.status);
          console.log(e.response.data.message);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('Error', e.message);
        }
      });
  }

  /*
   * get is first looking if the pages where already loaded, and only if not calls reload
   */
  get(onSuccess, onError) {
    if (this.pages) {
      if (onSuccess) onSuccess.call(null, this.pages);
    } else if (this.error) {
      if (onError) onError.call(null, this.error);
    } else {
      this.reload(onSuccess, onError);
    }
  }

  // updates an existing page
  put(pageId, updated, onSuccess, onError) { // eslint-disable-line
    axios
      .put(`${PageIO.pagesRestUrl}/${pageId}`, updated)
      .then(onSuccess)
      .catch((e) => {
        if (onError) onError.call(null, e);
        if (e.response) {
          // The request was made, but the server responded with a status code
          // that falls out of the range of 2xx
          console.log('Error', e.response.status);
          console.log(e.response.data.message);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('Error', e.message);
        }
      });
  }

  // updates an existing page
  remove(pageId, onSuccess, onError) { // eslint-disable-line
    axios
      .delete(`${PageIO.pagesRestUrl}/${pageId}`)
      .then(onSuccess)
      .catch((e) => {
        if (onError) onError.call(null, e);
        if (e.response) {
          // The request was made, but the server responded with a status code
          // that falls out of the range of 2xx
          console.log('Error', e.response.status);
          console.log(e.response.data.message);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('Error', e.message);
        }
      });
  }

  // creates a new page (e.g. when cloning)
  post(newPage, onSuccess, onError) { // eslint-disable-line
    axios
      .post(PageIO.pagesRestUrl, newPage)
      .then(onSuccess)
      .catch((e) => {
        if (onError) onError.call(null, e);
        if (e.response) {
          // The request was made, but the server responded with a status code
          // that falls out of the range of 2xx
          console.log('Error', e.response.status);
          console.log(e.response.data.message);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('Error', e.message);
        }
      });
  }
}
