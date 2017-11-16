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
 * Jean-Claude Dufourd (jean-claude.dufourd@telecom-paristech.fr
 * Stefano Miccoli (stefano.miccoli@finconsgroup.com)
 **/
/* eslint-disable */
function rename(obj,src,target){
  if (obj[src] !== undefined){
    obj[target] = obj[src];
    delete obj[src];
  }
}
export function adaptPost(post) {
  post = post || {};
  post.meta = post.meta || {};
  rename(post.meta,'layout_id','layoutId');
  rename(post.meta,'default_active','defaultActive');
  rename(post.meta,'components_styles','componentStyles');
  const content = post.meta.content;
  if (content) {
    //Rename to camel case
    Object.keys(content).forEach((key) => {
      // If its the old version without states
      const hasStates = Object.keys(content[key]).some(prop => prop.startsWith('_'));
      if (!hasStates){
        rename(content[key],'comp_screen','compScreen');
        rename(content[key],'comp_screen_name','compScreenName')
        content[key] = {
          _0: content[key]
        }
      }
    });
  }
  return post;
}

export function update() {
  application = window.MPATGlobalInformation;
}

/* eslint-enable */
export let application = window.MPATGlobalInformation;
export const keyset = window.int_keyset;
export const appObject = window.int_app;
