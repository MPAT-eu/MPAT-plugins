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
 * Jean-Claude Dufourd (jean-claude.dufourd@telecom-paristech.fr
 * Jean-Philippe Ruijs (jean-philippe.ruijs@telecom.paristech.fr)
 *
 **/
namespace MPAT\PostTypes;

class PageLayout extends PostType {
    public $slug = "page_layout";
    public $dashicon = "dashicons-feedback";

    public function register_post_type() {
      register_post_type(
        $this->slug,
        array(
          'labels' => array(
            'name' => __('Page Layouts' , 'mpat'),
            'singular_name' => __('Page Layout' , 'mpat')
          ),
          'public' => true,
          'menu_icon' => $this->dashicon,
          'supports' => array('title'),
          'show_in_rest' => true,
          'map_meta_cap' => 'true',
          'capabilities' => array(
          /* that WAS to remove the 'Add New' button */
            //'create_posts' => 'do_not_allow',
            'read' => 'do_not_allow'
          )
        )
      );
      remove_post_type_support('page_layout', 'comments' );
    }

    public function save_metaboxes($post_id, $post, $update) {

    	if (isset($_REQUEST['mpat_content'])) {
	        $mpat_content = json_decode(stripslashes($_REQUEST['mpat_content']),true);
	        update_post_meta($post_id,'mpat_content',$mpat_content);
    	}
    }

    public function add_metaboxes($post){
        add_meta_box('layout_builder','Layout Builder',array($this,'layout_builder_callback'),
          $this->slug, 'advanced');
    }

    public function layout_builder_callback(){
        ?>
        <div class="layout-builder-container"></div>
        <?php
        //this is where react takes over (see admin.js)
    }
}

