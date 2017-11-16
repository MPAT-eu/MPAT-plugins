<?php 
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
 * Stefano Miccoli (stefano.miccoli@finconsgroup.com)
 * Marco Ferrari (marco.ferrari@finconsgroup.com)
 **/
namespace MPAT\Taxonomies;

use MPAT\PostTypes\Page;

class PostTag {
	
	public static $slug = "post_tag";
	
	public function __construct () {
		
		/**
		 * Workaround to let us define CPT caps discerning between create
		 * and edit caps, without the need to grant edit_posts.
		 * wp-admin/includes/menu.php:153 (as for wp4.5.1) remove menu items
		 * when there is only one submenu item and it refer to submenu item.
		 * This is the case of a custom post type when specified user role
		 * can only edit posts and not create them (content editor).
		 * The lack of menu items lead to user_can_access_admin_page function
		 * to return false.
		 * Also, default cap for assigning tax terms to CPT is edit_posts, so
		 * we couldn't be able to add terms to page.
		 * This has the effect that user roles which have only editing cap on a CPT,
		 * cannot access CPT list page.
		 * Specifing custom caps on tags taxonomy we ensure that CPT menu item
		 * has at least 2 submenu items
		 */
		global $wp_taxonomies;
		
		$wp_taxonomies[ self::$slug ]->cap->manage_terms = 'manage_post_tags';
		$wp_taxonomies[ self::$slug ]->cap->edit_terms = 'edit_post_tags';
		$wp_taxonomies[ self::$slug ]->cap->delete_terms = 'delete_post_tags';
		$wp_taxonomies[ self::$slug ]->cap->assign_terms = 'assign_post_tags';
		
		// MPAT doesn't use post, and this remove related menu item for custom roles
		unregister_taxonomy_for_object_type(self::$slug, 'post');
		
		register_taxonomy_for_object_type(self::$slug, 'page');
		
	}
}