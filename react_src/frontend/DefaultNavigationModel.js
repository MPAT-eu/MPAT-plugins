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
 * Benedikt Vogel    (vogel@irt.de)
 *
 **/
export default class DefaultNavigationModel {

    // Reorder this for changing priority
  constructor(priorities = [
    { tag: 'always' },
    { tag: 'active', predicate: inst => inst.props && inst.props.active },
    { tag: 'focused', predicate: inst => inst.props && inst.props.focused },
    { tag: 'controller' },
    { tag: 'global' }
  ]) {
    this.priorities = priorities;
  }

  handleEvent(e, event, subs) {
    const always = () => true;
    for (let i = 0; i < this.priorities.length; i++) {
      const { tag, predicate = always } = this.priorities[i];
      const matches = subs.filter(sub => sub.tag === tag && predicate(sub.identifier));
      if (matches.length) {
        const consumed = matches.map(({ handler }) => handler(e, event))
                                .some(handlerReturn => handlerReturn !== false);
        if (consumed) {
          break;
        }
      }
    }
  }
}
