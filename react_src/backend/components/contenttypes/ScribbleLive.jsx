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
 * AUHTORS:
 * Jean-Philippe Ruijs (github.com/jeanphilipperuijs)
 * Benedikt Vogel 	 (vogel@irt.de)
 * Stefano Miccoli (stefano.miccoli@finconsgroup.com)
 * Marco Ferrari (marco.ferrari@finconsgroup.com)
 **/
import React, { PropTypes as Types } from 'react';
import { componentLoader } from '../../../ComponentLoader';
import { noSubmitOnEnter } from '../../utils';
import { getTooltipped } from '../../tooltipper.jsx';
// eslint-disable-next-line
import _reactCropStyle from 'react-image-crop/dist/ReactCrop.css';

import Constants from '../../../constants';
const i18n = Constants.locstr.scribbleLive;
function editView(params) {
  const { id, data, changeAreaContent, context, stateId } = params;

  return (
    <ScribbleLiveEdit
      id={id} {...data} context={context} changeAreaContent={changeAreaContent}
    />
  );
}
function preview() {
  return (
    <div className="mpat-content-preview">
      ScribleLive Feed. No specific preview available.
    </div>
  );
}


class ScribbleLiveEdit extends React.PureComponent {
  // todo: feed evaluation (live, on the fly)
  save(key, value) {
    this.props.changeAreaContent({ [key]: value });
  }

  render() {
    return (
      <div>
        <h1>Scribble Live</h1>
        <FiledComp save={this.save.bind(this)} name="Title" keyName="feedTitle" value={this.props.feedTitle} tooltiptext={i18n.ttFeedTitle} />
        <FiledComp save={this.save.bind(this)} name="ID" keyName="feedId" value={this.props.feedId} tooltiptext={i18n.ttFeedId} />
        <FiledComp save={this.save.bind(this)} name="Token" keyName="feedToken" value={this.props.feedToken} tooltiptext={i18n.ttFeedToken} />
        <FiledComp save={this.save.bind(this)} name="Polling Intervall[s]" keyName="pollingTime" value={this.props.pollingTime} tooltiptext={i18n.ttPolling} />
        <FiledComp save={this.save.bind(this)} name="Size" keyName="feedSize" value={this.props.feedSize} tooltiptext={i18n.ttFeedSize} />
        {i18n.hint1} <a href="admin.php?page=mpat-application-manager">MPAT -> Application Manager -> App Language</a> {i18n.hint2} <i>{i18n.hint3}</i>)
      </div>
    );
  }
}

function FiledComp({ keyName, name, save, value, tooltiptext }) {
  return (
    <div>
      <div className="componentList">{name}</div>
      {getTooltipped(
        <input
          type="text"
          placeholder={`Feed ${name}`}
          value={value}
          onChange={e => save(keyName, e.target.value)}
          onKeyPress={noSubmitOnEnter}
        />
        , tooltiptext)}
    </div>
  );
}

componentLoader.registerComponent(
  'scribblelive', {
    edit: editView,
    preview
  }, {
    isHotSpottable: false,
    isScrollable: true,
    hasNavigableGUI: true,
    isStylable: false
  }, {
    navigable: true
  }
);
