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
 * Jean-Philippe Ruijs (jean-philippe.ruijs@telecom.paristech.fr)
 * Benedikt Vogel 	 (vogel@irt.de)
 *
 **/
import React, { PropTypes as Types } from 'react';
import autobind from 'class-autobind';
import { Sortable } from 'react-sortable';
import { generateId } from '../../../functions';
import { componentLoader } from '../../../ComponentLoader';
import { noSubmitOnEnter } from '../../utils';
import { getTooltipped } from '../../tooltipper.jsx';
import Constants from '../../../constants';

function editView(params) {
  const { id, data, changeAreaContent } = params;
  return (
    <ListEdit
      id={id}
      {...(data === '' ? undefined : data) }
      changeAreaContent={changeAreaContent}
    />
  );
}

function preview() {
  // TODO
  return (
    <div className="mpat-content-preview listcontent-preview" />
  );
}

const itemType = Types.shape(
  {
    title: Types.string,
    appUrl: Types.string,
    id: Types.string
  });

function createDefaultItem() {
  return {
    title: '',
    appUrl: '',
    description: '',
    id: generateId()
  };
}

class ListEdit extends React.PureComponent {

  static propTypes = {
    id: Types.string.isRequired,
    listArray: Types.arrayOf(itemType),
    changeAreaContent: Types.func.isRequired
  };

  static defaultProps = {
    listArray: [createDefaultItem()]
  };

  constructor() {
    super();
    autobind(this);
    this.state = {
      draggingIndex: null
    };
  }

  setContent(itemId, key, value) {
    let { listArray } = this.props;
    const idx = listArray.findIndex(({ id }) => id === itemId);
    listArray = listArray.concat();
    listArray[idx][key] = value;
    this.props.changeAreaContent({ listArray });
  }

  addContent() {
    let { listArray } = this.props;
    listArray = listArray.concat([createDefaultItem()]);
    this.props.changeAreaContent({ listArray });
  }

  deleteItem(itemId) {
    let { listArray } = this.props;
    const idx = listArray.findIndex(({ id }) => id === itemId);
    listArray = listArray.concat();
    listArray.splice(idx, 1);
    this.props.changeAreaContent({ listArray });
  }

  /* guess this just updates the state of the currently dragged item*/
  updateState(obj) {
    this.setState(obj);
  }

  render() {
    return (
      <div className="component editHeader">
        <h2>{Constants.locstr.list.listSettings}</h2>
        {getTooltipped(
          <button
            type="button"
            className="right white_blue button img_left"
            onClick={this.addContent}
            style={{ marginTop: -70 }}
          >
            <svg
              id="Layer_1"
              data-name="Layer 1"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 100 100"
            >
              <path className="cls-1"
                d="M50.49,22.85A28.25,28.25,0,1,0,78.74,51.1,28.29,28.29,0,0,0,50.49,22.85Zm0,52.94A24.69,24.69,0,1,1,75.17,51.1,24.71,24.71,0,0,1,50.49,75.79Z" />
              <path className="cls-1"
                d="M64.47,49.31H52.27V37.12a1.78,1.78,0,1,0-3.57,0V49.31H36.51a1.78,1.78,0,0,0,0,3.57H48.7V65.08a1.78,1.78,0,0,0,3.57,0V52.88H64.47a1.78,1.78,0,0,0,0-3.57Z" />
            </svg>
            {Constants.locstr.list.addListElement}
          </button>
          , Constants.locstr.list.ttAddListElement)}
        {this.props.listArray.map((item, i) => {
          const props = {
            setContent: this.setContent,
            deleteItem: this.deleteItem,
            /*
             Issue MPAT-158: sorting items in firefox leads to redirects to about:blank
             workaround while waiting for a fix from react-sortable
             TODO check if version later than 1.1.0 implements the bugfix and then
             remove this workaround
             */
            // sorting items in firefox leads to redirects to about:blank
            onDrop(e) {
              e.preventDefault();
            }
          };
          return (
            <SortableListElement
              key={i}
              updateState={this.updateState}
              items={this.props.listArray}
              draggingIndex={this.state.draggingIndex}
              sortId={i}
              outline="list"
              childProps={props}
            >{item}</SortableListElement>
          );
        })}
      </div>
    );
  }
}

