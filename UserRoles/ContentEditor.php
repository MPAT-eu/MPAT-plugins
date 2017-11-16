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

class ContentEditor extends Role {
	public static $slug = "content_editor";
	
	public static $name = "Content Editor";
	
	public static $capabilities = array(

			"read" => true, // access the dashboard
			
			"edit_pages" => true, // enable list of pages
// 			"edit_others_pages" => true, // this grant is assigned dinamically for ACL
			
			'manage_post_tags' => true, // list of tags
			'edit_post_tags' => true, // create and edit of tags
			'assign_post_tags' => true, // assign tags to post types
	);
}
