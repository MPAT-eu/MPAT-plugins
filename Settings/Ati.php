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
 * Thomas Tröllmich  (thomas.troellmich@fokus.fraunhofer.de)
 **/
namespace MPAT\Settings;

class Ati {
	
	const OPTION_NAME = "ati_params";
	
	static function register_analytics() {
		add_action("admin_init", array(self::class, "register_settings"));
		add_filter("mpat_analytics_variables", array(self::class, "register_frontend_variables"));
		add_action("mpat_analytics_scripts", array(self::class, "print_config_script"));
	}

	static function register_settings() {
		
		register_setting( 'mpat-analytics', self::OPTION_NAME );
		
		add_settings_section(
			'ati_config',
			__( 'ATI configuration', 'mpat' ),
			array(),
			'mpat-analytics'
		);
		
		add_settings_field(
			'ati_enabled',
			__( 'Enable ATI tracking', 'mpat' ),
			array(FormHelper::class, "checkbox_field_render"),
			'mpat-analytics',
			'ati_config',
			array(
					"option_name" => self::OPTION_NAME,
					"field_name" => "enable",
					"default_value" => false
			)
		);
		
		add_settings_field(
			'ati_site',
			__( 'ATI Site-ID', 'mpat' ),
			array(FormHelper::class, "text_field_render"),
			'mpat-analytics',
			'ati_config',
			array(
					"option_name" => self::OPTION_NAME,
					"field_name" => "site",
					"default_value" => false
			)
		);
		
		add_settings_field(
			'ati_lvl2',
			__( 'ATI Level-2-ID', 'mpat' ),
			array(FormHelper::class, "text_field_render"),
			'mpat-analytics',
			'ati_config',
			array(
					"option_name" => self::OPTION_NAME,
					"field_name" => "lvl2",
					"default_value" => false
			)
		);
		
	}
	
	static function get_config() {
		return get_option(self::OPTION_NAME, array(
				"enable" => false,
				"site" => null,
				"lvl2" => null,
				
		));
	}
	static function register_frontend_variables($systems) {
		$ati_config = self::get_config();
		
		if (isset($ati_config["enable"])) {
			$systems["ati"] = $ati_config;
		}
		return $systems;
	}

	static function print_config_script() {
		$ati_config = self::get_config();
		if (isset($ati_config["enable"])) {
			?>
				<script type="text/javascript">
				//<![CDATA[
				window.setTimeout(function() {
					
					window.lvl2 = "<?= $ati_config["lvl2"]?>";

					if (typeof ATInternet  !== 'undefined') window.ATTag = new ATInternet.Tracker.Tag({site: "<?= $ati_config["site"]?>"});
					else {
						var el = document.createElement("script");
						el.type = "text/javascript";
						el.src = "<?= plugin_dir_url(__FILE__)?>../js/smarttag.js";
						el.onload = el.onreadystatechange = function () {
							if (this.readyState == "loaded" || this.readyState == "complete" || !this.readyState) {
								if (typeof ATInternet  !== 'undefined') window.ATTag = new ATInternet.Tracker.Tag({site: "<?= $ati_config["site"]?>"});
							}
						}
						var head = document.getElementsByTagName("head")[0];
						if (head) head.appendChild(el);
					}
				},1);
				//]]>
				</script>
            <?php
		}
	}
}