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
 * Miggi Zwicklbauer (miggi.zwicklbauer@fokus.fraunhofer.de)
 * Thomas Tröllmich  (thomas.troellmich@fokus.fraunhofer.de)
 * Benedikt Vogel    (vogel@irt.de)
 *
 **/
import React from 'react';

export function ArrowDown() {
  return (
    <svg
      className="page_arrow_down"
      data-name="page_arrow_down"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
    >
      <path className="cls-1" d="M49.49,68.93a2.92,2.92,0,0,1-2.07-.86l-30-30A2.93,2.93,0,1,1,21.61,34L49.49,61.85,77.38,34a2.93,2.93,0,1,1,4.15,4.15l-30,30A2.92,2.92,0,0,1,49.49,68.93Z" />
    </svg>
  );
}

export function ArrowUp() {
  return (
    <svg
      className="page_arrow_up"
      data-name="page_arrow_up"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
    >
      <path className="cls-1" d="M79.92,68.93a2.92,2.92,0,0,1-2.07-.86L50,40.19,22.08,68.07a2.93,2.93,0,0,1-4.15-4.15l30-30A2.93,2.93,0,0,1,52,34l30,30a2.93,2.93,0,0,1-2.07,5Z" />
    </svg>
  );
}

export function ArrowDownST({ color, activeColor }) {
  const style = `.active path {fill: ${activeColor}} path {fill: ${color};}`;
  return (
    <svg
      className="page_arrow_down_st"
      data-name="page_arrow_down_st"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
    >
      <style>{style}</style>
      <path d="M49.49,68.93a2.92,2.92,0,0,1-2.07-.86l-30-30A2.93,2.93,0,1,1,21.61,34L49.49,61.85,77.38,34a2.93,2.93,0,1,1,4.15,4.15l-30,30A2.92,2.92,0,0,1,49.49,68.93Z" />
    </svg>
  );
}

export function ArrowUpST({ color, activeColor }) {
  const style = `.active path {fill: ${activeColor}} path {fill: ${color};}`;
  return (
    <svg
      className="page_arrow_up_st"
      data-name="page_arrow_up_st"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
    >
      <style>{style}</style>
      <path d="M79.92,68.93a2.92,2.92,0,0,1-2.07-.86L50,40.19,22.08,68.07a2.93,2.93,0,0,1-4.15-4.15l30-30A2.93,2.93,0,0,1,52,34l30,30a2.93,2.93,0,0,1-2.07,5Z" />
    </svg>
  );
}

export function ArrowLeft() {
  return (
    <svg
      className="page_arrow_left"
      data-name="page_arrow_left"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
    >
      <path className="cls-1" d="M62.93,83.91A2.92,2.92,0,0,1,60.86,83l-30-30a2.93,2.93,0,0,1,0-4.15l30-30A2.93,2.93,0,1,1,65,23.13L37.12,51,65,78.9a2.93,2.93,0,0,1-2.07,5Z" />
    </svg>
  );
}

export function ArrowRight() {
  return (
    <svg
      className="page_arrow_right"
      data-name="page_arrow_right"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
    >
      <path className="cls-1" d="M36,83.91a2.93,2.93,0,0,1-2.07-5L61.81,51,33.93,23.13A2.93,2.93,0,0,1,38.08,19l30,30a2.93,2.93,0,0,1,0,4.15l-30,30A2.92,2.92,0,0,1,36,83.91Z" />
    </svg>
  );
}

export function Dot({ radius, color }) {
  return (
    <svg width="16px" height="16px">
      <circle cx="8px" cy="8px" r={radius} style={color} />
    </svg>
  );
}


export function Home() {
  return (
    <svg
      className="home"
      data-name="Home"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
    >
      <path className="cls-1" d="M82.37,44.6,50.32,20.31A1.75,1.75,0,0,0,49.26,20h-.32a1.75,1.75,0,0,0-1.06.36L15.83,44.6a1.75,1.75,0,1,0,2.11,2.79l3.41-2.58v34a1.75,1.75,0,0,0,1.75,1.75h52a1.75,1.75,0,0,0,1.75-1.75v-34l3.41,2.58a1.75,1.75,0,1,0,2.11-2.79ZM43.6,77.08V60.58h11v16.5ZM73.35,42.25V77.08H58.1V58.83a1.75,1.75,0,0,0-1.75-1.75H41.85a1.75,1.75,0,0,0-1.75,1.75V77.08H24.85V42.25s0-.06,0-.09L49.1,23.78,73.36,42.16S73.35,42.22,73.35,42.25Z" />
    </svg>

  );
}

