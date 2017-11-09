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
import React from 'react';

export default function TimeScale({ timeLineDuration, pixelLength }) {
  const ticks = [];
  let key = 4;
  const texts = [];
  ticks.push(
    <div
      className="tick" key="0"
      style={{ height: 12, top: 0, left: 0, textAlign: 'left' }}
    />
  ); // 0
  texts.push(<div className="ticktext" key="1" style={{ left: -30 }}>0</div>);
  ticks.push(
    <div
      className="tick" key="2"
      style={{ height: 12, top: 0, right: 0, textAlign: 'right' }}
    />
  ); // max
  let step = 10;
  if (timeLineDuration > 1000) step = 50;
  if (timeLineDuration > 3000) step = 100;
  if (timeLineDuration > 10000) step = 500;
  for (let i = step; i < timeLineDuration; i += step) {
    const v = i * pixelLength / timeLineDuration;
    if (i % (5 * step) === 0) {
      texts.push(<div className="ticktext" key={key++} style={{ left: v - 30 }}>{i}</div>);
      ticks.push(<div className="tick" key={key++} style={{ height: 8, top: 4, left: v }} />);
    } else ticks.push(<div className="tick" key={key++} style={{ height: 4, top: 8, left: v }} />);
  }
  return (
    <div className="timeScale">{ticks}{texts}</div>
  );
}

TimeScale.propTypes = {
  timeLineDuration: React.PropTypes.number,
  pixelLength: React.PropTypes.number
};

