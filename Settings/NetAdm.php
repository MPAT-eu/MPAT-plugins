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
 * Jean-Philippe Ruijs (github.com/jeanphilipperuijs)
 *
 **/
namespace MPAT\Settings;

class NetAdm
{
    const WEBSITE_NAV_MODEL = "website";
    const SLIDEFLOW_NAV_MODEL = "slideflow";
    const TIMELINE_NAV_MODEL = "timeline";
    
    static function menu_page()
    {
        add_menu_page (
                    __("App Model", "mpat"),
                    __("App Model", "mpat"),
        "manage_options",
        "mpat-application-model",
        array (self::class,"options_page"),
        "dashicons-admin-multisite"
        );
    }
    
    static function register_settings()
    {
        register_setting( 'mpat-application-model', 'mpat_application_manager' );
            
        add_settings_section (
					"main_section",
					__("Choose Application Model", "mpat" ),
					array (),
					"mpat-application-model"
        );
            
        add_settings_field(
					"mpat_navigation_model",
					__( "", "mpat" ),
					//null,
					array(FormHelper::class, "button_select_field_render"),
					"mpat-application-model",
					"main_section",
					array(
						"option_name" => "mpat_application_manager",
						"field_name" => "navigation_model",
						"available_values" => array(
							self::WEBSITE_NAV_MODEL => "Website",
							self::SLIDEFLOW_NAV_MODEL => "Slideflow",
							self::TIMELINE_NAV_MODEL => "Timeline"
							)
					)
        );


        
        /*
        add_settings_field(
        'mpat_navigation_model',
        //__( 'tests compare', 'mpat' ),
        null,
        array(FormHelper::class, "select_field_render"),
        'mpat-application-model',
        'main_section',
        array(
        "option_name" => "mpat_application_manager",
        "field_name" => "navigation_model",
        "available_values" => array(
            "" => "-- Select navigation model --",
            self::WEBSITE_NAV_MODEL => "Website",
            self::SLIDEFLOW_NAV_MODEL => "Slideflow",
            self::TIMELINE_NAV_MODEL => "Timeline"
        )
        )
        );
*/
/*
        add_settings_field(
        "mpat_slideflow_settings",
        //__( "Slideflow pages order', 'mpat' ),
        null,
        function() {
        echo "<div id=\"application-model-container\"></div>";
        },
        "mpat-application-model",
        "main_section"
        );
		*/
    }
    static function options_page()
    {
        ?>
 
       <form id="application-model-form" action="../options.php" method="post">

    <input type="hidden" name="hack" value="the planet" />
    <?php
        settings_fields( "mpat-application-model" );
        do_settings_sections("mpat-application-model");
        ?>
  </form>
    <?php
    }
}