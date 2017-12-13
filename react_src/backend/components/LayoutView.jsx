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
 * Miggi Zwicklbauer (miggi.zwicklbauer@fokus.fraunhofer.de)
 * Thomas Tröllmich  (thomas.troellmich@fokus.fraunhofer.de)
 * Jean-Philippe Ruijs (github.com/jeanphilipperuijs)
 * Benedikt Vogel 	 (vogel@irt.de)
 * Stefano Miccoli (stefano.miccoli@finconsgroup.com)
 **/
import React, { PropTypes as Types } from 'react';
import ReactGridLayout from 'react-grid-layout';
import autobind from 'class-autobind';
import Constants from '../../constants';
import { mpat_css } from '../utils';
import Grid from './Grid';

const gridItemType = Types.shape({
  i: Types.string,
  x: Types.number,
  y: Types.number,
  w: Types.number,
  h: Types.number
});

export default class LayoutView extends React.PureComponent {

  static propTypes = {
    background: Types.string,
    onLayoutChange: Types.func,
    width: Types.number,
    height: Types.number,
    onDragStart: Types.func,
    layout: Types.arrayOf(gridItemType),
    isStatic: Types.bool,
    children: Types.arrayOf(Types.element),
    hasSafeArea: Types.bool.isRequired,
    showGrid: Types.bool
  };

  static defaultProps = {};

  constructor(props) {
    super(props);
    autobind(this);
  }

  onLayoutChange(layout) {
    this.props.onLayoutChange && this.props.onLayoutChange(layout, {
      cols: Constants.page.grid.columns,
      rows: Constants.page.grid.rows,
      width: this.props.width,
      height: this.props.height
    });
  }

  render() {
    mpat_css();
    const style = { width: this.props.width, height: this.props.height };
    // check for colour, image or video as background
    if (this.props.background) {
      if (this.props.background.match(/^https?\:\/\//)) {
        style.backgroundImage = `url("${this.props.background}")`;
      } else if (this.props.background.match(/[^\<\>\'\"]/)) {
        style.backgroundColor = this.props.background;
      } else if (this.props.background.match(/\.(ts|mpegts|mp4|mpd)/)) {
        style.backgroundImage = 'url(/app/themes/mpat-theme/backend/assets/video-play.png)';
      } else {
        // hmmm
      }
    }
    const params = {
      cols: Constants.page.grid.columns,
      maxRows: Constants.page.grid.rows,
      width: this.props.width,
      rowHeight: this.props.height / Constants.page.grid.rows,
      autoSize: false,
      verticalCompact: false,
      onLayoutChange: this.onLayoutChange,
      onDragStart: this.props.onDragStart,
      style,
      layout: this.props.layout,
      margin: [0, 0],
      isDraggable: !this.props.isStatic,
      isResizable: !this.props.isStatic
    };

    return (
      <div className="gridview" style={{ width: this.props.width, height: this.props.height }}>
        <ReactGridLayout className="layout" {...params}>
          {this.props.children}
        </ReactGridLayout>
        <div className="safe-area1" style={{ display: (this.props.hasSafeArea ? 'inline' : 'none') }} />
        <div className="safe-area2" style={{ display: (this.props.hasSafeArea ? 'inline' : 'none') }} />

        <div className="showGrid" style={{ display: (this.props.showGrid ? 'inline' : 'none') }}>
          <Grid
            width={this.props.width}
            height={this.props.height}
            frontendWidth={1280}
            frontendHeight={720}
          />
        </div>
      </div>
    );
  }
}
