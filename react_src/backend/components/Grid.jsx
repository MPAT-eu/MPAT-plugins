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
 * Jean-Philippe Ruijs (github.com/jeanphilipperuijs)
 *
 **/
import React from 'react';
import Constants from '../../constants';

export default class Grid extends React.Component {
    constructor(props) {
        super(props);
        this.tvSize = { width: this.props.frontendWidth, height: this.props.frontendHeight };
        this.gridSize = this.props.frontendWidth / Constants.page.grid.columns;
        this.subGridSize = (this.gridSize * 10);
        this.strokeGridClr = Constants.styleguide.color.normal.blue;
        this.strokeSubGridClr = Constants.styleguide.color.normal.green;
        this.strokeGridWidth = 1;
        this.strokeSubGridWidth = 2;

    }

    svgGrid() {
        return (<div style={{ width: this.props.width, height: this.props.height }}>
            <svg width={this.props.width} height={this.props.height} xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <pattern id="smallGrid" width={this.gridSize} height={this.gridSize} patternUnits="userSpaceOnUse">
                        <path d={`M ${this.gridSize} 0 L 0 0 0 ${this.gridSize}`} fill="none" stroke={this.strokeGridClr} strokeWidth={this.strokeGridWidth} />
                    </pattern>

                    <pattern id="grid" width={this.subGridSize} height={this.subGridSize} patternUnits="userSpaceOnUse">
                        <rect width={this.subGridSize} height={this.subGridSize} fill="url(#smallGrid)" />
                        <path d={`M ${this.subGridSize} 0 L 0 0 0 ${this.subGridSize}`} fill="none" stroke={this.strokeSubGridClr} strokeWidth={this.strokeSubGridWidth} />
                    </pattern>

                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
        </div>);
    }
    render() {
        return this.svgGrid();
    }
}
