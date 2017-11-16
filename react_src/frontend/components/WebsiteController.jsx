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
 * Stefano Miccoli (stefano.miccoli@finconsgroup.com)
 **/
import React from 'react';
import autobind from 'class-autobind';
import DefaultNavigationModel from '../DefaultNavigationModel';
import PageWrapper from './PageWrapper';
import { log } from '../utils';
import { registerNavigationModel, triggerEvent } from '../RemoteBinding';
import { application, keyset, appObject } from '../appData';
import { trackAction, trackPageview } from '../analytics/index';
import PagesStore from '../stores/PagesStore';

export default class WebsiteController extends React.Component {

  constructor(props) {
    super(props);
    autobind(this);
    registerNavigationModel(new DefaultNavigationModel());
    this.state = {
      page: {
        id: application.post.id,
        data: application.post.meta
      }
    };
    this.hbbtvAppVisible = true;
    this.pagesStore = new PagesStore(application.post);
  }

  getCurrentPage() {
    return this.pagesStore.getCurrentPage();
  }

  goToPage(pageUrl) {
      if (pageUrl.substring(0, 7) == "page://") {
          const pageId = pageUrl.substring(7);
          if (pageId == "previous") {
              this.goToPrevious();
          } else {
              const pageContent = this.pagesStore.getPage(pageId);
              if (pageContent) {
                  pageContent.then((page) => {
                      this.setState({
                        page: page
                      });
                      trackAction('website', 'goToPage', page.page_url);
                      trackPageview(page.page_url, page.page_title);
                  });
              }
          }
      } else {
          window.location.href = pageUrl;
      }
  }

  goToPrevious() {
      const pageContent = this.pagesStore.getPrevious();
      if (pageContent) {
          pageContent.then((page) => {
              this.setState({
                page: page
              });
              trackAction('website', 'goToPage', page.page_url);
              trackPageview(page.page_url, page.page_title);
          }, () => { return; });
      }
  }

  performAction(type, actionData = {}, trigger = '') {
    if (type === 'application') {
      if (actionData.action === 'back') {
        this.goToPrevious();
      } else if (actionData.action === 'toggle') {
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
    } else if (type === 'ait') {
      if (actionData.action === 'launchApplication') {
        hbbtvlib_createApp('dvb://current.ait/' + actionData.appId +
                           '?autoshow=1', actionData.fallbackUrl);
      }
    }
  }

  render() {
    const { page } = this.state;
    return (
      <div>
        <PageWrapper
          key={page.id}
          data={page.data}
          pageUtils={{
            getCurrentPage: this.getCurrentPage,
            goToPage: this.goToPage,
            goToPreviousPage: this.goToPrevious,
            performAction: this.performAction
          }}
        />
      </div>
    );
  }

}
