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
 * Stefano Miccoli (stefano.miccoli@finconsgroup.com)
 * Marco Ferrari (marco.ferrari@finconsgroup.com)
 * Jean-Claude Dufourd (jean-claude.dufourd@telecom-paristech.fr
 **/
namespace MPAT\PostTypes;

use MPAT\UserRoles\ContentEditor;

class Page extends PostType {

  public $slug = "page";

  public function __construct() {
  	parent::__construct();
  	add_action("rest_api_init", array(&$this, "register_rest_fields"));
  }

  public function register_post_type() {
    remove_post_type_support('page', 'comments' );
    remove_post_type_support('page', 'editor');
  }

  public function register_rest_fields() {
  	register_rest_field('page', 'mpat_content', array(
  		'get_callback' => array(&$this, 'get_meta_mpat_content'),
  		'update_callback' => array(&$this, 'put_meta_mpat_content'),
  		'schema' => null,
  	));
  	register_rest_field('page', 'mpat_sc_publish_pubdate', array(
  		'get_callback' => array(&$this, 'get_meta_mpat_sc_publish_pubdate'),
  		'update_callback' => array(&$this, 'put_meta_mpat_sc_publish_pubdate'),
  		'schema' => null,
  	));
  }


  function get_meta_mpat_content($post, $field_name, $request) {
  	$mpatContent = get_post_meta($post['id'], 'mpat_content', true);
  	if ($mpatContent && $mpatContent['layoutId']) {
  		$layoutPost = get_post_meta($mpatContent['layoutId'], 'mpat_content', true);
  		if ($layoutPost && $layoutPost['layout']) $mpatContent["layout"] = $layoutPost['layout'];
  	}

  	$mpatContent["parent"] = ($post["parent"] && $post["parent"]!= $post["id"]) ? get_permalink($post["parent"]) : "";
	return $mpatContent;
  }

  function put_meta_mpat_content($value, $post, $field_name) {
  	unset($value["layout"]);
  	unset($value["parent"]);
  	return update_post_meta($post->ID, 'mpat_content', $value);
  }

  function get_meta_mpat_sc_publish_pubdate($post, $field_name, $request) {
  	return get_post_meta($post['id'], 'mpat_sc_publish_pubdate', true);
  }

  function put_meta_mpat_sc_publish_pubdate($value, $post, $field_name) {
  	return update_post_meta($post->ID, 'mpat_sc_publish_pubdate', $value);
  }


  public function update_capabilities() {
    $page_post_type = get_post_type_object($this->slug);

    // we want to differentiate create and edit pages capabilities
    // to allow more precise permissions management
    $page_post_type->cap->create_posts = "create_pages";
    $page_post_type->cap->edit_layout_ready_posts = "edit_layout_ready_pages";
    $page_post_type->cap->edit_layout_pending_posts = "edit_layout_pending_pages";
    $page_post_type->cap->manage_post_content_editors = "manage_page_content_editors";
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
      __('Content Editor', 'mpat'),
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
            <?php _e('Allowed content editors', "mpat"); ?></strong></label><br/>
            <select multiple name="allowed-content-editors[]">
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
            kid.innerHTML = 'Please take this permalink and open it in <a href="http://firefox.com" target="_blank">Firefox</a> with <a href="https://addons.mozilla.org/en-GB/firefox/addon/firehbbtv/" target="_blank">FireHbbTV</a> activated';
            document.getElementById("edit-slug-box").appendChild(kid);
          }
        </script>
      <?php
    endif;
  }

  public function render_content_editor_metabox($post, $args) {
    ?>
      <div class="content-editor-container"></div>
    <?php
    //this is where react takes over
  }
}
