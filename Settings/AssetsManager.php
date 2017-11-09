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

class AssetsManager {

	static function menu_page(  ) {

		$customPages = array();
		$customPages = apply_filters("mpat_register_assets_page", $customPages);
		
		// Temporary give same permissions of pages
		add_menu_page( __('Assets', 'mpat'), __('Assets', 'mpat'), 'edit_pages', 'mpat-assets-manager', array(self::class, "assets_list"), 'dashicons-format-gallery' );
		add_submenu_page( 'mpat-assets-manager', __('Assets Library', 'mpat'), __('Library', 'mpat'), 'edit_pages', 'mpat-assets-manager', array(self::class, "assets_list") );
		
		foreach ($customPages as $customPage) {
			add_submenu_page( 
					'mpat-assets-manager', 
					$customPage["page_title"],
					$customPage["menu_title"], 
					isset($customPage["capability"]) ? $customPage["capability"] : 'edit_pages', 
					$customPage["menu_slug"],
					$customPage["callback"]
			);
		}
		
		add_submenu_page( 'mpat-assets-manager', __('Settings', 'mpat'), __('Settings', 'mpat'), 'manage_mpat_options', 'mpat-assets-settings', array(self::class, "assets_settings") );
		
	}
	
	static function register_settings() {

		register_setting( 'mpat-asset-api', 'mpat_asset_settings' );
		
	}

	static function assets_list(  ) {
		?>
        Here will go the react interface for assets
        <div id="assets-manager-container"></div>
        <?php 		
	}
	
	static function assets_settings(  ) {
		?>
        <form action='options.php' method='post'>
    
			<h2>MPAT asset API</h2>
			<?php
			settings_fields( 'mpat-asset-api' );
			do_settings_sections( 'mpat-asset-api' );
			submit_button();
			?>
        </form>
		<?php
		//react renders into the application manager container
	}
}