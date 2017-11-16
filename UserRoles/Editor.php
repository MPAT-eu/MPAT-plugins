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
 * Marco Ferrari (marco.ferrari@finconsgroup.com)
 **/
namespace MPAT\UserRoles;
    
class Editor extends Role  {
    public static $slug = "editor";
    
    public static $name = "Editor";
    
    public static $capabilities = array(
            
	    "edit_pages" => true, // enable list of pages
	    "edit_others_pages" => true,
	    "create_pages" => true, // create new pages
	    "delete_pages" => true, // delete own pages        
    	"manage_mpat_options" => true,
    	"edit_theme_options" => true
    );
    
    public static function grant_capabilities() {
        $role = get_role(self::$slug);
        
        foreach (self::$capabilities as $capability => $value) {
            $role->add_cap($capability, $value);
        }
    }
}