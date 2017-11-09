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

class MPATApplication extends PostType {
  public $slug = "mpat_application";
  public $name = "MPAT Application";
  public $singular_name = "MPAT Application";
  public $dashicon = "dashicons-smiley";

  public function save_metaboxes($post_id, $post, $update) {
  }

  public function add_metaboxes($post){
  }
}
