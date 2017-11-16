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
 * Stefano Miccoli (stefano.miccoli@finconsgroup.com)
 **/
import DatePicker from 'react-datepicker';
import React from 'react';
import moment from 'moment';

// require('react-datepicker/dist/react-datepicker.css');

export default class SearchForm extends React.Component {

  constructor(props) {
    super();
    this.state = props.filters;
    this.timer = null;
  }

  componentWillMount() {
  }

  componentWillUnmount() {
  }

  changeFilter(fieldKey, fieldValue) {
    const state = this.state;
    state[fieldKey] = fieldValue;
    this.setState(state);
    this.props.updateFilters(fieldKey, fieldValue);
  }

  changeDate(fieldKey, date) {
    this.changeFilter(fieldKey, date.format('YYYY-MM-DD'));
  }

  changeText(fieldKey, text) {
    if (this.timer !== null) {
      clearTimeout(this.timer);
    }
    const that = this;
    const changedField = {};
    changedField[fieldKey] = text;
    this.setState(changedField);

    this.timer = setTimeout(() => {
      that.changeFilter.bind(that, fieldKey, text);
    }, 500);
  }

  render() {
    return (
      <div>
        <input type="text" value={this.state.text} placeholder="Filter by string" onChange={e => this.changeText.call(this, 'text', e.target.value)} />
        <select value={this.state.type} onChange={e => this.changeFilter.call(this, 'type', e.target.value)}>
          {this.props.types.map((item, index) => <option key={item.postType} value={item.postType}>{item.label}</option>)}
        </select>
        <DatePicker
          dateFormat="YYYY/MM/DD"
          selected={moment(this.state.startDate)}
          startDate={moment(this.state.startDate)}
          endDate={moment(this.state.endDate)}
          onChange={e => this.changeDate('startDate', e)}
        />
        <DatePicker
          selected={moment(this.state.endDate)}
          startDate={moment(this.state.startDate)}
          endDate={moment(this.state.endDate)}
          onChange={e => this.changeDate('endDate', e)}
        />
      </div>
    );
  }

}

SearchForm.propTypes = {
  types: React.PropTypes.array,
  filters: React.PropTypes.object,
  sort: React.PropTypes.object
};
SearchForm.defaultProps = {
  types: [],
  filters: {
    text: '',
    type: '',
    startDate: null,
    endDate: null
  },
  sort: {

  }
};
