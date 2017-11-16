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
 * Marco Ferrari (marco.ferrari@finconsgroup.com)
 *
 **/
jQuery(document).ready(function($){

});

PageManagement = PageManagement || {};

PageManagement.setCalendar = function(base_id) {
	$ = jQuery;

	options = {
				dayNamesMin: PageManagement.datepicker.daynames,//infused by wp_localize script
				monthNames: PageManagement.datepicker.monthnames,//infused by wp_localize script
				dateFormat: 'dd.mm.yy',
				minDate: new Date(),
				showOtherMonths: true,
				firstDay: 1
			};

	$('#' + base_id).datepicker(options);

	$('#' + base_id).on('change', function(evt) { PageManagement.checkTime(); });
	$('#' + base_id + '_time').on('change', function(evt) { PageManagement.checkTime(); });
	$('#' + base_id + '_time_mins').on('change', function(evt) { PageManagement.checkTime(); });

}

PageManagement.restoreValues = function() {

	document.getElementById('mpat_sc_popup_pubdate').value = document.getElementById('mpat_sc_publish_pubdate').value;
	document.getElementById('mpat_sc_popup_pubdate_time').value = document.getElementById('mpat_sc_publish_pubdate_time').value;
	document.getElementById('mpat_sc_popup_pubdate_time_mins').value = document.getElementById('mpat_sc_publish_pubdate_time_mins').value;

	PageManagement.checkTime();

}

PageManagement.setValues = function() {

	document.getElementById('mpat_sc_publish_pubdate').value = document.getElementById('mpat_sc_popup_pubdate').value;
	document.getElementById('mpat_sc_publish_pubdate_time').value = document.getElementById('mpat_sc_popup_pubdate_time').value;
	document.getElementById('mpat_sc_publish_pubdate_time_mins').value = document.getElementById('mpat_sc_popup_pubdate_time_mins').value;

}

PageManagement.checkTime = function() {

	PageManagement.setValues();

	//wordpress time
	var wp_time = PageManagement.datepicker.time;
	wp_time = wp_time.replace(":","");

	//wordpress date
	var wp_date = PageManagement.datepicker.date;
	wp_date = wp_date.split(".");
	wp_date = wp_date[1]+","+wp_date[0]+","+wp_date[2];
	wp_date = new Date(wp_date).getTime();

	//selected time
	var selected_time = document.getElementById('mpat_sc_publish_pubdate_time').value + ':' + document.getElementById('mpat_sc_publish_pubdate_time_mins').value;
	selected_time = selected_time.replace(":","");

	//selected date
	var selected_date = document.getElementById('mpat_sc_publish_pubdate').value;
	selected_date = selected_date.split(".");
	selected_date = selected_date[1]+","+selected_date[0]+","+selected_date[2];
	selected_date = new Date(selected_date).getTime();

	if ((selected_date < wp_date) || ((selected_date === wp_date) && (selected_time < wp_time)))  {
		document.getElementById('mpat_sc_popup_pastmsg').style.display = "block";
	} else {
		document.getElementById('mpat_sc_popup_pastmsg').style.display = "none";
	}
};
