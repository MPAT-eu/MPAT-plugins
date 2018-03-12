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
 * Marco Ferrari (marco.ferrari@finconsgroup.com)
 **/
namespace MPAT\ContentManagement;

class PageManagement {

	protected static $MPAT_PUBLISH_LABEL      = 'Scheduled Update';
	protected static $MPAT_PUBLISH_METABOX    = 'Scheduled Update';
	protected static $MPAT_PUBLISH_STATUS     = 'mpat_sc_publish';
	protected static $MPAT_PUBLISH_TEXTDOMAIN = 'mpat-scheduleupdate-td';

	public static function init(){
		// register actions for copy page
		add_action('admin_action_save_as_new_post_draft', function($post_id) { return PageManagement::clone_action($post_id);});
		add_action('admin_notices', function() { return PageManagement::display_error_message(); } );

		// 		register action for schedule update
		add_action( 'save_post', function($post_id, $post) { return PageManagement::save_meta( $post_id, $post ); }, 10, 2 );
		add_action( 'update_post_meta', function($meta_id, $object_id, $meta_key, $_meta_value) { return PageManagement::update_meta( $meta_id, $object_id, $meta_key, $_meta_value ); }, 10, 4 );
		add_action( 'added_post_meta', function($meta_id, $object_id, $meta_key, $_meta_value) { return PageManagement::update_meta( $meta_id, $object_id, $meta_key, $_meta_value ); }, 10, 4 );
		add_action( 'mpat_publish_post', function($post_id) { return PageManagement::cron_publish_post( $post_id ); } );

		add_action( 'wp_ajax_load_pubdate', function() { return PageManagement::load_pubdate(); } );
		add_action( 'init', function() { return PageManagement::setup(); } );
		add_action( 'admin_action_workflow_copy_to_publish', function() { return PageManagement::admin_action_workflow_copy_to_publish(); } );
		add_action( 'admin_action_workflow_publish_now', function() { return PageManagement::admin_action_workflow_publish_now(); } );
		add_action( 'transition_post_status', function($new_status, $old_status, $post) { return PageManagement::prevent_status_change( $new_status, $old_status, $post ); }, 10, 3 );

		add_filter( 'display_post_states', function($states) { return PageManagement::display_post_states( $states ); } );
		add_filter( 'manage_pages_columns',  function($columns) { return PageManagement::manage_pages_columns($columns); });
		add_filter( 'post_row_actions', function($actions, $post) { return PageManagement::pagelayout_row_actions( $actions, $post ); }, 10, 2);
	}


	/**
	 * Initializes MPAT_PUBLISH_LABEL and MPAT_PUBLISH_METABOX with their localized strings.
	 *
	 * This method initializes MPAT_PUBLISH_LABEL and MPAT_PUBLISH_METABOX with their localized
	 * strings and registers the mpat_sc_publish post status.
	 *
	 * @return void
	 */
	public static function setup() {
		self::$MPAT_PUBLISH_LABEL   = __( 'Scheduled Update', self::$MPAT_PUBLISH_TEXTDOMAIN );
		self::$MPAT_PUBLISH_METABOX = __( 'Scheduled Update', self::$MPAT_PUBLISH_TEXTDOMAIN );
		self::register_post_status();

		add_post_type_support( 'page', 'schedule_update' );
        add_post_type_support( 'page', 'clone_page' );
        add_post_type_support( 'page_layout', 'clone_page' );

		$basename = basename($_SERVER['PHP_SELF']);

		if(($basename == "edit.php") && (isset($_GET["post_type"]))){
			$post_type = $_GET["post_type"];

			if(post_type_supports($post_type, "schedule_update")){

				add_action( 'manage_'.$post_type.'_posts_columns', function($columns) { return PageManagement::manage_pages_columns( $columns ); } );
				add_filter( 'manage_'.$post_type.'_posts_custom_column', function($column, $post_id) { return PageManagement::manage_pages_custom_column( $column, $post_id ); }, 10, 2 );
				add_filter( 'page_row_actions', function($actions, $post) { return PageManagement::page_row_actions( $actions, $post ); }, 10, 2 );
			}
			if(post_type_supports($post_type, "clone_page")){
				add_action('admin_footer-edit.php', function() { return PageManagement::create_clone_field_bulk(); });
				add_action('load-edit.php', function() { return PageManagement::clone_bulk_action(); });
                add_filter('page_row_actions', function($actions, $post) { return PageManagement::create_clone_link_row($actions, $post); },10,2);
                add_filter('post_row_actions', function($actions, $post) { return PageManagement::create_clone_link_row($actions, $post); },10,2);
			}
		}
		if(($basename == "post.php") && (isset($_GET["post"]))){
			$type = get_post_type($_GET["post"]);
			if (post_type_supports($type, "schedule_update")) {
				add_action( 'add_meta_boxes', function($post_type, $post) { return PageManagement::add_meta_boxes_page( $post_type, $post ); }, 10, 2 );
			}
			if(post_type_supports($type, "clone_page")){
				add_action('post_submitbox_start', function() { return PageManagement::create_clone_link_in_page();});
			}
		}

	}


