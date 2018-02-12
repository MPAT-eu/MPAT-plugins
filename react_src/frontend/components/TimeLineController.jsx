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
 * Jean-Claude Dufourd (jean-claude.dufourd@telecom-paristech.fr
 **/
import React from 'react';
import DefaultNavigationModel from '../DefaultNavigationModel';
import PageWrapper from './PageWrapper';
import { application } from '../appData';
import { registerNavigationModel, unregisterHandlers } from '../RemoteBinding';

const debug = true;

function log(msg) {
  if (debug) window.TVDebugServerInterface.log(msg);
}


export default class TimeLineController extends React.Component {

  constructor() {
    super();
    log('TimeLineController constructor');
    // first init required HTML
    try {
      const intBcContainer = document.getElementById('vidcontainer');
      const intBcVideo = document.createElement('object');
      intBcVideo.id = 'broadcastvideo';
      intBcVideo.type = 'video/broadcast';
      intBcContainer.appendChild(intBcVideo);
      intBcVideo.setFullScreen(true);
      intBcVideo.bindToCurrentChannel();
    } catch (e) {
      log(`error in HbbTV bc init ${e.message}`);
    }
    log('after HbbTV BC init');
    //
    registerNavigationModel(new DefaultNavigationModel());
    log('TimeLineController html init done');
    const info = application.TimeLineInfoString;
    application.timeLineInfo = info;
    this.state = {
      page: { data: null, id: 0 },
      back: info.backComponent
    };
    this.handleMediaEvent = this.handleMediaEvent.bind(this);
    this.handleStreamEvent = this.handleStreamEvent.bind(this);
    this.handleKeyEvent = this.handleKeyEvent.bind(this);
    this.initMediaEvents = this.initMediaEvents.bind(this);
    this.mediaEventLoop = this.mediaEventLoop.bind(this);
  }

  componentDidMount() {
    const info = application.timeLineInfo;
    for (let i = 0; i < info.ranges.length; i++) {
      const range = info.ranges[i];
      switch (range.type) {
        case 'StreamEvent':
          log(`stream ${range.data}`);
          this.maybeInitStreamEvents();
          this.registeredStreamEventHandlers.push(range);
          break;
        case 'MediaEvent':
          log(`media ${range.begin} ${range.duration}`);
          this.maybeInitMediaEvents();
          this.registeredMediaEventHandlers.push(range);
          break;
        case 'KeyEvent':
          log(`key ${range.keycode}`);
          this.maybeInitKeyEvents();
          this.registeredKeyEventHandlers.push(range);
          break;
        case 'TimeEvent':
          log(`time ${range.begin} ${range.duration}`);
          setTimeout(this.setPageFun(info.ranges[i].meta,
                                     info.ranges[i].title),
            range.begin * 1000);
          setTimeout(this.setPageFun(null), ((range.begin + range.duration) * 1000) - 5);
          break;
        case 'ClockEvent':
          const ced = range.clock;
          const now = window.MPATGlobalInformation.now;
          log(`clock ${ced.y} ${ced.m} ${ced.d} ${ced.h} ${ced.i} ${ced.s}`);
          log(`tvclock ${now.y} ${now.m} ${now.d} ${now.h} ${now.i} ${now.s}`);
          const nowJS = new Date(`${ced.y}-${ced.m}-${ced.d}T${ced.h}:${ced.i}:${ced.s}`);
          const cedJS = new Date(`${now.y}-${now.m}-${now.d}T${now.h}:${now.i}:${now.s}`);
          if (cedJS > nowJS) {
            log(`add clock ${cedJS - nowJS}`);
            setTimeout(this.setPageFun(info.ranges[i].meta,
                                       info.ranges[i].title), cedJS - nowJS);
          } else {
            // if this event is in the past, show the page immediately
            this.setPageFun(info.ranges[i].meta, info.ranges[i].title);
          }
          break;
        default:
          break;
      }
    }
  }

  componentWillUnmount() {
    unregisterHandlers(this);
  }

  setPageFun(v, title) {
    const that = this;
    /*eslint-disable*/
    return function () {
      that.setPage(v, title);
    };
    /*eslint-enable*/
  }

  setPage(pageData, title = 'null') {
    log(`setPage ${title}`);
    this.setState({ page: { data: pageData, id: this.state.page.id + 1 } });
  }

  registeredStreamEventHandlers = [];
  registeredMediaEventHandlers = [];
  registeredKeyEventHandlers = [];

  video = null;
  videoRange = null;

  handleStreamEvent(streamEvent) {
    // available fields are name / data / text / status
    log(`streamevent received: "${streamEvent.text}"`);
    for (let i = 0; i < this.registeredStreamEventHandlers.length; i++) {
      const rangeI = this.registeredStreamEventHandlers[i];
      if (rangeI.data === streamEvent.text) {
        this.setPage(rangeI.meta, rangeI.title);
        return;
      }
    }
    log(`unknown streamEvent ${streamEvent.text}`);
  }

  handleMediaEvent() {
    // log('handleMediaEvent');
    const time = this.video.playPosition / 1000;
    let active = false;
    for (let i = 0; i < this.registeredMediaEventHandlers.length; i++) {
      const rangeI = this.registeredMediaEventHandlers[i];
      if (time >= rangeI.begin && time < rangeI.begin + rangeI.duration) {
        // range i should be active
        active = true;
        if (this.videoRange !== rangeI) {
          log(`handleMediaEvent range ${i} is active `);
          this.videoRange = rangeI;
          this.setPage(this.videoRange.meta, this.videoRange.title);
          return;
        }
      }
    }
    if (this.videoRange && !active) {
      log('handleMediaEvent cleaning up');
      this.setPage(null);
      this.videoRange = null;
    }
  }

  handleKeyEvent(keyEvent) {
    log(`keyevent received: ${keyEvent.keyCode}`);
    for (let i = 0; i < this.registeredKeyEventHandlers.length; i++) {
      const rangeI = this.registeredKeyEventHandlers[i];
      if (rangeI.keycode === keyEvent.keyCode) {
        this.setPage(rangeI.meta, rangeI.title);
      }
    }
  }

  streamEventsInitialized = false;
  mediaEventsInitialized = false;
  keyEventsInitialized = false;

  maybeInitStreamEvents() {
    if (!this.streamEventsInitialized) {
      this.streamEventsInitialized = true;
      log('init streamevents');
      try {
        const vidObj = document.getElementById('broadcastvideo');
        log(`vidObj ${vidObj}`);
        /*eslint-disable*/
        // event is a fixed url pointing at the stream event declaration
        vidObj.addStreamEventListener('%20-%20/event', 'id1', this.handleStreamEvent);
        /*eslint-enable*/
      } catch (e) {
        log(`unable to register stream event listener ${e}`);
      }
    }
  }

  mediaEventLoop() {
    setTimeout(this.mediaEventLoop, 250);
    this.handleMediaEvent();
  }

  initMediaEvents() {
    // get all the videos
    const videos = document.getElementsByTagName('object');
    // if not videos yet, wait
    if (videos.length <= 0) {
      setTimeout(this.initMediaEvents, 100);
      return;
    }
    let index = 0;
    this.video = videos[index++];
    // find a video/mp4 (not broadcast)
    while (this.video && this.video.type !== 'video/mp4') {
      this.video = videos[index++];
    }
    if (this.video) {
      // if a video exists, start the loop
      this.mediaEventLoop(this.video);
    } else {
      // wait some more
      setTimeout(this.initMediaEvents, 100);
    }
  }

  maybeInitMediaEvents() {
    if (!this.mediaEventsInitialized) {
      this.mediaEventsInitialized = true;
      this.initMediaEvents();
    }
  }

  maybeInitKeyEvents() {
    if (!this.keyEventsInitialized) {
      this.keyEventsInitialized = true;
      document.addEventListener('keydown', this.handleKeyEvent, false);
    }
  }

  render() {
    const { front, page, back } = this.state;
    return (
      <div>
        {back &&
        <div className="tlfullscreen">
          <PageWrapper data={back.meta} />
        </div>}
        {page.data &&
        <div className="tlfullscreen">
          <PageWrapper
            key={page.id}
            data={page.data}
          />
        </div>}
      </div>
    );
  }

}
