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
 * Jean-Philippe Ruijs (github.com/jeanphilipperuijs)
 * Benedikt Vogel 	 (vogel@irt.de)
 *
 **/
import React from 'react';
import autobind from 'class-autobind';
import Popup from 'react-popup';
import { } from 'react-grid-layout/css/styles.css';
import Constants from '../../constants';
import BoxHeader from './helpers/BoxHeader';
import LayoutView from './LayoutView';
import { genereId, noSubmitOnEnter } from '../utils';
import { generateId } from '../../functions';
import LayoutIO from '../../LayoutIO';
import { getTooltipped } from '../tooltipper.jsx';

const i18n = Constants.locstr.layoutBuilder;
export default class LayoutBuilder extends React.PureComponent {

  static canLeave = true;

  static displayLayoutSaved() {
    let el = document.getElementById('pageeditorstatus');
    if (!el) {
      el = document.createElement('li');
      el.id = 'pageeditorstatus';
      document.getElementById('wp-admin-bar-root-default').appendChild(el);
    }
    el.innerHTML = '<p class="page_editor_status">Layout saved</p>'
    window.setTimeout(() => { document.getElementById('pageeditorstatus').innerHTML = ''; }, 5000);
    LayoutBuilder.canLeave = true;
  }

  constructor(props) {
    super();
    autobind(this);
    this.state = {
      layout: (props.meta && props.meta.layout) ? props.meta.layout : [
        { i: generateId(), x: 10, y: 10, w: 50, h: 50, minW: 5, minH: 5 },
      ],
      background: '',
      hasSafeArea: true,
      showGrid: true
    };
    this.containerId = `layout_builder${generateId()}`;
    window.addEventListener('beforeunload', (e) => {
      const ee = e || window.event;
      ee.preventDefault();
      if (LayoutBuilder.canLeave) return false;
      ee.returnValue = 'You have unsaved changes';
      return ee.returnValue;
    });
  }

  onLayoutChange(layout, { cols, rows }) {
    // discard changes if the layout is invalid
    const isValid = layout.every(box => box.x + box.w <= cols && box.y + box.h <= rows);
    if (isValid) {
      this.setState({ layout });
      LayoutBuilder.canLeave = false;
    }
    return isValid;
  }

  onBoxAdd() {
    const boxW = 5;
    const boxH = 5;
    const boxSpace = this.findEmptySpace(boxW, boxH);
    if (boxSpace) {
      const item = { i: generateId(), ...boxSpace, minW: 5, minH: 5 };
      this.setState({ layout: this.state.layout.concat(item) });
    }
    LayoutBuilder.canLeave = false;
  }

  onBoxDelete(id) {
    let { layout } = this.state;
    const index = layout.findIndex(item => item.i === id);
    if (index > -1) {
      layout = layout.concat();
      layout.splice(index, 1);
    }
    this.setState({ layout });
    LayoutBuilder.canLeave = false;
  }

  onBoxLock(id) {
    const { layout } = this.state;
    const index = layout.findIndex(item => item.i === id);
    if (index > -1) {
      layout[index] = { ...layout[index], static: !layout[index].static };
    }
    this.setState({ layout: layout.concat(), forceLayoutRefreshKey: generateId() });
    LayoutBuilder.canLeave = false;
  }

  findEmptySpace(boxW, boxH) {
    const { layout } = this.state;
    const grid = [];
    const cols = Constants.page.grid.columns;
    const rows = Constants.page.grid.rows;
    for (let i = 0; i < cols; i++) {
      grid.push([]);
      for (let j = 0; j < rows; j++) {
        grid[i].push(true);
      }
    }
    layout.forEach((item) => {
      for (let i = item.x; i < item.x + item.w; i++) {
        for (let j = item.y; j < item.y + item.h; j++) {
          grid[i][j] = false;
        }
      }
    });
    let x = false;
    let y = false;
    let done = false;

    for (let i = 0; i < cols && !done; i++) {
      for (let j = 0; j < rows && !done; j++) {
        let isfree = true;
        for (let k = 0; k < boxW; k++) {
          for (let l = 0; l < boxH; l++) {
            isfree = isfree && grid[i + k][j + l];
          }
        }
        if (isfree) {
          x = i;
          y = j;
          done = true;
        }
      }
    }
    if (x !== false && y !== false) {
      return { x, y, w: boxW, h: boxH };
    }
    return false;
  }