	/**
	 * Retreives all currently registered posttypes.
	 *
	 * @access private
	 * @return array Array of all registered post type as objects
	 */
	private static function get_post_types() {
		return get_post_types( array( 'public' => true ), 'objects' );
	}


	/**
	 * Displays a post's publishing date.
	 *
	 * @see get_post_meta
	 * @return void
	 */
	public static function load_pubdate() {
		$stamp = get_post_meta( $_REQUEST['postid'], self::$MPAT_PUBLISH_STATUS . '_pubdate', true );
		if ( $stamp ) {
			$str  = '<div style="margin-left:20px">';
			$str .= self::getPubdate( $stamp );
			$str .= '</div>';
			die($str);
		}
	}

	/**
	 * Registers the post status mpat_sc_publish.
	 *
	 * @see register_post_status
	 * @return void
	 */
	public static function register_post_status() {
		$args = array(
			'label'                     => _x( self::$MPAT_PUBLISH_LABEL, 'Status General Name', 'default' ),
			'public'                    => false,
			'internal'                  => false,
			'publicly_queryable'        => false,
			'protected'                 => true,
			'exclude_from_search'       => true,
			'show_in_admin_all_list'    => false,
			'show_in_admin_status_list' => true,
			'label_count'               => _n_noop( self::$MPAT_PUBLISH_LABEL . ' <span class="count">(%s)</span>', self::$MPAT_PUBLISH_LABEL . ' <span class="count">(%s)</span>', self::$MPAT_PUBLISH_TEXTDOMAIN ),
		);
		register_post_status( self::$MPAT_PUBLISH_STATUS, $args );
	}


	/**
	 * Adds post's state to 'scheduled updates'-posts.
	 *
	 * @param array $states Array of post states
	 * @global $post
	 */
	public static function display_post_states( $states ) {
		global $post;
		$arg = get_query_var('post_status');
		$the_post_types = self::get_post_types();
		// default states for non public posts
		if( !isset($the_post_types[$post->post_type]) ) return $states;
		$type = $the_post_types[$post->post_type];

		if ( $post->post_status == self::$MPAT_PUBLISH_STATUS ) {
			if ($arg != self::$MPAT_PUBLISH_STATUS) {
				$states[] = self::$MPAT_PUBLISH_LABEL;
			}
			$orig = get_post(get_post_meta($post->ID, self::$MPAT_PUBLISH_STATUS . '_original', true));
			array_push($states, __( 'Original', self::$MPAT_PUBLISH_TEXTDOMAIN ).': ' . $orig->post_title);
		}

		return $states;
	}


	public static function pagelayout_row_actions($actions, $post) {
        if ($post->post_type == 'page_layout') {
            // remove the view actions which does not work
            array_pop($actions);
            return $actions;
        }
    }

	/**
	 * Adds links for scheduled updates.
	 *
	 * Adds a link for immediate publishing to all sheduled posts. Adds a link to schedule a change
	 * to all non-scheduled posts.
	 *
	 * Schedule new post can be done starting from an existing scheduled post.
	 * Schedulation is enabled only if it is supported by post type
	 *
	 * @param array $actions Array of available actions added by previous hooks
	 * @oaram post $post the post for which to add actions
	 * @return array Array of available actions for the given post
	 */
	public static function page_row_actions( $actions, $post ) {
		if (!post_type_supports($post->post_type, "schedule_update")) return $actions;

		$action = '?action=workflow_copy_to_publish&post=' . $post->ID;
		$actions['copy_to_publish'] = '<a href="' . admin_url('admin.php' . $action) . '">' . __( 'Create new scheduled update', self::$MPAT_PUBLISH_TEXTDOMAIN ) . '</a>';
		if ( $post->post_status == self::$MPAT_PUBLISH_STATUS ) {
			$action = '?action=workflow_publish_now&post=' . $post->ID;
			$actions['publish_now'] = '<a href="' . admin_url('admin.php' . $action) .'">' . __('Publish Now', self::$MPAT_PUBLISH_TEXTDOMAIN) . '</a>';
		}

		return $actions;
	}


	/**
	 * Adds a column to the pages overview.
	 *
	 * @param array $columns Array of available columns added by previous hooks
	 * @return array Array of available columns
	 */
	public static function manage_pages_columns( $columns ) {

		// column for scheduled update will be added only if there are updates to show
		if (get_query_var("post_status") != self::$MPAT_PUBLISH_STATUS) return $columns;

		$new = array();
		foreach ( $columns as $key => $val ) {
			$new[$key] = $val;
			if ( 'title' == $key ) {
				$new['mpat_publish'] = __( 'Releasedate', self::$MPAT_PUBLISH_TEXTDOMAIN );

			}
		}
		return $new;
	}


	/**
	 * Manages the content of previously added custom columns.
	 *
	 * @see PageManagement::manage_pages_columns()
	 * @param string $column Name of the column
	 * @param int $post_id id of the current post
	 */
	public static function manage_pages_custom_column( $column, $post_id) {
		if ( 'mpat_publish' == $column ) {
			$stamp = get_post_meta($post_id, self::$MPAT_PUBLISH_STATUS . '_pubdate', true);
			if( $stamp ) {
				echo self::getPubdate($stamp);
			}
		}
	}