// Audio
export function AudioOn() {
  return (
    <svg
      className="audio_on"
      data-name="Audio_On"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
    >
      <path className="cls-1" d="M52.45,80.35a1.75,1.75,0,0,1-1-.28L27.4,64.37H16.21a1.75,1.75,0,0,1-1.75-1.75V41.68a1.75,1.75,0,0,1,1.75-1.75H27.4l24.1-15.7A1.75,1.75,0,0,1,54.2,25.7V78.6a1.75,1.75,0,0,1-1.75,1.75ZM18,60.87h10a1.75,1.75,0,0,1,1,.28L50.7,75.37V28.93L28.87,43.15a1.75,1.75,0,0,1-1,.28H18Z" />
      <path className="cls-1" d="M60.55,63.27a1.75,1.75,0,0,1-1.24-3,11.5,11.5,0,0,0,0-16.26,1.75,1.75,0,0,1,2.47-2.47,15,15,0,0,1,0,21.21A1.74,1.74,0,0,1,60.55,63.27Z" />
      <path className="cls-1" d="M68.53,67.64a1.75,1.75,0,0,1-1.24-3,17.71,17.71,0,0,0,0-25,1.75,1.75,0,0,1,2.47-2.47,21.21,21.21,0,0,1,0,30A1.74,1.74,0,0,1,68.53,67.64Z" />
      <path className="cls-1" d="M76.3,73.08a1.75,1.75,0,0,1-1.24-3,25.38,25.38,0,0,0,0-35.89,1.75,1.75,0,1,1,2.47-2.47,28.88,28.88,0,0,1,0,40.84A1.74,1.74,0,0,1,76.3,73.08Z" />
    </svg>

  );
}

export function AudioOff() {
  return (
    <svg
      className="audio_off"
      data-name="Audio_Off"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
    >
      <path className="cls-1" d="M53.28,24.16a1.75,1.75,0,0,0-1.79.07L27.4,39.93H16.21a1.75,1.75,0,0,0-1.75,1.75V62.62a1.75,1.75,0,0,0,1.75,1.75H27.4l24.1,15.7A1.75,1.75,0,0,0,54.2,78.6V25.7A1.75,1.75,0,0,0,53.28,24.16ZM50.7,75.37,28.87,61.15a1.75,1.75,0,0,0-1-.28H18V43.43h10a1.75,1.75,0,0,0,1-.28L50.7,28.93Z" />
      <path className="cls-1" d="M74.65,51.83l6.76-6.76a1.75,1.75,0,0,0-2.47-2.47l-6.76,6.76L65.41,42.6a1.75,1.75,0,0,0-2.47,2.47l6.76,6.76L62.94,58.6a1.75,1.75,0,1,0,2.47,2.47l6.76-6.76,6.76,6.76a1.75,1.75,0,0,0,2.47-2.47Z" />

    </svg>

  );
}


// HOTSPOTS

export function HotspotText(bg = 'black', fill = 'white') {
  return (
    <svg
      id="hotspottext"
      data-name="HotspotText"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
    >
      <circle cx="50" cy="50" r="50" fill={bg} />
      <path fill={fill} className="cls-1" d="M50.1,91.9A41.7,41.7,0,1,1,91.7,50.2h0A41.65,41.65,0,0,1,50.1,91.9Zm0-80.2A38.5,38.5,0,1,0,88.6,50.1,38.6,38.6,0,0,0,50.1,11.7Z" />
      <path fill={fill} className="cls-1" d="M64.3,39.5H35.9a1,1,0,0,1-1-1,1.08,1.08,0,0,1,1-1H64.3a1,1,0,0,1,0,2Z" />
      <path fill={fill} className="cls-1" d="M64.3,51.3H35.9a1,1,0,0,1-1-1,1.08,1.08,0,0,1,1-1H64.3a1,1,0,0,1,0,2Z" />
      <path fill={fill} className="cls-1" d="M64.3,63.1H35.9a1,1,0,0,1-1-1,1.08,1.08,0,0,1,1-1H64.3a1,1,0,0,1,0,2Z" />
    </svg>
  );
}


