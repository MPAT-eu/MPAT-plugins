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
 **/
header('Content-Type: text/html;charset=UTF-8');
?>
<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="application/vnd.hbbtv.xml+xhtml;charset=utf-8"/>
    <title><?php _e('Preview', 'mpat'); ?></title>
  <?php wp_head(); ?>
</head>
<body>
<!-- this next should go to mpat-core.php -->
<div style="visibility: hidden; width: 0pt; height: 0pt;">
    <object id="appMan" type="application/oipfApplicationManager" width="0" height="0"></object>
</div>
<div id="vidcontainer"></div>
<div id="main"></div>
<script type="text/javascript">
    var MPATPreviewDoNotAutostartVideos = true;
    var TVDebugServerInterface = (function () {
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
    })();
    TVDebugServerInterface.log(">>>>>>>>>>>>>>>>>> loading " + window.location.href);
    if (hbbtvlib_initialize() || (!!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0)) {
        TVDebugServerInterface.log("after HbbTV initialisation");
        setTimeout(function () {
            hbbtvlib_show();
            TVDebugServerInterface.log("after HbbTV show");
        }, 10);
    }
</script>
<?php wp_footer(); ?>
<script type="text/javascript">
    window.addEventListener("message", function (event) {
        try {
            window.MPATGlobalInformation.Post.meta = JSON.parse(event.data);
            // console.log(window.MPATGlobalInformation.Post.meta);
            mpat_core.previewRender();
        } catch (e) {
            console.log(e);
        }
    });
    // console.log('going to send ping to parent');
    window.parent.postMessage("init", window.location.origin);
    let c = document.getElementById('console');
    if (c) c.style.display = 'none';
</script>
</body>
</html>
