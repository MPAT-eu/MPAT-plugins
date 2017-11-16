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
 * Miggi Zwicklbauer (miggi.zwicklbauer@fokus.fraunhofer.de)
 * Thomas Tröllmich  (thomas.troellmich@fokus.fraunhofer.de)
 * Stefano Miccoli (stefano.miccoli@finconsgroup.com)
 * Marco Ferrari (marco.ferrari@finconsgroup.com)
 *
 **/
namespace MPAT;


class AjaxCalls {

    public static function get_page_content(){
        if (isset($_GET['id'])){
            $page_content = \MPAT\get_page_content($_GET['id']);
            if ($page_content){
                wp_send_json_success($page_content);
            } else {
                wp_send_json_error(new \WP_Error("get_page_content", __('cannot get post content', 'mpat')));
            }

        } else {
            wp_send_json_error(new \WP_Error("get_page_content", __('no id provided!', 'mpat')));
        }
    }
    
    /**
     * get updated nonce for image editor related to attachment id
     */
    public static function image_editor_nonce(){
    	if(isset($_GET['id'])){
    		$post_id = $_GET['id'];
    		$nonce = wp_create_nonce("image_editor-$post_id");
    		wp_send_json_success($nonce);
    	}else{
    		wp_send_json_error(new \WP_Error("image_editor_nonce", __('no id provided!', 'mpat')));
    	}
    }
    
    public static function insert_image_from_url(){
    	if(isset($_GET['url'])){
    	$filename = basename($_GET['url']);
    	$uploaddir = wp_upload_dir();
    	$uploadfile = $uploaddir['path'] . '/' . $filename;
    	$contents= file_get_contents($_GET['url']);
    	$savefile = fopen($uploadfile, 'w');
    	fwrite($savefile, $contents);
    	fclose($savefile);
    	
    	$wp_filetype = wp_check_filetype(basename($filename), null );
    	
    		$attachment = array(
    				'post_mime_type' => $wp_filetype['type'],
    				'post_title' => $filename,
    				'post_content' => '',
    				'post_status' => 'inherit'
    		);
    		
    		$attach_id = wp_insert_attachment( $attachment, $uploadfile );
    		apply_filters('wp_handle_upload', array('file' => $uploadfile, 'url' => $_GET['url'], 'type' => $wp_filetype['type']), 'upload');
    		$imagenew = get_post( $attach_id );
    		$fullsizepath = get_attached_file( $imagenew->ID );
    		$attach_data = wp_generate_attachment_metadata( $attach_id, $fullsizepath );
    		
    		if(!empty($attach_data)){
    			$attach_data["postid"] = $attach_id;
    		}
    		wp_update_attachment_metadata( $attach_id, $attach_data );

    		wp_send_json_success($attach_data);
    	}else{
    		wp_send_json_error(__('Error', 'mpat'));
    	}
    }

    public static function delete_component_template(){
        if (isset($_POST) && isset($_POST['data']) && isset($_POST['data']['id'])){
            wp_delete_post($_POST['data']['id']);

        } else {
            wp_send_json_error(new \WP_Error("delete_component_template", __('no id provided!', 'mpat')));
        }
    }

    public static function save_component_template(){

        if (isset($_POST['data'])){
            $args = array(
                'meta_input' => array("template"=>$_POST['data']['template']),
                'post_title' => $_POST['data']['title'],
                'post_type' => 'page_component',
                'post_status' => 'publish'
            );
            $id = wp_insert_post($args);
            wp_send_json_success(array("id" => $id));
        } else {
            wp_send_json_error(new \WP_Error("save_component_template", __('no template data!', 'mpat')));
        }
    }

    public static function save_button_control() {
		if (isset($_POST['main_menu_button'])){
			update_post_meta( 1, '_main_menu_button', $_POST['main_menu_button']);
		}
		if (isset($_POST['items']) or empty($_POST['items'])) {
			$menu_loc = 'footer-menu';
			if ( ( $locations = get_nav_menu_locations() )) {
				$menu = wp_get_nav_menu_object( $locations[ $menu_loc ] );
				if ($menu){
					$menu_objects = get_objects_in_term( $menu->term_id, 'nav_menu' );
					if ( ! empty( $menu_objects ) ) {
						foreach ( $menu_objects as $obj ) {
							wp_delete_post( $obj);
						}
					}
				} else {
					$menu_id = wp_create_nav_menu('FooterMenu');
					$menu = wp_get_nav_menu_object($menu_id);
					$locations[ $menu_loc ] = $menu_id;
					set_theme_mod('nav_menu_locations',$locations);
				}
		
				foreach($_POST['items'] as $index=>$item){
					
					if (isset($item['button_name']) && isset($item['show'])){
						//Hide Button Item
						if (isset($item['is_hide'])){
							$menu_item = array(
								'menu-item-position' => $index+1,
								'menu-item-status' => 'publish',
								'menu-item-title' => get_theme_mod( "hide_text"),
							);
							$id = wp_update_nav_menu_item($locations[$menu_loc], 0, $menu_item);
							add_post_meta( $id, '_menu_item_mpat_button', __('Red', 'mpat'), true );
							add_post_meta( $id, '_menu_item_is_hide', 'true', true );
							add_post_meta( $id, '_menu_item_show_footer', $item['show'], true );
						} else {
							$menu_item = array(
									'menu-item-object-id' => $item['post_id'],
									'menu-item-object' => get_post_type($item['post_id']),
									'menu-item-position' => $index+1,
									'menu-item-type' => 'post_type',
									'menu-item-status' => 'publish',
							);
							$id = wp_update_nav_menu_item($locations[$menu_loc], 0, $menu_item);
							add_post_meta( $id, '_menu_item_mpat_button', $item['button_name'], true );
							add_post_meta( $id, '_menu_item_show_footer', $item['show'], true );
						}
					}
				}
			}
			wp_send_json_success(array("message" => __('Items saved', 'mpat')));
		} else {
			$error = new \WP_Error("button-control", __('Items not found', 'mpat'));
			wp_send_json_error($error);
		}
	}
}