  saveIsCurrentlyActive = false;

  update(ev) {
    if (this.saveIsCurrentlyActive) return;
    ev.preventDefault();
    if (window.location.pathname.endsWith('post-new.php')) {
      LayoutIO.getCommon().post(
        {
          post_type: 'page_layout',
          post_status: 'publish',
          post_title: document.getElementById('title_clone').value,
          mpat_content: {
            layout: this.state.layout
          }
        },
        (a) => {
          // cannot avoid to reload when saving the first time
          const url = window.location.href.substring(
            0, window.location.href.indexOf('admin/post') + 10);
          this.saveIsCurrentlyActive = false;
          LayoutBuilder.canLeave = true;
          window.location.href = `${url}.php?post=${a.data.id}&action=edit`;
        },
        (e) => {
          window.alert(`Error while saving: ${e}`);
          this.saveIsCurrentlyActive = false;
        }
      );
    } else {
      const pageId = parseInt(window.location.search.substring(6), 10);
      LayoutIO.getCommon().put(
        pageId,
        {
          ID: pageId,
          post_type: 'page_layout',
          post_status: 'publish',
          post_title: document.getElementById('title').value,
          mpat_content: {
            layout: this.state.layout
          }
        },
        () => {
          LayoutBuilder.displayLayoutSaved();
          this.saveIsCurrentlyActive = false;
        },
        (e) => {
          window.alert(`Error while saving: ${e}`);
          this.saveIsCurrentlyActive = false;
        }
      );
    }
  }

  componentDidMount() {
    document.getElementById('title_clone').value = document.getElementById('title').value;
    LayoutBuilder.canLeave = true;
  }

  changeTitle(e) {
    document.getElementById('title').value = e.target.value;
    LayoutBuilder.canLeave = false;
  }


  mediaGalleryCallback(imgData) {
    this.setState({ background: imgData.imgUrl });
    LayoutBuilder.canLeave = false;
  }

  retId = '';

  returnToPageEditor(e) {
    e.preventDefault();
    const o = window.location;
    window.location.href = `${o.origin}${o.pathname}?post=${this.retId}&action=edit`;
    return false;
  }

  checkBox(box, boxIndex) {
    const box1 = Object.assign({}, box);
    const w = parseInt(document.getElementById("editBoxW").value);
    const h = parseInt(document.getElementById("editBoxH").value);
    const x = parseInt(document.getElementById("editBoxX").value);
    const y = parseInt(document.getElementById("editBoxY").value);
    box1.w = (w - w%10)/10;
    box1.h = (h - h%10)/10;
    box1.x = (x - x%10)/10;
    box1.y = (y - y%10)/10;
    const layout = this.state.layout.slice();
    layout[boxIndex] = box1;
    const valid = this.onLayoutChange(layout,
                                      { cols: Constants.page.grid.columns,
                                        rows: Constants.page.grid.rows });
    if (valid) {
      document.getElementById(box.i+"message").textContent = '';
    } else {
      document.getElementById(box.i+"message").textContent = 'layout is not valid';
    }
  }

