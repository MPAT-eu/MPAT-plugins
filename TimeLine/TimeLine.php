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
 * Jean-Philippe Ruijs (jean-philippe.ruijs@telecom.paristech.fr)
 * Jean-Claude Dufourd (jean-claude.dufourd@telecom-paristech.fr)
 *
 **/
namespace MPAT\TimeLine;

class TimeLine {

  public static $timeline_uri_prefix = '%20-%20';

  function timeline_init() {
    $application_manager = get_option('mpat_application_manager');
    if ($application_manager['navigation_model'] == 'timeline') {
      add_menu_page('MPAT Timeline', 'Timeline', 'manage_options', 'MPAT_timeline', array(&$this, 'load'), 'dashicons-clock');
    }
    update_option('timeline_uri_prefix', self::$timeline_uri_prefix);
  }

  /**
   * custom timeline urls
   */
  static function timeline_templates() {
    $prefix = get_option('timeline_uri_prefix', self::$timeline_uri_prefix);
    $url_path = trim(parse_url(add_query_arg(array()), PHP_URL_PATH), '/');
    if ($url_path === "$prefix/timeline" || self::endsWith($url_path, "/$prefix/timeline")) {
        include('timelineout.php');
        exit();
    } else if ($url_path === "$prefix/preview" || self::endsWith($url_path, "/$prefix/preview")) {
        include('preview.php');
        exit();
    } else if ($url_path === "$prefix/event" || self::endsWith($url_path, "/$prefix/event")) {
      include('dsmcc.php');
      exit();
    }
  }

  static function endsWith($haystack, $needle) {
    $length = strlen($needle);
    if ($length == 0) {
      return true;
    }
    return (substr($haystack, -$length) === $needle);
  }

  function getTimeLineUrl() {
      $details = get_blog_details(get_current_blog_id());
      $prefix = get_option('timeline_uri_prefix', self::$timeline_uri_prefix);
      return $_SERVER['WP_HOME'] . substr($details->path, 1) . "$prefix/timeline";
  }

  function getDsmccUrl() {
      $details = get_blog_details(get_current_blog_id());
    $prefix = get_option('timeline_uri_prefix', self::$timeline_uri_prefix);
    return $_SERVER['WP_HOME'] . substr($details->path, 1) . "$prefix/event";
  }

  function load() {
    /* activate WP REST API v2 http://v2.wp-api.org/extending/javascript-client/ */
    wp_enqueue_script('wp-api');
    wp_enqueue_script('mpat-timeline', plugin_dir_url(__FILE__) . '../js/mpat_timeline.min.js', array(), 1.0, true);
    wp_localize_script('mpat-timeline', 'MPATTimeLinePages', $this->getPagesFromThisSite());
    wp_localize_script('mpat-timeline', 'MPATOther', array(
        "blogid" => get_current_blog_id(),
        "user" => wp_get_current_user(),
        "edit_pages" => current_user_can('edit_pages'),
        "generated" => time(),
        "blogname" => get_bloginfo($show = 'name'),
        'url' => array(
          'dsmcc' => $this->getDsmccUrl(),
          'scenario' => $this->getTimeLineUrl()
        ),
        'timeline_scenario' => get_option('timeline_scenario')
      )
    );
  }

  function getPagesFromAllSites() {
    /* create returning array */
    $main = array();
    /**
     * retrieve all sites
     * https://developer.wordpress.org/reference/functions/wp_get_sites/
     */
    /* iterate */
    if (is_multisite()) {
      foreach (get_sites() as $key => $value) {
        /* retrieve blog_id (not to confuse with site_id) and be certain it's an int */
        $blogid = 0 + $value->blog_id;

        /* switch to that specific blog */
        switch_to_blog($blogid);

        $this->fillit($main, $blogid);
        /* if we do not restore the current blog, we are asking for problems */
        if (restore_current_blog() == false) {
          echo 'restore_current_blog went false';
        }
      }
    } else {
      $this->fillit($main, "_");
    }
    return $main;
  }

  function getPagesFromThisSite() {
    $main = array();
    $this->fillit($main, "_");
    return $main;
  }

  function remove_things() {
    remove_menu_page('edit.php'); // Post
    remove_menu_page('upload.php'); // Media
    remove_menu_page('edit-comments.php'); // Comments
  }

  /**
   * function to obtain few objects from all the posts on all sites
   */
  function fillit(&$main, $blogid) {
    /* get all pages (that are published) */
    $pages = get_pages();
    /* create an object with the blogid as key and the pages as value */
    $subsite = ( object )[$blogid => $pages];
    /* for each subsite (just to get into the children object) */
    foreach ($subsite as $post) {
      /* for each post */
      foreach ($post as $siteid => $sitepost) {
        /* we declare only the objects/vars that are usefull */
        $postid = $sitepost->ID;
          /* create new obect */
          array_push($main, [
              'id' => $blogid . '_' . $postid,
              'blogid' => $blogid,
              'postid' => $postid,
              'guid' => $sitepost->guid,
              'title' => $sitepost->post_title
          ]);
      }
    }
  }
}
