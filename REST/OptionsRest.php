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
 * Jean-Philippe Ruijs (jean-philippe.ruijs@telecom.paristech.fr)
 *
 **/
namespace MPAT\REST;

use WP_Error;
use WP_REST_Request;
use WP_REST_Response;
use WP_REST_Server;
use WP_REST_Controller;

class OptionsRest extends \WP_REST_Controller {

  /**
   * Register the routes for the objects of the controller.
   */
  public function register_routes() {
    $version = '1';
    $namespace = 'mpat/v' . $version;
    $base = 'option';
    register_rest_route( $namespace, '/' . $base,
      array(
        array(
          'methods'         => WP_REST_Server::READABLE,
          'callback'        => array( $this, 'get_items' ),
          'permission_callback' => array( $this, 'get_items_permissions_check' ),
          'args'            => array(),
        )
      )
    );
    // here we choose a name that should never happen as optionName
    register_rest_route( $namespace, '/' . $base . '/(?P<illegalPropName>[\S]+)',
      array(
        array(
          'methods'         => WP_REST_Server::READABLE,
          'callback'        => array( $this, 'get_item' ),
          'permission_callback' => array( $this, 'get_item_permissions_check' ),
          'args'            => array(
            'context'          => array(
              'default'      => 'view',
            ),
          ),
        ),
        array(
          'methods'         => WP_REST_Server::EDITABLE,
          'callback'        => array( $this, 'update_item' ),
          'permission_callback' => array( $this, 'update_item_permissions_check' ),
          'args'            => array(),
        ),
        array(
          'methods'  => WP_REST_Server::DELETABLE,
          'callback' => array( $this, 'delete_item' ),
          'permission_callback' => array( $this, 'delete_item_permissions_check' ),
          'args'     => array(
            'force'    => array(
              'default'      => false,
            ),
          ),
        ),
      )
    );
  }

  /**
   * Get a collection of items
   *
   * @param WP_REST_Request $request Full data about the request.
   * @return WP_Error|WP_REST_Response
   */
  public function get_items($request) {
    $items = wp_load_alloptions();
    foreach ($items as $item => $value) {
      $items[$item] = maybe_unserialize($value);
    }
    $itemdata = $this->prepare_item_for_response( $items, $request );
    $data = $this->prepare_response_for_collection( $itemdata );
    return new WP_REST_Response( $data, 200 );
  }

  /**
   * Get one item from the collection
   *
   * @param WP_REST_Request $request Full data about the request.
   * @return WP_Error|WP_REST_Response
   */
  public function get_item($request) {
    $params = $request->get_params();
    $id = $params['illegalPropName'];
    $item = get_option( $id );
    $data = $this->prepare_item_for_response( $item, $request );
    return new WP_REST_Response( $data, 200 );
  }

  public function update_item($request) {
    $params = $request->get_params();
    $id = $params['illegalPropName'];
    unset($params['illegalPropName']);
    unset($params['1']);
    if (count($params) == 1 && array_key_exists(0, $params)) {
      $res = update_option($id, $params[0]);
    } else {
      $res = update_option($id, $params);
    }
    if ($res) {
      return new WP_REST_Response(array('id'=> $id), 200 );
    }
    return new WP_Error( 'cant-update', __( 'message', 'text-domain'), array( 'status' => 500 ) );
  }

  public function delete_item($request) {
    $params = $request->get_params();
    var_dump($params);
    $id = $params['illegalPropName'];
    $deleted = delete_option($id);
    if ($deleted) {
      return new WP_REST_Response( true, 200 );
    }
    return new WP_Error( 'cant-delete', __( 'message', 'text-domain'), array( 'status' => 500 ) );
  }

  public function get_items_permissions_check($request) {
    return current_user_can( 'read' );
  }

  public function get_item_permissions_check($request) {
    return current_user_can( 'read' );
  }

  public function update_item_permissions_check($request)
  {
    return current_user_can( 'manage_mpat_options' );
  }

  public function delete_item_permissions_check($request)
  {
    return current_user_can( 'manage_mpat_options' );
  }

  protected function prepare_item_for_database($request)
  {
    return array($request);
  }

  public function prepare_item_for_response($item, $request)
  {
    return $item;
  }
}
