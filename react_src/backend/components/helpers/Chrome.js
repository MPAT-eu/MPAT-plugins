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
 *
 **/
import React from 'react';
import reactCSS from 'reactcss';

import { ColorWrap, Saturation, Hue, Alpha, Checkboard } from 'react-color/lib/components/common';
import ChromeFields from 'react-color/lib/components/chrome/ChromeFields';
import ChromePointer from 'react-color/lib/components/chrome/ChromePointer';
import ChromePointerCircle from 'react-color/lib/components/chrome/ChromePointerCircle';
import { getTooltipped } from '../../tooltipper.jsx';
import Constants from '../../../constants';

const i18n = Constants.locstr.chrome;

export const Chrome = ({ onChange, disableAlpha, rgb, hsl, hsv, hex, renderers }) => {
  const styles = reactCSS(
    {
      default: {
        picker: {
          background: '#fff',
          borderRadius: '2px',
          boxShadow: '0 0 2px rgba(0,0,0,.3), 0 4px 8px rgba(0,0,0,.3)',
          boxSizing: 'initial',
          width: '450px',
          height: '120px',
          fontFamily: 'Menlo'
        },
        saturation: {
          width: '225px',
          height: '120px',
          position: 'relative',
          borderRadius: '2px 2px 0 0',
          overflow: 'hidden'
        },
        Saturation: {
          radius: '2px 2px 0 0'
        },
        body: {
          width: '185px',
          height: '120px',
          position: 'relative',
          top: '-125px',
          left: '225px',
          padding: '16px 16px 12px'
        },
        controls: {
          display: 'flex'
        },
        color: {
          width: '32px'
        },
        swatch: {
          marginTop: '2px',
          width: '24px',
          height: '24px',
          borderRadius: '8px',
          position: 'relative',
          overflow: 'hidden'
        },
        active: {
          absolute: '0px 0px 0px 0px',
          borderRadius: '8px',
          boxShadow: 'inset 0 0 0 1px rgba(0,0,0,.1)',
          background: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${rgb.a})`,
          zIndex: '2'
        },
        toggles: {
          flex: '1'
        },
        hue: {
          height: '10px',
          position: 'relative',
          marginBottom: '8px'
        },
        Hue: {
          radius: '2px'
        },
        alpha: {
          height: '10px',
          position: 'relative'
        },
        Alpha: {
          radius: '2px'
        }
      },
      disableAlpha: {
        color: {
          width: '22px'
        },
        alpha: {
          display: 'none'
        },
        hue: {
          marginBottom: '0px'
        },
        swatch: {
          width: '10px',
          height: '10px',
          marginTop: '0px'
        }
      }
    }, { disableAlpha });

  return (
    <div style={styles.picker} className="chrome-picker">
      {getTooltipped(<div style={styles.saturation}>
        <Saturation
          style={styles.Saturation}
          hsl={hsl}
          hsv={hsv}
          pointer={ChromePointerCircle}
          onChange={onChange}
        />
      </div>, i18n.ttSaturation)}
      <div style={styles.body}>
        <div style={styles.controls} className="flexbox-fix">
          <div style={styles.color}>
            <div style={styles.swatch}>
              <div style={styles.active} />
              <Checkboard renderers={renderers} />
            </div>
          </div>
          <div style={styles.toggles}>
            {getTooltipped(<div style={styles.hue}>
              <Hue
                style={styles.Hue}
                hsl={hsl}
                pointer={ChromePointer}
                onChange={onChange}
              />
            </div>, i18n.ttHue)}
            {getTooltipped(<div style={styles.alpha}>
              <Alpha
                style={styles.Alpha}
                rgb={rgb}
                hsl={hsl}
                pointer={ChromePointer}
                renderers={renderers}
                onChange={onChange}
              />
            </div>, i18n.ttAlpha)}
          </div>
        </div>
        {getTooltipped(
          <ChromeFields
            rgb={rgb}
            hsl={hsl}
            hex={hex}
            onChange={onChange}
            disableAlpha={disableAlpha}
          />, i18n.ttchromeFields)}
      </div>
    </div>
  );
};

export default ColorWrap(Chrome);
