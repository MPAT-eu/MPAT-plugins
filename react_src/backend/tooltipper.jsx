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
import React from 'react';
import { generateId } from '../functions';

/*
  EXAMPLE CSS

  .mpat .tooltip {
    position: relative;
    font-family: 'Source Sans Pro', sans-serif;
  }

  .mpat .tooltip .tooltiptext {
    opacity: 0;
    display: inline-block;
    visibility: hidden;
    position: absolute;
    padding: 25px 15px 25px 15px;
    transition: opacity 0.35s;
    -moz-transition: opacity 0.35s;
    -webkit-transition: opacity 0.35s;
    transition-delay: 0.35s;
    -webkit-transition-delay: 0.35s;
    z-index: 3;
  }

  .mpat .tooltip .tooltiptext.blue:before{
    content:'';
    width:0;
    height:0;
    position:absolute;
    border-top: 8px transparent ;
    border-bottom: 8px solid #43b4f9;
    border-right:8px solid transparent;
    border-left:8px solid transparent;
    top:-8px;
    left: 90px;
  }

  .mpat .tooltip:hover .tooltiptext{
    opacity: 0.88;
    visibility: visible;
    min-width: 160px;
    height: auto;
    display: inline-block;
    font-size: 14pt;
    font-weight: lighter;
    font-kerning: auto;
    text-align: center;
    top: 38px;
    left: 0px;
    position: absolute;
    z-index: 3;
  }

  .mpat .tooltip:hover .tooltiptext.white {
    color:#43b4f9;
    background-color: white;
    border: 2px dashed #43b4f9;
  }
  .mpat .tooltip:hover .tooltiptext.blue {
    color: white;
    background-color:#43b4f9;
    border: 2px #3994d8;
    border-radius: 3px;
  }
*/

export let tooltipConf = {
  tagType: 'div',
  cnWrap: 'tooltip',
  ttPrefix: 'tooltiptext',
  white: 'white',
  blue: 'blue',
  delay: 1850
};
/**
 * 
 * @param {*} content inner html or inner text
 * @param {*} popUpText text message to show on hover
 * @param {*} tag div, span, et.mpat .tooltip {
    position: relative;
    font-family: 'Source Sans Pro', sans-serif;
}
.mpat .tooltip .tooltiptext {
    opacity: 0;
    display: none;
    position: absolute;
    padding: 25px 15px 25px 15px;
}
.mpat .tooltip .tooltiptext.blue:before{
    content:'';
    display:block;
    width:0;
    height:0;
    position:absolute;
    border-top: 8px transparent ;
    border-bottom: 8px solid #43b4f9;
    border-right:8px solid transparent;
    border-left:8px solid transparent;
    top:-8px;
    left: 90px;
   
}
.mpat .tooltip:hover .tooltiptext{
    opacity: 0.88;
    transition: opacity 0.6s;
    -moz-transition: opacity 0.6s;
    -webkit-transition: opacity 0.6s;
    min-width: 160px;
    height: auto;
    display: inline-block;
    z-index: 10;
    font-size: 14pt;
    font-weight: lighter;
    font-kerning: auto;
    text-align: center;
    top: 38px;
    left: 0px;
    position: absolute;

}
.mpat .tooltip:hover .tooltiptext.white {
    color:#43b4f9;
    background-color: white;
    border: 2px dashed #43b4f9;
}
.mpat .tooltip:hover .tooltiptext.blue {
    color: white;
    background-color:#43b4f9;
    border: 2px #3994d8;
    border-radius: 3px;
}
*/
/**
 * @param {*} variant white/blue tooltip style, default white
 * @param {*} debug show stuff in console
 */
export function getTooltipped(content, popUpText, tag = tooltipConf.tagType, variant = mpat_tt.tooltips_style, debug = false) {
  let delay = Number(mpat_tt.tooltips_delay)/1000 || tooltipConf.delay;
  let styleopa = {
    transition : `opacity 0.35s`,
    WebkitTransition : `opacity 0.35s`,
    MozTransition : `opacity 0.35s`,
    transitionDelay : `${delay}s`,
    WebkitTransitionDelay : `${delay}s`,
    MozTransitionDelay : `${delay}s`
  };
  if (mpat_tt.tooltips_active === 'on') {
    if (debug || mpat_tt.tooltips_debug) console.log('tooltipper', tag, variant, popUpText, content,delay);

    if (variant !== tooltipConf.white && variant !== tooltipConf.blue) {
      variant = tooltipConf.white;
      console.log(`Warning: no valid variant type set (white/blue), defaulting to ${variant}`);
    }

    if (tag === tooltipConf.tagType) {
      return (<div className={`${tooltipConf.cnWrap} ${variant}`}>
        {content}
        <div className={`${tooltipConf.ttPrefix} ${variant}`} style={styleopa}>
          {popUpText}
        </div>
      </div>);
    }
    return React.createElement(tag, {
      className: `${tooltipConf.cnWrap} ${variant}`,
      key: generateId()
    }, [
        content,
        React.createElement(tag, {
          className: `${tooltipConf.ttPrefix} ${variant}`,
          key: generateId(),
          style: styleopa
        }, popUpText)
      ]);
  }
  return content;
}
