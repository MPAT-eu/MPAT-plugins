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
import React, { PropTypes as Types } from 'react';
import autobind from 'class-autobind';
import { pageElemType, pageElemDefaults } from '../../types';
import { createHandler, createTaggedHandler, handlersWithTag } from '../../utils';
import { registerHandlers, unregisterHandlers } from '../../RemoteBinding';
import { Dot } from '../icons/Icons';
import { trackAction } from '../../analytics';
import { componentLoader } from '../../../ComponentLoader';
import { application } from '../../appData';

class GalleryContent extends React.Component {

  static propTypes = {
    ...pageElemType,
    initialSlide: Types.number,
    images: Types.array,
    loop: Types.bool,
    autoplay: Types.bool,
    autoplayInterval: Types.string ,
    orientation: Types.string
  };

  static defaultProps = {
    ...pageElemDefaults,
    initialSlide: 0,
    images: [],
    loop: false,
    autoplay: false,
    autoplayInterval: '1000',
    orientation: "horizontal"
  };

  constructor(props) {
    super(props);
    autobind(this);
    this.state = {
      currentSlide: props.initialSlide
    };
  }

  componentWillMount() {
        // preload of gallery images (then stored in browser cache) for better UX
    this.props.images.forEach((galleryImage) => {
      const img = document.createElement('img');
      img.src = galleryImage.attachmentUrl;
    });
  }

  componentDidMount() {
        // Register Key Handlers
    const isHorizontal = this.props.orientation === 'horizontal';
    const goToKeys = this.props.images.map(({ remoteKey }) => KeyEvent[remoteKey]);

    const activeHandlers = [
      createHandler(isHorizontal ? KeyEvent.VK_LEFT : KeyEvent.VK_UP, this.goToPrev),
      createHandler(isHorizontal ? KeyEvent.VK_RIGHT : KeyEvent.VK_DOWN, this.goToNext)
    ];

    if(this.props.mediaKeys){

        registerHandlers(this, handlersWithTag('global', [
          createHandler(KeyEvent.VK_PLAY, this.play),
          createHandler(KeyEvent.VK_PAUSE, this.pause),
          createHandler(KeyEvent.VK_REWIND, this.rw),
          createHandler(KeyEvent.VK_FAST_FWD, this.ff),
        ]));
    }

    if (application.application_manager.smooth_navigation) {
      activeHandlers.push(createHandler(isHorizontal ?
                                          KeyEvent.VK_UP :
                                          KeyEvent.VK_LEFT,
                                        () => {return false;}));
      activeHandlers.push(createHandler(isHorizontal ?
                                          KeyEvent.VK_DOWN :
                                          KeyEvent.VK_RIGHT,
                                        () => {return false;}));
    }
    registerHandlers(this, handlersWithTag('active', activeHandlers));
        // setup autoplay if configured so
    if (this.props.autoplay === true) {
            // store intervalId for future accesses
        this.play();
    }
  }

  componentWillUnmount() {
        // disable autoplay if previously enabled
    this.pause();
    unregisterHandlers(this);
  }

  rw(){
      this.pause();
      this.prev();
  }

  ff(){
      this.pause();
      this.next();
  }

  goToPrev() {
    if(application.application_manager.smooth_navigation &&
      !this.props.loop && this.state.currentSlide <= 0){
      return false;
    }
    this.prev();
  }

  goToNext() {
    if(application.application_manager.smooth_navigation &&
      !this.props.loop && this.state.currentSlide >= (this.props.images.length -1)){
      return false;
    }
    this.next();
  }

  prev() {
    const state = this.state;

        // prevent going back to last image from first image when loop is disabled
    if (this.props.loop === false && state.currentSlide === 0) {
      return;
    }

    state.currentSlide--;
    if (state.currentSlide < 0) {
      state.currentSlide = this.props.images.length - 1;
    }

    this.setState(state);
    trackAction('gallery', 'prev', this.props.images[state.currentSlide].attachmentUrl);
  }

  next() {
        // console.log("call next");
    const state = this.state;

     // prevent going back to first image from last image when loop is disabled
    if (this.props.loop === false && state.currentSlide === (this.props.images.length - 1)) {
      // if im coming to next() from autoplay interval and loop is disabled,
      // i prevent future calls to next()
      // unsetting the interval
      if (this.state.autoplayIntervalId) clearInterval(this.state.autoplayIntervalId);
      return;
    }

    state.currentSlide++;
    if (state.currentSlide >= this.props.images.length) {
      state.currentSlide = 0;
    }
    this.setState(state);
    trackAction('gallery', 'next', this.props.images[state.currentSlide].attachmentUrl);
  }

  play(){
    if (!this.state.autoplay){
      const intervalId = setInterval(this.next, this.props.autoplayInterval);
      this.setState({
        autoplayIntervalId: intervalId,
        autoplay: true
      });
    }
  }

  pause(){
    if (this.state.autoplay){
      clearInterval(this.state.autoplayIntervalId);
      this.setState({
        autoplay: false,
        autoplayIntervalId: null
      });
    }
  }

  render() {
    const imageUrl = this.props.images[this.state.currentSlide].attachmentUrl;
    const imgStyle = {
      height: 'auto' // always preserve image aspect ratio
    };
    if (this.props.fitContainer === true) {
      imgStyle.width = '100%';
    } else {
      imgStyle.maxWidth = '100%';
    }
    return (
      <div>
        {this.props.mediaKeys && this.state.autoplay &&
                <img src={application.icons.remote["button_play"] } className="gallery-media-icons"/>
        }

        {this.props.mediaKeys && !this.state.autoplay &&
                <img src={application.icons.remote["button_pause"] } className="gallery-media-icons"/>
        }

        {this.props.arrows && 
            <div> 
              <span className="gallery-arrow gallery-arrow-left" style={this.props.componentStyles.arrowStyles}>&larr;</span>
            </div>
        }
               
        <img src={imageUrl} role="presentation" style={imgStyle} />

        {this.props.arrows &&
            <div>
              <span className="gallery-arrow gallery-arrow-right" style={this.props.componentStyles.arrowStyles}>&rarr;</span>
            </div>
        }
        <div className="gallery-dots">
          {(this.props.dots) ? this.props.images.map((item, i) => (
            <span key={i} className={(i === this.state.currentSlide) ? "gallery-dot-focused" : "gallery-dot"}>
              <Dot radius={8} color={(i === this.state.currentSlide) ? this.props.componentStyles.dotStylesFocused : this.props.componentStyles.dotStyles} />
            </span>
                        )) : ''}
        </div>
      </div>
    );
  }
}
componentLoader.registerComponent('gallery', { view: GalleryContent }, {
  isStylable: true
});