export function HotspotAudio(bg = 'black', fill = 'white') {
  return (
    <svg
      id="hotspotaudio"
      data-name="HotspotAudio"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
    >
      <circle cx="50" cy="50" r="50" fill={bg} />
      <path fill={fill} className="cls-1" d="M50.1,91.9A41.7,41.7,0,1,1,91.7,50.2h0A41.65,41.65,0,0,1,50.1,91.9Zm0-80.2A38.5,38.5,0,1,0,88.6,50.1,38.6,38.6,0,0,0,50.1,11.7Z" />
      <path fill={fill} className="cls-1" d="M50.3,59a7,7,0,0,0,7-7V38.3a7,7,0,1,0-14-1.4V52A7.09,7.09,0,0,0,50.3,59Z" />
      <path fill={fill} className="cls-1" d="M62.5,52.1a1,1,0,0,0-1-1,1.08,1.08,0,0,0-1,1,10.2,10.2,0,0,1-20.4,0,1,1,0,0,0-2,0A12.28,12.28,0,0,0,49.3,64.3v3.8H41.8a1,1,0,0,0,0,2H58.9a1,1,0,0,0,0-2H51.4V64.3A12.35,12.35,0,0,0,62.5,52.1Z" />
    </svg>
  );
}

export function HotspotVideo(bg = 'black', fill = 'white') {
  return (
    <svg
      id="hotspotvideo"
      data-name="HotspotVideo"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
    >
      <circle cx="50" cy="50" r="50" fill={bg} />
      <path fill={fill} className="cls-1" d="M50.1,92.1A41.7,41.7,0,1,1,91.8,50.4h0A41.8,41.8,0,0,1,50.1,92.1Zm0-80.2A38.55,38.55,0,1,0,88.6,50.4,38.52,38.52,0,0,0,50.1,11.9Z" />
      <path fill={fill} className="cls-1" d="M42.7,68.5c-.2,0-.3,0-.4-.1a1.15,1.15,0,0,1-.6-.9V33.4a1.08,1.08,0,0,1,1-1,1.42,1.42,0,0,1,.6.2l22.6,17a1.08,1.08,0,0,1,.2,1.4l-.2.2L43.3,68.3A1.07,1.07,0,0,1,42.7,68.5Z" />
    </svg>
  );
}

