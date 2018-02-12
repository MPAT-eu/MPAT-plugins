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
 * Jean-Claude Dufourd (jean-claude.dufourd@telecom-paristech.fr
 *
 **/
/**
 * Generate Digital Storage Media Command and Control (DSM-CC) XML object based on WordPress "dsmcc" option.
 * @author Jean-Philippe Ruijs
 */
    header("Content-Type: text/xml;");
    $default_values = array('id'=>1, 'tag'=>9, 'name'=>'id1');
    $dsmcc = get_option("dsmcc", $default_values);
    $dsmcctag = $dsmcc['tag'];
    $dsmccid = $dsmcc['id'];
    $dsmccname = $dsmcc['name'];
    echo '<dsmcc xmlns="urn:dvb:mis:dsmcc:2009">
  <dsmcc_object component_tag="'.$dsmcctag.'">
    <stream_event stream_event_id="'.$dsmccid.'" stream_event_name="'.$dsmccname.'"/>
  </dsmcc_object>
</dsmcc>';
?>
