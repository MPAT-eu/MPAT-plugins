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
 **/
namespace MPAT\PostTypes;

abstract class AbstractAsset {


	/**
	 * Register the class as an asset in MPAT specifing which post type is associated
	 * @param array $asset_types
	 * @return unknown
	 */
	public static function registerAssetType( $asset_types ) {
	
		$asset_types[static::class] = static::POST_TYPE;
	
		return $asset_types;
	}

	/**
	 * Authorization callback for custom field
	 * @return boolean
	 */
	public static function authorize() {
		// manage with post type permission
		return true;
	}
	
	/**
	 * function called by WP rest API to get requested custom field 
	 * @param unknown $object
	 * @param unknown $field_name
	 * @param unknown $request
	 * @param unknown $object_type
	 * @return mixed|boolean|string|unknown
	 */
	public static function callback_rest_get_field ($object, $field_name, $request, $object_type ) {
	
		return get_post_meta($object["id"], $field_name, true);
	}
	

	/**
	 * function called by WP rest API to persist requested custom field
	 * @param unknown $object
	 * @param unknown $field_name
	 * @param unknown $request
	 * @param unknown $object_type
	 * @return mixed|boolean|string|unknown
	 */
	public static function callback_rest_update_field ( $field, $object, $field_name, $request, $object_type  ){
	
		return update_post_meta($request["id"], $field_name, $request[$field_name] );
	}
}