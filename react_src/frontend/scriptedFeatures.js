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
 * Jean-Claude Dufourd (jean-claude.dufourd@telecom-paristech.fr
 *
 **/
"use strict";
import { application } from './appData';

export function registerScriptedFeatures() {
  window.TVDebugServerInterface = TVDebugServerInterface();
  window.TVDebugServerInterface.log(">>>>>>>>>>>>>>>>>> loading " + window.location.href);
  if (hbbtvlib_initialize() || (!!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0)) {
    window.TVDebugServerInterface.log("after HbbTV initialisation");
    setTimeout(function () {
      hbbtvlib_show();
      window.TVDebugServerInterface.log("after HbbTV show");
    }, 10);
  }
  window.TVDebugServerInterface.log("before RedButtonFader");
  window.RedButtonFader = RedButtonFader();
  window.TVDebugServerInterface.log("after RedButtonFader");
}

export function TVDebugServerInterface() {
  var serverUrl = location.protocol + '//' + location.hostname + ':' + 3000;
  var exports = {};
  exports.log = function (message) {
    if (location.hash === "#tvdebug") {
      var xhr = new XMLHttpRequest();
      xhr.open("GET", serverUrl + "/log?message=" + encodeURIComponent(message));
      xhr.send();
    }
  };
  return exports;
}

export function RedButtonFader () {
  var exports = {}, progress;
  // the Page class in the front end reads this RedButtonMode
  // which can take as values:
  // all : all pages can be hidden by the red button
  // some : only pages with hideOnRed can be hidden by the red button (set in Page Editor)
  // none : global of the red button feature (overrides page settings)
  exports.RedButtonMode = 'all';
  if (application.application_manager.red_button_config !== "") {
    // get value from application settings
    exports.RedButtonMode = application.application_manager.red_button_config;
  }
  exports.defaultText = 'Press RED button to show again';
  if (application.application_manager.red_button_text !== "") {
    // get value from application settings
    exports.defaultText = application.application_manager.red_button_text;
  }
  exports.resolution = 10; // 10 updates per second
  exports.durationOnScreen = 10 * exports.resolution; // 10s on screen
  if (application.application_manager.red_button_onscreen !== "") {
    // get value from application settings
    exports.durationOnScreen = parseInt(application.application_manager.red_button_onscreen) * exports.resolution;
  }
  exports.totalDuration = 300 * exports.resolution; // 5m total period
  if (application.application_manager.red_button_duration !== "") {
    // get value from application settings
    exports.totalDuration = parseInt(application.application_manager.red_button_duration) * exports.resolution;
  }
  exports.animationDuration = 2 * exports.resolution; // animation 2s
  if (application.application_manager.red_button_animation !== "") {
    // get value from application settings
    exports.animationDuration = parseInt(application.application_manager.red_button_animation) * exports.resolution;
  }
  exports.animationMode = 'position' // can be position or fade
  if (application.application_manager.red_button_mode !== "") {
    // get value from application settings
    exports.animationMode = application.application_manager.red_button_mode;
  }
  exports.animatedPosField = 'bottom';
  if (application.application_manager.red_button_posfield !== "") {
    // get value from application settings
    exports.animatedPosField = application.application_manager.red_button_posfield;
  }
  exports.posFieldIn = 0; // value of bottom when in
  exports.posFieldOut = -30; // value of bottom when out
  if (application.application_manager.red_button_posout !== "") {
    // get value from application settings
    exports.posFieldOut = parseInt(application.application_manager.red_button_posout);
  }
  exports.fade = function (div, i) {
    if (exports.animationMode === 'fade') {
      if (exports.durationOnScreen > i) {
        div.style.opacity = 1;
      } else if ((exports.durationOnScreen + exports.animationDuration) > i) {
        progress = (i - exports.durationOnScreen) / exports.animationDuration;
        div.style.opacity = (1 - progress);
      } else if ((exports.totalDuration - exports.animationDuration) > i) {
        div.style.opacity = 0;
      } else if (exports.totalDuration > i) {
        progress = -(i - exports.totalDuration) / exports.animationDuration;
        div.style.opacity = (1 - progress);
      } else {
        div.style.opacity = 1;
        i = 0;
      }
    } else {
      if (exports.durationOnScreen > i) {
        div.style[exports.animatedPosField] = exports.posFieldIn + "px";
      } else if ((exports.durationOnScreen + exports.animationDuration) > i) {
        progress = (i - exports.durationOnScreen) / exports.animationDuration;
        div.style[exports.animatedPosField] = (exports.posFieldOut * progress - exports.posFieldIn * (1 - progress)) + "px";
      } else if ((exports.totalDuration - exports.animationDuration) > i) {
        div.style[exports.animatedPosField] = exports.posFieldOut + "px";
      } else if (exports.totalDuration > i) {
        progress = -(i - exports.totalDuration) / exports.animationDuration;
        div.style[exports.animatedPosField] = (exports.posFieldOut * progress - exports.posFieldIn * (1 - progress)) + "px";
      } else {
        div.style[exports.animatedPosField] = exports.posFieldIn + "px";
        i = 0;
      }
    }
    setTimeout(function() {exports.fade(div, i + 1)}, 1000/exports.resolution);
  };
  exports.start = function () {
    window.TVDebugServerInterface.log("start red button fader");
    exports.fade(document.getElementById("MPATRedButtonDiv"), 0);
  };
  exports.active = false;
  return exports;
}