function ListElement(props) {
  const childProps = props.onDragEnd.__reactBoundContext.props.childProps; //eslint-disable-line
  const { id, title } = props;
  // value={title} onChange={e => setContent( 'title', e.target.value, id )
  // value={appUrl} onChange={e => setContent( 'appUrl', e.target.value, id )
  // value={description} onChange={e => setContent( 'description', e.target.value, id )
  // <button className="right white_blue button img_left" onClick={() => deleteItem( id )
  // THE FOLLOWING CODE BREAKS, ARE YOU SURE IT IS NOT THE ABOVE CODE INSTEAD?
  return (
    <div
      id={id}
      title={title}
      className="list-item"
      style={{
        border: '2px #ddd solid',
        background: '#eee',
        padding: '30px',
        margin: '20px 0',
        position: 'relative'
      }}
    >
      <table>
        <tbody>
          <tr>
            <td>
              <label>{Constants.locstr.list.title}: </label>
            </td>
            <td>
              {getTooltipped(
                <input
                  type="text"
                  placeholder={Constants.locstr.list.placeHolderTitle}
                  value={props.children.title}
                  onKeyPress={noSubmitOnEnter}
                  onChange={e => childProps.setContent(props.children.id, 'title', e.target.value)}
                />
                , Constants.locstr.list.ttTitle)}
            </td>
          </tr>
          <tr>
            <td>
              <label>{Constants.locstr.list.url}: </label>
            </td>
            <td>
              {getTooltipped(
                <input
                  type="text"
                  placeholder={Constants.locstr.list.placeHolderUrl}
                  value={props.children.appUrl}
                  onKeyPress={noSubmitOnEnter}
                  onChange={e => childProps.setContent(props.children.id, 'appUrl', e.target.value)}
                />
                , Constants.locstr.list.ttUrl)}
            </td>
          </tr>
          <tr>
            <td>
              <label>{Constants.locstr.list.description}: </label>
            </td>
            <td>
              {getTooltipped(
                <input
                  type="text"
                  placeholder={Constants.locstr.list.placeHolderDesc}
                  value={props.children.description}
                  onKeyPress={noSubmitOnEnter}
                  onChange={e => childProps.setContent(props.children.id, 'description',
                    e.target.value)}
                />
                , Constants.locstr.list.ttDesc)}
            </td>
          </tr>
        </tbody>
      </table>
      {getTooltipped(
        <button
          type="button"
          className="right white_blue button img_left"
          style={{ position: 'absolute', right: 10, bottom: 10 }}
          onClick={() => childProps.deleteItem(props.children.id)}
        >
          <svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 100 100">
            <path className="cls-1"
              d="M68.26,31.71h-35a1.78,1.78,0,0,0-1.78,1.94l3.78,44.48A1.78,1.78,0,0,0,37,79.76H64.49a1.78,1.78,0,0,0,1.78-1.63L70,33.65a1.78,1.78,0,0,0-1.78-1.94ZM62.85,76.19H38.64L35.17,35.28H66.32Z" />
            <path className="cls-1"
              d="M69.17,26.34H52.53V24.23a1.78,1.78,0,0,0-3.57,0v2.11H32.32a1.78,1.78,0,0,0,0,3.57H69.17a1.78,1.78,0,1,0,0-3.57Z" />
            <path className="cls-1"
              d="M41.31,72a1.78,1.78,0,0,0,1.78,1.63h.16a1.78,1.78,0,0,0,1.62-1.93L42.18,40.53a1.78,1.78,0,0,0-3.56.31Z" />
            <path className="cls-1"
              d="M58.24,73.67h.16A1.78,1.78,0,0,0,60.17,72l2.68-31.22a1.78,1.78,0,1,0-3.56-.31L56.62,71.74A1.78,1.78,0,0,0,58.24,73.67Z" />
            <path className="cls-1"
              d="M50.74,73.68a1.79,1.79,0,0,0,1.78-1.78V40.61a1.78,1.78,0,1,0-3.57,0V71.89A1.79,1.79,0,0,0,50.74,73.68Z" />
          </svg>
          {Constants.locstr.list.deleteListElement}
        </button>
        , Constants.locstr.list.ttDeleteListElement)}
    </div>
  );
}
ListElement.prototype.displayName = 'SortableListElement';

const SortableListElement = Sortable(ListElement);

componentLoader.registerComponent(
  'list',
  {
    edit: editView,
    preview
  }, {
    isHotSpottable: false,
    isScrollable: true,
    hasNavigableGUI: false,
    isStylable: true
  }, {
    navigable: true
  }
);
