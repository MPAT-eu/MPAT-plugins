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
 * Jean-Claude Dufourd (jean-claude.dufourd@telecom-paristech.fr
 * Jean-Philippe Ruijs (github.com/jeanphilipperuijs)
 * Stefano Miccoli (stefano.miccoli@finconsgroup.com)
 **/
import React, { PropTypes as Types } from 'react';
import autobind from 'class-autobind';

import { componentLoader } from '../../../ComponentLoader';
import PageIO from '../../../PageIO';
import LayoutIO from '../../../LayoutIO';
import Constants from '../../../constants';
import CanvasComponent from '../helpers/CanvasComponent';

function editView(params) {
  const { id, data, changeAreaContent } = params;
  return (
    <CloneEdit id={id} {...data} changeAreaContent={changeAreaContent} />
  );
}

const keyOption = obj =>
  <option key={obj.key} disabled={obj.disabled} value={obj.key}>{obj.label}</option>;

class CloneEdit extends React.PureComponent {

  static propTypes = {
    changeAreaContent: Types.func.isRequired,
    pageId: Types.number,
    boxId: Types.string,
    pageName: Types.string,
    stateId: Types.string
  };

  constructor(props) {
    super(props);
    autobind(this);
    this.state = {
      availablePages: [{ key: '', label: '--LOADING--', disabled: false }],
      urlSelectDisabled: false,
      completePageArray: null
    };
  }

  componentDidMount() {
    const urls = [{ key: -1, label: '--SELECT--', disabled: false }];
    window.Pages.forEach((item) => {
      const singleUrl = {};
      singleUrl.key = item.ID;
      singleUrl.label = item.post_name;
      singleUrl.disabled = false;
      singleUrl.mpat_content = item.mpat_content;
      urls.push(singleUrl);
    });
    const newState = {
      availablePages: urls,
      urlSelectDisabled: false
    };
    if (this.props.pageId) {
      newState.destinationPage = urls.find(p => p.key === this.props.pageId);
      this.updateLayoutDisplay(newState.destinationPage);
    } else if (this.props.pageName) {
      newState.destinationPage = urls.find(p => p.name === this.props.pageName);
      this.updateLayoutDisplay(newState.destinationPage);
    }
    this.setState(newState);
  }

  updateLayoutDisplay(destinationPage) {
    // change layout of destination page as shown in editor
    const layoutId = destinationPage.mpat_content.layoutId;
    LayoutIO.getCommon().get(
      (layouts) => {
        this.refs.canvascomponent.updateCanvas(layouts.find(l => l.ID == layoutId).mpat_content.layout);
      },
      (e) => { console.log('could not access layout of source'); }
    );
  }

  setPage(pageId) {
    // destination page id has changed, change destinationPage
    const destinationPage = this.state.availablePages.find(p => p.key === pageId);
    this.setState({ destinationPage });
    // send action
    this.props.changeAreaContent({ pageId: pageId, pageName: destinationPage.label });
    // change layout of destination page as shown in editor
    this.updateLayoutDisplay(destinationPage);
  }

  setComponent(boxStateId) {
    const ids = boxStateId.split(':');
    this.props.changeAreaContent({
      boxId: ids[0],
      stateId: ids[1]
    });
    // mark model as not editable
    this.state.destinationPage.mpat_content.content[ids[0]][ids[1]].cloneModel = true;
    // then update the referenced page
    PageIO.getCommon().put(this.props.pageId, this.state.destinationPage, () => { }, e => console.log(e));
  }

  render() {
    const { pageId, boxId, stateId, layout } = this.props;
    const components = [
      <option key={0} value="">--{Constants.locstr.clone.choose}--</option>
    ];
    if (pageId && this.state.destinationPage) {
      Object.keys(this.state.destinationPage.mpat_content.content).forEach((boxKey, i) => {
        Object.keys(this.state.destinationPage.mpat_content.content[boxKey]).forEach((stateKey) => {
          const component = this.state.destinationPage.mpat_content.content[boxKey][stateKey];
          components.push(
            <option key={`${boxKey}:${stateKey}`} value={`${boxKey}:${stateKey}`}>
              {`box${i + 1}:${component.stateTitle || stateKey}:${component.componentTitle || component.type}`}
            </option>
          );
        });
      });
    }
    return (
      <div className="component editHeader">
        <h2>{Constants.locstr.clone.title}</h2>
        <table>
          <tbody>
            <tr>
              <td>
                <label htmlFor="clonepageselector">{Constants.locstr.clone.modelComponentPage}:</label>
              </td>
              <td>
                <select
                  value={pageId}
                  id="clonepageselector"
                  onChange={e => this.setPage(+e.target.value)}
                >
                  {this.state.availablePages.map(keyOption)}
                </select>
              </td>
              <td rowSpan={2}>
                <label>Source Layout:</label>
                <CanvasComponent ref="canvascomponent" />
              </td>
            </tr>
            <tr>
              <td>
                <label htmlFor="clonecompsel">{Constants.locstr.clone.component}:</label>
              </td>
              <td>
                <select
                  disabled={!pageId}
                  value={`${boxId}:${stateId}`}
                  id="clonecompsel"
                  onChange={e => this.setComponent(e.target.value)}
                >
                  {components}
                </select>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

componentLoader.registerComponent(
  'clone', {
    edit: editView
  }, {
    isHotSpottable: false,
    isScrollable: false,
    hasNavigableGUI: false,
    isStylable: false
  }
);
