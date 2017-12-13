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
 * Stefano Miccoli (stefano.miccoli@finconsgroup.com)
 * Marco Ferrari (marco.ferrari@finconsgroup.com)
 **/
namespace MPAT\UserRoles;

class Role {
	public static $slug = "";
	public static $name = "";
	public static $capabilities = array();

    public static function register_user_role() {
        add_role( static::$slug, static::$name, static::$capabilities );
    }

    public static function unregister_user_role() {
        $role = get_role(static::$slug);

        if (is_a($role, "WP_Role")) {
	        foreach ($role->capabilities as $capability) {
	            $role->remove_cap($capability);
	        }

	        remove_role($role->name);
        }
    }


    /**
     * @param array $allcaps All the capabilities of the user
     * @param array $cap     [0] Required capability
     * @param array $args    [0] Requested capability
     *                       [1] User ID
     *                       [2] Associated object ID
     */
    public static function check_user_permissions($allcaps, $required_caps, $args) {

		if ($args[0] == "manage_page_content_editors" && (!isset($allcaps[$args[0]]) || $allcaps[$args[0]] != true)) {
			$post = get_post($args[2]);
			$user_id = $args[1];
			// Author of page can always assign other app creators the grant to edit page
			if ($post->post_author == $user_id) {
				$allcaps["manage_page_content_editors"] = true;
			}
		}

		/*
		 * When editing pages, following MPAT specific rules are applied:
		 * - Capability assigned to user role rules editing of pages with layout ready status (only content have to be added)
		 * - Content editor explicitly specified to a page can edit it when in layout ready status
		 * - Capability assigned to user role rules the editing of pages with layout pending status
		 * - Application creator explicitly specified to a page can edit it when in layout pending status
		 */
		if ($args[0] == "edit_post" || $args[0] == "edit_others_pages") {
				$pt = null;
			//var_dump($args);
			$post = isset($args[2]) ? get_post($args[2]) : null;
			//var_dump($post);
			try{
				if(isset($post->post_type))
					$pt = $post->post_type;
			}
			catch(Exception $e){
			//	var_dump($e);
			}
			$user_id = $args[1];
			if ($pt == 'page') {
	// 				var_dump($required_caps);
	// 				if ($post->post_status == "mpat_layout_ready") {
				$allowed_users = (array)get_post_meta($post->ID, "allowed_content_editors", true);
				if (in_array($user_id, $allowed_users)) {
							// If user is specified we have to ensure that he can edit page
							// even if his role (content editor) doesnt have enough caps
							// TBD, this might be dangerous
	// 						foreach ($required_caps as $required_cap) {
	// 							$allcaps[$required_cap] = true;
	// 						}
						$allcaps["edit_others_pages"] = true;
	// 						$allcaps["edit_published_pages"] = true;
						$allcaps["edit_layout_ready_pages"] = true;
						}
	// 				} elseif ($post->post_status == "mpat_layout_pending") {
	// 					if (isset($allcaps["edit_layout_pending_pages"]) && $allcaps["edit_layout_pending_pages"] == true) {
	// 						$allcaps["edit_pages"] = true;
	// 						$allcaps["edit_others_pages"] = true;
	// 						$allcaps[$args[0]] = true;
	// 					} else {
	// 						$allowed_users = (array)get_post_meta($post->ID, "allowed_application_creators", true);
	// 						if (in_array($user_id, $allowed_users)) {
	// 							$allcaps["edit_pages"] = true;
	// 							$allcaps["edit_others_pages"] = true;
	// 							$allcaps[$args[0]] = true;
	// 						} else {
	// 							// explicitly forbid editing for custom status if not included in above cases
	// 							$allcaps[$args[0]] = false;
	// 						}
	// 					}
	// 				}
			}
		}
    	return $allcaps;
    }

    public static function custom_meta_cap( $caps, $cap, $user_id, $args ) {

    	if ($cap == "edit_post") {

	    	/*
	    	 * User who wants to edit a page in an mpat specific status (see D4.1)
	    	 * hase to be granted to do so with a specific capability
	    	 */
	    	$post = get_post( $args[0] );

	    	if ($post->post_type == 'page') {

	    		if ($post->post_status == "mpat_layout_pending") {

	    			$caps[] = "edit_layout_pending_pages";

	    		} elseif ($post->post_status == "mpat_layout_ready") {

    				$caps[] = "edit_layout_ready_pages";
	    		}
	    	}
    	}
    	return $caps;
    }
    
    /**
     * Overwrite standard mange_options during submission of mpat-specific options, 
     * shown in admin pages with manage_mpat_options cap.
     */
    static function define_custom_settings_cap() {
    	return "manage_mpat_options";
    }
    
    /**
     * Defines menu items in admin bar to manage network sites (MPAT applications) for enabled user roles
     */
    static function admin_bar_menu( $wp_admin_bar ) {

    	// Don't show for logged out users or single site mode.
    	if ( ! is_user_logged_in() || ! is_multisite() )
    		return;

    	// Show only when the users have at least one site, or they're a super admin.
    	if ( count( $wp_admin_bar->user->blogs ) < 1 && is_super_admin() )
    		return;

		if ( $wp_admin_bar->user->active_blog ) {
			$my_sites_url = get_admin_url( $wp_admin_bar->user->active_blog->blog_id, 'my-sites.php' );
		} else {
			$my_sites_url = admin_url( 'my-sites.php' );
		}

		// menu items pasted from wp-includes/admin-bar.php (it works only for superadmin, see at wp_admin_bar_my_sites_menu function)
		if ( current_user_can('manage_sites') ) {
			$wp_admin_bar->add_menu( array(
					'id'    => 'my-sites',
					'title' => __( 'My Sites' ),
					'href'  => $my_sites_url,
			) );

			$wp_admin_bar->add_group( array(
					'parent' => 'my-sites',
					'id'     => 'my-sites-super-admin',
			) );

			$wp_admin_bar->add_menu( array(
					'parent' => 'my-sites-super-admin',
					'id'     => 'network-admin',
					'title'  => __('Network Admin'),
					'href'   => network_admin_url(),
			) );

			$wp_admin_bar->add_menu( array(
					'parent' => 'network-admin',
					'id'     => 'network-admin-d',
					'title'  => __( 'Dashboard' ),
					'href'   => network_admin_url(),
			) );
			$wp_admin_bar->add_menu( array(
					'parent' => 'network-admin',
					'id'     => 'network-admin-s',
					'title'  => __( 'Sites' ),
					'href'   => network_admin_url( 'sites.php' ),
			) );

		}

    }
}
