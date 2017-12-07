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
import React from 'react';
import Popup from 'react-popup';
import autobind from 'class-autobind';

import ModelIO from '../../../ModelIO';
import { componentLoader } from '../../../ComponentLoader';
import CanvasComponent from '../helpers/CanvasComponent';

import Constants from '../../../constants';

export default class PageModelCreator extends React.PureComponent {

  static displayModelSaved() {
    let el = document.getElementById('pageeditorstatus');
    if (!el) {
      el = document.createElement('li');
      el.id = 'pageeditorstatus';
      document.getElementById('wp-admin-bar-root-default').appendChild(el);
    }
    el.innerHTML = '<p class="page_editor_status">Model created</p>';
    window.setTimeout(() => { document.getElementById('pageeditorstatus').innerHTML = ''; }, 5000);
  }

  constructor(props) {
    super(props);
    autobind(this);
    this.state = {
      model: { origin: window.Post.postInfo.post_title + '_pm' }
    };
    Object.keys(props.content).forEach((a) => {
      const defState = props.content[a][Object.keys(props.content[a])[0]];
      const types = {};
      if (defState && defState.type) types[defState.type] = true;
      this.state.model[a] = {
        editable: true,
        types
      };
    });
  }

  pmfOK() {
    const name = window.Post.postInfo.post_title + '_pm';
    ModelIO.getCommon().get(
      (models) => {
        const exists = models.find((m) => m.post_title === name);
        if (exists) {
          ModelIO.getCommon().put(
            exists.ID,
            {
              ID: exists.ID,
              post_type: 'page_model',
              post_status: 'publish',
              post_title: name,
              mpat_content: {
                model: this.state.model,
                ...this.props.toSave
              }
            },
            PageModelCreator.displayModelSaved,
            (e) => {
              window.alert(`Error while saving: ${e}`);
            }
          );
        } else {
          ModelIO.getCommon().post(
            {
              post_type: 'page_model',
              post_status: 'publish',
              post_title: name,
              mpat_content: {
                model: this.state.model,
                ...this.props.toSave
              }
            },
            PageModelCreator.displayModelSaved,
            (e) => {
              window.alert(`Error while saving: ${e}`);
            }
          );
        }
      },
      (error) => {
        window.alert(`Error while saving: ${error}`);
      }
    );
    this.pmfCancel();
  }

  pmfCancel() {
    Popup.close();
    document.getElementById('content_editor').className = 'postbox';
  }

  componentDidMount() {
    this.refs.canvascomponent.updateCanvas(this.props.layout);
  }

  render() {
    const availableComponents = componentLoader.getComponents();
    let keyIndex = 1;
    const fields = Object.keys(this.props.content).map(
      (boxId, i) => {
        return (
          <tr key={keyIndex++}>
            <td>{i+1}</td>
            <td>
              <input
                type="checkbox"
                checked={this.state.model[boxId].editable}
                onChange={(e) => {
                  this.state.model[boxId].editable = e.target.checked;
                  this.forceUpdate();
                }}
              />
            </td>
            <td>
              <input
                type="checkbox"
                checked={this.state.model[boxId].editableStyles !== false}
                onChange={(e) => {
                  this.state.model[boxId].editableStyles = e.target.checked;
                  this.forceUpdate();
                }}
              />
            </td>
            <td>
              <button
                type="button"
                onClick={() => {
                  const v = document.getElementById("modelselector").value;
                  if (v === 'ANY') {
                    this.state.model[boxId].types = {ANY: true};
                  } else {
                    this.state.model[boxId].types[v] = true;
                  }
                  this.forceUpdate();
                }}
                style={{margin: '0 10px', padding: '0 10px'}}
              >
                +
              </button>
              &nbsp;
              <button
                type="button"
                onClick={() => {
                  delete this.state.model[boxId].types[document.getElementById("modelselector").value];
                  this.forceUpdate();
                }}
                style={{margin: '0 10px', padding: '0 10px'}}
              >
                -
              </button>
            </td>
            <td>{Object.keys(this.state.model[boxId].types).join(' ')}</td>
          </tr>
        );
      }
    );
    return (
      <div>
        <span style={{fontSize: '150%', fontWeight: '600'}}>
          {Constants.locstr.pageModelCreator.chooseCustomBox}
        </span>
        <div style={{width: 500, height: 500, overflowY: 'auto'}}>
          <table className="pagemodeltable">
            <thead>
            <tr>
              <td>{Constants.locstr.pageModelCreator.compontentTypeToAddOrRemove}</td>
              <td>{Constants.locstr.pageModelCreator.isItEditable}?</td>
              <td>{Constants.locstr.pageModelCreator.editableOrStyles}?</td>
              <td>{Constants.locstr.pageModelCreator.addOrRemoveFromAllowedTypes}</td>
              <td>{Constants.locstr.pageModelCreator.allowedTypes}</td>
            </tr>
            </thead>
            <tbody>
            {fields}
            </tbody>
          </table>
        </div>
        <span>{Constants.locstr.pageModelCreator.compontentTypeToAddOrRemove}: </span>
        <select id="modelselector">
          <option key={0} value="ANY">{Constants.locstr.pageModelCreator.any}</option>
          {availableComponents.map(
            (obj, i) =>
              <option key={i+1} value={obj.type}>{obj.type}</option>)}
        </select>
        <br/>
        <button
          type="button"
          className="white_blue"
          onClick={this.pmfCancel}
          style={{ margin: 5, float: 'left', padding: '0 10px' }}
        >
        {Constants.locstr.pageModelCreator.cancel}
        </button>
        <button
          type="button"
          className="white_blue"
          onClick={this.pmfOK}
          style={{ margin: 5, float: 'right', padding: '0 10px' }}
        >
        {Constants.locstr.pageModelCreator.create}
        </button>
        <div className="canvasforcreatemodel">
          <CanvasComponent ref="canvascomponent"/>
        </div>
      </div>
    );
  }
}
