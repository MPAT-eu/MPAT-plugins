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
 * Benedikt Vogel 	 (vogel@irt.de)
 * Stefano Miccoli (stefano.miccoli@finconsgroup.com)
 * Marco Ferrari (marco.ferrari@finconsgroup.com)
 **/
import React, { PropTypes as Types } from 'react';
import autobind from 'class-autobind';
import jsonp from 'fetch-jsonp';
import moment from 'moment';
import { log, createHandler, handlersWithTag } from '../../utils';
import { registerHandlers, unregisterHandlers } from '../../RemoteBinding';
import { componentLoader } from '../../../ComponentLoader';
import { application } from '../../appData';

//import { generateId } from '../../functions';
// import { log } from '../utils';

class Scribblelive extends React.Component {
    /* todo:
        - look for Post types
        - detail types
          - images (Gallery, twiter up to 4 img)
          - questions ?
          - videos (navigation?)
        - add date
        - removed html content because of third party tracking.
        - dummy author image
        - polling
        - Title
        - calculate date sice
        - customizer settings
        - arrows

      ideas:
          - scrolle to last post
          - auto scroll from post to post
          - location -> maps

    */

  static defaultProps = {}

  constructor() {
    super();
    autobind(this);
    this.state = {
      position: 3,
      feed: {
        Posts: false
      }
    };
  }

  componentWillUnmount() {
    unregisterHandlers(this);
  }

  componentDidMount() {
    this.load();
    registerHandlers(this, handlersWithTag('active', [
      createHandler(KeyEvent.VK_ENTER, this.toggleDetails),
      createHandler(KeyEvent.VK_UP, this.up),
      createHandler(KeyEvent.VK_DOWN, this.down)
    ]));
  }

  load() {
    const url = `http://apiv1.scribblelive.com/event/${
                  this.props.feedId
                  }/page/last/?Token=${
                  this.props.feedToken
                  }&Format=json&PageSize=${
                  this.props.feedSize}`;

    log('sending jsonp request...');
    jsonp(url)
      .then(response => response.json()).then((json) => {
//        this.setState({ feed: this.format(json)});
        this.setState({ feed: json });
      }).catch((ex) => {
        log(`jsonp parsing failed${ex}`);
      });
  }
/*
  format(feed) {
    const updatedFeed = [];
    feed.map((i, item ) => {
      updatedFeed.push({
        text: item.Content,
        image: getImage(item.Media),
        video: getVideo(item.Media)
      });
    });

    function getImage(media) {
      return media.map((i, item) => {
        if(item.Type && item.Type === 'IMAGE') {
        };
      });
    }
    return updatedFeed;
  }
*/
  toggleDetails() {
    const state = this.state;
    state.showDetails = !state.showDetails;
    this.setState(state);
  }

  showDetails() {
    const style = {
      position: 'fixed',
      // width: '70%',
      padding: '15px',
      transform: 'translateX(-50%)',
      left: '50%',
      top: '10%',
      border: '3px solid grey',
      backgroundColor: 'white',
      zIndex: 1100
    };

    const outer = {
      zIndex: 1050,
      position: 'fixed',
      left: 0,
      top: 0,
      width: '100%',
      height: '100%',
      opacity: 0.7,
      backgroundColor: 'black'
    };

    const item = this.state.feed.Posts[this.state.position];
    return (
      <div>
        <div style={outer} />
        <div style={style} className={'feedPost'}>
          <ContentFull item={item} selected />
        </div>
      </div>
    );
  }

  down() {
    const state = this.state;
    if (application.application_manager.smooth_navigation &&
      state.position == state.feed.Posts.length - 1) return false;
    state.position = state.position >= state.feed.Posts.length - 1 ?
      state.position = state.feed.Posts.length - 1 :
      state.position + 1;
    this.setState(state);
  }

  up() {
    const state = this.state;
    if (application.application_manager.smooth_navigation && state.position === 0) return false;
    state.position = state.position < 1 ?
      0 : state.position - 1;
    this.setState(state);
  }

