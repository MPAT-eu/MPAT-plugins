/**
 *
 * Copyright (c) 2018 Fraunhofer FOKUS. All rights reserved.
 *
 **/
import { log } from '../utils';

export default class ati {

  constructor() {
    window.addEventListener('onMPATpageview', ati.trackPageview);
    window.addEventListener('onMPATevent', ati.trackAction);
  }

// trackAction({detail: {page:"", category: "", action: "", name: "", value: ""}})
  static trackAction(eventHandler) {
    let name = '';
    if (typeof ATTag !== 'undefined') {
      switch (eventHandler.detail.category) {
        case 'menu':
          if (eventHandler.detail.action === 'menu-open') {
            name = window.MPATGlobalInformation.post.page_title + ' menu-open';
          } else if (eventHandler.detail.action === 'goto') {
            name = window.MPATGlobalInformation.post.page_title + ' menu-link ' + eventHandler.detail.name;
          }
          break;
        case 'gallery':
          if (eventHandler.detail.action === 'next') {
            name = window.MPATGlobalInformation.post.page_title + ' skip ' + (eventHandler.detail.value + 1);
          } else if (eventHandler.detail.action === 'prev') {
            name = window.MPATGlobalInformation.post.page_title + ' skip ' + (eventHandler.detail.value + 1);
          }
          break;
        case 'video':
          if (eventHandler.detail.action === 'initialPlay') {
            name = window.MPATGlobalInformation.post.page_title + ' video-play ' + eventHandler.detail.name;
          }
          break;
        case 'audio':
          if (eventHandler.detail.action === 'initialPlay') {
            name = window.MPATGlobalInformation.post.page_title + ' audio-play ' + eventHandler.detail.name;
          }
          break;
        default:
      }

      if (name !== '') {
        log('ATI tracking action pre: ' + name);
        window.ATTag.page.send({
          name,
          chapter1: document.title,
          level2: window.lvl2,
          callback: () => { log('ATI tracking action cb: ' + name); }
        });
      }
    } else {
      log('ATI tracking action: ATTag === undefined');
    }
  }

// trackPageView({detail: {page:"", title: ""}})
  static trackPageview(eventHandler) {
    window.setTimeout(function() {
      if (typeof ATTag !== 'undefined') {
        log('ATI tracking pageview pre: ' + MPATGlobalInformation.post.page_title + ' :: ' + document.title + ' :: ' + window.lvl2);
        window.ATTag.page.send({
          name: MPATGlobalInformation.post.page_title,
          chapter1: document.title,
          level2: window.lvl2,
          callback: () => { log('ATI tracking pageview cb: ' + MPATGlobalInformation.post.page_title + ' :: ' + document.title + ' :: ' + window.lvl2); }
        });
      } else {
        log('ATI tracking pageview: ATTag === undefined');
      }
    }, 1000);
  }
}