  editBox(itemId) {
    const box = this.state.layout.find(b => b.i === itemId);
    const saveBox = Object.assign({}, box);
    const boxIndex = this.state.layout.indexOf(box);
    Popup.create(
      {
         content: (
           <div className="editboxsizeandposition">
             <h3>Edit box size and position</h3>
             <table>
               <tbody>
               <tr>
                 <td><label>Width</label></td>
                 <td>
                   <input
                     type="number"
                     id="editBoxW"
                     step="10"
                     defaultValue={box.w*10}
                     onChange={() => this.checkBox(box, boxIndex)}
                   />
                 </td>
               </tr>
               <tr>
                 <td><label>Height</label></td>
                 <td>
                   <input
                     type="number"
                     id="editBoxH"
                     step="10"
                     defaultValue={box.h*10}
                     onChange={() => this.checkBox(box, boxIndex)}
                   />
                 </td>
               </tr>
               <tr>
                 <td><label>Left</label></td>
                 <td>
                   <input
                     type="number"
                     id="editBoxX"
                     step="10"
                     defaultValue={box.x*10}
                     onChange={() => this.checkBox(box, boxIndex)}
                   />
                 </td>
               </tr>
               <tr>
                 <td><label>Top</label></td>
                 <td>
                   <input
                     type="number"
                     id="editBoxY"
                     step="10"
                     defaultValue={box.y*10}
                     onChange={() => this.checkBox(box, boxIndex)}
                   />
                 </td>
               </tr>
               </tbody>
             </table>
             <button
               type="button"
               onClick={() => {
                 if (document.getElementById(box.i+"message").textContent === '') {
                   Popup.close();
                 }
               }}
               className="button blue_white"
             >
               OK
             </button>
             <button
               type="button"
               onClick={() => {
                 const layout = this.state.layout.slice();
                 layout[boxIndex] = saveBox;
                 this.onLayoutChange(layout,
                                     { cols: Constants.page.grid.columns,
                                       rows: Constants.page.grid.rows });
                 this.forceUpdate();
                 Popup.close();
               }}
               className="button blue_white"
             >
               Cancel
             </button>
             <span id={box.i+"message"}></span>
           </div>
         )
      });
  }

