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
 * Stefano Miccoli (stefano.miccoli@finconsgroup.com)
 **/
import React from 'react';
import deepAssign from 'assign-deep';

import PageIO from '../../../PageIO';

const debug = false;

export default class Preview extends React.Component {

  childDOM = null;

  sendOnEvent(e) {
    if (e.data == 'init') {
      if (debug) console.log('bound to child iframe');
      this.childDOM = e.source;
      this.processClonesAndSend(this.props.info);
          // TODO find whe not always working... probably method signature change due to "this"
      window.removeEventListener('message', this.sendOnEvent);
    }
  }

  processClonesAndSend(previewInfo) {
    const todos = [];
    // gather a list of clones to process
    Object.keys(previewInfo.content).forEach(
      (cloneBoxId) => {
        const states = previewInfo.content[cloneBoxId];
        // find the clone components
        const cloneStates = Object.keys(states).filter(name => states[name].type === 'clone');
        cloneStates.forEach((cloneStateName) => {
          const pageId = states[cloneStateName].data.pageId;
          const boxId = states[cloneStateName].data.boxId;
          const stateId = states[cloneStateName].data.stateId;
          if (pageId && stateId) todos.push({ pageId, boxId, stateId, cloneBoxId, cloneStateName });
        });
      }
    );
    if (todos.length > 0) {
      // if there are clones, then we need to copy the content object
      previewInfo.content = deepAssign({}, previewInfo.content); // eslint-disable-line
      // get the page loader, next is async code
      PageIO.getCommon().get(
        (result) => {
          todos.forEach(({ pageId, boxId, stateId, cloneBoxId, cloneStateName }) => {
            const page = result.find(item => item.id === pageId);
            // substitute the clone with the reference
            if (page) {
              // if page exists, i.e. clone model exists
              previewInfo.content[cloneBoxId][cloneStateName] =
                page.mpat_content.content[boxId][stateId]; // eslint-disable-line
            }
          });
          // end clones
          const data = JSON.stringify(previewInfo);
          this.childDOM.postMessage(data, window.location.origin);
          if (debug) console.log(data);
        }
      );
      // no error message, the clone reference will just be absent in the preview
    } else {
      // if no clones, end the process
      const data = JSON.stringify(previewInfo);
      this.childDOM.postMessage(data, window.location.origin);
      if (debug) console.log(data);
    }
  }

  constructor(props) {
    super(props);
  }


  componentWillReceiveProps(nextProps) {
      // while not bulletproof, comparing stringified json should
      // minimize the number of false positive updates
    if (JSON.stringify(nextProps.info) !== JSON.stringify(this.props.info)) {
          // console.log("props changed, need to update the iframe content");
      this.processClonesAndSend(nextProps.info);
    }
  }

  componentDidMount() {
      // bind to messages coming from the child iframe
    window.addEventListener('message', e => this.sendOnEvent(e));
  }


  render() {
    return (
      <div style={{ height: 540 }} className="editor_preview_div">
        <iframe id="previewareaiframe1" src={window.Urls.preview} />
      </div>
    );
  }
}