export function HotspotLink(bg = 'black', fill = 'white') {
  return (
    <svg
      id="hotspotlink"
      data-name="HotspotLink"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
    >
      <circle cx="50" cy="50" r="50" fill={bg} />
      <path fill={fill} className="cls-1" d="M50,92.1a41.65,41.65,0,1,1,41.7-41.6h0A41.85,41.85,0,0,1,50,92.1Zm0-80.2a38.55,38.55,0,1,0,38.5,38.5A38.52,38.52,0,0,0,50,11.9Z" />
      <path fill={fill} className="cls-1" d="M39,45.93l2.07-6.07a3.8,3.8,0,0,0,.28-1.14.86.86,0,0,0-.29-.65,1,1,0,0,0-.7-.28.92.92,0,0,0-.61.18,1.06,1.06,0,0,0-.31.43c-.07.18-.15.46-.27.88l-1.79,6.07-1.62-5.67c-.15-.52-.27-.89-.36-1.1A1.45,1.45,0,0,0,35,38a1.21,1.21,0,0,0-.81-.24,1.19,1.19,0,0,0-.79.24,1.35,1.35,0,0,0-.4.53c-.08.2-.19.57-.35,1.12L31,45.36l-1.77-6.07a5.23,5.23,0,0,0-.46-1.19.82.82,0,0,0-.75-.3,1,1,0,0,0-.71.29.88.88,0,0,0-.29.64,4.24,4.24,0,0,0,.3,1.14l2.05,6.07.23.65a3.32,3.32,0,0,0,.33.69,1.24,1.24,0,0,0,.44.42,1.33,1.33,0,0,0,.65.15,1.11,1.11,0,0,0,1-.47,6,6,0,0,0,.59-1.52l1.52-5.35,1.57,5.35c.12.44.24.8.34,1.08a1.61,1.61,0,0,0,.45.66,1.44,1.44,0,0,0,1.62,0,1.55,1.55,0,0,0,.43-.57C38.72,46.81,38.86,46.44,39,45.93Z" />
      <path fill={fill} className="cls-1" d="M54.48,45.93l2.07-6.07a3.78,3.78,0,0,0,.28-1.14.86.86,0,0,0-.29-.65,1,1,0,0,0-.7-.28.93.93,0,0,0-.62.18,1.06,1.06,0,0,0-.31.43c-.07.18-.16.47-.27.88l-1.79,6.07-1.62-5.67c-.15-.52-.27-.89-.36-1.1a1.44,1.44,0,0,0-.41-.55,1.21,1.21,0,0,0-.81-.24,1.19,1.19,0,0,0-.79.24,1.35,1.35,0,0,0-.4.53c-.08.2-.19.57-.35,1.12l-1.62,5.68-1.77-6.07a5.2,5.2,0,0,0-.46-1.19.81.81,0,0,0-.75-.3,1,1,0,0,0-.71.29.88.88,0,0,0-.29.64,4.24,4.24,0,0,0,.3,1.14l2.05,6.07.22.62v0a3.39,3.39,0,0,0,.33.69,1.25,1.25,0,0,0,.44.42,1.33,1.33,0,0,0,.65.15,1.11,1.11,0,0,0,1-.47,5.94,5.94,0,0,0,.59-1.52l1.52-5.35,1.57,5.35c.12.44.24.8.34,1.08a1.61,1.61,0,0,0,.45.66,1.44,1.44,0,0,0,1.62,0,1.54,1.54,0,0,0,.43-.57C54.16,46.82,54.3,46.45,54.48,45.93Z" />
      <path fill={fill} className="cls-1" d="M69.93,45.93,72,39.87a3.78,3.78,0,0,0,.28-1.14.86.86,0,0,0-.29-.65,1,1,0,0,0-.7-.28.93.93,0,0,0-.62.18,1.06,1.06,0,0,0-.31.43c-.07.18-.16.47-.27.88L68.3,45.35l-1.62-5.67c-.15-.52-.27-.89-.36-1.1a1.43,1.43,0,0,0-.41-.55,1.21,1.21,0,0,0-.81-.24,1.19,1.19,0,0,0-.79.24,1.34,1.34,0,0,0-.4.53c-.08.2-.2.57-.35,1.12l-1.62,5.68-1.77-6.07a5.12,5.12,0,0,0-.46-1.19.81.81,0,0,0-.75-.3,1,1,0,0,0-.71.29.89.89,0,0,0-.29.64,4.26,4.26,0,0,0,.3,1.14l2.05,6.07.22.62v0a3.36,3.36,0,0,0,.33.69,1.25,1.25,0,0,0,.44.42,1.33,1.33,0,0,0,.65.15,1.11,1.11,0,0,0,1-.47,6,6,0,0,0,.59-1.52L65.1,40.5l1.57,5.35c.12.44.24.8.34,1.08a1.61,1.61,0,0,0,.45.66,1.44,1.44,0,0,0,1.62,0,1.54,1.54,0,0,0,.43-.57C69.61,46.82,69.75,46.45,69.93,45.93Z" />
      <path fill={fill} className="cls-1" d="M48.18,64H44.63a7.27,7.27,0,0,0,7.2,8.27h11a7.27,7.27,0,1,0,0-14.54h-8a9.93,9.93,0,0,1,2.55,3.7H62.8a3.57,3.57,0,1,1,0,7.14h-11A3.57,3.57,0,0,1,48.26,65a3.52,3.52,0,0,1,.14-1Z" />
      <path fill={fill} className="cls-1" d="M51.83,66.29h3.5A7.16,7.16,0,0,0,55.45,65a7.28,7.28,0,0,0-7.27-7.27h-11a7.27,7.27,0,1,0,0,14.54h8.4a9.64,9.64,0,0,1-2.66-3.7H37.21a3.57,3.57,0,1,1,0-7.14h11a3.57,3.57,0,0,1,3.35,4.79A1.27,1.27,0,0,0,51.83,66.29Z" />
    </svg>
  );
}