  render() {
    const params = {
      width: this.props.parentSize.width,
      height: this.props.parentSize.height,
      onLayoutChange: this.onLayoutChange,
      onDragStart: this.updateLastLayout,
      layout: this.state.layout,
      background: this.state.background,
      hasSafeArea: this.state.hasSafeArea,
      showGrid: this.state.showGrid,
      key: this.state.forceLayoutRefreshKey
    };
    const ret = window.location.hash !== '';
    if (ret) {
      this.retId = window.location.hash.substring(8);
    }
    const layoutId = parseInt(window.location.search.substring(6));
    let users = '';
    Pages.forEach((page) => {
      if (page.mpat_content.layoutId === layoutId) {
        users += page.post_title;
        users += ' ';
      }
    });
    if (users === '') {
      users = `--${i18n.unused}--`;
    }

    return (
      <div className="mpat">
        <div className="editHeader">
          <table className="hard-right-top">
            <tbody>
              <tr>
                {ret && <td>
                  <button
                    id="returnStuff"
                    onClick={this.returnToPageEditor}
                    className="button duplicateButton green_white"
                  >
                    {i18n.returnToPageEditor}
                  </button>
                </td>}
                <td>
                  <button
                    id="updateStuff"
                    onClick={this.update}
                    className="button updateButton green_white"
                  >
                    {i18n.save}
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
          <h2>{i18n.layoutBuilder}</h2>
          <div>
            <LayoutView {...params}>
              {this.state.layout.map(
                item =>
                  <div key={item.i}>
                    <BoxHeader
                      minWidth={185}
                      boxSize={{
                        width: this.props.parentSize.width / 128 * item.w,
                        height: this.props.parentSize.height / 72 * item.h
                      }}
                    >
                      <div onClick={() => this.onBoxDelete(item.i)}>
                        <span className="dashicons dashicons-dismiss" />
                      </div>
                      <div className="boxInfo" onClick={() => this.editBox(item.i)}>
                        Width: {item.w * 10}px
                        Height: {item.h * 10}px
                        Left: {item.x * 10}px
                        Top: {item.y * 10}px
                      </div>

                      <div className="right" onClick={() => this.onBoxLock(item.i) && false}>
                        {getTooltipped(
                          <span className="dashicons dashicons-sticky" />
                          , i18n.ttPinBox)}
                      </div>


                    </BoxHeader>
                  </div>
              )}
            </LayoutView>
          </div>
          <div style={{ marginTop: 730 }}>
            <table>
              <tbody>
                <tr>
                  <td>
                    <label>{i18n.layoutTitle}: </label>
                  </td>
                  <td>
                    {getTooltipped(
                      <input
                        placeholder={i18n.placeholderTitle}
                        type="text"
                        size="30"
                        id="title_clone"
                        onChange={this.changeTitle}
                        onKeyPress={noSubmitOnEnter}
                        spellCheck="true"
                        autoComplete="off"
                      />
                      , i18n.ttTitle)}

                  </td>
                  <td>
                    <label>{i18n.previewBackground}: </label>
                  </td>
                  <td>
                    {getTooltipped
                      (<div className="editor-container">
                        <input
                          type="text"
                          id="BGUrlInput"
                          value={this.state.background}
                          onChange={e => this.setState({ background: e.target.value })}
                          name="background"
                          placeholder={i18n.placeholderBg}
                          onKeyPress={noSubmitOnEnter}
                        />
                        <span>&nbsp;&nbsp;OR&nbsp;&nbsp;</span>
                        <button type="button" target="BGUrlInput" className="button mpat-insert-media blue_white">
                          {i18n.selectFile}
                        </button>
                      </div>, i18n.ttPreviewBg)}
                  </td>
                </tr>
                <tr>
                  <td>
                    <label>{i18n.addAnotherBox}: </label>
                  </td>
                  <td>
                    {getTooltipped(
                      <span onClick={this.onBoxAdd} className="blue_white_link">
                        <svg
                          id="Layer_1"
                          data-name="Layer 1"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 100 100"
                        >
                          <path
                            className="cls-1"
                            d="M50.49,22.85A28.25,28.25,0,1,0,78.74,51.1,28.29,28.29,0,0,0,50.49,22.85Zm0,52.94A24.69,24.69,0,1,1,75.17,51.1,24.71,24.71,0,0,1,50.49,75.79Z"
                          />
                          <path
                            className="cls-1"
                            d="M64.47,49.31H52.27V37.12a1.78,1.78,0,1,0-3.57,0V49.31H36.51a1.78,1.78,0,0,0,0,3.57H48.7V65.08a1.78,1.78,0,0,0,3.57,0V52.88H64.47a1.78,1.78,0,0,0,0-3.57Z"
                          />
                        </svg>
                        {i18n.add}
                      </span>
                      , i18n.ttAddBox)}
                  </td>
                  <td>
                    <label>{i18n.showSafeArea}: </label>
                  </td>
                  <td>
                    {getTooltipped(
                      <input
                        type="checkbox"
                        id="safe_clone"
                        checked={this.state.hasSafeArea}
                        onChange={() => this.setState({ hasSafeArea: !this.state.hasSafeArea })}
                      />
                      , i18n.ttSafeZone)}
                  </td>
                </tr>
                <tr>
                  <td>
                    <label>{i18n.showGridLines}: </label>
                  </td>
                  <td>
                    {getTooltipped(
                      <input
                        type="checkbox"
                        id="grid_clone"
                        checked={this.state.showGrid}
                        onChange={() => this.setState({ showGrid: !this.state.showGrid })}
                      />
                      , i18n.ttGridLines)}
                  </td>
                  <td>
                    {i18n.layoutUsedInPages}:
                  </td>
                  <td style={{ textTransform: 'uppercase' }}>
                    {users}
                  </td>
                </tr>
              </tbody>
            </table >
          </div >
        </div >
      </div >
    );
  }
}
