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
namespace MPAT\UserRoles;
	
class ApplicationCreator extends Role
{
	public static $slug = "application_creator";
	
	public static $name = "Application Creator";
	
	public static $capabilities = array(

			"read" => true, // access the dashboard

			'create_sites' => true, // define new MPAT apps
			'manage_sites' => true, // list MPAT apps
			'manage_network' => true,
			'manage_network_users' => true,
			
			'list_users' => true,
			'promote_users' => true,
			'remove_users' => true,
			'edit_users' => true,
			'create_users' => true,
			
			"edit_pages" => true, // enable list of pages
			"edit_others_pages" => true, 
			"create_pages" => true, // create new pages
			"delete_pages" => true, // delete own pages
			
    		'manage_post_tags' => true, // list of tags
    		'edit_post_tags' => true, // create and edit of tags
    		'assign_post_tags' => true, // assign tags to post types

			/*
			 * Functions permissions
			 */
			'edit_mpat_functions' => true,
			'publish_mpat_functions' => true,
			'read_private_mpat_functions' => true,
			'delete_mpat_functions' => true,
			'edit_published_mpat_functions' => true,
			'create_mpat_functions' => true,
			
	);
}
