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
import AssetListView from './AssetListView';
import React from 'react';
import ReactDataGrid from 'react-data-grid';
import SearchForm from './SearchForm';

// import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';


export default class AssetsManager extends React.Component {

  constructor(props) {
    super();

    this.state = {
      hasMore: false,
      filters: {
        type: props.types[0].baseUrl
      },
      items: []
    };
  }

  capitalizeString(baseUrl) {
    return baseUrl.charAt(0).toUpperCase() + baseUrl.slice(1);
  }

  componentDidMount() {
    const that = this;
    wp.api.loadPromise.done(() => {
      const initialCollection = new wp.api.collections[that.capitalizeString(that.state.filters.type)]();

      that.setState({
        clientLoaded: true,
        collection: initialCollection
      },
            () => that.getItems(false));
    });
  }

  componentWillMount() {
  }

  componentWillUnmount() {
  }

  updateFilter(filterKey, filterValue) {
    const newState = this.state;

    if (filterKey == 'type') {
      const typeFilter = this.capitalizeString(filterValue);

      newState.filters.type = typeFilter;

        	let collectionName = '';
        	if (typeFilter == '') {
        		collectionName = 'Mpat_assets';
        } else {
          collectionName = typeFilter;
        }

      newState.collection = new wp.api.collections[collectionName]();
    }

    this.setState(newState, () => this.getItems());
  }

  getItems(append = false) {
    const that = this;
    if (append) {
      if (this.state.collection.hasMore()) {
        this.state.collection.more({
          success(collection, response) {
            const items = that.state.items;
            items.push(...response);
            that.setState({
              items,
              hasMore: collection.hasMore()
            });
          }
        });
      }
    } else {
      this.state.collection.fetch({
        success(collection, response, options) {
          that.setState({
            items: response,
            hasMore: collection.hasMore()
          });
        }
                // TODO track error too
      });
    }
  }

  moreItems() {
    if (this.state.clientLoaded && this.state.collection) {
      this.getItems(true);
    }
  }

  titleFormat(cell, row) {
    return cell.rendered;
  }

  previewImageFormat(cell, row) {
    return <img src={cell} width="30" height="30" />;
  }

  rowGetter(i) {
    return this.state.items[i];
  }

  render() {
    const columns = [
      {
        key: 'id',
        name: 'Post ID'
      },
      {
        key: 'thumbnail_url',
        name: 'Thumbnail',
        formatter: previewImageFormatter
      },
      {
        key: 'title',
        name: 'Title',
        formatter: titleFormatter
      },
      {
        key: 'slug',
        name: 'Slug'
      }
    ];

    return (
      <div>
        <SearchForm updateFilters={this.updateFilter.bind(this)} types={this.props.types} />
        {/*
            <BootstrapTable data={this.state.items} striped={true} hover={true}>
                <TableHeaderColumn dataFormat={this.previewImageFormat} dataField="thumbnail_url">Thumbnail</TableHeaderColumn>
                <TableHeaderColumn isKey={true} dataField="id">Post ID</TableHeaderColumn>
                <TableHeaderColumn dataSort={true} dataField="slug">Slug</TableHeaderColumn>
                <TableHeaderColumn dataFormat={this.titleFormat} dataField="title">Title</TableHeaderColumn>
                <TableHeaderColumn dataField="type">Type</TableHeaderColumn>
            </BootstrapTable>
            */}
        <ReactDataGrid
          columns={columns}
          rowGetter={this.rowGetter.bind(this)}
          rowsCount={this.state.items.length}
        />
        {/*
            {this.state.items.map(function(currentItem, index, array) {
                return <AssetListView key={currentItem.id} item={currentItem} />
            })}
            */}
        <button type="button" onClick={() => this.moreItems()} disabled={!this.state.hasMore}>Load more</button>
      </div>
    );
  }

}


let previewImageFormatter = React.createClass({
  render() {
    const url = this.props.value;
    return (<img src={url} width="30" height="30" />);
  }
});

let titleFormatter = React.createClass({
  render() {
    return (<span>{this.props.value.rendered}</span>);
  }
});
