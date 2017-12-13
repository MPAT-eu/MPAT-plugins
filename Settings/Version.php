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
 * Benedikt Vogel    (vogel@irt.de)
 *
 **/
namespace MPAT\Settings;

class Version {

	static function menu_page(  ) {
		add_submenu_page( 'mpat-application-manager', 'MPAT Version', 'Version', 'manage_options', 'mpat-version', array(self::class, "version_page") );
	}
	
	static function readFile($type){
		$path = dirname(__file__).'/../js/'.$type;
		return file($path)[0];
	}

	static function version_page(  ) {
		$hash = self::readFile('COMMITHASH');
		$version = self::readFile('VERSION');
		?>
		<h1>MPAT Version</h1>
		<table>
		<tr>
			<td><b>Current Version*<b></td>
			<td><?=$version?></td>
		</tr><tr>
			<td><b>CommitHash</b></td>
			<td><?=$hash?></td>
		</tr>
		</table>
		<i>*) git-describe</i>
		<?php
	}
		
}