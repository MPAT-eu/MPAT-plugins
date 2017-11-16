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
 * Jean-Philippe Ruijs (github.com/jeanphilipperuijs)
 * Stefano Miccoli (stefano.miccoli@finconsgroup.com)
 **/
namespace MPAT\Settings;

class Analytics
{
    static function menu_page()
    {
        add_submenu_page( 'mpat-application-manager',
        __('Analytics systems', 'mpat'),
        __('Analytics', 'mpat'),
        'manage_mpat_options', 'mpat-analytics', array(self::class, "analytics_page") );
    }
    
    static function analytics_page()
    {
        ?>
        <form id="analytics-form" action='options.php' method='post'>
    
            <?php
            settings_fields( 'mpat-analytics' );
            do_settings_sections("mpat-analytics");
            submit_button();
            ?>
        </form>
        <?php
    }
}
