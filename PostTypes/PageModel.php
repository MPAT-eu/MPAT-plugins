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
 *
 **/
namespace MPAT\PostTypes;

use MPAT\UserRoles\ContentEditor;

class PageModel extends PostType {

  public $slug = "page_model";
  public $dashicon = "dashicons-images-alt2";


  public function register_post_type() {
    register_post_type(
      $this->slug,
      array(
        'labels' => array(
          'name' => __('Page Models' , 'mpat'),
          'singular_name' => __('Page Model' , 'mpat')
        ),
        'public' => true,
        'menu_icon' => $this->dashicon,
        'supports' => array("title"),
        'show_in_rest' => true,
        'map_meta_cap' => 'true',
        'capabilities' => array(
          /* that WAS to remove the 'Add New' button */
        //  'create_posts' => 'do_not_allow',
          'read' => 'do_not_allow'
        )
      )
    );

    remove_post_type_support('page_model', 'comments' );
    add_filter('page_row_actions', function ($args) {
      return $args; // and dont forget to return the actions
    });
  }

  public function update_capabilities() {
    $page_post_type = get_post_type_object($this->slug);
  }

  public function add_metaboxes() {
    global $post;
    // Application custom fields should be defined in this method

    // Can be populated automatically with users authorized for parent app,
    // waiting for inputs from D4 for app-page relation
    if (current_user_can("manage_page_content_editors", $post->ID)) :
      add_meta_box(
        "user-permissions",
        __('User permissions', 'mpat'),
        array($this, "render_permissions_metabox"),
        $this->slug,
        "side"
      );
    endif;

    add_meta_box(
      "content_editor",
      __('Content Editor' , 'mpat'),
      array($this, 'render_content_editor_metabox'),
      $this->slug,
      'advanced'
    );
  }

  public function save_metaboxes($post_id, $post, $update) {
    if (!isset($_POST["permissions-nonce"]) || !wp_verify_nonce($_POST["permissions-nonce"], "page-permissions"))
      return $post_id;

    if (!current_user_can("edit_post", $post_id))
      return $post_id;

    if (defined("DOING_AUTOSAVE") && DOING_AUTOSAVE)
      return $post_id;

    if (current_user_can("manage_page_content_editors")) :
      $allowed_users = array();
      if (isset($_POST["allowed-content-editors"])) {
        $allowed_users = $_POST["allowed-content-editors"];
      }
      update_post_meta($post_id, "allowed_content_editors", $allowed_users);
    endif;

    $mpat_content = json_decode(stripslashes($_REQUEST['mpat_content']), true);
    update_post_meta($post_id, 'mpat_content', $mpat_content);
  }

  public function render_permissions_metabox($post, $args) {

    global $post;

    wp_nonce_field("page-permissions", "permissions-nonce");

    if (current_user_can("manage_page_content_editors", $post->ID)) :
      $users = get_users(array(
        "role" => ContentEditor::$slug
      ));
      $allowed_users = (array)get_post_meta($post->ID, "allowed_content_editors", true);
      ?>
        <div>
            <label for="allowed-content-editors"><strong>
            <?php _e('Allowed content editors','mpat') ?> <select ?> multiple name="allowed-content-editors[]">
              <?php foreach ($users as $user) : ?>
                  <option
                    <?php if (in_array($user->ID, $allowed_users)): ?>selected="selected"<?php endif; ?>
                    value="<?php echo $user->ID ?>"><?php echo $user->display_name ?></option>
              <?php endforeach; ?>
            </select>
        </div>  <!-- MPAT-167 -->
        <script type="text/javascript">
          if (navigator.userAgent.toLowerCase().indexOf('firefox') <= 0 && // not already in firefox
            document.getElementById("sample-permalink") && document.getElementById("edit-slug-box")) {
            let kid = document.createElement('blockquote');
            kid.style.fontWeight = 'bold';
            kid.style.lineHeight = '0.8em';
            kid.innerHTML = __('Please take this permalink and open it in <a href="http://firefox.com" target="_blank">Firefox</a> with <a href="https://addons.mozilla.org/en-GB/firefox/addon/firehbbtv/" target="_blank">FireHbbTV</a> activated','mpat');
            document.getElementById("edit-slug-box").appendChild(kid);
          }
        </script>
      <?php
    endif;
  }

  public function render_content_editor_metabox($post, $args) {
    ?>
      <div class="content-editor-container pagemodel"></div>
    <?php
    //this is where react takes over
  }
}
