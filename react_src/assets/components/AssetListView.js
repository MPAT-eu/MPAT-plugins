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
import React from 'react';

export default class AssetListView extends React.Component {

  constructor(props) {
    super();
    this.state = props;
  }

  componentWillMount() {
  }

  componentWillUnmount() {
  }

  componentDidMount() {
    const previewImage = this.state.item.featured_media;
    const that = this;
    if (previewImage) {
      const imageModel = new wp.api.models.Media({ id: previewImage });
      imageModel.fetch({
        success(model, response) {
          that.setState({
            previewImage: response.media_details.sizes.thumbnail.source_url
          });
        }
      });
    } else {
      this.setState({
        previewImage: '/wp/wp-includes/images/media/default.png'
      });
    }
  }

  render() {
    return (
      <div>
        <img src={this.state.previewImage} width="150" height="150" />
        {this.state.item.title.rendered}

      </div>
    );
  }

}
