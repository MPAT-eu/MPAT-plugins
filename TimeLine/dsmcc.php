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
 * Jean-Claude Dufourd (jean-claude.dufourd@telecom-paristech.fr
 *
 **/
/**
 * Generate Digital Storage Media Command and Control (DSM-CC) XML object based on WordPress "dsmcc" option.
 * @author Jean-Philippe Ruijs
 */
    header("Content-Type: text/xml;");
    $default_values = json_encode(array('id'=>1, 'tag'=>9, 'name'=>'id1'));
    $dsmcc_option = get_option("dsmcc", $default_values);
    $dsmcc = json_decode($dsmcc_option, true);
    echo '<?xml version="1.0" encoding="utf-8"?>
<dsmcc xmlns="urn:dvb:mis:dsmcc:2009">
  <dsmcc_object component_tag="'.$dsmcc['tag'].'">
    <stream_event stream_event_id="'.$dsmcc['id'].'" stream_event_name="'.$dsmcc['name'].'"/>
  </dsmcc_object>
</dsmcc>';
?>
