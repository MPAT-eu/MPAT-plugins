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
 * React part of MPAT i18n.
 * (Merged) language objects are instantiated and optionally override localization.
 * For transition to wordpress po files.
 */
import LocalizedStrings from 'react-localization';

import en from './merge/org/en';

// if you do not wanto to use the merged files but directly the originals
/*
import de from './org/de';
import es from './org/es';
import fr from './org/fr';
import fi from './org/fi';
import it from './org/it';
import nl from './org/nl';
*/

// use deep merges base upon english generated on `npm prebuild`
import de from './merge/export/de';
import es from './merge/export/es';
import fr from './merge/export/fr';
import fi from './merge/export/fi';
import it from './merge/export/it';
import nl from './merge/export/nl';

const i18n = new LocalizedStrings({
  en: en,
  de: de,
  es: es,
  fi: fi,
  fr: fr,
  it: it,
  nl: nl
});


/**
 * first try to get the 'get_user_locale()' from javascript object  'mpati18n'
 * app_language is prior set by get_option. If not existing it returns get_user_locale() value
*/
try {
  if (mpati18n !== undefined) {
    const v = mpati18n.lang.split("_")[0];
    i18n.setLanguage(v);
    //console.log('set i18n from get_user_locale value',v);
  } else {
    //console.log('mpati18n not defined');
  }
}
catch (err) {
  // console.log(err);
}

/**
 * in case we have an `i18n` querystring, we override the configured value with the this one
 */
try {
  const i = document.location.search.split('i18n=');
  if (i.length > 1) {
    const j = i[1].split('&')[0];
    console.log('Forcing locale to ', j);
    i18n.setLanguage(j);
  }
} catch (err) {
  //console.log(err);
}
module.exports = i18n;
