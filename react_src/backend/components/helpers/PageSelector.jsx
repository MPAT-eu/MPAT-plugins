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
 * Jean-Philippe Ruijs (github.com/jeanphilipperuijs)
 *
 **/
import React, { PropTypes as Types } from 'react';
import PageIO from '../../../PageIO';
import autobind from 'class-autobind';
import Constants from '../../../constants';

const i18n = Constants.locstr.pageSelector;

function compare(s1, s2) {
  if (s1.label < s2.label) return -1;
  return 1;
}

export default class PageSelector extends React.PureComponent {
  static defaultProps = {
    selectedPage: "",
    disabled: false,
  }

constructor(props){
  super(props);
  autobind(this);
  this.state = {
    availablePages: [{ key: '', label: `--${i18n.loading}--`, disabled: false }],
    urlSelectDisabled: true
  };
}

componentDidMount(){
  const that = this;
  PageIO.getCommon().get(
    (result) => {
      if (typeof result === "string") {
        console.log("error getting pages information:");
        console.log(result);
        that.setState(
          {
            availablePages: [{ key: '', label: '--see debug log--', disabled: false }],
            urlSelectDisabled: true
          });
        return;
      }
      const urls = [];
      for (const item of result) {
        const singleUrl = {};
        singleUrl.key = "page://" + item.id;
        singleUrl.label = item.title.rendered ? item.title.rendered : i18n.noTitle;
        singleUrl.label = singleUrl.label.toUpperCase();
        singleUrl.disabled = false;
        urls.push(singleUrl);
      }
      urls.sort(compare);
      urls.unshift({ key: '', label: `--${i18n.select}--`, disabled: false });
      that.setState({ availablePages: urls, urlSelectDisabled: false });
    },
    (error) => {
      console.log('error in page selector ');
      console.log(error);
      that.setState(
        {
          availablePages: [{ key: '', label: `--${i18n.error}--`, disabled: false }],
          urlSelectDisabled: true
        });
    }
  );
}

render(){
  const keyOption = obj => <option key={obj.key} disabled={obj.disabled} value={obj.key} title={obj.label}>{obj.label}</option>;
  const { selectedPage, disabled, callbackFunction } = this.props;
  return (
    <select
      value={selectedPage}
      disabled={disabled || this.state.urlSelectDisabled}
      onChange={e => {
        const selectedIndex = this.state.availablePages.findIndex(curItem => e.target.value === curItem.key);
        return this.props.callbackFunction({ url: e.target.value, title: this.state.availablePages[selectedIndex].label })
      }}
    >
      {this.state.availablePages.map(keyOption)}
    </select>
  );
}
}