	/**
	 * Handles the admin action workflow_copy_to_publish.
	 * redirects to post edit screen if successful
	 *
	 * @return void
	 */
	public static function admin_action_workflow_copy_to_publish() {
		$post = get_post( $_REQUEST['post'] );
		$publishing_id = is_a($post, "WP_Post") ? self::create_publishing_post( $post ) : false;
		if ( $publishing_id !== false ) {
			wp_redirect( admin_url( 'post.php?action=edit&post='.$publishing_id ) );
		} else {
			$html  = sprintf( __('Could not schedule %s %s', self::$MPAT_PUBLISH_TEXTDOMAIN ), $post->post_type, '<i>'.htmlspecialchars( $post->post_title ).'</i>' );
			$html .= '<br><br>';
			$html .= '<a href="' . esc_attr( admin_url( 'edit.php?post_type='.$post->post_type ) ) . '">' . __('Back') . '</a>';
			wp_die( $html );
		}
	}

	/**
	 * Handles the admin action workflow_publish_now
	 *
	 * @return void
	 */
	public static function admin_action_workflow_publish_now() {
		$post = get_post( $_REQUEST['post'] );
		self::publish_post( $post->ID );
		wp_redirect( admin_url( 'edit.php?post_type='.$post->post_type ) );
	}


	/**
	 * Adds the 'scheduled update'-metabox to the edit-page screen.
	 *
	 * @param post $post The post being currently edited
	 * @see add_meta_box
	 * @return void
	 */
	public static function add_meta_boxes_page( $post_type, $post ) {

		add_meta_box( 'meta_' . self::$MPAT_PUBLISH_STATUS . "_revisions", __( 'Scheduled revisions', self::$MPAT_PUBLISH_TEXTDOMAIN ),
            function($post) { PageManagement::create_revisions_meta_box( $post ); }, $post_type, 'side' );

		if($post->post_status != self::$MPAT_PUBLISH_STATUS) return;


		$months = array();
		for ( $i=1; $i<=12; $i++ ) {
			$months[] = date_i18n( 'F', strtotime( '2014-'.$i.'-01 00:00:00' ) );
		}
		$days = array();
		for ( $i=23;$i<=29;$i++ ) {
			$days[] = date_i18n( 'D', strtotime( '2014-03-'.$i.' 00:00:00' ) );
		}

		$date = $time = '';
		$dateo = new \DateTime('now', self::get_timezone_object() );

		$time = $dateo->format( 'H:i' );
		$date = $dateo->format( 'd.m.Y' );

		$js_data = array(
			'datepicker' => array(
				'daynames'   => $days,
				'monthnames' => $months,
				'elementid' => self::$MPAT_PUBLISH_STATUS . '_pubdate',
				'time' => $time,
				'date' => $date,
				),
			'text' => array(
				'save' => __( 'Save' ),
			),
		);

		wp_enqueue_script( 'jquery-ui-datepicker' );
		wp_enqueue_style(  'jquery-ui-blitzer', plugins_url( 'css/jquery-ui-datepicker.min.css', __DIR__) );

		wp_enqueue_script(  'publish-datepicker.js', plugins_url( 'ContentManagement/publish-datepicker.js', __DIR__), array( 'jquery-ui-datepicker' ) );
		wp_localize_script( 'publish-datepicker.js' , 'PageManagement', $js_data );

		add_meta_box( 'meta_' . self::$MPAT_PUBLISH_STATUS, self::$MPAT_PUBLISH_METABOX,
            function($post) { PageManagement::create_meta_box( $post ); }, $post_type, 'side' );
	}

