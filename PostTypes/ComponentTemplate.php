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
 **/
namespace MPAT\PostTypes;

class ComponentTemplate {

  public function __construct() {
      $this->register_post_type();
  }

  public function register_post_type() {
    // Create the component_template type
    register_post_type( 'component_templates', array(
      'show_ui' => false,
      'show_in_rest' => true,
      'supports' => array('custom-fields', 'title')
    ));

    register_rest_field( 'component_templates',
      'mpat_content',
        array(
           'get_callback'    => array($this, 'api_get_callback'),
           'update_callback' => array($this, 'api_update_callback'),
           'schema'          => null,
        )
    );
  }

  function api_get_callback($object, $field_name, $request) {
    return get_post_meta( $object[ 'id' ], $field_name, true );
  }

  function api_update_callback( $value, $object, $field_name ) {
    return update_post_meta( $object->ID, $field_name, $value );
  }

}
