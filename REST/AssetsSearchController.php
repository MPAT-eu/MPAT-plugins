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
namespace MPAT\REST;

/**
 * AssetsSearchController exposes an endpoint to get all registered assets type.
 */

class AssetsSearchController extends \WP_REST_Posts_Controller {

	protected $post_types;
	private $parent_namespace;
	
	public function __construct( $post_types ) {
		parent::__construct("post");

		$array = $post_types;
		
		$this->post_types = array();
		$this->parent_namespace = $this->namespace;
		$this->rest_base = "mpat_assets";
// 		$this->namespace = 'mpat';
				
		foreach ($array as $value){
			$obj = get_post_type_object( $value );

			$this->post_types[$value] = array(
							"post_type" => $value,
							"rest_base" =>  ! empty( $obj->rest_base ) ? $obj->rest_base : $obj->name
					);
		}
	}
	
	
	/**
     * Register the routes for the objects of the controller.
     */
    public function register_routes() {

		register_rest_route( $this->namespace, '/' . $this->rest_base, array(
				
			array(
				'methods'         => \WP_REST_Server::READABLE,
				'callback'        => array( $this, 'get_items' ),
				'permission_callback' => array( $this, 'get_items_permissions_check' ),
				'args'            => $this->get_collection_params(),
				
			),
			'schema' => array($this, 'get_public_item_schema' ) ,
// 			'schema' => $this->get_item_schema_prova(), 
// 				'schema' => $this->get_item_schema(),
			
        ));
    }


    /**
     *
     * @param WP_REST_Request $request Full data about the request.
     * @return WP_Error|bool
     */
    public function get_items_permissions_check( $request ) {
    	
    	$post_type = get_post_type_object( $this->post_type );

    	/*
    	 * TODO fix permissions
    	 */
//     	if ( !isset($post_type->cap->manage_mpat_assets) || ! current_user_can( $post_type->cap->manage_mpat_assets ) ) {
//     		return new \WP_Error( 'rest_forbidden_context', __( 'Sorry, you are not allowed to access the assets library' ), array( 'status' => rest_authorization_required_code() ) );
//     	}
    	
    	return true;
    }

    /**
     * Check if a given request has access to get a specific item
     *
     * @param WP_REST_Request $request Full data about the request.
     * @return WP_Error|bool
     */
    public function get_item_permissions_check( $request ) {
        return $this->get_items_permissions_check( $request );
    }


    /**
     * Get the query params for collections
     *
     * @return array
     */
    public function get_collection_params() {

        return array(
            'page'                   => array(
                'description'        => 'Current page of the collection.',
                'type'               => 'integer',
                'default'            => 1,
                'sanitize_callback'  => 'absint',
            		
            ),
            'per_page'               => array(
                'description'        => 'Maximum number of items to be returned in result set.',
                'type'               => 'integer',
                'default'            => 10,
                'sanitize_callback'  => 'absint',
            ),
            'search'                 => array(
                'description'        => 'Limit results to those matching a string.',
                'type'               => 'string',
                'sanitize_callback'  => 'sanitize_text_field',
            ),
        	'post_type'				=> array(
        		'description'		=> 'asset post type to be returned.',
        		'type'				=> 'string',
        		'default'			=>  implode(",", array_keys($this->post_types)),
        		'sanitize_callback' => function( $param ){
					
					$types = array();
					$types = explode(",", $param);

					return $types;

       			}
        			
        	),
        	'orderby' => array(
        			'description'        => __( 'Sort collection by object attribute.' ),
        			'type'               => 'string',
        			'default'            => 'date',
        			'enum'               => array(
        					'date',
        					'id',
        					'include',
        					'title',
        					'slug',
        			),
        			'validate_callback'  => 'rest_validate_request_arg',
        	)
        );
    }
    
