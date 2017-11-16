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
 * Stefano Miccoli (stefano.miccoli@finconsgroup.com)
 * Marco Ferrari (marco.ferrari@finconsgroup.com)
 **/
import React from 'react';
import smooth from 'react-motify/lib/smooth';
import autobind from 'class-autobind';
import { createHandler, handlersWithTag, log } from '../utils';
import { registerHandlers, registerNavigationModel, unregisterHandlers, triggerEvent } from '../RemoteBinding';
import DefaultNavigationModel from '../DefaultNavigationModel';
import PageWrapper from './PageWrapper';
import SlideFlowStore from '../stores/SlideFlowStore';
import { ArrowDown, ArrowUp } from './icons/Icons';
import { trackAction, trackPageview } from '../analytics/index';
import { application, keyset, appObject } from '../appData';

export default class SlideFlowController extends React.Component {

  constructor() {
    super();
    autobind(this);
    this.state = {
      tick: 1,
      page: null,
      pages: [],
      allowMedia: true,
      hasScrolledUp: null
    };
    this.isScrollingLocked = false;
    this.orientation = (application.application_manager.slideflow_orientation) ? application.application_manager.slideflow_orientation : "vertical";
    this.experimental = (application.application_manager.slideflow_experimental) ? application.application_manager.slideflow_experimental : false;
    this.showArrows = (application.application_manager.slideflow_arrows != undefined) ? application.application_manager.slideflow_arrows : true;
    registerNavigationModel(new DefaultNavigationModel());
    this.slideFlowStore = new SlideFlowStore(application.post, application.application_manager.pages);

	// setting the initial page in componentDidMount led to an unnecessary re-render of the slideflow
    const currentPage = application.post;
    currentPage.data = currentPage.meta;
    this.state.pages.push(currentPage);
    this.hbbtvAppVisible = true;
  }

  componentDidMount() {
    if (this.orientation == "horizontal") {
      registerHandlers(this, handlersWithTag('controller', [
        createHandler(KeyEvent.VK_LEFT, this.previousSlide),
        createHandler(KeyEvent.VK_RIGHT, this.nextSlide)
      ]));
    } else {
      registerHandlers(this, handlersWithTag('controller', [
        createHandler(KeyEvent.VK_UP, this.previousSlide),
        createHandler(KeyEvent.VK_DOWN, this.nextSlide)
      ]));
    }
  }

  componentWillUnmount() {
    unregisterHandlers(this);
  }

  previousSlide() {
    if (this.slideFlowStore.hasPrevPage() && !this.isScrollingLocked) {
      this.isScrollingLocked = true;
      this.slideFlowStore.getPrevPage().then((page) => {
        this.setState({
          pages: [page, ...this.state.pages],
          allowMedia: false,
          hasScrolledUp: true
        });
        this.startAnimation();
        trackAction('slideflow', 'previousPage', page.page_url);
        trackPageview(page.page_url, page.page_title);
      });
    }
  }

  nextSlide() {
    if (this.slideFlowStore.hasNextPage() && !this.isScrollingLocked) {
      this.isScrollingLocked = true;
      this.slideFlowStore.getNextPage().then((page) => {
        this.setState({
          pages: [page, ...this.state.pages],
          allowMedia: false,
          hasScrolledUp: false
        });
        this.startAnimation();
        trackAction('slideflow', 'nextPage', page.page_url);
        trackPageview(page.page_url, page.page_title);
      });
    }
  }

  startAnimation() {
    this.animation && this.animation.skip();
    this.animation = smooth(tick => {
        if (this.experimental) {
            const temp = this.interpolate(tick);
            // change position only if actually changed
            if (temp != this.state.tick) {
                this.setState({ tick: temp });
            }
        } else {
            this.setState({ tick: tick });
        }
    }, 700);
    this.animation.awaitFinish.then(this.animationDidFinish);
  }

  interpolate(t) {
  	  if (this.experimental)
  	      // round position of 0.05. No need to re-render 90 times in 700 milliseconds...
  	      return Math.round((t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t) * 20) / 20;
      else
          return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  }

  animationDidFinish = () => {
    this.isScrollingLocked = false;
    this.setState({ pages: this.state.pages.slice(0, 1) });
  }
  
  goToPage(pageInfo) {
      if (pageInfo.substring(0, 7) == "page://") {
          const pageContent = this.slideFlowStore.loadPage(pageInfo.substring(7));
          pageContent.then((page) => {
              window.location.href = page.page_url;
          });
      } else {
          window.location.href = pageInfo;
      }
  }
  
  goToPrevious() {
      // TODO what is previous page in slideflow? last visited page or (i-1)?
      return;
  }
  
  // duplicated from website, need to think of a better way
  performAction(type, actionData = {}, trigger = '') {
      if (type == "application") {
          if (actionData.action === "back") {
              this.goToPrevious();
          } else if (actionData.action === "toggle") {
            try {
              if (this.hbbtvAppVisible === true) {
                this.hbbtvAppVisible = false;
                triggerEvent('appWillHide', {});
                appObject.hide();
                keyset.setValue(keyset[trigger.replace(/VK_/g, '')]);
              } else {
                triggerEvent('appWillShow', {});
                this.hbbtvAppVisible = true;
                appObject.show();
                // restore the complete keyset
                keyset.setValue(0x33F);
              }
            } catch (e) {
              log('error while toggeling hbbTV-App');
              log(JSON.stringify(e));
            }
          }
      } else if (type == "ait") {
          if (actionData.action == "launchApplication") {
              hbbtvlib_createApp("dvb://current.ait/"+ actionData.appId +"?autoshow=1", actionData.fallbackUrl)
          }
      }
  }
  
  getCurrentPage() {
      this.slideFlowStore.getCurrentPage();
  }

  // closeHbbTVApp() {
  //   hbbtvlib_closeApp();
  // }

  render() {
    const { tick, hasScrolledUp, pages } = this.state;
    const orientation = this.orientation;
    const pagePositioning = function(i) {
        const style = {
                position: 'absolute',
                top: 0,
                left: 0
        }
        if (orientation == "vertical") {
            style.top = `${(tick + i - 1) * 720 * (hasScrolledUp ? 1 : -1)}px`;
        } else if (orientation == "horizontal") {
            style.left = `${(tick + i - 1) * 1280 * (hasScrolledUp ? 1 : -1)}px`;
        }
        return style;
    }
    return (
      <div>
        <div className="slideFlowContainer">
          {pages.map((page, i) => (
            <PageWrapper
              key={page.id}
              style={pagePositioning(i)}
              data={page.data}
              pageUtils={{ getCurrentPage: this.getCurrentPage, goToPage: this.goToPage, goToPreviousPage: this.goToPrevious, performAction: this.performAction }}
            />
            ))}
        </div>
        {(this.slideFlowStore.hasNextPage() && this.showArrows) &&
          <ArrowDown />
        }
        {(this.slideFlowStore.hasPrevPage() && this.showArrows) &&
          <ArrowUp />
        }
      </div>
    );
  }
}
