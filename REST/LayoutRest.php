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
 *
 * AUTHORS:
 * Jean-Claude Dufourd (jean-claude.dufourd@telecom-paristech.fr
 * Jean-Philippe Ruijs (github.com/jeanphilipperuijs)
 * Marco Ferrari (marco.ferrari@finconsgroup.com)
 **/
namespace MPAT\REST;

use WP_Error;
use WP_REST_Request;
use WP_REST_Response;
use WP_REST_Server;
use WP_REST_Controller;

class LayoutRest extends \WP_REST_Controller {

  /**
   * Register the routes for the objects of the controller.
   */
  public function register_routes() {
    $version = '1';
    $namespace = 'mpat/v' . $version;
    $base = 'layout';
    register_rest_route( $namespace, '/' . $base,
      array(
        array(
          'methods'         => WP_REST_Server::READABLE,
          'callback'        => array( $this, 'get_items' ),
          'permission_callback' => array( $this, 'get_items_permissions_check' ),
          'args'            => array(),
        ),
        array(
          'methods'         => WP_REST_Server::CREATABLE,
          'callback'        => array( $this, 'create_item' ),
          'permission_callback' => array( $this, 'update_item_permissions_check' ),
          'args'            => $this->get_endpoint_args_for_item_schema( true ),
        ),
      )
    );
    register_rest_route( $namespace, '/' . $base . '/(?P<id>[\d]+)',
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
          'args'            => $this->get_endpoint_args_for_item_schema( false ),
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
    $args = array(
      'posts_per_page' => 100,
      'post_type' => 'page_layout',
      'post_status'=> 'publish'
    );
    $myposts = get_posts( $args );
    $items =$myposts; //do a query, call another class, etc
    $data = array();
    foreach ($items as $item) {
      $item->mpat_content = get_post_meta($item->ID, 'mpat_content', true);
      $itemdata = $this->prepare_item_for_response( $item, $request );
      $data[] = $this->prepare_response_for_collection( $itemdata );
    }
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
    $id = $params['id'];
    $args = array(
      'posts_per_page' => 1,
      'ID'=> $id,
      'post_type' => 'page_layout',
      'post_status' => 'publish'
    );
    $item = get_posts( $args );
    // $item is an array of 1
    $it = $item[0];
    // $it is a post object
    $it->mpat_content = get_post_meta($id, 'mpat_content', true);
    $data = $this->prepare_item_for_response( $it, $params );
    if (sizeof($it)>0) {
      return new WP_REST_Response( $data, 200 );
    } else {
      return new WP_Error( 'code', __( 'message', 'text-domain' ) );
    }
  }

  public function create_item($request) {
    $params = $request->get_params();
    $m = $params['mpat_content'];
    $p = $params;
    unset($p['mpat_content']);
    $id = wp_insert_post($p);
    if ($id>0) {
      add_post_meta($id, 'mpat_content', $m);
      return new WP_REST_Response(array('id'=> $id), 200 );
    }
    return new WP_Error( 'cant-create', __( 'message', 'text-domain'), array( 'status' => 500 ) );
  }

  public function update_item($request) {
    $params = $request->get_params();
    $m = $params['mpat_content'];
    $p = $params;
    unset($p['mpat_content']);
    $id = wp_insert_post($p);
    if ($id>0) {
      update_post_meta($id, 'mpat_content', $m);
      return new WP_REST_Response( $id, 200 );
    }
    return new WP_Error( 'cant-update', __( 'message', 'text-domain'), array( 'status' => 500 ) );
  }

  public function delete_item($request) {
    $params = $request->get_params();
    $id = $params['id'];
    if ($id > 0) {
      $deleted = wp_delete_post($id);
      if ($deleted) {
        return new WP_REST_Response( true, 200 );
      }
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
    return current_user_can( 'edit_private_posts' );
  }

  public function delete_item_permissions_check($request)
  {
    return current_user_can( 'delete_private_posts' );
  }

  protected function prepare_item_for_database($request)
  {
    return array($request);
  }

  public function prepare_item_for_response($item, $request)
  {
    return $item;
  }

  public function get_collection_params()
  {
    return array(
      'page'     => array(
        'description'        => 'Current page of the collection.',
        'type'               => 'integer',
        'default'            => 1,
        'sanitize_callback'  => 'absint',
      ),
      'per_page' => array(
        'description'        => 'Maximum number of items to be returned in result set.',
        'type'               => 'integer',
        'default'            => 100,
        'sanitize_callback'  => 'absint',
      ),
      'search'   => array(
        'description'        => 'Limit results to those matching a string.',
        'type'               => 'string',
        'sanitize_callback'  => 'sanitize_text_field',
      ),
    );
  }
}
