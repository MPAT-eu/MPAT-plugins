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
 * Jean-Claude Dufourd (Telecom-ParisTech)
 **/
import React from 'react';

export default class CanvasComponent extends React.Component {

  componentDidMount() {
    const ctx = this.refs.canvas.getContext('2d');
    ctx.fillStyle = '#FFF';
    ctx.fillRect(0, 0, 256, 144);
  }

  updateCanvas(layout) {
    const ctx = this.refs.canvas.getContext('2d');
    ctx.fillStyle = '#FFF';
    ctx.fillRect(0, 0, 256, 144);
    layout.forEach((box, i) => {
      window.drawComponent(ctx, 2 * box.x, 2 * box.y, 2 * box.w, 2 * box.h, `${i + 1}`);
    });
  }

  render() {
    return (
      <canvas ref="canvas" width={256} height={144} />
    );
  }
}
