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
 * Benedikt Vogel (vogel@irt.de)
 **/
namespace MPAT\Settings;

class WebTrekk {
	
	const OPTION_NAME = "webtrekk_params";
	
	static function register_analytics() {
		add_action("admin_init", array(self::class, "register_settings"));
		add_filter("mpat_analytics_variables", array(self::class, "register_frontend_variables"));
		add_action("mpat_analytics_scripts", array(self::class, "print_config_script"));
	}

	static function register_settings() {
		
		register_setting( 'mpat-analytics', self::OPTION_NAME );
		
		add_settings_section(
			'webTrekk_config',
			__( 'WebTrekk configuration', 'mpat' ),
			array(),
			'mpat-analytics'
		);
		
		add_settings_field(
			'piwik_enabled',
			__( 'Enable WebTrekk tracking', 'mpat' ),
			array(FormHelper::class, "checkbox_field_render"),
			'mpat-analytics',
			'webTrekk_config',
			array(
					"option_name" => self::OPTION_NAME,
					"field_name" => "enable",
					"default_value" => false
			)
		);
		
		add_settings_field(
			'webTrekk_url',
			__( 'WebTrekk server URL', 'mpat' ),
			array(FormHelper::class, "text_field_render"),
			'mpat-analytics',
			'webTrekk_config',
			array(
					"option_name" => self::OPTION_NAME,
					"field_name" => "url",
					"default_value" => "https://wa.wdr.de/#siteId#/wt?p=441,#cat1#_#cat2#_#cat3#_#cat4#_#cat5#,1,1920x1200,24,1,1536150091710,0,1667x1073,0&tz=2&la=de&cg1=#cat1#&cg2=#cat2#&cg3=#cat3#&cg4=#cat4#&cg5=#cat5#&cp4=2016-02-27&pu=#page#&eor=1"
			)
		);
		
		add_settings_field(
			'webTrekk_siteid',
			__( 'Webtrekk site ID', 'mpat' ),
			array(FormHelper::class, "text_field_render"),
			'mpat-analytics',
			'webTrekk_config',
			array(
					"option_name" => self::OPTION_NAME,
					"field_name" => "siteid",
					"default_value" => false
			)
		);

		add_settings_field(
			'webTrekk_cat1',
			__( 'Webtrekk cat 1', 'mpat' ),
			array(FormHelper::class, "text_field_render"),
			'mpat-analytics',
			'webTrekk_config',
			array(
					"option_name" => self::OPTION_NAME,
					"field_name" => "cat1",
					"default_value" => false
			)
		);

		add_settings_field(
			'webTrekk_cat2',
			__( 'Webtrekk cat 2', 'mpat' ),
			array(FormHelper::class, "text_field_render"),
			'mpat-analytics',
			'webTrekk_config',
			array(
					"option_name" => self::OPTION_NAME,
					"field_name" => "cat2",
					"default_value" => false
			)
		);

		add_settings_field(
			'webTrekk_cat3',
			__( 'Webtrekk cat 3', 'mpat' ),
			array(FormHelper::class, "text_field_render"),
			'mpat-analytics',
			'webTrekk_config',
			array(
					"option_name" => self::OPTION_NAME,
					"field_name" => "cat3",
					"default_value" => false
			)
		);

		add_settings_field(
			'webTrekk_cat4',
			__( 'Webtrekk cat 4', 'mpat' ),
			array(FormHelper::class, "text_field_render"),
			'mpat-analytics',
			'webTrekk_config',
			array(
					"option_name" => self::OPTION_NAME,
					"field_name" => "cat4",
					"default_value" => false
			)
		);
	}
	
	static function get_config() {
		return get_option(self::OPTION_NAME, array(
				"enable" => false,
				"url" => null,
				"siteid" => null,
		));
	}
	static function register_frontend_variables($systems) {
		$webTrekk_config = self::get_config();
		
		if ($webTrekk_config["enable"]) {
			$systems["piwik"] = $webTrekk_config;
		}
		return $systems;
	}

	static function print_config_script() {
		$webTrekk_config = self::get_config();
		if ($webTrekk_config["enable"]) {
			?>
            <script type="text/javascript">
			//<![CDATA[
	        	var mpatWebTrekkConfig = <?= json_encode($webTrekk_config) ?>
			//]]>
	        </script>
            <?php
		}
	}
}