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

class ApplicationManager
{
    static function menu_page()
    {
        add_menu_page(__( 'Application Manager', 'mpat' ), 'MPAT', 'manage_mpat_options', 'mpat-application-manager', array(self::class, "options_page"), 'dashicons-hammer' );
        add_submenu_page( 'mpat-application-manager', __( 'Application Manager', 'mpat' ), __( 'Application Manager', 'mpat' ), 'manage_mpat_options', 'mpat-application-manager', array(self::class, "options_page") );
    }
    
    static function register_settings()
    {

        register_setting( 'mpat-application-manager', 'mpat_application_manager' );

        add_settings_section(
            'main_section',
            __( 'Application Manager', 'mpat' ),
            array(),
            'mpat-application-manager'
        );

        add_settings_field(
            'mpat_navigation_model',
            __( 'Navigation model', 'mpat' ),
            function () {
                // react renders into the leadin-nav-model container
                echo "<div id='application-navigation-container' class='leadin-nav-model'></div>";
            },
            'mpat-application-manager',
            'main_section'
        );
        
        add_settings_field(
            'smooth_navigation',
            __( '"Smooth" components navigation <small>(when navigating within components which support this mode, end-user is not required to switch between focuses)</small>', 'mpat' ),
            array(FormHelper::class, "checkbox_field_render"),
            'mpat-application-manager',
            'main_section',
            array(
                "option_name" => "mpat_application_manager",
                "field_name" => "smooth_navigation",
                "default_value" => false
            )
        );

        add_settings_field(
            'root_application_url',
            __( 'Root application url', 'mpat' ),
            array(FormHelper::class, "text_field_render"),
            'mpat-application-manager',
            'main_section',
            array(
                "option_name" => "mpat_application_manager",
                "field_name" => "root_application_url",
                "default_value" => false
            )
        );
        
        add_settings_field(
            'slideflow_experimental',
            __( 'Slideflow experimental mode <small>(optimizes animation steps for better performance)</small>', 'mpat' ),
            array(FormHelper::class, "checkbox_field_render"),
            'mpat-application-manager',
            'main_section',
            array(
                "option_name" => "mpat_application_manager",
                "field_name" => "slideflow_experimental",
                "default_value" => false
            )
        );
        
        
        add_settings_field(
            'slideflow_arrows',
            __( 'Slideflow show arrows', 'mpat' ),
            array(FormHelper::class, "checkbox_field_render"),
            'mpat-application-manager',
            'main_section',
            array(
                "option_name" => "mpat_application_manager",
                "field_name" => "slideflow_arrows",
                "default_value" => true
            )
        );
        add_settings_field(
            'slideflow_orientation',
            __( 'Slideflow orientation', 'mpat' ),
            array(FormHelper::class, "select_field_render"),
            'mpat-application-manager',
            'main_section',
            array(
                "option_name" => "mpat_application_manager",
                "field_name" => "slideflow_orientation",
                "available_values" => array(
                    "vertical" => "Vertical",
                    "horizontal" => "Horizontal"
                )
            )
        );
        
        add_settings_field(
          'mpat_slideflow_settings',
          __( 'Slideflow pages order', 'mpat' ),
            function () {
                // react renders into the application manager container
                echo "<div id='application-manager-container' name='slideflow'></div>";
            },
            'mpat-application-manager',
            'main_section',
          array(
            "option_name" => "mpat_application_manager",
            "field_name" => "slideflow_pages_order"
          )
        );


        ///from irt
        add_settings_field(
            'mpat_language',
            __( 'App Language', 'mpat' ),
            array(FormHelper::class, "select_field_render"),
            'mpat-application-manager',
            'main_section',
            array(
                "option_name" => "mpat_application_manager",
                "field_name" => "app_language",
                "available_values" => array(
                    "en" => "en",
                    "es" => "es",
                    "de" => "de",
                    "fi" => "fi",
                    "fr" => "fr",
                    "it" => "it",
                    "nl" => "nl"
                )
            )
        );
    }

    static function options_page()
    {
        ?>
        <form id="application-manager-form" action="options.php" method="post" class="editHeader">
            <?php
            settings_fields("mpat-application-manager");
            do_settings_sections("mpat-application-manager");
            submit_button();
            ?>
        </form>
        <script>
             
            var assetsPath = '<?php print plugin_dir_url(__FILE__); ?>../assets/';
            var selectedNavModel = '<?php
                $options = get_option('mpat_application_manager');
                print (isset($options['navigation_model']) ? $options['navigation_model'] : 'website');
            ?>';
        </script>
        <?php
    }
}

