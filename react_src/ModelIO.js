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
 * Jean-Philippe Ruijs (jean-philippe.ruijs@telecom.paristech.fr)
 * Jean-Claude Dufourd (jean-claude.dufourd@telecom.paristech.fr)
 *
 **/
import axios from 'axios';

/*
 * similar to PageIO, but for models
 *
 * Author: JC Dufourd, Telecom ParisTech
 */
export default class ModelIO {

  static needInit = true;
  static loader = null;
  static modelsRestUrl = null;
  static restUrl = null;

  // internal
  static init() {
    ModelIO.modelsRestUrl = `${window.wpApiSettings.root}mpat/v1/model`;
    const pp = 'per_page=100'; // 100 is max limit (default?)
    ModelIO.restUrl = `${ModelIO.modelsRestUrl}`;
    if (ModelIO.modelsRestUrl.indexOf('?') > 0) {
      ModelIO.restUrl = `${ModelIO.modelsRestUrl}&${pp}`;
    } else {
      ModelIO.restUrl = `${ModelIO.modelsRestUrl}?${pp}`;
    }
    axios.defaults.headers.common['X-WP-Nonce'] = window.wpApiSettings.nonce;
    ModelIO.needInit = false;
  }

  // gets the shared object to load pages
  static getCommon() {
    if (ModelIO.loader === null) {
      ModelIO.loader = new ModelIO();
    }
    return ModelIO.loader;
  }

  models = null;
  error = null;

  constructor() {
    if (ModelIO.needInit) {
      ModelIO.init();
    }
  }

  reload(onSuccess, onError) {
    axios
      .get(ModelIO.restUrl, {})
      .then((v) => {
        this.models = v.data;
        if (onSuccess) onSuccess.call(null, v.data);
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

  get(onSuccess, onError) {
    if (this.models) {
      if (onSuccess) onSuccess.call(null, this.models);
    } else if (this.error) {
      if (onError) onError.call(null, this.error);
    } else {
      this.reload(onSuccess, onError);
    }
  }

  put(pageId, updated, onSuccess, onError) { // eslint-disable-line
    axios
      .put(`${ModelIO.modelsRestUrl}/${pageId}`, updated)
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

  remove(pageId, onSuccess, onError) { // eslint-disable-line
    axios
      .delete(`${ModelIO.modelsRestUrl}/${pageId}`)
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

  post(newPage, onSuccess, onError) { // eslint-disable-line
    axios
      .post(ModelIO.modelsRestUrl, newPage)
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
