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
 *
 **/
/* eslint-disable */
function rename(obj, src, target) {
	if (obj[src] !== undefined) {
		obj[target] = obj[src];
		delete obj[src];
	}
}
function adaptPost(post) {
	post = post || {};
	post.meta = post.meta || {};
	rename(post.meta, 'layout_id', 'layoutId');
	rename(post.meta, 'default_active', 'defaultActive');
	rename(post.meta, 'components_styles', 'componentStyles');
	const content = post.meta.content;
	if (content) {
		//Rename to camel case
		Object.keys(content).forEach((key) => {
			// If its the old version without states
			const hasStates = Object.keys(content[key]).some(prop => prop.startsWith('_'));
			if (!hasStates) {
				rename(content[key], 'comp_screen', 'compScreen');
				rename(content[key], 'comp_screen_name', 'compScreenName')
				content[key] = {
					_0: content[key]
				}
			}
		});
	}
	return post;
}
/* eslint-enable */
export const post = adaptPost(window.Post);
export const layouts = window.Layouts;
export const application = window.Application;
