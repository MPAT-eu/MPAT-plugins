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
 * Jean-Philippe Ruijs (github.com/jeanphilipperuijs)
 *
 **/
/**
 * At prebuild this file is executed to merge all the language other language files with the english version.
 * Al missing values will be added.
 *
 * Merge language opbject and export the results in a file
 *
 * @author Jean-Philippe Ruijs
 */
const Merge2File = require('merge2file');
const de = require('./org/de');
const es = require('./org/es');
const fi = require('./org/fi');
const fr = require('./org/fr');
const it = require('./org/it');
const nl = require('./org/nl');
const en = require('./org/en');
const exppath = __dirname + "/export";
console.log('merging to ' + exppath);

const org = JSON.stringify(en); //FIXME quick fix to simulate immutability

let m = new Merge2File('de', de, JSON.parse(org), exppath);
m.save();

m = new Merge2File('es', es, JSON.parse(org), exppath);
m.save();

m = new Merge2File('fi', fi, JSON.parse(org), exppath);
m.save();

m = new Merge2File('fr', fr, JSON.parse(org), exppath);
m.save();

m = new Merge2File('it', it, JSON.parse(org), exppath);
m.save();

m = new Merge2File('nl', nl, JSON.parse(org), exppath);
m.save();

