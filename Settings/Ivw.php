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

class Ivw {
	
	const OPTION_NAME = "ivw_params";
	
	static function register_analytics() {
		add_action("admin_init", array(self::class, "register_settings"));
		add_filter("mpat_analytics_variables", array(self::class, "register_frontend_variables"));
		add_action("mpat_analytics_scripts", array(self::class, "print_config_script"));
	}

	static function register_settings() {
		
		register_setting( 'mpat-analytics', self::OPTION_NAME );
		
		add_settings_section(
			'ivw_config',
			__( 'Ivw configuration', 'mpat' ),
			array(),
			'mpat-analytics'
		);
		
		add_settings_field(
			'ivw_enabled',
			__( 'Enable IVW tracking', 'mpat' ),
			array(FormHelper::class, "checkbox_field_render"),
			'mpat-analytics',
			'ivw_config',
			array(
					"option_name" => self::OPTION_NAME,
					"field_name" => "enable",
					"default_value" => false
			)
		);
		
		add_settings_field(
			'ivw_sc',
			__( 'IVW SC (cp-code)', 'mpat' ),
			array(FormHelper::class, "text_field_render"),
			'mpat-analytics',
			'ivw_config',
			array(
					"option_name" => self::OPTION_NAME,
					"field_name" => "sc",
					"default_value" => false
			)
		);
		
		add_settings_field(
			'ivw_ak',
			__( 'IVW AK (st-code)', 'mpat' ),
			array(FormHelper::class, "text_field_render"),
			'mpat-analytics',
			'ivw_config',
			array(
					"option_name" => self::OPTION_NAME,
					"field_name" => "ak",
					"default_value" => false
			)
		);
		
	}
	
	static function get_config() {
		return get_option(self::OPTION_NAME, array(
				"enable" => false,
				"ak" => null,
				"sc" => null,
		));
	}
	static function register_frontend_variables($systems) {
		$ivw_config = self::get_config();
		
		if (isset($ivw_config["enable"])) {
			$systems["ivw"] = $ivw_config;
		}
		return $systems;
	}

	static function print_config_script() {
		$ivw_config = self::get_config();
		if (isset($ivw_config["enable"])) {
			?>
				<script type="text/javascript">
				//<![CDATA[
				window.setTimeout(function() {
					var ivw_ak = "<?= $ivw_config["ak"]?>";
					var ivw_sc = "<?= $ivw_config["sc"]?>";

					var po = (typeof szmType !== 'undefined' && szmType == "CP") ? {"st":ivw_ak, "cp":ivw_sc} : {"st":ivw_ak, "xp":ivw_sc};
					if (typeof iom  !== 'undefined') iom.init(po, 1);
					else {
						var el = document.createElement("script");
						el.type = "text/javascript";
						el.src = "https://script.ioam.de/iam.js";
						el.onload = el.onreadystatechange = function () {
							if (this.readyState == "loaded" || this.readyState == "complete" || !this.readyState) {
								if (typeof iom !== 'undefined') iom.init(po,1);
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