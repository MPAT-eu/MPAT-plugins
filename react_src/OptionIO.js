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
 * similar to PageIO, but for options
 *
 * Author: JC Dufourd, Telecom ParisTech
 */
export default class OptionIO {

  static needInit = true;
  static loader = null;
  static optionsRestUrl = null;
  static restUrl = null;

  // internal
  static init() {
    OptionIO.optionsRestUrl = `${window.wpApiSettings.root}mpat/v1/option`;
    const pp = 'per_page=100'; // 100 is max limit (default?)
    OptionIO.restUrl = `${OptionIO.optionsRestUrl}`;
    if (OptionIO.optionsRestUrl.indexOf('?') > 0) {
      OptionIO.restUrl = `${OptionIO.optionsRestUrl}&${pp}`;
    } else {
      OptionIO.restUrl = `${OptionIO.optionsRestUrl}?${pp}`;
    }
    axios.defaults.headers.common['X-WP-Nonce'] = window.wpApiSettings.nonce;
    OptionIO.needInit = false;
  }

  // gets the shared object to load pages
  static getCommon() {
    if (OptionIO.loader === null) {
      OptionIO.loader = new OptionIO();
    }
    return OptionIO.loader;
  }

  options = null;
  error = null;

  constructor() {
    if (OptionIO.needInit) {
      OptionIO.init();
    }
  }

  reload(onSuccess, onError) {
    axios
      .get(OptionIO.restUrl, {})
      .then((v) => {
        this.options = v.data;
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

  getAll(onSuccess, onError) {
    if (this.options) {
      if (onSuccess) onSuccess.call(null, this.options);
    } else if (this.error) {
      if (onError) onError.call(null, this.error);
    } else {
      this.reload(onSuccess, onError);
    }
  }

  get(name, onSuccess, onError) {
    if (this.options) {
      if (onSuccess) onSuccess.call(null, this.options[name]);
    } else if (this.error) {
      if (onError) onError.call(null, this.error);
    } else {
      this.reload(
        (a) => {
          if (a.hasOwnProperty(name)) { // eslint-disable-line
            if (onSuccess) onSuccess.call(null, a[name]);
          } else if (onError) onError.call(null, `unknown option ${name}`);
        },
        onError
      );
    }
  }

  put(optionName, updated, onSuccess, onError) { // eslint-disable-line
    axios
      .put(`${OptionIO.optionsRestUrl}/${optionName}`, updated)
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

  remove(optionName, onSuccess, onError) { // eslint-disable-line
    axios
      .delete(`${OptionIO.optionsRestUrl}/${optionName}`)
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
