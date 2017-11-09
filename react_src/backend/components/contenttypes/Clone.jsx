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
 * Jean-Philippe Ruijs (jean-philippe.ruijs@telecom.paristech.fr)
 *
 **/
import React, { PropTypes as Types } from 'react';
import autobind from 'class-autobind';
import { componentLoader } from '../../../ComponentLoader';
import PageIO from '../../../PageIO';
import LayoutIO from '../../../LayoutIO';
import Constants from '../../../constants';

function editView(params) {
  const { id, data, changeAreaContent } = params;
  return (
    <CloneEdit id={id} {...data} changeAreaContent={changeAreaContent}/>
  );
}

const keyOption = obj =>
  <option key={obj.key} disabled={obj.disabled} value={obj.key}>{obj.label}</option>;

class CloneEdit extends React.PureComponent {

  static propTypes = {
    changeAreaContent: Types.func.isRequired,
    pageId: Types.number,
    boxId: Types.string,
    stateId: Types.string
  };

  constructor(props) {
    super(props);
    autobind(this);
    this.state = {
      availablePages: [{ key: '', label: '--LOADING--', disabled: false }],
      urlSelectDisabled: false,
      completePageArray: null,
    };
  }

  componentDidMount() {
    const urls = [{ key: -1, label: '--SELECT--', disabled: false }];
    window.Pages.forEach((item) => {
      const singleUrl = {};
      singleUrl.key = item.ID;
      singleUrl.label = item.post_title;
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
      this.updateLayout(this.props.pageId, newState.availablePages);
    }
    this.setState(newState);
  }

  updateLayout(pageId, availablePages) {
    const destinationPage = availablePages.find(p => p.key === pageId);
    this.setState({ destinationPage });
    const layoutId = destinationPage.mpat_content.layoutId;
    LayoutIO.getCommon().get(
      (layouts) => {
        this.refs.canvascomponent.updateCanvas(layouts.find(l => l.ID == layoutId));
      },
      (e) => {console.log('could not access layout of source');}
    );
  }

  setPage(pageId) {
    this.props.changeAreaContent({ pageId: pageId });
    this.updateLayout(pageId, this.state.availablePages);
  }

  setComponent(boxStateId) {
    const ids = boxStateId.split(":");
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
    let components = [
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
                <CanvasComponent ref="canvascomponent"/>
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

class CanvasComponent extends React.Component {

  componentDidMount() {
    const ctx = this.refs.canvas.getContext('2d');
    ctx.fillStyle = '#FFF';
    ctx.fillRect(0, 0, 256, 144);
  }

  updateCanvas(layout) {
    const ctx = this.refs.canvas.getContext('2d');
    ctx.fillStyle = '#FFF';
    ctx.fillRect(0, 0, 256, 144);
    layout.mpat_content.layout.forEach((box, i) => {
      window.drawComponent(ctx, 2 * box.x, 2 * box.y, 2 * box.w, 2 * box.h, "" + (i + 1));
    })
  }

  render() {
    return (
      <canvas ref="canvas" width={256} height={144}/>
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
