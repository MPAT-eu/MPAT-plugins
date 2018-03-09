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
 * Miggi Zwicklbauer (miggi.zwicklbauer@fokus.fraunhofer.de)
 * Thomas Tröllmich  (thomas.troellmich@fokus.fraunhofer.de)
 * Jean-Claude Dufourd (jean-claude.dufourd@telecom-paristech.fr
 * Benedikt Vogel 	 (vogel@irt.de)
 * Jean-Claude Dufourd (jean-claude.dufourd@telecom-paristech.fr
 * Stefano Miccoli (stefano.miccoli@finconsgroup.com)
 * Marco Ferrari (marco.ferrari@finconsgroup.com)
 **/
/**
 * @link              URL to plugin homepage
 * @since             1.0.0
 *
 * Plugin Name:       MPAT core plugin
 * Plugin URI:        http://www.mpat.eu
 * Description:       Main MPAT plugins which includes the most of core modules.
 * Version:           1.0.0
 * Author:            MPAT
 * Author URI:        http://www.mpat.eu
 * License:           GPL-2.0+
 * License URI:       http://www.gnu.org/licenses/gpl-2.0.txt
 * Text Domain:    	mpat
 */

namespace MPAT;

use MPAT\PostTypes\Page;
use MPAT\PostTypes\PageModel;
use MPAT\PostTypes\PageLayout;
use MPAT\REST\LayoutRest;
use MPAT\REST\ModelRest;
use MPAT\REST\OptionsRest;
use MPAT\REST\AssetsSearchController;
use MPAT\REST\AssetsController;
use MPAT\Settings\Piwik;
use MPAT\Settings\Ivw;
use MPAT\TimeLine\TimeLine;
use MPAT\UserRoles\Administrator;
use MPAT\UserRoles\ApplicationCreator;
use MPAT\UserRoles\ApprovalEditor;
use MPAT\UserRoles\ContentEditor;
use MPAT\UserRoles\LayoutDesigner;
use MPAT\UserRoles\TechnicalPublisher;
use MPAT\AssetConverter\AssetConverter;
use MPAT\UserRoles\Editor;


// If this file is called directly, abort.
if (!defined('WPINC')) {
	die;
}

class Core {
	const TEXT_DOMAIN = "mpat";

	private static $instance = null;

	private static $dummy_users = array(
			"application_creator",
			"content_editor",
	);

	private $registered_asset_types = array();

	private function __construct() {
		// action and filters go here
		add_action("init", array(&$this, "init"));
		add_action("admin_init", array(&$this, "admin_init"));
		add_action('widgets_init', array(&$this, "widgets_init"));
		add_action("wpmu_new_blog", array(&$this, "wpmu_new_blog"));
		add_action("admin_bar_menu", array("\MPAT\UserRoles\Role", "admin_bar_menu"), 21);
		add_action('wp_enqueue_scripts', array(&$this, 'enqueue_frontend_scripts'));
		add_action('admin_enqueue_scripts', array(&$this, 'enqueue_admin_scripts'));
		add_action('init', array(&$this, 'disable_wordpress_spam'));
		add_action("do_meta_boxes", array(&$this, "remove_featured_image_meta_box"));
		add_action("admin_menu", array(&$this, "remove_meta_boxes"));

		add_action("admin_menu", array("MPAT\Settings\ApplicationManager", "menu_page"));
		add_action("admin_init", array("MPAT\Settings\ApplicationManager", "register_settings"));

		add_action("admin_menu", array("MPAT\Settings\AssetsManager", "menu_page"));
		add_action("admin_init", array("MPAT\Settings\AssetsManager", "register_settings"));
		add_action("admin_menu", array("MPAT\Settings\Analytics", "menu_page"));
		add_action("admin_menu", array("MPAT\Settings\Version", "menu_page"));
		add_action("wp_footer", array(&$this, 'analytics_code'), 99);

		// filter to replace clone references with actual values (only frontend)
		add_filter("get_post_metadata", array( &$this, "filter_mpat_content_meta"), 99, 4);

		ContentManagement\PageManagement::init();
		ContentManagement\SiteManagement::init();
		Piwik::register_analytics();
		Ivw::register_analytics();

		// Trigger the registration of asset types from third-party plugins
		$this->registered_asset_types = apply_filters("mpat_register_asset_types", $this->registered_asset_types);

		add_action("rest_api_init", array(&$this, "register_routes"));
		add_action('update_option_mpat_application_manager', array(&$this, "set_ordered_pages"), 10, 2);

		$tl = new TimeLine();
		add_action("admin_menu", array(&$tl, "timeline_init"));

		add_action('wp_loaded', array("MPAT\TimeLine\TimeLine", "timeline_templates"));

		$plr = new LayoutRest();
		add_action('rest_api_init', array(&$plr, 'register_routes'));
		$mlr = new ModelRest();
		add_action('rest_api_init', array(&$mlr, 'register_routes'));
		$olr = new OptionsRest();
		add_action('rest_api_init', array(&$olr, 'register_routes'));

		// add_action('in_admin_footer', array(&$this, 'cleanup_print_templates'));

		add_action('admin_menu', array(&$this, 'filter_menus'));


		add_action('admin_init', array(&$this,'tooltips_section'));

	} // end constructor


	/** tooltip configuration in general settings */
	function tooltips_section() {
		add_settings_section(
			'tooltip_settings_section', // Section ID
			__('ToolTips', "mpat"), // Section Title
			array(&$this,'tooltip_section_cb'), // Callback
			'general' // This makes the section show up on the General Settings Page
		);

		add_settings_field( // Option tooltips_active
			'tooltips_active', // Option ID
			__('Active', "mpat"), // Label
			array(&$this,'tooltip_checkbox_cb'), // !important - This is where the args go!
			'general', // Page it will be displayed (General Settings)
			'tooltip_settings_section', // Name of our section
			array( // The $args
				'tooltips_active' // Should match Option ID
			)
		);
		register_setting('general','tooltips_active', 'esc_attr');

		add_settings_field(
			'tooltips_style',
			__('Style',"mpat"),
			array(&$this,'tooltip_select_cb'),
			'general',
			'tooltip_settings_section',
			array('tooltips_style')
		);
		register_setting('general','tooltips_style', 'esc_attr');

		add_settings_field(
			'tooltips_delay',
			__('Delay (ms) for the ToolTips to appear',"mpat"),
			array(&$this,'tooltip_nb_cb'),
			'general',
			'tooltip_settings_section',
			array('tooltips_delay')
		);
		register_setting('general','tooltips_delay', 'esc_attr');
		/*
		// only for dev since we remove console.log at build time
		add_settings_field(
			'tooltips_debug',
			__('Debug ToolTips',"mpat"),
			array(&$this,'tooltip_checkbox_cb'),
			'general',
			'tooltip_settings_section',
			array('tooltips_debug')
		);
		register_setting('general','tooltips_debug', 'esc_attr');
		*/

	}

	function tooltip_section_cb() { // Section Callback
		_e('In case you need a quicker or more thorough walkthru while creating MPAT pages, you can fine-tune here the appearance of the tooltips.', 'mpat');
	}

	function tooltip_text_cb($args) {  // input text Callback
		$option = get_option($args[0],'');
		echo '<input type="text" id="'. $args[0] .'" name="'. $args[0] .'" value="'. $option .'" />';
	}

	function tooltip_nb_cb($args) {  // input number for delay Callback
		$option = get_option($args[0],'');
		echo '<input type="number" style="width: 64px" min="0" max="3000" step="150" title="'.__('ms',"mpat").'" id="'. $args[0] .'" name="'. $args[0] .'" value="'. $option .'" />';
	}

	function tooltip_checkbox_cb($args) {  // input checkbox Callback
		$option = get_option($args[0],'');
		$cmp = strcmp($option , "on");
		$chk = ($cmp == 0) ? 'checked' : '';
		echo '<input type="checkbox" id="'. $args[0] .'" name="'. $args[0] .'" '. $chk .' />';
	}

	function tooltip_select_cb($args) {  // select Callback
		$option = get_option($args[0],'');
		$options = ['white','blue'];
		echo'<select id="'.$args[0].'" name="'.$args[0].'">';
		echo '<option value="'.$option.'">'.$option.'</option>';
		for( $i=0; $i < sizeof($options); $i++ ){
			if($options[$i]!=$option){
				echo '<option value="'.$options[$i].'">'.$options[$i].'</option>';
			}
		}
		echo '</select>';
	}


	public function filter_menus() {

		$current_user = wp_get_current_user();

		// here remove menus for all users
		remove_menu_page('index.php');
		remove_submenu_page('tools.php', 'import.php');
    remove_submenu_page('tools.php', 'export.php');
    remove_submenu_page('tools.php', 'tools.php');

		// here remove menus for all non admin roles (i.e. editors, authors, etc.)
		if ( ! in_array('administrator', $current_user->roles) ) {
			remove_submenu_page('options-general.php', 'options-reading.php');
			remove_submenu_page('options-general.php', 'options-writing.php');
			remove_submenu_page('options-general.php', 'options-discussion.php');
			remove_submenu_page('themes.php', 'nav-menus.php');
		}

		/*
		 // another way to target roles < admin
		 // based on the admin-only manage_options capability
		 if ( ! current_user_can('manage_options') ) {

		 }
		 */

		/*
		 // here remove menus for editors specifically
		 if ( $user->roles[0] == 'editor' ) {

		 }
		 */
	}

	public function register_routes() {
		$assetsSearchController = new AssetsSearchController(array_values($this->registered_asset_types));
		$assetsSearchController->register_routes();
	}

	public static function get_instance() {

		if (null == self::$instance) {
			self::$instance = new self;
		}

		return self::$instance;

	} // end get_instance;

	public function init() {

		load_plugin_textdomain( 'mpat', false, basename( dirname( __FILE__ ) ) . '/languages' );

		$this->init_post_types();

		register_post_status('mpat_layout_ready', array(
				'label' => __('Layout ready', self::TEXT_DOMAIN),
				'public' => true,
				'show_in_admin_all_list' => true,
				'show_in_admin_status_list' => true,
				'label_count' => _n_noop('Layout ready <span class="count">(%s)</span>', 'Layout ready <span class="count">(%s)</span>', self::TEXT_DOMAIN),
		));

		register_post_status('mpat_layout_pending', array(
				'label' => __('Pending layout approval', self::TEXT_DOMAIN),
				'public' => true,
				'show_in_admin_all_list' => true,
				'show_in_admin_status_list' => true,
				'label_count' => _n_noop('Pending layout approval <span class="count">(%s)</span>', 'Pending layout approval <span class="count">(%s)</span>', self::TEXT_DOMAIN),
		));
	}

	private function init_post_types() {
		new PageLayout();
		new Page();
		new PageModel();
		new \MPAT\PostTypes\ComponentTemplate();
	}

	public function admin_init() {

		//change default image size
		update_option('large_size_w', 1280);
		update_option('large_size_h', 720);

		add_action("wp_ajax_mpat_image_editor_nonce", array("\MPAT\AjaxCalls", "image_editor_nonce"));
		add_action("wp_ajax_mpat_insert_image_from_url", array("\MPAT\AjaxCalls", "insert_image_from_url"));

		add_filter('map_meta_cap', array("\MPAT\UserRoles\Role", "custom_meta_cap"), 10, 4);
		add_filter('user_has_cap', array("\MPAT\UserRoles\Role", "check_user_permissions"), 10, 3);

		// custom manage_mpat_options was defined to let editors (and other roles in the future) change app settings without messing with WP settings
		add_filter('option_page_capability_mpat-application-manager', array("\MPAT\UserRoles\Role", "define_custom_settings_cap"));
		add_filter('option_page_capability_mpat-analytics', array("\MPAT\UserRoles\Role", "define_custom_settings_cap"));

		add_action('print_media_templates', function () {
			echo '
            <style>
                .post-php select.link-to option[value="post"],
                .post-php select[data-setting="link"] option[value="post"]
                .post-php select.link-to option[value="embed"],
                .post-php select[data-setting="link"] option[value="embed"]
                { display: none; }
            </style>';
		});
	}

	public function widgets_init() {
		register_widget("\MPAT\Widgets\SampleWidget");
	}


	public function enqueue_frontend_scripts() {
		global $post;
    $applicationManager = get_option("mpat_application_manager");

		$this->enqueue_frontend_scripts_TV();
		// generic code
		wp_register_script('keycodes', get_template_directory_uri(__FILE__) . '/frontend/js/keycodes.js');
		wp_register_script('hbbtvlib', get_template_directory_uri(__FILE__) . '/frontend/js/hbbtvlib.js');
		wp_enqueue_script('keycodes');
		wp_enqueue_script('hbbtvlib');
	}

	private function enqueue_frontend_scripts_TV() {
		wp_register_script('core', plugin_dir_url(__FILE__) . 'js/mpat_core.min.js?webpack', array(), false, true);
		// wp_register_script('core','http://localhost:8888/mpat_core.min.js',array(),false,true);
		$this->enqueue_frontend_scripts_generic();
	}

	private function enqueue_frontend_scripts_generic() {
		$applicationManager = get_option("mpat_application_manager");
		if (!$applicationManager["navigation_model"]) unset($applicationManager["navigation_model"]);
		$applicationManager = wp_parse_args($applicationManager, array(
				"navigation_model" => "website",
				"smooth_navigation" => false,
				"app_language" => "en",
				"slideflow_arrows" => false,
				"slideflow_experimental" => false,
				"slideflow_orientation" => "vertical"
		));
		global $post;
		$postData = null;
		if ($post != null) {
			$postData = get_page_content($post->ID);
		} else {
			// here we are in preview
			$postData = array(
					"meta" => array(
							"layout" => [],
							"parent" => "",
							"background" => "",
							"layoutId" => 1,
							"content" => array(
									"_x82yvgd5u" => (object)[]
							)
					)
			);
			$applicationManager['navigation_model'] = "preview";
		}
		// cast to boolean, otherwise true values would be string "1"
		foreach (array("smooth_navigation", "slideflow_arrows", "slideflow_experimental", "slideflow_arrows") as $boolItem) {
			$applicationManager[$boolItem] = (bool)$applicationManager[$boolItem];
		}
		if ($applicationManager["navigation_model"] == "slideflow") {
			$applicationManager["pages"] = self::get_ordered_pages(false);
		}
		$videoplayerIcons = array();
		$videoplayerIconsOptions = array(
        'mpat_icons_video_loading', 'mpat_icons_video_play', 'mpat_icons_video_pause', 'mpat_icons_video_stop',
        'mpat_icons_video_forward', 'mpat_icons_video_rewind', 'mpat_icons_video_fullscreen',
        'mpat_icons_video_fullscreenexit', 'mpat_icons_video_arrowleft', 'mpat_icons_video_arrowright',
        'mpat_icons_video_zoomin', 'mpat_icons_video_zoomout'
		);
		foreach ($videoplayerIconsOptions as $option) {
			$videoplayerIcons[str_replace("mpat_icons_video_", "", $option)] = get_option($option);
		}
		$remoteIcons = array();
		$remoteIconsOptions = array(
				'mpat_icons_ok', 'mpat_icons_back', 'mpat_icons_red', 'mpat_icons_blue', 'mpat_icons_green', 'mpat_icons_yellow',
				'mpat_icons_pause', 'mpat_icons_play', 'mpat_icons_forward', 'mpat_icons_rewind', 'mpat_icons_0', 'mpat_icons_1',
				'mpat_icons_2', 'mpat_icons_3',
				'mpat_icons_4', 'mpat_icons_5', 'mpat_icons_6', 'mpat_icons_7', 'mpat_icons_8', 'mpat_icons_9'
		);
		foreach ($remoteIconsOptions as $option) {
			$remoteIcons[str_replace("mpat_icons_", "button_", $option)] = get_option($option);
		}
    /* update clones (this code is redundant)
    $content = $postData['meta']['content'];
    forEach ($content as $boxKey => $boxValue) {
      forEach ($boxValue as $stateKey => $stateValue) {
        if ($stateValue['type'] == 'clone') {
          $componentData = $stateValue['data'];
          if (array_key_exists('boxId', $componentData) &&
            array_key_exists('stateId', $componentData)) {
            $boxId = $componentData['boxId'];
            $stateId = $componentData['stateId'];
            $modelPageMeta = get_post_meta($stateValue['data']['pageId'], 'mpat_content', true);
            $tmp = $modelPageMeta['content'];
            if (array_key_exists($boxId, $tmp) && array_key_exists($stateId, $tmp[$boxId])) {
              $postData['meta']['content'][$boxKey][$stateKey] = $tmp[$boxId][$stateId];
              continue 2;
            }
          }
        }
      }
    }
    /* end update clones */
		wp_localize_script('core', 'MPATGlobalInformation', array(
				"Post" => $postData,
				"application_manager" => $applicationManager,
				"analytics" => apply_filters("mpat_analytics_variables", array()),
				"icons" => array(
						"videoplayer" => $videoplayerIcons,
						"remote" => $remoteIcons
						// arrows next? probably yes, in applicationIcons please
				),
		));
		wp_localize_script('core', 'wpApiSettings', array(
				'root' => esc_url_raw( get_rest_url() ),
				'nonce'  => wp_create_nonce( 'wp_rest' ),
				'versionString' => 'wp/v2/',
		));
		wp_localize_script('core', 'ajaxurl', admin_url('admin-ajax.php'));
		wp_enqueue_script('core');
	}

	function enqueue_admin_scripts($hook) {
		global $post;
		if (($hook === "post-new.php" || $hook === "post.php") && ($post->post_type === "page" ||
                $post->post_type === "page_layout" || $post->post_type === "page_model")) {
            remove_meta_box('submitdiv', 'page', 'side');
            remove_meta_box('pageparentdiv', 'page', 'side');
            remove_meta_box('user-permissions', 'page', 'side');
            remove_meta_box('slugdiv', 'page', 'normal');
            remove_meta_box('postcustom', 'page', 'normal');
            remove_meta_box('submitdiv', 'post', 'side');
            remove_meta_box('pageparentdiv', 'post', 'side');
            remove_meta_box('user-permissions', 'post', 'side');
            remove_meta_box('slugdiv', 'post', 'normal');
            remove_meta_box('postcustom', 'post', 'normal');
            wp_enqueue_media();
            wp_register_script('mpat_admin', plugin_dir_url(__FILE__) . 'js/mpat_admin.min.js?webpack', array('wp-api'), 1.0, true);
            // wp_register_script('mpat_admin','http://localhost:8888/mpat_admin.min.js', array('wp-api'),1.0,true);
            global $tinymce_version;
            wp_enqueue_script('mpat_tinymce', includes_url('js/tinymce') . '/wp-tinymce.php?c=1&amp;ver=' . $tinymce_version, array(), false, true);
            $postMeta = $post->post_type == "page_layout" ? get_page_layout_content($post->ID) : get_page_content($post->ID);

            $postData = array(
                'meta' => ($postMeta && isset($postMeta["meta"])) ? $postMeta["meta"] : array(),
                'postInfo' => $post
            );
            $args = array(
                'posts_per_page' => -1,
                'post_type' => 'page_layout',
            );

            $layoutData = array_map(function ($layout) {
                $temp = get_post_meta($layout->ID, 'mpat_content', true);
                if (is_array($temp) && array_key_exists("layout", $temp)) $temp = $temp["layout"];
                return array(
                    "id" => $layout->ID,
                    "name" => $layout->post_title,
                    "data" => $temp
                );
            }, get_posts($args));

            $pages =  array_map(function ($page) {
                $page->mpat_content = get_post_meta($page->ID, 'mpat_content', true);
                return $page;
            }, get_pages(array("hierarchical" => false)));

            $array_post_assets = array();
            $post_assets = get_post_types_by_support("mpat-asset");

            foreach ($post_assets as $post_asset) {
                $array_post_assets[] = $post_asset;
            }

            $args['post_type'] = 'component_templates';
            wp_localize_script( 'mpat_admin', 'Post', $postData );
            wp_localize_script('mpat_admin', 'Layouts', $layoutData);
            wp_localize_script('mpat_admin', 'Pages', $pages);
            wp_localize_script('mpat_admin', 'Urls', array(
                "home" => home_url(),
                "preview" => home_url(' - /preview')
            ));
            wp_localize_script('mpat_admin', 'CustomCSS',
                get_posts( array( 'post_type' => 'custom_css', 'posts_per_page' => '100' ) ));


            $applicationManager = get_option("mpat_application_manager");
            wp_localize_script('mpat_admin', 'assets', $array_post_assets);
            wp_localize_script('mpat_admin', 'Application', array("application_manager" => $applicationManager));
            wp_localize_script('mpat_admin', 'siteurl', site_url());
            wp_localize_script('mpat_admin', 'corepluginurl', plugin_dir_url(__FILE__));
            wp_localize_script('mpat_admin', 'frontendStyles', array(
                "*" => array(
                    "color" => get_theme_mod('font_color')
                ),
                "a" => array(
                    "color" => get_theme_mod('link_color')
                ),
                "p" => array(
                    "font-size" => get_theme_mod('font_size')
                ),
                "h1, h2, h3, h4, h5, h6" => array(
                    "font-weight" => get_theme_mod('hx_style')
                ),
                "h1" => array(
                    "font-size" => get_theme_mod('h1_size'),
                    "color" => get_theme_mod('h1_color')
                ),
                "h2" => array(
                    "font-size" => get_theme_mod('h2_size'),
                    "color" => get_theme_mod('h2_color')
                ),
                "h3" => array(
                    "font-size" => get_theme_mod('h3_size'),
                    "color" => get_theme_mod('h3_color')
                ),
                "h4" => array(
                    "font-size" => get_theme_mod('h4_size'),
                    "color" => get_theme_mod('h4_color')
                ),
                "h5" => array(
                    "font-size" => get_theme_mod('h5_size'),
                    "color" => get_theme_mod('h5_color')
                ),
                "h6" => array(
                    "font-size" => get_theme_mod('h6_size'),
                    "color" => get_theme_mod('h6_color')
                )
            ));
            wp_localize_script('mpat_admin', 'wp_option_gmt_offset', array( 'gmt_offset' => get_option('gmt_offset')) );
            wp_enqueue_script('mpat_admin');
        } else if ($hook === "toplevel_page_mpat-application-manager"){
            wp_enqueue_script('wp-api');
            wp_register_script('mpat_app_manager', plugin_dir_url( __FILE__ ).'/js/mpat_app_manager.min.js?webpack',array(),1.0,true);
            // wp_register_script('mpat_app_manager','http://localhost:8888/mpat_app_manager.min.js',array(),1.0,true);

            wp_localize_script('mpat_app_manager', 'pagesOrder', self::get_ordered_pages());
            wp_enqueue_script('mpat_app_manager');
        } elseif ($hook == "toplevel_page_mpat-assets-manager") {
            wp_register_script('mpat_assets_manager', plugin_dir_url(__FILE__) . '/js/mpat_assets_manager.min.js?webpack', array("wp-api"), 1.0, true);

            $asset_types = array();

            foreach ($this->registered_asset_types as $fqn => $post_type) {
                $post_type_object = get_post_type_object($post_type);

                $asset_types[] = array(
                    "baseUrl" => isset($post_type_object->rest_base) ? $post_type_object->rest_base : $post_type_object->name,
                    "postType" => $post_type_object->name,
                    "label" => $post_type_object->label
                );
            }

            wp_localize_script('mpat_assets_manager', 'assetsManagerSettings', array('types' => $asset_types));
            wp_enqueue_script('mpat_assets_manager');
        }
		/** for localization */
		wp_register_script('mpat_i18n',null,array("wp-api"));
		wp_localize_script('mpat_i18n','mpati18n',array(
			'lang' => substr(get_user_locale(), 0, 2),
			'locale' => get_user_locale(),
			'app_language' => get_option('mpat_application_manager')['app_language']
		));
		wp_enqueue_script('mpat_i18n');

		/** for tooltips */
		$ttdelay = get_option('tooltips_delay','750');
		$ttdebebug = get_option('tooltips_debug','');
		wp_register_script('mpat_tt',null,array());
		wp_localize_script('mpat_tt','mpat_tt',array(
			'tooltips_active' => get_option('tooltips_active', ''),
			'tooltips_style' => get_option('tooltips_style', 'white'),
			'tooltips_delay' => $ttdelay,
			'tooltips_debug' => $ttdebebug
		));
		wp_enqueue_script('mpat_tt');

        wp_enqueue_style('mpat_admin', plugin_dir_url(__FILE__) . '/css/admin_style.css');
    }

	public function analytics_code() {
		do_action("mpat_analytics_scripts");
	}

	public function get_ordered_pages($returnExcludedPages = true) {

		if ($returnExcludedPages === true) {
			//get all pages
			$args = array(
					'posts_per_page' => -1,
					'post_type' => 'page',
					"orderby" => array('menu_order' => 'ASC', 'date' => 'ASC')
			);

			$pages = array_map(function ($page) {
				return array(
						"id" => $page->ID,
						"name" => $page->post_title,
						"menu_order" => $page->menu_order,
						"excluded" => get_post_meta($page->ID, "_slideflow_excluded", true),
				);
			}, get_posts($args));

		} else {
			//get only pages with _slideflow_excluded meta value false
			$args = array(
					'posts_per_page' => -1,
					'post_type' => 'page',
					"orderby" => array('menu_order' => 'ASC', 'date' => 'ASC'),
					'meta_query' => array(
							'relation' => 'OR',
							array(
									'key' => '_slideflow_excluded',
									'compare' => 'NOT EXISTS'
							),
							array(
									'key' => '_slideflow_excluded',
									'value' => '',
							)
					)
			);

			$pages = array_map(function ($page) {
				return array(
						"id" => $page->ID,
						"name" => $page->post_title,
						"menu_order" => $page->menu_order,
				);
			}, get_posts($args));
		}

		return $pages;
	}

	public static function set_ordered_pages($old_value, $new_value) {

    $pages_to_update = array();
		$pages_excluded = array();

    $app_manager = json_decode($new_value["slideflow_settings"], true);
    $oapp_manager = json_decode($old_value["slideflow_settings"], true);
    $new_pages = $app_manager["pagesOrder"];
    $old_pages = $oapp_manager["pagesOrder"];
		$page_index = sizeof($new_pages);

		//check for pages to be updated
		for ($i = 0; $i < $page_index; $i++) {
			if ($new_pages[$i]['menu_order'] != ($i + 1)) {
				$new_pages[$i]['menu_order'] = $i + 1;
				array_push($pages_to_update, $new_pages[$i]);
			}

			$index = array_search($new_pages[$i]["id"], array_column($old_pages, "id"));
			if ($new_pages[$i]["excluded"] != $old_pages[$index]["excluded"]) {
				array_push($pages_excluded, $new_pages[$i]);
			}
		}

		foreach ($pages_to_update as $page) {
			$post_update = array(
					'ID' => $page["id"],
					'menu_order' => $page["menu_order"],
			);
			wp_update_post($post_update);
		}

		foreach ($pages_excluded as $page) {
			update_post_meta($page["id"], "_slideflow_excluded", $page["excluded"]);
		}

	}

	public function disable_wordpress_spam() {
		remove_action('wp_head', 'feed_links_extra', 3);
		remove_action('wp_head', 'feed_links', 2);
		remove_action('wp_head', 'wp_generator');
		remove_action('wp_head', 'wp_shortlink_wp_head');
		remove_action('wp_head', 'wp_msapplication_TileImage');
		remove_action('wp_head', 'wp_oembed_add_discovery_links');
		remove_action('wp_head', 'wp_oembed_add_host_js');
		remove_action('wp_head', 'rel_canonical');
		remove_action('wp_head', 'rsd_link');
		remove_action('wp_head', 'wlwmanifest_link');
		remove_action('wp_head', 'rest_output_link_wp_head');
		remove_action('wp_head', 'noindex', 1);
		remove_action('wp_head', 'wp_resource_hints', 2);
		remove_action('wp_head', 'dns-prefetch');
		//disable emojis
		remove_action('wp_head', 'print_emoji_detection_script', 7);
		remove_action('admin_print_scripts', 'print_emoji_detection_script');
		remove_action('wp_print_styles', 'print_emoji_styles');
		remove_action('admin_print_styles', 'print_emoji_styles');
		remove_filter('the_content_feed', 'wp_staticize_emoji');
		remove_filter('comment_text_rss', 'wp_staticize_emoji');
		remove_filter('wp_mail', 'wp_staticize_emoji_for_email');
	}

	public function remove_featured_image_meta_box() {
		remove_meta_box('postimagediv', 'page', 'side');
	}

	public function remove_meta_boxes() {
		//PAGE
		remove_meta_box('commentstatusdiv', 'page', 'normal');
		remove_meta_box('commentsdiv', 'page', 'normal');
		remove_meta_box('authordiv', 'page', 'normal');
		remove_meta_box('tagsdiv-post_tag', 'page', 'normal');
		//DASHBOARD
		remove_meta_box('dashboard_activity', 'dashboard', 'normal');
		remove_meta_box('dashboard_quick_press', 'dashboard', 'normal');
		remove_meta_box('dashboard_primary', 'dashboard', 'normal');
	}

	public static function activate_plugin() {
		self::add_roles();
		self::create_dummy_users();

	}

	public static function deactivate_plugin() {
		self::delete_dummy_users();
		self::remove_roles();
	}

	public static function add_roles() {
		Administrator::grant_capabilities();
		Editor::grant_capabilities();
		//     LayoutDesigner::register_user_role();
		//     ApplicationCreator::register_user_role();
		//     ContentEditor::register_user_role();
		//     ApprovalEditor::register_user_role();
		//     TechnicalPublisher::register_user_role();
	}

	public static function remove_roles() {
		//     LayoutDesigner::unregister_user_role();
		//     ApplicationCreator::unregister_user_role();
		//     ContentEditor::unregister_user_role();
		//     ApprovalEditor::unregister_user_role();
		//     TechnicalPublisher::unregister_user_role();
	}

	public static function create_dummy_users() {
		if (isset(self::$dummy_users)) {
			foreach (self::$dummy_users as $dummy_user) {
				wp_insert_user(array(
						"user_pass" => "password",
						"user_login" => $dummy_user,
						"role" => $dummy_user
				));
			}
		}
	}

	public static function delete_dummy_users() {
		if (isset(self::$dummy_users)) {
			foreach (self::$dummy_users as $dummy_user) {
				$user = get_user_by("login", $dummy_user);

				if ($user)
					wp_delete_user($user->ID);
			}
		}
	}

	/**
	 * Register user who creates new site (MPAT application) as Application creator
	 * inside the created site
	 */
	public static function wpmu_new_blog($blog_id) {
		$current_user = wp_get_current_user();
		/*
		 * User role (network) has to be tested before switch_to_blog because
		 * this function update $current_user->roles with the ones related to
		 * specific site
		 */
		$is_application_creator = (in_array(ApplicationCreator::$slug, $current_user->roles));

		switch_to_blog($blog_id);
		/*
		 * By default only superadmins can create new sites. When it happens they are
		 * assigned as administrator of their new site.
		 * In MPAT Application Creators can create new sites (MPAT apps) too. So they have to be
		 * assigned automatically as application creator of the new site
		 */
		if ($is_application_creator && !is_super_admin($current_user->ID)) {
			add_user_to_blog($blog_id, $current_user->ID, ApplicationCreator::$slug);
		}

		self::add_roles();

		if( get_role('subscriber') ){
			remove_role('subscriber');
		}
		if( get_role('contributor') ){
			remove_role('contributor');
		}
		if( get_role('author') ){
			remove_role('author');
		}

		restore_current_blog();
	}

	public static function filter_mpat_content_meta($value, $object_id, $meta_key, $single) {
		if ($meta_key == "mpat_content" && !is_admin()) { // !admin implies both frontend (sync) and rest (async)
			$post_type = get_post_type($object_id);
			// when I retrieve mpat_content for page and page_model in the frontend I want to replace
			// references to original component with the actual content
			if ($post_type == "page" || $post_type == "page_model") {
				// check mpat_content value from transient cache
				$value = wp_cache_get("mpat_content_{$object_id}");
				if ($value == false) {
					global $wpdb;
					$table = _get_meta_table( "post" );
					$mpat_content_value = null;
					$meta_list = $wpdb->get_row(
							"SELECT post_id, meta_key, meta_value FROM $table WHERE post_id = $object_id AND meta_key = 'mpat_content'" );
					if ($meta_list && $meta_list->meta_value) {
						$mpat_content_value = maybe_unserialize($meta_list->meta_value);
						if (array_key_exists('content', $mpat_content_value)) {
              foreach ($mpat_content_value["content"] as $boxName => $boxValue) {
                foreach ($boxValue as $stateName => $stateValue) {
                  if ($stateValue['type'] == 'clone') {
                    $componentData = $stateValue['data'];
                    if (array_key_exists('boxId', $componentData) && array_key_exists('stateId', $componentData)) {
                      $boxId = $componentData['boxId'];
                      $stateId = $componentData['stateId'];
                      $modelPageMeta = $wpdb->get_row(
                        "SELECT post_id, meta_key, meta_value FROM $table WHERE post_id = {$componentData['pageId']} AND meta_key = 'mpat_content'" );
                      if ($modelPageMeta != null) {
                          $modelPageMeta = maybe_unserialize($modelPageMeta->meta_value);
                          $tmp = $modelPageMeta['content'];
                          if (isset($tmp[$boxId]) && isset($tmp[$boxId][$stateId])) {
                              $mpat_content_value["content"][$boxName][$stateName] = $tmp[$boxId][$stateId];
                              continue 2;
                          }
                      }
                    }
                  }
                }
              }
            }
					}
					$value = array($mpat_content_value);
					wp_cache_add("mpat_content_{$object_id}", $value);
				}
			}
		}
		return $value;
	}
}


// we should keep autoloading, otherwise MPAT won't work without composer
spl_autoload_register(__NAMESPACE__ . '\\autoload');

register_activation_hook(__FILE__, array('\MPAT\Core', 'activate_plugin'));
register_deactivation_hook(__FILE__, array('\MPAT\Core', 'deactivate_plugin'));

\MPAT\Core::get_instance();


function autoload($cls) {
	$cls = ltrim($cls, '\\');
	if (strpos($cls, __NAMESPACE__) !== 0)
		return;

		$cls = str_replace(__NAMESPACE__, '', $cls);

		$path = plugin_dir_path(__FILE__) . str_replace('\\', DIRECTORY_SEPARATOR, $cls) . '.php';
		require_once($path);
}

if (!function_exists('write_log')) {
	function write_log($log) {
		if (true === WP_DEBUG) {
			if (is_array($log) || is_object($log)) {
				error_log(print_r($log, true));
			} else {
				error_log($log);
			}
		}
	}

	function dump_log($var) {
		ob_start();
		var_dump($var);
		write_log(ob_get_clean());
	}
}

// *** UTILS ***
function get_page_content($id) {
	$pageContent = get_post_meta($id, 'mpat_content', true);
	if ($pageContent) {
		$layoutPost = get_post_meta($pageContent['layoutId'], 'mpat_content', true);
		if (!$layoutPost) { // DEPRECATED need to delete layout_id
			try{
				$layoutPost = get_post_meta($pageContent['layout_id'], 'mpat_content', true);
			}
			catch(Exception $e){
				$layoutPost = $e->getMessage();
			}
		}
		$parentId = wp_get_post_parent_id($id);
		$parentLink = ($parentId && $parentId != $id) ? get_permalink($parentId) : "";
		$content = array(
				'meta' => array(
						'layout' => $layoutPost['layout'],
						'parent' => $parentLink
				),
				'id' => $id,
				"page_url" => get_page_link($id),
				"page_title" => get_the_title($id)
		);
		$content['meta'] = array_merge($content['meta'], $pageContent);
		$content = remove_null_values($content);
		return $content;
	}
	return null;
}

function get_page_layout_content($id) {
	$content = array(
			'meta' => get_post_meta($id, 'mpat_content', true) ? : array(),
			'id' => $id,
			"page_url" => get_page_link($id),
			"page_title" => get_the_title($id)
	);
	$content = remove_null_values($content);
	return $content;
}

function remove_null_values($val) {
	if (is_array($val) || is_object($val)) {
		$ar = (array)$val;
		if (sizeof($ar) === 0) {
			return null;
		}
		$ret = array_map(function ($el) {
			return remove_null_values($el);
		}, $ar);
			$ret = array_filter($ret, function ($el) {
				return remove_null_values($el) !== null;
			});
				return $ret;
	}
	return $val;
}

