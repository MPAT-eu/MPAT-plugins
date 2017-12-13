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
 *
 **/
import React from 'react';
import Constants from '../../../constants';

const width = Constants.tv.resolutions.hdready.width;
const height = Constants.tv.resolutions.hdready.height;
const aspectRatio = Constants.tv.resolutions.hdready.ar;

function getSize(container) {
  const elementWidth = Math.min(container.offsetWidth, width);
  const elementHeight = (elementWidth === width) ? height : parseFloat(parseFloat(container.offsetWidth / aspectRatio).toFixed(2));
  return {
    width: elementWidth,
    height: elementHeight
  };
}

export default class Resizable extends React.PureComponent {

  componentWillMount() {
    window.addEventListener('resize', () => this.forceUpdate());
  }

  componentWillUnmount() {
    window.removeEventListener('resize', () => this.forceUpdate());
  }

  toggleFullscreen() {
    const classes = this.props.container.className.split(/\s+/);
    const index = classes.indexOf('fullscreen');
    if (index > -1) {
      classes.splice(index);
      this.props.container.className = classes.join(' ');
      const { top, height } = this.props.container.getBoundingClientRect();
      window.scrollTo(0, top + height - document.body.getBoundingClientRect().top);
    } else {
      classes.push('fullscreen');
      this.props.container.className = classes.join(' ');
    }

    this.forceUpdate();
  }

  render() {
    return React.cloneElement(React.Children.only(this.props.children), {
      parentSize: getSize(this.props.container),
      toggleFullscreen: this.toggleFullscreen.bind(this)
    });
  }
}
