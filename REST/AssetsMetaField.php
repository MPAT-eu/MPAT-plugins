<?php
/**
 *
 * Copyright (c) 2017 MPAT Consortium , All rights reserved.
 * Fraunhofer FOKUS, Fincons Group, Telecom ParisTech, IRT, Lancaster University, Leadin, RBB, Mediaset
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
 * Marco Ferrari (marco.ferrari@finconsgroup.com)
 **/
namespace MPAT\REST;

class AssetsMetaField extends \WP_REST_Post_Meta_Fields{
	
	protected function get_meta_type() {
		return $this->post_type;
	}
	
	public function get_value( $object_id, $request ) {
		$fields   = $this->get_registered_fields();
		$response = array();
		
		foreach ( $fields as $meta_key => $args ) {
				
			$name = $args['name'];
			$all_values = get_metadata( 'post', $object_id, $meta_key, false );
			if ( $args['single'] ) {
				if ( empty( $all_values ) ) {
					$value = $args['schema']['default'];
				} else {
					$value = $all_values[0];
				}
				$value = $this->prepare_value_for_response( $value, $request, $args );
			} else {
				$value = array();
				foreach ( $all_values as $row ) {
					$value[] = $this->prepare_value_for_response( $row, $request, $args );
				}
			}
	
			$response[ $name ] = $value;
		}
	
		return $response;
	}
}