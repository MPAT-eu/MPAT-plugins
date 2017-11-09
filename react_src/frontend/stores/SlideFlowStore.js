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
 *
 **/
import PagesStore from './PagesStore';

export default class SlideFlowStore extends PagesStore {

  constructor(pageData, appData) {
    super(pageData);
    this.app = appData;
    // eslint-disable-next-line eqeqeq
    this.index = appData.findIndex(({ id }) => id == pageData.id);
    // buffer next page
    if (this.index < this.app.length - 1) this.loadPage(this.app[this.index + 1].id);
    // buffer prev page
    if (this.index > 0) this.loadPage(this.app[this.index - 1].id);
  }

  getNextPage() {
    if (this.index < this.app.length - 1) {
        this.index++;
        // buffer next page
        if (this.index < this.app.length - 1) {
            this.loadPage(this.app[this.index + 1].id);
        }
        return this.getPage(this.app[this.index].id);
    }
  }

  getPrevPage() {
    if (this.index > 0) {
      this.index--;
      // buffer prev page
      if (this.index > 0) {
          this.loadPage(this.app[this.index - 1].id);
      }
      return this.getPage(this.app[this.index].id);
    }
  }

  hasNextPage() {
    return this.index < this.app.length - 1;
  }
  hasPrevPage() {
    return this.index > 0;
  }
}

