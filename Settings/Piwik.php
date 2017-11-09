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
 *
 **/
namespace MPAT\Settings;

class Piwik {
	
	const OPTION_NAME = "piwik_params";
	
	static function register_analytics() {
		add_action("admin_init", array(self::class, "register_settings"));
		add_filter("mpat_analytics_variables", array(self::class, "register_frontend_variables"));
		add_action("mpat_analytics_scripts", array(self::class, "print_config_script"));
	}

	static function register_settings() {
		
		register_setting( 'mpat-analytics', self::OPTION_NAME );
		
		add_settings_section(
			'piwik_config',
			__( 'Piwik configuration', 'mpat' ),
			array(),
			'mpat-analytics'
		);
		
		add_settings_field(
			'piwik_enabled',
			__( 'Enable Piwik tracking', 'mpat' ),
			array(FormHelper::class, "checkbox_field_render"),
			'mpat-analytics',
			'piwik_config',
			array(
					"option_name" => self::OPTION_NAME,
					"field_name" => "enable",
					"default_value" => false
			)
		);
		
		add_settings_field(
			'piwik_url',
			__( 'Piwik server URL', 'mpat' ),
			array(FormHelper::class, "text_field_render"),
			'mpat-analytics',
			'piwik_config',
			array(
					"option_name" => self::OPTION_NAME,
					"field_name" => "url",
					"default_value" => false
			)
		);
		
		add_settings_field(
			'piwik_siteid',
			__( 'Piwik site ID', 'mpat' ),
			array(FormHelper::class, "text_field_render"),
			'mpat-analytics',
			'piwik_config',
			array(
					"option_name" => self::OPTION_NAME,
					"field_name" => "siteid",
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
		$piwik_config = self::get_config();
		
		if ($piwik_config["enable"]) {
			$systems["piwik"] = $piwik_config;
		}
		return $systems;
	}

	static function print_config_script() {
		$piwik_config = self::get_config();
		
		if ($piwik_config["enable"]) {
			$piwik_url = rtrim($piwik_config["url"], "/") . "/";
			?>
            <script type="text/javascript">
	        var _paq = _paq || [];
	        _paq.push(['trackPageView']);
	        _paq.push(['enableLinkTracking']);
	        (function() {
	            var u="<?php echo $piwik_url ?>";
	            _paq.push(['setTrackerUrl', u+'piwik.php']);
	            _paq.push(['setSiteId', '<?php echo $piwik_config["siteid"] ?>']);
	            var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
	            g.type='text/javascript'; g.async=true; g.defer=true; g.src=u+'piwik.js'; s.parentNode.insertBefore(g,s);
	        })();
	        </script>
	        <noscript><p><img src="<?php echo $piwik_url ?>piwik.php?idsite=<?php echo $piwik_config["siteid"] ?>" style="border:0;" alt="" /></p></noscript>
            <?php
		}
	}
}