    /**
     * Get a collection of posts.
     *
     * @param WP_REST_Request $request Full details about the request.
     * @return WP_Error|WP_REST_Response
     */
    public function get_items( $request ) {
    	
    	$args                         = array();
    	$args['author__in']           = $request['author'];
    	$args['author__not_in']       = $request['author_exclude'];
    	$args['menu_order']           = $request['menu_order'];
    	$args['offset']               = $request['offset'];
    	$args['order']                = $request['order'];
    	$args['orderby']              = $request['orderby'];
    	$args['paged']                = $request['page'];
    	$args['post__in']             = $request['include'];
    	$args['post__not_in']         = $request['exclude'];
    	$args['posts_per_page']       = $request['per_page'];
    	$args['name']                 = $request['slug'];
    	$args['post_parent__in']      = $request['parent'];
    	$args['post_parent__not_in']  = $request['parent_exclude'];
    	$args['post_status']          = $request['status'];
    	$args['s']                    = $request['search'];
    
    	$args['date_query'] = array();
    	// Set before into date query. Date query must be specified as an array of an array.
    	if ( isset( $request['before'] ) ) {
    		$args['date_query'][0]['before'] = $request['before'];
    	}
    
    	// Set after into date query. Date query must be specified as an array of an array.
    	if ( isset( $request['after'] ) ) {
    		$args['date_query'][0]['after'] = $request['after'];
    	}
    
    	if ( is_array( $request['filter'] ) ) {
    		$args = array_merge( $args, $request['filter'] );
    		unset( $args['filter'] );
    	}
    
    	// Force the post_type argument, since it's not a user input variable.
    	if(	isset ($request['post_type'])){
    		$args['post_type'] = $request['post_type'];
    	
    	}else{
    		$args['post_type'] = array_keys($this->post_types);
    	}
    	
  	
    	/**
    	 * Filter the query arguments for a request.
    	 *
    	 * Enables adding extra arguments or setting defaults for a post
    	 * collection request.
    	 *
    	 * @see https://developer.wordpress.org/reference/classes/wp_user_query/
    	 *
    	 * @param array $args Key value array of query var to query value.
    	 * @param WP_REST_Request $request The request used.
    	 */
   		$args = apply_filters( "rest_mpat_asset_query", $args, $request );
    	$query_args = $this->prepare_items_query( $args, $request );

    	/*
    	 * removed taxonomies filter for multiple post types
    	 */
    
    	$posts_query = new \WP_Query();
    	$query_result = $posts_query->query( $query_args );
 
    
    	$posts = array();
    	foreach ( $query_result as $post ) {
    		if ( ! $this->check_read_permission( $post ) ) {
    			continue;
    		}
    
    		$data = $this->prepare_item_for_response( $post, $request );
    		$posts[] = $this->prepare_response_for_collection( $data );
    	}
    
    	$page = (int) $query_args['paged'];
    	$total_posts = $posts_query->found_posts;
    
    	if ( $total_posts < 1 ) {
    		// Out-of-bounds, run the query again without LIMIT for total count
    		unset( $query_args['paged'] );
    		$count_query = new \WP_Query();
    		$count_query->query( $query_args );
    		$total_posts = $count_query->found_posts;
    	}
    
    	$max_pages = ceil( $total_posts / (int) $query_args['posts_per_page'] );
    
    	$response = rest_ensure_response( $posts );
    	$response->header( 'X-WP-Total', (int) $total_posts );
    	$response->header( 'X-WP-TotalPages', (int) $max_pages );
    
    	$request_params = $request->get_query_params();
    	if ( ! empty( $request_params['filter'] ) ) {
    		// Normalize the pagination params.
    		unset( $request_params['filter']['posts_per_page'] );
    		unset( $request_params['filter']['paged'] );
    	}
    	$base = add_query_arg( $request_params, rest_url( sprintf( '/%s/%s', $this->namespace, $this->rest_base ) ) );
    
    	if ( $page > 1 ) {
    		$prev_page = $page - 1;
    		if ( $prev_page > $max_pages ) {
    			$prev_page = $max_pages;
    		}
    		$prev_link = add_query_arg( 'page', $prev_page, $base );
    		$response->link_header( 'prev', $prev_link );
    	}
    	if ( $max_pages > $page ) {
    		$next_page = $page + 1;
    		$next_link = add_query_arg( 'page', $next_page, $base );
    		$response->link_header( 'next', $next_link );
    	}
    
    	return $response;
    }
    

    protected function prepare_links( $post ) {

    	$link_post_type_key = $post->post_type;
		$link_post_type_value = $this->post_types[$link_post_type_key]['rest_base'];

    	$parent_links = parent::prepare_links($post);

      	$base = sprintf( '/%s/%s', $this->parent_namespace, $link_post_type_value );
    
    	// Entity meta
    	$parent_links['self'] =  array('href' => rest_url( trailingslashit( $base ) . $post->ID ));

      	return $parent_links;

    }
    
