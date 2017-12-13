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
 **/
namespace MPAT\PostTypes;

abstract class PostType {
  public $slug = "";
  //public $name = "";
  //public $singular_name = "";
  public $dashicon = "";

  public function __construct() {
    $this->update_capabilities();
    $this->register_post_type();
    add_action('add_meta_boxes_' . $this->slug, array($this, 'add_metaboxes'), 10, 2);
    add_action('save_post_' . $this->slug, array($this, 'save_metaboxes'), 10, 3);
  }

  public function update_capabilities() {
  }
/*
  public function register_post_type() {
    register_post_type(
      $this->slug,
      array(
        'labels' => array(
          'name' => $this->name,
          'singular_name' => $this->singular_name
        ),
        'public' => true,
        'menu_icon' => $this->dashicon,
        'supports' => array("title"),
        'show_in_rest' => true
      )
    );
  }
*/
  public function save_metaboxes($post_id, $post, $update) {
  }

}