export function HotspotImage(bg = 'black', fill = 'white') {
  return (
    <svg
      id="hotspotimage"
      data-name="HotspotImage"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
    >
      <circle cx="50" cy="50" r="50" fill={bg} />
      <path fill={fill} className="cls-1" d="M50.08,92.32a41.65,41.65,0,1,1,41.7-41.6h0A41.78,41.78,0,0,1,50.08,92.32Zm0-80.2a38.55,38.55,0,1,0,38.6,38.5A38.52,38.52,0,0,0,50.08,12.12Z" />
      <path fill={fill} className="cls-1" d="M42,49.63a3.82,3.82,0,1,0-3.82-3.82A3.83,3.83,0,0,0,42,49.63Zm-2.42-3.82A2.42,2.42,0,1,1,42,48.23,2.43,2.43,0,0,1,39.62,45.81Z" />
      <path fill={fill} className="cls-1" d="M63.94,54.81l-6.62-7.19a.71.71,0,0,0-1,0l-6,5.38-2.27-2.46a.7.7,0,0,0-1,0l-10.5,9.5a.7.7,0,0,0,.5,1.19.72.72,0,0,0,.44-.15l10-9,6.15,6.68a.71.71,0,1,0,1-1L51.34,54l5.42-4.93,6.16,6.69a.7.7,0,0,0,.48.19h0a.7.7,0,0,0,.52-1.14Z" />
      <path fill={fill} className="cls-1" d="M66.83,28.67H33.33a2,2,0,0,0-2,2v40a2,2,0,0,0,2,2h33.5a2,2,0,0,0,2-2v-40A2,2,0,0,0,66.83,28.67Zm-33.5,42v-40h33.5v40Z" />
    </svg>
  );
}


export function HotspotAudioOn(bg = 'black', fill = 'white') {
  return (
    <svg
      className="audio_on"
      data-name="Audio_On"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
    >
      <circle cx="50" cy="50" r="50" fill={bg} />
      <path fill={fill} className="cls-1" d="M50.08,92.32a41.65,41.65,0,1,1,41.7-41.6h0A41.78,41.78,0,0,1,50.08,92.32Zm0-80.2a38.55,38.55,0,1,0,38.6,38.5A38.52,38.52,0,0,0,50.08,12.12Z" />
      <path fill={fill} className="cls-1" d="M52.45,80.35a1.75,1.75,0,0,1-1-.28L27.4,64.37H16.21a1.75,1.75,0,0,1-1.75-1.75V41.68a1.75,1.75,0,0,1,1.75-1.75H27.4l24.1-15.7A1.75,1.75,0,0,1,54.2,25.7V78.6a1.75,1.75,0,0,1-1.75,1.75ZM18,60.87h10a1.75,1.75,0,0,1,1,.28L50.7,75.37V28.93L28.87,43.15a1.75,1.75,0,0,1-1,.28H18Z" />
      <path fill={fill} className="cls-1" d="M60.55,63.27a1.75,1.75,0,0,1-1.24-3,11.5,11.5,0,0,0,0-16.26,1.75,1.75,0,0,1,2.47-2.47,15,15,0,0,1,0,21.21A1.74,1.74,0,0,1,60.55,63.27Z" />
      <path fill={fill} className="cls-1" d="M68.53,67.64a1.75,1.75,0,0,1-1.24-3,17.71,17.71,0,0,0,0-25,1.75,1.75,0,0,1,2.47-2.47,21.21,21.21,0,0,1,0,30A1.74,1.74,0,0,1,68.53,67.64Z" />
      <path fill={fill} className="cls-1" d="M76.3,73.08a1.75,1.75,0,0,1-1.24-3,25.38,25.38,0,0,0,0-35.89,1.75,1.75,0,1,1,2.47-2.47,28.88,28.88,0,0,1,0,40.84A1.74,1.74,0,0,1,76.3,73.08Z" />
    </svg>

  );
}

export function HotspotAudioOff(bg = 'black', fill = 'white') {
  return (
    <svg
      className="audio_off"
      data-name="Audio_Off"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
    >
      <circle cx="50" cy="50" r="50" fill={bg} />
      <path fill={fill} className="cls-1" d="M50.08,92.32a41.65,41.65,0,1,1,41.7-41.6h0A41.78,41.78,0,0,1,50.08,92.32Zm0-80.2a38.55,38.55,0,1,0,38.6,38.5A38.52,38.52,0,0,0,50.08,12.12Z" />
      <path fill={fill} className="cls-1" d="M53.28,24.16a1.75,1.75,0,0,0-1.79.07L27.4,39.93H16.21a1.75,1.75,0,0,0-1.75,1.75V62.62a1.75,1.75,0,0,0,1.75,1.75H27.4l24.1,15.7A1.75,1.75,0,0,0,54.2,78.6V25.7A1.75,1.75,0,0,0,53.28,24.16ZM50.7,75.37,28.87,61.15a1.75,1.75,0,0,0-1-.28H18V43.43h10a1.75,1.75,0,0,0,1-.28L50.7,28.93Z" />
    </svg>

  );
}
