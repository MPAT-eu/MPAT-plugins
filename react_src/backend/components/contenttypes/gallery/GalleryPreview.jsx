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
 * Stefano Miccoli (stefano.miccoli@finconsgroup.com)
 * Marco Ferrari (marco.ferrari@finconsgroup.com)
 * Jean-Claude Dufourd (jean-claude.dufourd@telecom-paristech.fr
 **/
import React, { PropTypes as Types } from 'react';
import autobind from 'class-autobind';
import { Dot } from '../../icons';

export default class GalleryPreview extends React.PureComponent {

  static propTypes = {
    initialSlide: Types.number,
    content: Types.object
  };

  static defaultProps = {
    initialSlide: 0,
    content: {
      images: [],
      loop: false,
      arrows: false
    }
  };

  constructor(props) {
    super(props);
    autobind(this);
    this.state = {
      currentSlide: props.initialSlide
    };
  }

  prev() {
    const state = this.state;
        // prevent going back to last image from first image when loop is disabled
    if (this.props.content.loop === false && state.currentSlide === 0) { return; }
    state.currentSlide--;
    if (state.currentSlide < 0) {
      state.currentSlide = this.props.content.images.length - 1;
    }

    this.setState(state);
  }

  next() {
    const state = this.state;
        // prevent going back to first image from last image when loop is disabled
    if (!this.props.content.loop && state.currentSlide === (this.props.content.images.length - 1)) {
      return;
    }
    state.currentSlide++;
    if (state.currentSlide >= this.props.content.images.length) { state.currentSlide = 0; }
    this.setState(state);
  }

  render() {
    const { images = [], dots, arrows } = this.props.content;
    const imageUrl = images.length && images[this.state.currentSlide].attachmentUrl;
    const imgStyle = {
      height: 'auto' // always preserve image aspect ratio
    };
    if (this.props.content.fitContainer) {
      imgStyle.width = '100%';
    } else {
      imgStyle.maxWidth = '100%';
    }
    return (

      <div className="mpat-content-preview">

        {arrows &&
        <div>
          <span className="gallery-arrow gallery-arrow-left" onClick={() => this.prev()}>&larr;</span>
        </div>
        }

        <img src={imageUrl} style={imgStyle} />

       {arrows &&
        <div>
          <span className="gallery-arrow gallery-arrow-right" onClick={() => this.next()}>&rarr;</span>
        </div>
       }

        <div className="gallery-dots">
          {dots && images.map((item, i) => (
            <span key={i} className={(i === this.state.currentSlide) ? "gallery-dot-focused" : "gallery-dot"}>
                  <Dot radius={8} color={(i === this.state.currentSlide) ? this.props.componentStyles.dotStylesFocused : this.props.componentStyles.dotStyles} />
            </span>
          ))}
        </div>
      </div>
    );
  }
}