	/**
	 * Creates the HTML-Code for the 'scheduled update'-metabox
	 *
	 * @param post $post The post being currently edited
	 * @return void
	 */
	public static function create_meta_box( $post ) {
		wp_nonce_field( basename( __FILE__ ), self::$MPAT_PUBLISH_STATUS . '_nonce' );
		$metaname = self::$MPAT_PUBLISH_STATUS . '_pubdate';
		$stamp = get_post_meta( $post->ID, $metaname, true );
		$date = $time = '';
		$dateo = new \DateTime('now', self::get_timezone_object() );
		if ( $stamp ) {
			$dateo->setTimestamp( $stamp );
		}
		$time = $dateo->format( 'H:i' );
		$date = $dateo->format( 'd.m.Y' );

		?>
			<p>
				<strong><?php _e( 'Releasedate', self::$MPAT_PUBLISH_TEXTDOMAIN ); ?></strong>
			</p>
			<label class="screen-reader-text" for="<?php echo $metaname; ?>"><?php _e( 'Releasedate', self::$MPAT_PUBLISH_TEXTDOMAIN ); ?></label>
			<input type="text" class="widefat" name="<?php echo $metaname; ?>" id="<?php echo $metaname; ?>" value="<?php echo $date; ?>"/>
			<p>
				<strong><?php _e( 'Time', self::$MPAT_PUBLISH_TEXTDOMAIN ); ?></strong>
			</p>
			<label class="screen-reader-text" for="<?php echo $metaname; ?>_time"><?php _e( 'Time', self::$MPAT_PUBLISH_TEXTDOMAIN ); ?></label>
			<select name="<?php echo $metaname; ?>_time_hrs" id="<?php echo $metaname; ?>_time">
				<?php for ($i = 0; $i < 24; $i++ ) : ?>
				<option value="<?php echo sprintf( '%02d', $i ); ?>" <?php echo $i == $dateo->format( 'H' ) ? 'selected' : ''; ?>><?php echo sprintf( '%02d', $i ); ?></option>
				<?php endfor; ?>
			</select>:
			<select name="<?php echo $metaname; ?>_time_mins" id="<?php echo $metaname; ?>_time_mins">
				<?php for ($i = 0; $i < 60; $i+=5 ) : ?>
				<option value="<?php echo sprintf( '%02d', $i ); ?>" <?php echo $i == ceil( $dateo->format( 'i' ) / 5 ) * 5 ? 'selected' : ''; ?>><?php echo sprintf( '%02d', $i ); ?></option>
				<?php endfor; ?>
			</select>
			<p>
				<?php echo sprintf( __( 'Please enter <i>Time</i> as %s', self::$MPAT_PUBLISH_TEXTDOMAIN ), self::get_timezone_string() ); ?>
			</p>
			<p>
				<div id="<?php echo self::$MPAT_PUBLISH_STATUS ?>_pastmsg" style="color:red; display:none;"><?php echo __( 'The Releasedate is in the past, this post will be published 5 Minutes from now.', self::$MPAT_PUBLISH_TEXTDOMAIN ); ?></div>
			</p>
		<?php
	}