  render() {
    if (this.state.feed.Posts) {
      const items = this.state.feed.Posts;
      return (
        <div>
          {this.state.showDetails && this.showDetails()}
          <ScrollState
            current={this.state.position}
            total={this.state.feed.Posts.length}
            compHeight={this.props.position.height}
          />
          {items.map((item, i) => {
            const selected = (i === this.state.position);
            if (
              // upper
              (this.state.position - 1) > i ||
              // lower
              (this.state.position + 6) < i
            ) return null;
            return (
              <div
                style={{ padding: '6px 35px 6px 6px' }}
                key={i}
                className={'feedPost'}
              >
                <ListItem item={item} selected={selected} />
              </div>);
          })
         }
        </div>
      );
    }
    // no data available
    return (
      <div>
        is loading
      </div>
    );
  }

}

function ListItem({ item, selected }) {
  const style = {
    height: '120px',
    textOverflow: 'ellipsis',
    border: '3px solid',
    borderColor: '#c0c0c0',
    backgroundColor: '#fefefe',
    color: '#707070',
    padding: '5px',
    overflow: 'hidden'
  };

  if (selected) {
    style.borderColor = '#909090';
    style.backgroundColor = 'white';
    style.color = 'black';
  }
  return (
    <div style={style}>
      <ContentShort item={item} />
    </div>);
}

function ContentShort({ item }) {
  const text = item.Content.replace(/<\/?[^>]+(>|$)/g, '');
  return (
    <div>
      <Autor item={item} />
      {text}
    </div>);
}

function ContentFull({ item }) {
  const text = item.Content.replace(/<\/?[^>]+(>|$)/g, '');
  // item.Media && item.Media[0] && item.Media[0].Type? console.log(item.Media[0].Type) : '';
  const imgSrc = item.Media && item.Media[0] && item.Media[0].Type === 'IMAGE' && item.Media[0].Url ? item.Media[0].Url : false;
  return (
    <table><tbody><tr>
      <td style={{ verticalAlign: 'top', width: '250px', padding: '10px' }}>
        <Autor item={item} /><br />
        { text }
      </td>
      {imgSrc ?
        <td>
          <img alt="from Feed" style={{ maxHeight: '535px', maxWidth: '950px' }} src={imgSrc} />
        </td> : null
      }
    </tr></tbody></table>
    );
}


function Autor({ item }) {
  const img = item.Creator && item.Creator.Avatar ? item.Creator.Avatar : 'app/themes/mpat-theme/frontend/assets/icon_stop_white.png';
  const d = (item.PostMeta && item.PostMeta.created_at) ? new Date(item.PostMeta.created_at) : null;
  const lang = application.application_manager.app_language;
  moment.locale(lang);
  const dateStr = d ? moment(d).fromNow() : <p />;
  const sourceStr = item.PostMeta && item.PostMeta.source ? `via: ${item.PostMeta.source}` : '';
  return (
    <span>
      <img alt="" src={img} style={{ float: 'left' }} />
      <span>
        <span><span className="name">{item.Creator.Name}</span>{dateStr} {sourceStr}</span>
      </span>
    </span>);
}


function ScrollState({ current, total, compHeight }) {
  const height = (compHeight / total) < 10 ? 10 : (compHeight / total);
  const top = compHeight * current / total;
  const bar = {
    backgroundColor: '#c0c0c0',
    zIndex: '998px',
    position: 'absolute',
    width: '30px',
    top: 0,
    height: compHeight,
    right: 0
  };
  const cursor = {
    backgroundColor: '#707070',
    zIndex: 999,
    position: 'absolute',
    width: '30px',
    height,
    top
  };
  return (
    <div>
      <div style={bar} />
      <div style={cursor} />
    </div>
  );
}
componentLoader.registerComponent('scribblelive', { view: Scribblelive }, {
  isStylable: true
});