    /**
     * Get the Post's schema, conforming to JSON Schema.
     *
     * @return array
     */
	public function get_item_schema() {

		$schema = array(
			'$schema'    => 'http://json-schema.org/draft-04/schema#',
			'title'      => 'asset',
			'type'       => 'object',
			/*
			 * Base properties for every Post.
			 */
			'properties' => array(
				'date'            => array(
					'description' => __( "The date the object was published, in the site's timezone." ),
					'type'        => 'string',
					'format'      => 'date-time',
					'context'     => array( 'view', 'edit', 'embed' ),
				),
				'date_gmt'        => array(
					'description' => __( 'The date the object was published, as GMT.' ),
					'type'        => 'string',
					'format'      => 'date-time',
					'context'     => array( 'view', 'edit' ),
				),
// 				'guid'            => array(
// 					'description' => __( 'The globally unique identifier for the object.' ),
// 					'type'        => 'object',
// 					'context'     => array( 'view', 'edit' ),
// 					'readonly'    => true,
// 					'properties'  => array(
// 						'raw'      => array(
// 							'description' => __( 'GUID for the object, as it exists in the database.' ),
// 							'type'        => 'string',
// 							'context'     => array( 'edit' ),
// 						),
// 						'rendered' => array(
// 							'description' => __( 'GUID for the object, transformed for display.' ),
// 							'type'        => 'string',
// 							'context'     => array( 'view', 'edit' ),
// 						),
// 					),
// 				),
				'id'              => array(
					'description' => __( 'Unique identifier for the object.' ),
					'type'        => 'integer',
					'context'     => array( 'view', 'edit', 'embed' ),
					'readonly'    => true,
				),
				'link'            => array(
					'description' => __( 'URL to the object.' ),
					'type'        => 'string',
					'format'      => 'uri',
					'context'     => array( 'view', 'edit', 'embed' ),
					'readonly'    => true,
				),
				'modified'        => array(
					'description' => __( "The date the object was last modified, in the site's timezone." ),
					'type'        => 'string',
					'format'      => 'date-time',
					'context'     => array( 'view', 'edit' ),
					'readonly'    => true,
				),
				'modified_gmt'    => array(
					'description' => __( 'The date the object was last modified, as GMT.' ),
					'type'        => 'string',
					'format'      => 'date-time',
					'context'     => array( 'view', 'edit' ),
					'readonly'    => true,
				),
				'password'        => array(
					'description' => __( 'A password to protect access to the post.' ),
					'type'        => 'string',
					'context'     => array( 'edit' ),
				),
				'slug'            => array(
					'description' => __( 'An alphanumeric identifier for the object unique to its type.' ),
					'type'        => 'string',
					'context'     => array( 'view', 'edit', 'embed' ),
					'arg_options' => array(
						'sanitize_callback' => 'sanitize_title',
					),
				),
				'status'          => array(
					'description' => __( 'A named status for the object.' ),
					'type'        => 'string',
					'enum'        => array_keys( get_post_stati( array( 'internal' => false ) ) ),
					'context'     => array( 'edit' ),
				),
				'type'            => array(
					'description' => __( 'Type of Post for the object.' ),
					'type'        => 'string',
					'context'     => array( 'view', 'edit', 'embed' ),
					'readonly'    => true,
				),
			),
		);

		$schema['properties']['title'] = array(
			'description' => __( 'The title for the object.' ),
			'type'        => 'object',
			'context'     => array( 'view', 'edit', 'embed' ),
			'properties'  => array(
				'raw' => array(
					'description' => __( 'Title for the object, as it exists in the database.' ),
					'type'        => 'string',
					'context'     => array( 'edit' ),
				),
				'rendered' => array(
					'description' => __( 'HTML title for the object, transformed for display.' ),
					'type'        => 'string',
					'context'     => array( 'view', 'edit', 'embed' ),
				),
			),
		);

		$schema['properties']['content'] = array(
			'description' => __( 'The content for the object.' ),
			'type'        => 'object',
			'context'     => array( 'view', 'edit' ),
			'properties'  => array(
				'raw' => array(
					'description' => __( 'Content for the object, as it exists in the database.' ),
					'type'        => 'string',
					'context'     => array( 'edit' ),
				),
				'rendered' => array(
					'description' => __( 'HTML content for the object, transformed for display.' ),
					'type'        => 'string',
					'context'     => array( 'view', 'edit' ),
				),
			),
		);

		$schema['properties']['author'] = array(
			'description' => __( 'The id for the author of the object.' ),
			'type'        => 'integer',
			'context'     => array( 'view', 'edit', 'embed' ),
		);

		$schema['properties']['excerpt'] = array(
			'description' => __( 'The excerpt for the object.' ),
			'type'        => 'object',
			'context'     => array( 'view', 'edit', 'embed' ),
			'properties'  => array(
				'raw' => array(
					'description' => __( 'Excerpt for the object, as it exists in the database.' ),
					'type'        => 'string',
					'context'     => array( 'edit' ),
				),
				'rendered' => array(
					'description' => __( 'HTML excerpt for the object, transformed for display.' ),
					'type'        => 'string',
					'context'     => array( 'view', 'edit', 'embed' ),
				),
			),
		);

		$schema['properties']['featured_media'] = array(
			'description' => __( 'The id of the featured media for the object.' ),
			'type'        => 'integer',
			'context'     => array( 'view', 'edit' ),
		);


		return $schema;
	}

}