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
 * Jean-Philippe Ruijs (github.com/jeanphilipperuijs)
 */

 /*
 * - various mpat and hbbtv constants
 * - localized strings
 * change log:
 * - migrated static functions to ./backend/utils.js
 */
import i18n from './localization/i18n';

export default (() => ({
  page: {
    grid: { columns: 128, rows: 72 } //page grid size
  },
  tv: {
    resolutions: { // various resolutions, current HbbTV supports 'hdready'.
      uw: { width: 5120, height: 2160, ar: 2.37 },
      dci4k: { width: 4096, height: 2160, ar: 1.90 },
      uhd: { width: 3840, height: 2160, ar: 1.78 },
      fullhd: { width: 1920, height: 1080, ar: 1.78 },
      hdready: { width: 1280, height: 720, ar: 1.78 }
    },
    framerates: [25, 50] // frame rates supported by HbbTV
  },
  timeline: {
    rest: {
      url: `${window.wpApiSettings.root}timeline/v1/scenario`,
      contentType: 'application/x-www-form-urlencoded'
    }
  },
  styleguide: { // mpat style guide css values
    color: {
      hover: { blue: '#59c3f7', green: '#37d1be' },
      normal: { blue: '#59c3f7', green: '#25c1b2' },
      pressed: { blue: '#59c3f7', green: '#00a99d' },
      usable: { disable: '#d0d8dd', enable: '#fff' },
      background: { light: '#f4f4f4', dark: '#2e383d' },
      warning: { text: 'red', background: 'white' }
    },
    typography: {
      font: 'Source Sans Pro',
      color: '#475455',
      h1: { fontWeight: 'light', fontSize: '26pt' },
      h2: { fontWeight: 'light', fontSize: '20pt' },
      h3: { fontWeight: 'regular', fontSize: '126pt' },
      body: { fontWeight: 'light', fontSize: '14pt' },
      buttons: {
        fontWeight: 'light',
        fontSize: '26pt',
        textTransform: 'uppercase',
        width: '44px',
        borderSize: '2px',
        borderRadius: '3px'
      },
      big: { fontWeight: 'light', fontSize: '18pt' },
      small: { fontWeight: 'light', fontSize: '14pt' }
    }
  },
  component: {
    size: {
      width: 100, height: 100
    }
  },
  third_party_url: {
    firehbbtv: 'https://addons.mozilla.org/de/firefox/addon/firehbbtv/'
  },
  locstr: i18n,
}
))();
