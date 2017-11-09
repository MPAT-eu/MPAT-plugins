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
 * Jean-Claude Dufourd (jean-claude.dufourd@telecom.paristech.fr)
 *
 **/
$agent = strtolower(getenv('HTTP_USER_AGENT'));
if (strpos($agent, "hbbtv") !== false){
header("Content-Type: application/vnd.hbbtv.xhtml+xml;charset=UTF-8");
?>
<!DOCTYPE html PUBLIC "-//HbbTV//1.1.1//EN" "http://www.hbbtv.org/dtd/HbbTV-1.1.1.dtd">
<html xmlns='http://www.w3.org/1999/xhtml'>
<?php
} else {
header('Content-Type: text/html;charset=UTF-8');
?>
<!DOCTYPE html>
<html>
<?php } ?>
<head>
  <meta http-equiv="Content-Type" content="application/vnd.hbbtv.xml+xhtml;charset=utf-8" />
  <title>TimeLine</title>
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
  var TVDebugServerInterface = (function () {
    var serverUrl = location.protocol + '//' + location.hostname + ':' + 3000;
    var exports = {};
    exports.log = function (message) {
      //if (location.hash === "#tvdebug") {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", serverUrl + "/log?message=" + encodeURIComponent(message));
        xhr.send();
      //}
    };
    return exports;
  })();
  TVDebugServerInterface.log(">>>>>>>>>>>>>>>>>> loading "+window.location.href);
  if (hbbtvlib_initialize() || (!!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0)){
    TVDebugServerInterface.log("after HbbTV initialisation");
    setTimeout(function(){
      hbbtvlib_show();
      TVDebugServerInterface.log("after HbbTV show");
    },10);
  }
</script>
<?php
$applicationManager = get_option("mpat_application_manager");
if (!$applicationManager["navigation_model"]) unset($applicationManager["navigation_model"]);
$applicationManager = wp_parse_args($applicationManager, array(
  "smooth_navigation" => false,
  "app_language" => "en",
  "slideflow_arrows" => false,
  "slideflow_experimental" => false,
  "slideflow_orientation" => "vertical"
));
// actually, force model to be timeline
$applicationManager["navigation_model"] = "timeline";
// cast to boolean, otherwise true values would be string "1"
foreach (array("smooth_navigation", "slideflow_arrows", "slideflow_experimental", "slideflow_arrows") as $boolItem) {
  $applicationManager[$boolItem] = (bool)$applicationManager[$boolItem];
}
$applicationIcons = array();
$applicationIconsOptions = array(
  'mpat_icons_video_loading'
);
foreach ($applicationIconsOptions as $option) {
  $applicationIcons[str_replace("mpat_", "", $option)] = get_option($option);
}
$remoteIcons = array();
$remoteIconsOptions = array(
  'mpat_icons_ok', 'mpat_icons_back', 'mpat_icons_red', 'mpat_icons_blue', 'mpat_icons_green', 'mpat_icons_yellow',
  'mpat_icons_pause', 'mpat_icons_play', 'mpat_icons_forward', 'mpat_icons_rewind', 'mpat_icons_0','mpat_icons_1',
  'mpat_icons_2', 'mpat_icons_3',
  'mpat_icons_4', 'mpat_icons_5', 'mpat_icons_6', 'mpat_icons_7', 'mpat_icons_8', 'mpat_icons_9'
);
foreach ($remoteIconsOptions as $option) {
  $remoteIcons[str_replace("mpat_icons_", "button_", $option)] = get_option($option);
}
?>
<script type='text/javascript'>
  TVDebugServerInterface.log("before load data");
  /* <![CDATA[ */
  var MPATGlobalInformation = {
    TimeLineInfoString: <?php

function updateClone($postid) {
  $meta = get_post_meta($postid, 'mpat_content', true);
  /* update clones */
  $content = $meta['content'];
  forEach ($content as $boxKey => $boxValue) {
    forEach ($boxValue as $stateKey => $stateValue) {
      if ($stateValue['type'] == 'clone') {
        $componentData = $stateValue['data'];
        if (array_key_exists('boxId', $componentData) &&
          array_key_exists('stateId', $componentData)) {
          $boxId = $componentData['boxId'];
          $stateId = $componentData['stateId'];
          $modelPageMeta = get_post_meta($stateValue['data']['pageId'], 'mpat_content', true);
          $tmp = $modelPageMeta['content'];
          if (array_key_exists($boxId, $tmp) && array_key_exists($stateId, $tmp[$boxId])) {
            $meta['content'][$boxKey][$stateKey] = $tmp[$boxId][$stateId];
            continue 2;
          }
        }
      }
    }
  }
  /* end update clones */
  return $meta;
}

    // get the meta and layout from the db
    $opt = get_option("timeline_scenario");
    $cbid = get_current_blog_id();
    if ($opt['backComponent'] !== null) {
      $opt['backComponent']['meta'] = updateClone($opt['backComponent']['postid']);
      $opt['backComponent']['meta']['layout'] =
        get_post_meta($opt['backComponent']['meta']['layoutId'],
        'mpat_content', true)['layout'];
    }
    $nbranges = count($opt['ranges']);
    for($i = 0; $i < $nbranges; $i++) {
      $meta = updateClone($opt['ranges'][$i]['postid']);
      $layout = get_post_meta($meta['layoutId'], 'mpat_content', true);
      $opt['ranges'][$i]['meta'] = $meta;
      $opt['ranges'][$i]['meta']['layout'] = $layout['layout'];
    }
    echo json_encode($opt);
    date_default_timezone_set('Europe/Paris');
    ?>,
    now: <?php echo date("{\y: Y, \m: m, \d: d, \h: H, \i: i, \s: s}", time()); ?>,
    application_manager: <?php echo json_encode($applicationManager); ?>,
    icons: {
      application: <?php echo json_encode($applicationIcons); ?>,
      remote: <?php echo json_encode($remoteIcons); ?>
    },
    analytics: []
  };
  var wpApiSettings = {"root": "<?php echo esc_url_raw( get_rest_url() ); ?>",
    "nonce": "<?php echo wp_create_nonce( 'wp_rest' ); ?>",
    "versionString": "wp/v2/"};
  var ajaxurl = "<?php echo admin_url('admin-ajax.php'); ?>";
  /* ]]> */
  TVDebugServerInterface.log("after load data, before mpat_core.min.js");
</script>
<script type='text/javascript' src='<?php echo WP_PLUGIN_URL; ?>/mpat-plugins/js/mpat_core.min.js'></script>
<script type="text/javascript">
  TVDebugServerInterface.log("after mpat_core.min.js");
  if (location.hash === '#nodebug') {
    let c = document.getElementById('console');
    if (c) c.style.display = 'none';
  }
</script>
</body>
</html>