	/**
	 * Creates the HTML-Code for the 'scheduled revisions'-metabox
	 *
	 * @param post $post The post being currently edited
	 * @return void
	 */
	public static function create_revisions_meta_box( $post ) {
		$metaname = self::$MPAT_PUBLISH_STATUS . '_pubdate';
		$copy_to_publish = admin_url('admin.php?action=workflow_copy_to_publish&post=' . $post->ID);
		if ($post->post_status == self::$MPAT_PUBLISH_STATUS) { // scheduled update
			$original_id = get_post_meta( $post->ID, self::$MPAT_PUBLISH_STATUS . "_original", true);
		} else {
			$original_id = $post->ID;
		}

		$is_new_sc_draft = false;

		$scheduled_updates = new \WP_Query(array(
				"post_type" => $post->post_type,
				"posts_per_page" => -1,
				"post_status" => self::$MPAT_PUBLISH_STATUS,
				'meta_query' => array(
						array(
							'key'   => self::$MPAT_PUBLISH_STATUS . "_original",
							'value' => $original_id,
						)
				),
				"meta_key" => $metaname,
				"orderby" => "meta_value_num",
				"order" => "ASC"
		));

		$scheduled_revisions = array();
		$scheduled_revisions[] = array(
				"post_id" => $original_id,
				"label" => __( 'Original revision', self::$MPAT_PUBLISH_TEXTDOMAIN ),
				"url" => admin_url( "post.php?action=edit&post=" . $original_id )
		);

		if ($scheduled_updates->have_posts()) {
			foreach ($scheduled_updates->posts as $scheduled_update) {

				$stamp = get_post_meta($scheduled_update->ID, self::$MPAT_PUBLISH_STATUS . '_pubdate', true);
				$date = new \DateTime( 'now', self::get_timezone_object() );
				$date->setTimestamp( $stamp );

				$scheduled_revisions[] = array(
						"post_id" => $scheduled_update->ID,
						"label" => $date->format("d/m/Y H:i"),
						"url" => admin_url( "post.php?action=edit&post=" . $scheduled_update->ID )
				);
			}
		}
		$not_scheduled_updates = new \WP_Query(array(
				"post_type" => $post->post_type,
				"posts_per_page" => -1,
				"post_status" => self::$MPAT_PUBLISH_STATUS,
				"meta_query" => array(
						array(
							'key' => $metaname,
							'compare' => 'NOT EXISTS'
						),
						array(
							'key'   => self::$MPAT_PUBLISH_STATUS . "_original",
							'value' => $original_id,
						)
				),
				"order" => "ASC"
		));

        //add to list the drafts with status mpat_sc_publish which does not have a publication date.
        if ($not_scheduled_updates->have_posts()) {
            foreach ($not_scheduled_updates->posts as $not_scheduled_update) {
                if ($not_scheduled_update->ID == $post->ID)
                    $is_new_sc_draft = true;

                $scheduled_revisions[] = array(
                    "post_id" => $not_scheduled_update->ID,
                    "label" => ($not_scheduled_update->ID == $post->ID) ? __( 'Current draft revision', self::$MPAT_PUBLISH_TEXTDOMAIN ) : __( 'Unscheduled draft revision '.$not_scheduled_update->ID, self::$MPAT_PUBLISH_TEXTDOMAIN ),
                    "url" => admin_url( "post.php?action=edit&post=" . $not_scheduled_update->ID )
                );
            }
        }
        if ($is_new_sc_draft) {
            echo "<script>PageManagement = PageManagement || {}; PageManagement.new_sc_draft = true; </script>\n";
        }
        ?>
        <p>
            <strong><a href="<?php echo $copy_to_publish ?>"><?php _e( 'Create new scheduled update', self::$MPAT_PUBLISH_TEXTDOMAIN ); ?></a></strong>
        </p>
        <?php /* ?>
		<p>
			<strong><?php _e( 'Scheduled revisions', self::$MPAT_PUBLISH_TEXTDOMAIN ); ?></strong>
		</p>
		<?php */ ?>
        <?php if ($scheduled_revisions) : ?>
            <ul style="padding-left: 20px; list-style-type:disc;">
                <?php foreach ($scheduled_revisions as $scheduled_revision): ?>
                    <li data-post-id="<?php echo $scheduled_revision["post_id"] ?>">
                        <?php if ($scheduled_revision["post_id"] == $post->ID) : ?>
                            <strong><?php echo $scheduled_revision["label"] ?></strong>
                        <?php else: ?>
                            <a href="<?php echo $scheduled_revision["url"] ?>"><?php echo $scheduled_revision["label"] ?></a>&nbsp;
                            <a href="<?php echo wp_nonce_url( "post.php?action=trash&amp;post=" . $scheduled_revision["post_id"],
                                'trash-post_' . $scheduled_revision["post_id"] )?>">(Trash <?php echo $scheduled_revision["post_id"] ?>)</a>
                        <?php endif; ?>
                    </li>
                <?php endforeach; ?>
            </ul>
            <i><?php echo __( self::get_timezone_string().' timezone', self::$MPAT_PUBLISH_TEXTDOMAIN )?></i>
        <?php endif; ?>
		<?php
	}


	/**
	 * Gets the currently set timezone..
	 *
	 * Retreives either the timezone_string or the gmt_offset.
	 *
	 * @see get_option
	 * @access private
	 * @return string The set timezone
	 */
	private static function get_timezone_string() {
		$current_offset = get_option( 'gmt_offset' );
		$tzstring = get_option( 'timezone_string' );

		$check_zone_info = true;

		// Remove old Etc mappings. Fallback to gmt_offset.
		if ( false !== strpos( $tzstring, 'Etc/GMT' ) ) {
			$tzstring = '';
		}

		if ( empty( $tzstring ) ) { // Create a UTC+- zone if no timezone string exists
			$check_zone_info = false;
			if ( 0 == $current_offset )
				$tzstring = 'UTC+0';
			elseif ( $current_offset < 0 )
				$tzstring = 'UTC' . $current_offset;
			else
				$tzstring = 'UTC+' . $current_offset;
		}

		return $tzstring;
	}

	/**
	 * Creates a timezone object based on the option gmt_offset
	 *
	 * @see DateTimeZone
	 * @return DateTimeZone timezone specified by the gmt_offset option
	 */
	private static function get_timezone_object() {
		$offset = get_option( 'gmt_offset' ) * 3600;
		$ids = \DateTimeZone::listIdentifiers();
		foreach ( $ids as $timezone ) {
			$tzo = new \DateTimeZone( $timezone );
			$dt = new \DateTime( 'now', $tzo );
			if ( $tzo->getOffset( $dt ) == $offset ) {
				return $tzo;
			}
		}
	}

	/**
	 * Prevents scheduled updates to switch to other post states.
	 *
	 * Prevents post with the state 'scheduled update' to switch to published after being saved
	 * clears cron hook if post is trashed
	 * restores cron hook if post us un-trashed
	 *
	 * @param string $new_status the post's new status
	 * @param string $old_status the post's old status
	 * @param post $post the post changing status
	 * @return void
	 */
	public static function prevent_status_change ( $new_status, $old_status, $post ) {
		if ($new_status === $old_status && $new_status == self::$MPAT_PUBLISH_STATUS) return;

		if ( $old_status == self::$MPAT_PUBLISH_STATUS && 'trash' != $new_status ) {
			remove_action( 'save_post', function($post_id, $post) { return PageManagement::save_meta( $post_id, $post ); }, 10 );

			$post->post_status = self::$MPAT_PUBLISH_STATUS;
			$u = wp_update_post( $post, true );

			add_action( 'save_post', function($post_id, $post) { return PageManagement::save_meta( $post_id, $post ); }, 10, 2 );
		} elseif ( 'trash' == $new_status ) {
			wp_clear_scheduled_hook( 'mpat_publish_post', array( 'ID' => $post->ID ) );
		} elseif ( 'trash' == $old_status && $new_status == self::$MPAT_PUBLISH_STATUS ) {
			wp_schedule_single_event( get_post_meta( $post->ID, self::$MPAT_PUBLISH_STATUS.'_pubdate', true ), 'mpat_publish_post', array( 'ID' => $post->ID ) );
		}
	}

	/**
	 * Copies an entire post and sets it's status to 'scheduled update'
	 *
	 * @param post $post the post to be copied
	 * @return int - ID of the newly created post
	 */
	public static function create_publishing_post( $post ) {

		//create a scheduled revision starting from a post. All post values will be preserved and copied in the new scheduled revision.
		if ($post->post_status == self::$MPAT_PUBLISH_STATUS ) {
			$original_id = get_post_meta( $post->ID, self::$MPAT_PUBLISH_STATUS.'_original', true );
		}
		else {
			$original_id = $post->ID;
		}

		if (!$original_id) return false;

		$new_author = wp_get_current_user();

		//create the new post
		$new_post = array(
			'menu_order'     => $post->menu_order,
			'comment_status' => $post->comment_status,
			'ping_status'    => $post->ping_status,
			'post_author'    => $new_author->ID,
			'post_content'   => $post->post_content,
			'post_excerpt'   => $post->post_excerpt,
			'post_mime_type' => $post->mime_type,
			'post_password'  => $post->post_password,
			'post_status'    => self::$MPAT_PUBLISH_STATUS,
			'post_title'     => $post->post_title,
			'post_type'      => $post->post_type,
		);

		//insert the new post
		$new_post_id = wp_insert_post( $new_post );

		//get post meta from which create new scheduled revision.
		//$post may be a published or a scheduled revision.
		$meta_keys = get_post_custom_keys( $post->ID ); //now for copying the metadata to the new post

		//if new post is a scheduled revision created by an existing scheduled revision, schedule meta won't be copied in order to prevent a duplication

		$pos = array_search(self::$MPAT_PUBLISH_STATUS . '_original', $meta_keys);
		if ($pos !== false) unset($meta_keys[$pos]);
		$pos = array_search(self::$MPAT_PUBLISH_STATUS . '_pubdate', $meta_keys);
		if ($pos !== false) unset($meta_keys[$pos]);

		foreach ( $meta_keys as $key ) {
			$meta_values = get_post_custom_values( $key, $post->ID );
			foreach ( $meta_values as $value ) {
				$value = maybe_unserialize( $value );
// 				$value = wp_slash($value);		/* mpat-360 */
				add_post_meta( $new_post_id, $key, $value );
			}
		}
		add_post_meta( $new_post_id, self::$MPAT_PUBLISH_STATUS . '_original', $original_id );//and finally referencing the original post

		return $new_post_id;
	}

	/**
	 * copies meta and terms from one post to another
	 * @param int $source_post_id the post from which to copy
	 * @param int $destination_post_id the post which will get the meta and terms
	 * @return void
	 */
	public static function copy_meta_and_terms( $source_post_id, $destination_post_id ) {

		$source_post = get_post( $source_post_id );
		$destination_post = get_post( $destination_post_id );

		//abort if any of the ids is not a post
		if( !$source_post || !$destination_post ) return;

		/* remove all meta from the destination,
		 * initialize to emptyarray if not set to prevent error in foreach loop
		 */
		$dest_keys = get_post_custom_keys( $destination_post->ID ) ?: array();
		foreach( $dest_keys as $key ) {
			delete_post_meta( $destination_post->ID, $key );
		}

		//now for copying the metadata to the new post
		$meta_keys = get_post_custom_keys( $source_post->ID ) ?: array();
		foreach ( $meta_keys as $key ) {
			$meta_values = get_post_custom_values( $key, $source_post->ID );
			foreach ( $meta_values as $value ) {
				$value = maybe_unserialize( $value );
				add_post_meta( $destination_post->ID, $key, $value );
			}
		}


		//and now for copying the terms
		$taxonomies = get_object_taxonomies( $source_post->post_type );
		foreach( $taxonomies as $taxonomy ) {
			$post_terms = wp_get_object_terms( $source_post->ID, $taxonomy, array( 'orderby' => 'term_order' ) );
			$terms = array();
			foreach( $post_terms as $term ) {
				$terms[] = $term->slug;
			}
			//reset taxonomy to empty
			wp_set_object_terms( $destination_post->ID, NULL, $taxonomy );
			//then add new terms
			$what = wp_set_object_terms( $destination_post->ID, $terms, $taxonomy );
		}

	}


	/**
	 * Saves a post's publishing date.
	 *
	 * @param int $post_id the post's id
	 * @param post $post the post being saved
	 * @return void
	 */
	public static function save_meta( $post_id, $post )
	{
		if ( $post->post_status == self::$MPAT_PUBLISH_STATUS || get_post_meta($post_id, self::$MPAT_PUBLISH_STATUS . '_original', true) ) {
			$nonce = PageManagement::$MPAT_PUBLISH_STATUS . '_nonce';
			$pub = PageManagement::$MPAT_PUBLISH_STATUS . '_pubdate';

			if (isset( $_POST[$nonce] ) && wp_verify_nonce( $_POST[$nonce], basename( __FILE__ ) !== 1 ) ) return $post_id;
			if ( ! current_user_can( get_post_type_object( $post->post_type )->cap->edit_post, $post_id ) ) return $post_id;

			if ( isset( $_POST[$pub] ) && isset( $_POST[$pub.'_time_hrs'] ) && isset( $_POST[$pub.'_time_mins'] ) && ! empty( $_POST[$pub] ) ) {
				$tz = self::get_timezone_object();
				$stamp = \DateTime::createFromFormat('d.m.Y H:i', $_POST[$pub] . ' ' . $_POST[$pub.'_time_hrs'] . ':' . $_POST[$pub.'_time_mins'], $tz )->getTimestamp();
				if ( ! $stamp || $stamp <= time())
					$stamp = strtotime('+5 minutes');

				wp_clear_scheduled_hook( 'mpat_publish_post', array( 'ID' => $post_id ) );
				update_post_meta( $post_id, $pub, $stamp );
				wp_schedule_single_event( $stamp, 'mpat_publish_post', array('ID' => $post_id) );
			}
		}
	}

	/**
	 * Saves a post publishing date and schedule event when its meta is set elsewhere (by the rest api for example)
	 */
	public static function update_meta($meta_id, $post_id, $meta_key, $_meta_value) {

		if ($meta_key != self::$MPAT_PUBLISH_STATUS . '_pubdate')
			return;

		$post = get_post($post_id);

		if ( $post->post_status == self::$MPAT_PUBLISH_STATUS || get_post_meta($post_id, self::$MPAT_PUBLISH_STATUS . '_original', true) ) {

			if ( ! current_user_can( get_post_type_object( $post->post_type )->cap->edit_post, $post_id ) ) return $post_id;

			$stamp = get_post_meta( $post_id, self::$MPAT_PUBLISH_STATUS . '_pubdate', true );

			if ($stamp) {

				wp_clear_scheduled_hook( 'mpat_publish_post', array( 'ID' => $post_id ) );
				$ret = wp_schedule_single_event( $stamp, 'mpat_publish_post', array('ID' => $post_id) );

			}

		}

	}

	/**
	 * Publishes a scheduled update
	 *
	 * Copies the original post's contents and meta into it's "scheduled update" and then deletes
	 * the original post. This function is either called by wp_cron or if the user hits the
	 * 'publish now' action
	 *
	 * @param int $post_id the post's id
	 * @return int the original post's id
	 */
	public static function publish_post( $post_id ) {

		$orig_id = get_post_meta( $post_id, self::$MPAT_PUBLISH_STATUS . '_original', true );
		//break early if given post is not an actual scheduled post created by this plugin
		if( !$orig_id ) {
			return $post_id;
		}

		$orig = get_post( $orig_id );

		$post = get_post( $post_id );

		self::copy_meta_and_terms( $post->ID, $orig->ID );

		$post->ID = $orig->ID;
		$post->post_name = $orig->post_name;
		$post->guid = $orig->guid;
		$post->post_parent = $orig->post_parent;
		$post->post_status = $orig->post_status;
		$post_date = date_i18n( 'Y-m-d H:i:s' );
		$post->post_date = $post_date; //we need this to get wp to recognize this as a newly updated post
		$post->post_date_gmt = get_gmt_from_date($post_date);

		delete_post_meta( $orig->ID, self::$MPAT_PUBLISH_STATUS . '_original' );
		delete_post_meta( $orig->ID, self::$MPAT_PUBLISH_STATUS . '_pubdate' );

		wp_update_post( $post );
		wp_delete_post( $post_id, true );

		return $orig->ID;
	}

	/**
	 * Wrapper function for cron automated publishing
	 * disables the kses filters before and reenables them after the post has been published
	 *
	 * @param int $post_id the post's id
	 * @return void
	 */
	public static function cron_publish_post( $post_id ) {
		kses_remove_filters();
		self::publish_post( $post_id );
		kses_init_filters();
	}


	/**
	 * Reformats a timestamp into human readable publishing date and time
	 *
	 * @param int $stamp unix timestamp to be formatted
	 * @see date_i18n, DateTime, PageManagement::get_timezone_object
	 * @return string the formatted timestamp
	 */
	public static function getPubdate( $stamp ) {
		$date = new \DateTime( 'now', self::get_timezone_object() );
		$date->setTimestamp( $stamp );
		$str = $date->format( 'd' ) . date_i18n( ' F Y', mktime( 0, 0, 0, $date->format( 'm' ) ) ) . ' - ' . $date->format( 'H:i \U\T\CO' );
		return $str;
	}

	/***************** clone section ********************/


	/**
	 * Add the clone Bulk Action to the select menus
	 */
	public static function create_clone_field_bulk() {
		// bulk action must be available only in pages list
		if ($_GET['post_type'] === 'page' || $_GET['post_type'] === 'page_layout'){

			?>	<script type="text/javascript">
						jQuery(document).ready(function() {
								jQuery('<option>').val('<?php echo 'clone_bulk_action' ?>').text('<?php echo 'Clone' ?>').appendTo("select[name='action']");
								jQuery('<option>').val('<?php echo 'clone_bulk_action' ?>').text('<?php echo 'Clone' ?>').appendTo("select[name='action2']");
						});
					</script>
				<?php
			}
	}

	/**
	 * Handle the clone Bulk Action to copy multiple pages
	 */
	public static function clone_bulk_action() {
		$success = array();
		$error = array();
		$result = array();
		$wp_list_table = _get_list_table('WP_Posts_List_Table');
		$action = $wp_list_table->current_action();
		if($action == "clone_bulk_action"){
			$post_ids = $_GET['post'];
			if (isset($post_ids) && $post_ids!=null) {
				foreach ($post_ids as $post_id){
					$new_post_id = self::clone_page($post_id);

					if($post_id !== null && is_numeric($new_post_id) && $new_post_id > '1'){
						$success[] = $new_post_id;
					}
					else{
						$error[] = $post_id;
					}
				}
			}
			$result['success'] = $success;
			$result['error'] = $error;
			$user_id = get_current_user_id();
			set_transient($user_id.'_mpat_clone_page', $result, 5*60);
		}

		wp_redirect(admin_url( "edit.php?post_type=page"));
		return;
	}

	/**
	 * Add the link to action list for post_row_actions
	 */
	public static function create_clone_link_row($actions, $post) {

		$link = admin_url( "admin.php?action=save_as_new_post_draft&amp;post=".$post->ID  );
		$actions['clone'] = '<a href="'.$link.'" title="'
				. esc_attr(__('Clone this item', 'mpat')). '">' .  __('Clone', 'mpat') . '</a>';

		return $actions;
	}


	/**
	 * Add a button in the post/page edit screen to create a clone
	 */
	public static function create_clone_link_in_page() {
		if ( isset( $_GET['post'] )){
			$id = $_GET['post'];

			$link = admin_url( "admin.php?action=save_as_new_post_draft&amp;post=".$id  );
			?>
				<div id="duplicate-action">
					<a class="submitduplicate duplication"
						href="<?php echo $link ?>"><?php _e('Copy to a new draft', 'mpat'); ?>
					</a>
				</div>
		    <?php
		}
	}

	public static function clone_action($post_id){
		if($post_id == null){
			$post_id = ($_GET['post']);
		}

		$success = array();
		$error = array();
		$result = array();
		$new_post_id = self::clone_page($post_id);

		if(is_numeric($new_post_id) && $post_id !== null && $new_post_id > '1'){
			$success[] = $new_post_id;
		}else{
			$error[] = $post_id;
		}
		$result['success'] = $success;
		$result['error'] = $error;
		$user_id = get_current_user_id();
		set_transient($user_id.'_mpat_clone_page', $result, 5*60);
		wp_redirect(wp_get_referer());
	}

	/**
	 * Create a duplicate from a post
	 */
	public static function clone_page($post_id = null) {

		if($post_id == null){
			$post_id = ($_GET['post']);
		}

		$args = get_post($post_id, ARRAY_A);

		$args['post_status'] = 'draft';
		unset($args['ID']);
		$new_post_id = wp_insert_post($args);

		update_post_meta($new_post_id, '_mpat_original', $post_id);

		$post_meta = get_post_custom_keys( $post_id );
		if(!empty($post_meta) && $post_meta != null){

			$meta_keys = get_post_custom_keys( $post_id ); //now for copying the metadata to the new post
			foreach ( $meta_keys as $key ) {
				$meta_values = get_post_custom_values( $key, $post_id );
				foreach ( $meta_values as $value ) {
					$value = maybe_unserialize( $value );
// 					$value = wp_slash($value);		/* mpat-360 */
					add_post_meta( $new_post_id, $key, $value );
				}
			}
		}else{
			wp_redirect(admin_url( "edit.php?post_type=page"));
		}
		return $new_post_id;
	}


	public static function display_error_message() {

		$screen = get_current_screen();
		if( 'page' == $screen->post_type && ('edit' == $screen->base || 'post' == $screen->base )){
			$user_id = get_current_user_id();
			$transient = get_transient($user_id.'_mpat_clone_page');

			if(empty($transient)){
				return;
			}
			//no pages selected
			elseif(empty($transient['success']) and empty($transient['error'])){
				?>
				<div class="error notice">
				    <p><?php _e( 'No pages selected!', 'mpat' ); ?></p>
				</div>
				<?php
			}
			//bulk or single page selection
			else{

				//if errors in page cloning
				if(!empty($transient['error'])){
					$page = count($transient['error']) > 1 ? 'pages' : 'page';
					?>
					<div class="error notice">
					    <p><?php _e( 'Error cloning '.$page.': ', 'mpat' );
					    foreach($transient['error'] as $post_id){
					    	$link = admin_url( "post.php?post=".$post_id."&action=edit" );
					    	?><a href=<?php echo $link ?>><?php echo $post_id?></a>&nbsp<?php
					    }
					    ?></p>
					</div>
					<?php
				}

				//if success in page cloning
				if(!empty($transient['success'])){
					$page = count($transient['success']) > 1 ? 'Pages' : 'Page';
					?>
					<div class="updated notice">
					    <p><?php _e( $page.' successfully cloned! New '.$page.': ', 'mpat' );
					    foreach($transient['success'] as $post_id){
					    	$link = admin_url( "post.php?post=".$post_id."&action=edit" );

					    	?><a href=<?php echo $link ?>><?php echo $post_id?></a>&nbsp<?php
					    }
					    ?></p>
					</div>
					<?php
				}
			}

			delete_transient($user_id.'_mpat_clone_page');
		}
	}
}
