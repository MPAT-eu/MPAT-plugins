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
 * Miggi Zwicklbauer (miggi.zwicklbauer@fokus.fraunhofer.de)
 * Thomas Tröllmich  (thomas.troellmich@fokus.fraunhofer.de)
 * Jean-Philippe Ruijs (github.com/jeanphilipperuijs)
 * Stefano Miccoli (stefano.miccoli@finconsgroup.com)
 * Marco Ferrari (marco.ferrari@finconsgroup.com)
 **/
import React from 'react';
import autobind from 'class-autobind';
import Popup from 'react-popup';
import axios from 'axios';
import urlencode from 'encodeurl';

import BoxHeader from '../helpers/BoxHeader';
import LayoutView from '../LayoutView';
import { EditIcon, ImportIcon } from '../icons';
import StateEditor from './StateEditor';
import Preview from './Preview';
import Constants from '../../../constants';
import UndoRedo, { canLeave, clearHistory } from '../../containers/UndoRedo';
import { mpat_css, noSubmitOnEnter } from '../../utils';
import { classnames } from '../../../functions';
import { getTooltipped } from '../../tooltipper.jsx';
import PageIO from '../../../PageIO';
import ModelIO from '../../../ModelIO';
import OptionIO from '../../../OptionIO';
import { StylesPopup } from '../helpers/Styles';
import PageModelCreator from './PageModelCreator';

const i18n = Constants.locstr.pageEditor;

const saveTitles = {
  model: 'SAVE MODEL',
  instance: i18n.saveModelInstance,
  page: i18n.savePage
};

export default class PageEditor extends React.PureComponent {
  static propTypes = {
    pageStyles: React.PropTypes.object
  };

  static defaultProps = {
    pageStyles: {
      container: {},
      activeComponent: {}
    },
    styleDefinitions: {
      container: {
        fontSize: {
          label: 'Font Size',
          fieldType: 'text',
          fieldProps: {
            placeholder: i18n.phFontSize
          }
        },
        backgroundColor: {
          label: 'Background Color',
          fieldType: 'color',
          fieldProps: {
            defaultValue: 'transparent'
          }
        },
        backgroundImage: {
          label: 'Background image',
          fieldType: 'image',
          fieldProps: {}
        }
      },
      activeComponent: {
        sectionTitle: {
          label: 'Active component styles',
          fieldType: 'separator',
          fieldProps: {
            description: i18n.descActiveComponent
          }
        },
        borderWidth: {
          label: 'Border size',
          fieldType: 'text',
          fieldProps: {
            placeholder: i18n.phBorderSize
          }
        },
        borderStyle: {
          label: 'Border style',
          fieldType: 'select',
          fieldProps: {
            options: [
              'none',
              'solid',
              'hidden',
              'dotted',
              'dashed'
            ]
          }
        },
        borderColor: {
          label: 'Border color',
          fieldType: 'color',
          fieldProps: {
            defaultValue: 'transparent'
          }
        }
      }
    }
  };

  constructor(props) {
    super(props);
    autobind(this);
    this.state = {
      curEditId: false,
      curEditContext: false,
      curTemplateEditId: false,
      templateFilter: '',
      templateName: '',
      fullscreenEditor: false,
      postParent: +window.Post.postInfo.post_parent,
      postId: +window.Post.postInfo.ID,
      editMode: 'editPage',
      willSaveTo: 'page'
    };
    window.addEventListener('beforeunload', (e) => {
      if (canLeave()) return undefined;
      const ee = e || window.event;
      ee.returnValue = i18n.unsavedChanges;
      return ee.returnValue;
    });
    mpat_css();
    // first check that all boxes are actually in the layout
    const boxesInContent = Object.keys(props.pageContent);
    boxesInContent.forEach((boxName) => {
      if (!props.layout.data.find(box => box.i === boxName)) {
        delete props.pageContent[boxName];
        // this removes any box whose name is not found in the layout
      }
    });
  }

  ChooseTargetView() {
    const { layout, background, model } = this.props;
    const that = this;
    const curEditState = this.props.selectedAreaStates[this.state.curEditId];
    const boxes = this.getAreas().map((area, i) => {
      const editable = this.state.editMode === 'editModel' ||
        (model === undefined || model[area.key].editable);
      return (
        <div
          key={area.key}
          className={classnames(
            {
              editBox: true,
              lockedBox: !editable,
              chooseTargetMode: true,
              active: (this.state.curEditId === area.key)
            })}
          onClick={() => that.setState({ curEditId: area.key, curEditContext: layout.data[i] })}
        >
          {area.label}
        </div>
      );
    });
    const previewInfo = {
      content: this.props.pageContent,
      layout: this.props.layout.data,
      styles: this.props.pageStyles,
      layoutId: this.props.layoutId,
      background: this.props.background
    };
    return (
      <div style={{ position: 'relative' }}>
        <LayoutView
          width={960}
          height={540}
          layout={layout.data}
          background={background}
          isStatic
          hasSafeArea={false}
        >
          {boxes}
        </LayoutView>
        <div className="previewarea2">
          <Preview info={previewInfo} storeState={this.props.storeState} />
        </div>
        <div className="previewarea1" style={{ width: Constants.tv.resolutions.fullhd.width / 2, height: Constants.tv.resolutions.fullhd.height / 2 }} />
        <PreviewStyles context={this.state} />
      </div>
    );
  }

  init() {
    if (window.PageManagement && window.PageManagement.new_sc_draft) {
      this.toggleSchedule();
    }
  }

  changeTitle(e) { // eslint-disable-line
    window.Post.postInfo.post_title = e.target.value;
  }

  getAreas() {
    return this.props.layout.data.map((box, index) => ({ key: box.i, label: index + 1 }));
  }

  getStateEditView() {
    const { curEditId } = this.state;
    const { pageContent, actions } = this.props;
    const curEditState = this.props.selectedAreaStates[curEditId];
    const bindId = fn => fn.bind(null, curEditId);
    return (
      <div>
        <StateEditor
          id={curEditId}
          stateId={curEditState}
          getAreas={this.getAreas}
          changeAreaState={bindId(actions.changeAreaState)}
          changeAreaStateType={bindId(actions.changeAreaStateType)}
          changeAreaStateMeta={bindId(actions.changeAreaStateMeta)}
          changeAreaStateContent={bindId(actions.changeAreaStateContent)}
          changeAreaStateStyle={bindId(actions.changeAreaStateStyle)}
          onClickBack={() => this.setState({ curEditId: false }, this.init)}
          addAreaState={bindId(actions.addAreaState)}
          deleteAreaState={bindId(actions.deleteAreaState)}
          editAreaStateName={bindId(actions.editAreaStateName)}
          content={pageContent[curEditId]}
          editContext={this.state.curEditContext}
          saveTemplate={actions.saveTemplate}
          getComponentStates={this.getComponentStates}
          getLayoutView={this.getLayoutView}
          pageContent={this.props.pageContent}
          mainButtons={this.mainButtons}
          chooseTargetView={this.ChooseTargetView}
          setStateActive={bindId(actions.setStateActive)}
          model={this.props.model}
          editMode={this.state.editMode}
        />
      </div>
    );
  }

  getComponentStates = (id) => {
    const target = this.props.pageContent[id] || {};
    return Object.assign(
      {},
      ...Object.keys(target).map(
        key => ({ [key]: target[key].stateTitle || i18n.untitled })
      )
    );
  };

  render() {
    if (this.props.model && this.state.editMode === 'editPage') {
      // there is a model, the mode could be editModel, createInstance or editInstance
      if (!this.props.model.instance) {
        // need to ask the user if edit model or create instance
        const that = this;
        return (
          <div style={{ margin: 40, fontSize: 24 }}> Do you want to
            <button
              type="button"
              className="button blue_white"
              onClick={(ev) => {
                Popup.close();
                that.setState({ editMode: 'editModel', willSaveTo: 'model' });
              }}
              style={{ margin: 5, position: 'relative', bottom: 17 }}
            >
              EDIT THIS MODEL
            </button>
            or
            <button
              type="button"
              className="button blue_white"
              onClick={(ev) => {
                Popup.close();
                this.setState({ editMode: 'createInstance', willSaveTo: 'instance' });
              }}
              style={{ margin: 5, position: 'relative', bottom: 17 }}
            >
              CREATE INSTANCE FROM THIS MODEL
            </button>
            ?
          </div>
        );
      }
    }
    const { curEditId, curTemplateEditId } = this.state;
    if ((!curEditId && !curTemplateEditId)) {
      return this.getLayoutView();
    } else if (curEditId) {
      return this.getStateEditView();
    }
  }

  getLayoutSelector() {
    const { actions, layouts, layoutId } = this.props;
    return (
      <select onChange={e => actions.changePageLayout(e.target.value)} value={layoutId}>
        {layouts.map(({ id, name }) =>
          <option key={id} value={id}>{name || i18n.untitled}</option>
        )}
      </select>
    );
  }

  componentDidMount() {
    this.init();
  }

  componentWillMount() {
    if (this.props.model && this.state.editMode === 'editPage') {
      // there is a model, the mode could be editModel, createInstance or editInstance
      if (this.props.model.instance) {
        // the model is editInstance, we will save to instance
        this.setState({ editMode: 'editInstance', willSaveTo: 'instance' });
      }
    }
  }

  saveIsCurrentlyActive = false;

  saveModel() {
    // when saving a page model, check the coherence of the model constraints
    // with the current types in the boxes
    const content = this.props.pageContent;
    Object.keys(this.props.model).forEach((boxName) => {
      const contentBox = content[boxName];
      const modelBox = this.props.model[boxName];
      // if the current model box is editable and not of type ANY, then
      // force any edited component type to be allowed
      if (modelBox.editable && !modelBox.types.ANY) {
        if (Object.keys(modelBox.types).length === 1) {
          modelBox.types = {};
        }
        Object.keys(contentBox).forEach((state) => {
          modelBox.types[contentBox[state].type] = true;
        });
      }
    });
    ModelIO.getCommon().put(
      this.state.postId,
      {
        ID: this.state.postId,
        post_type: 'page_model',
        post_title: window.Post.postInfo.post_title,
        post_parent: `${this.state.postParent}`,
        post_status: 'publish',
        mpat_content: {
          model: this.props.model,
          background: this.props.background,
          styles: this.props.pageStyles,
          content,
          layoutId: this.props.layoutId,
          defaultActive: this.props.defaultActive
        }
      },
      () => {
        clearHistory();
        this.displayPageSaved();
        this.saveIsCurrentlyActive = false;
      },
      (e) => {
        window.alert(`Error while saving: ${e}`);
        this.saveIsCurrentlyActive = false;
      }
    );
  }

  saveNewInstance() {
    Popup.create(
      {
        content: (
          <div style={{ backgroundColor: 'white' }}>
            Save modified Model as
            <input
              id="modelinstancenewname"
              type="text"
              onKeyPress={noSubmitOnEnter}
            />
            <button
              type="button"
              className="button blue_white"
              onClick={(ev) => {
                ev.preventDefault();
                Popup.close();
                const newname = document.getElementById('modelinstancenewname').value;
                this.props.model.instance = true;
                PageIO.getCommon().post(
                  {
                    type: 'page', // save as page
                    title: newname,
                    parent: `${this.state.postParent}`,
                    status: 'publish',
                    mpat_content: {
                      model: this.props.model,
                      background: this.props.background,
                      styles: this.props.pageStyles,
                      content: this.props.pageContent,
                      layoutId: this.props.layoutId,
                      defaultActive: this.props.defaultActive
                    }
                  },
                  (a) => {
                    // after saving as a page, edit that page
                    clearHistory();
                    window.location.href = `${window.location.origin + window.location.pathname
                      }?post=${a.data.id}&action=edit`;
                  },
                  (e) => {
                    window.alert(`Error while saving: ${e}`);
                    this.saveIsCurrentlyActive = false;
                  }
                );
              }}
              style={{ margin: 5 }}
            >
              Save
            </button>
            <button
              type="button"
              className="button blue_white"
              onClick={(ev) => {
                ev.preventDefault();
                Popup.close();
              }}
              style={{ margin: 5 }}
            >
              Cancel
            </button>
          </div>
        )
      }
    );
  }

  saveNewPage() {
    PageIO.getCommon().post(
      {
        type: 'page',
        status: 'publish',
        title: window.Post.postInfo.post_title,
        parent: `${this.state.postParent}`,
        mpat_content: {
          model: this.props.model,
          background: this.props.background,
          styles: this.props.pageStyles,
          content: this.props.pageContent,
          layoutId: this.props.layoutId,
          defaultActive: this.props.defaultActive
        }
      },
      (a) => {
        // cannot avoid to reload when saving the first time
        clearHistory();
        this.saveIsCurrentlyActive = false;
        // new page url (post-new.php) and edit page url (post.php) share
        // the same path, thus no need to deduct full url from window.location
        window.location.href = `post.php?post=${a.data.id}&action=edit`;
      },
      (e) => {
        window.alert(`${i18n.errorWhileSaving}: ${e}`);
        this.saveIsCurrentlyActive = false;
      }
    );
  }

  savePageOrInstance() {
    let save_state = 'publish';
    // save scheduling info on page update
    const sc_status = 'mpat_sc_publish';
    const sc_pubdate = `${sc_status}_pubdate`;
    let schedule_meta = null;
    if (window.Post.postInfo.post_status == sc_status) {
      const date_elt = document.getElementsByName(sc_pubdate);
      const hrs_elt = document.getElementsByName(`${sc_pubdate}_time_hrs`);
      const min_elt = document.getElementsByName(`${sc_pubdate}_time_mins`);
      if (date_elt.length && hrs_elt.length && min_elt.length) {
        const date_split = date_elt[0].value.split('.');
        if (date_split.length == 3) {
          // wordpress local time = UTC + gmt_offset(hours) so UTC(wp_time) = wp_time + gmt_offset and wp_time = UTC(wp_time) - gmt_offset
          // this way we don't have to deal with the javascript timezone and we can change the wordpress timezone at will
          schedule_meta = Date.UTC(date_split[2], date_split[1] - 1, date_split[0], hrs_elt[0].value, min_elt[0].value) / 1000 - wp_option_gmt_offset.gmt_offset * 3600;
          save_state = sc_status;
        }
      }
    }
    PageIO.getCommon().put(
      this.state.postId,
      {
        ID: this.state.postId,
        title: window.Post.postInfo.post_title,
        parent: `${this.state.postParent}`,
        status: save_state,
        mpat_content: {
          model: this.props.model,
          background: this.props.background,
          styles: this.props.pageStyles,
          content: this.props.pageContent,
          layoutId: this.props.layoutId,
          defaultActive: this.props.defaultActive
        },
        [sc_pubdate]: schedule_meta
      },
      () => {
        clearHistory();
        this.displayPageSaved();
        this.saveIsCurrentlyActive = false;
      },
      (e) => {
        window.alert(`Error while saving: ${e}`);
        this.saveIsCurrentlyActive = false;
      }
    );
  }

  update(ev) { // eslint-disable-line
    // protect against multiple clicks
    if (this.saveIsCurrentlyActive) return;
    ev.preventDefault();
    if (this.state.willSaveTo === 'model') this.saveModel();
    else if (this.props.model && !this.props.model.instance) {
      this.saveNewInstance();
    } else {
      // normal page already saved as new name
      if (window.location.pathname.endsWith('post-new.php')) {
        this.saveNewPage();
      } else {
        this.savePageOrInstance();
      }
    }
  }

  displayPageSaved() { // eslint-disable-line
    let el = document.getElementById('pageeditorstatus');
    if (!el) {
      el = document.createElement('li');
      el.id = 'pageeditorstatus';
      document.getElementById('wp-admin-bar-root-default').appendChild(el);
    }
    el.innerHTML = '<p class="page_editor_status">Page saved</p>';
    window.setTimeout(() => { document.getElementById('pageeditorstatus').innerHTML = ''; }, 5000);
  }

  editLayout(e) {
    e.preventDefault();
    if (canLeave() || window.confirm(i18n.confirmLeave)) {
      const o = window.location;
      const oo = this.state.postId;
      o.href = `${o.origin}${o.pathname}?post=${this.props.layoutId}&action=edit#return=${oo}`;
    }
  }

  duplicate(e) { // eslint-disable-line
    e.preventDefault();
    PageIO.getCommon().post(
      {
        title: window.Post.postInfo.post_title,
        parent: `${this.state.postParent}`,
        status: 'publish',
        mpat_content: {
          model: this.props.model,
          background: this.props.background,
          styles: this.props.pageStyles,
          content: this.props.pageContent,
          layoutId: this.props.layoutId,
          defaultActive: this.props.defaultActive
        }
      },
      (a) => {
        clearHistory();
        window.location.href =
          `${window.location.origin}${window.location.pathname}?post=${a.data.id}&action=edit`;
      },
      (e) => {
        window.alert(`Error while duplicating: ${e}`);
      }
    );
  }

  scheduleShown = false;

  toggleSchedule(e) { // eslint-disable-line

    if (this.scheduleShown) return;
    this.scheduleShown = true;
    if (e) { e.preventDefault(); }

    const sc_revisions = document.getElementById('meta_mpat_sc_publish_revisions');
    const sc_datetime = document.getElementById('meta_mpat_sc_publish');

    let html1 = '';
    if (sc_revisions) { html1 = sc_revisions.innerHTML.replace(/mpat_sc_publish/gi, 'mpat_sc_popup'); }

    let html2 = '';
    if (sc_datetime) { html2 = sc_datetime.innerHTML.replace(/mpat_sc_publish/gi, 'mpat_sc_popup'); }


    class ScheduleContent extends React.PureComponent {

      componentDidMount() {
        if (sc_datetime) {
          window.PageManagement.setCalendar('mpat_sc_popup_pubdate');
          window.PageManagement.restoreValues();
        }
      }

      render() {
        return (
          <div id="sc_box">
            <div dangerouslySetInnerHTML={{ __html: html1 }} />
            <div dangerouslySetInnerHTML={{ __html: html2 }} />
          </div>
        );
      }

    }
    Popup.create({
      content: (
        <div>
          <ScheduleContent />
          <button
            type="button"
            className="white_blue"
            onClick={() => {Popup.close(); this.scheduleShown = false; }}
            style={{ margin: 5, float: 'right' }}
          >
            Done
          </button>
        </div>
      )
    });
  }

  // TODO icon for default active

  popupPageModel() {
    const c = this.props.pageContent;
    const s = {
      background: this.props.background,
      content: this.props.pageContent,
      layoutId: this.props.layoutId,
      defaultActive: this.props.defaultActive
    };
    Popup.create(
      {
        content: (
          <div>
            <PageModelCreator content={c} toSave={s} layout={this.props.layout.data} />
          </div>
        )
      }
    );
    document.getElementById('content_editor').className += ' choosePageModel';
  }

  getLayoutView() {
    const { layout, actions, defaultActive, parentSize, background, model } = this.props;
    const curEditState = this.props.selectedAreaStates[this.state.curEditId];
    const that = this;
    const boxes = (!layout ? null : layout.data.map(
      (box, i) => {
        const editable = (that.state.editMode === 'editModel') ||
          (model === undefined || model[box.i].editable);
        return (
          <div
            key={box.i}
            className={classnames({ editBox: true, lockedBox: !editable })}
          >
            {editable &&
              <BoxHeader
                minWidth={120}
                boxSize={{
                  width: parentSize.width / Constants.page.grid.columns * box.w,
                  height: parentSize.height / Constants.page.grid.rows * box.h
                }}
              >

                <div onClick={() => that.setState({ curEditId: box.i, curEditContext: box })}>
                  {getTooltipped(<EditIcon />, i18n.ttEditIcon)}
                </div>
                <div className="right" onClick={() => actions.changeDefaultActive(box.i)}>
                  {getTooltipped(defaultActive === box.i ?
                    <div style={{ color: '#43B4F9' }} className="dashicons dashicons-admin-generic" />
                    :
                    <div className="dashicons dashicons-admin-generic" />,
                    i18n.ttToggleDefault)}
                </div>
              </BoxHeader>}
            <div className="choosePageModelText">{i + 1}</div>
          </div>
        );
      }));
    const previewInfo = {
      content: this.props.pageContent,
      layout: this.props.layout.data,
      styles: this.props.pageStyles,
      layoutId: this.props.layoutId,
      background: this.props.background
    };
    const pageParent = +window.Post.postInfo.post_parent;
    const pageParentOptions =
      window.Pages.map((p, i) => (<option key={i + 1} value={p.ID}>{p.post_title}</option>));
    pageParentOptions.unshift(<option key="0" value="0">--{i18n.noParent}--</option>);

    const currentPermaLink = $('#sample-permalink').text();
    const fullPermaLink = window.Post.postInfo.guid;
    //const ffStyle = { fontSize: 'small', background: 'white', padding: '5px', margin: '5px', borderRadius: '3px', border: '2px dashed #43b4f9' };

    return (
      <div className="mpat">
        <div className="editHeader">
          <h2 id="pageeditor">{i18n.title}</h2>
          <LayoutView
            width={960}
            height={540}
            layout={layout && layout.data}
            background={background}
            isStatic
            hasSafeArea={false}
          >
            {boxes}
          </LayoutView>
          <Preview info={previewInfo} />
          <table>
            <tbody>
              <tr>
                <td>
                  <label>{i18n.pageTitle}: </label>
                </td>
                <td id="title_wrapper">
                  {getTooltipped(
                    <input
                      type="text"
                      size="30"
                      placeholder={i18n.phTitle}
                      id="title_clone"
                      spellCheck="true"
                      autoComplete="off"
                      onChange={this.changeTitle}
                      onKeyPress={noSubmitOnEnter}
                      defaultValue={window.Post.postInfo.post_title}
                    />
                    , i18n.ttTitle)}

                </td>
                <td width="20" />
                <td>
                  <label>{i18n.pageLink}: </label>
                </td>
                <td>
                  {getTooltipped(<span id="link_wrapper"><a href={fullPermaLink}>{currentPermaLink}</a></span>, i18n.ttLink)}
                </td>
              </tr>

              <tr>
                <td>
                  <label>{i18n.pageLayout}: </label>
                </td>
                <td>
                  {getTooltipped(this.getLayoutSelector(), i18n.ttLayout)}
                </td>
                <td>&nbsp;&nbsp;</td>
                <td>
                  <label>{i18n.pageParent}: </label>
                </td>
                <td>
                  {getTooltipped(
                    <select
                      value={pageParent}
                      onChange={this.switchParentTo}
                    >{pageParentOptions}</select>
                    , i18n.ttParent)}
                </td>
              </tr>

              <tr>
                <td>
                  <label>{i18n.scheduleUpdate}: </label>
                </td>
                <td>
                  {getTooltipped(
                    <button
                      type="button"
                      className="button blue_white"
                      onClick={this.toggleSchedule}
                    >
                      {i18n.show}
                    </button>
                    , i18n.ttToggleUpdate)}
                </td>
                <td>&nbsp;&nbsp;</td>
                <td>
                  <label>{i18n.pageStyles}: </label>
                </td>
                <td>
                  {getTooltipped(
                    <button
                      type="button"
                      className="button white_blue"
                      id="styleEditButton"
                      onClick={e => Popup.create(
                        {
                          content: (
                            <StylesPopup
                              title={'Edit page styles'}
                              popup={Popup}
                              callback={this.props.actions.changePageStyles}
                              styleValues={this.props.pageStyles}
                              styleDefinitions={this.props.styleDefinitions}
                            />
                          )
                        })}
                    >
                      {i18n.changeStyles}
                    </button>
                    , i18n.ttPageStyles)}
                </td>
              </tr>
              <tr>
                <td>
                  <label>Check styles</label>
                </td>
                <td>
                  <button
                    type="button"
                    className="button blue_white"
                    onClick={this.validateCSS}
                  >
                    Check
                  </button>
                </td>
                <td>
                  &nbsp;&nbsp;
                </td>

                {!this.props.model &&
                <td>
                  <label>{i18n.createModelFromPage}</label>
                </td>}
                {!this.props.model &&
                <td>{getTooltipped(
                  <button
                    type="button"
                    className="button blue_white"
                    onClick={this.popupPageModel}
                  >
                    {i18n.create}
                  </button>
                  , i18n.ttCreateModelFromPage)}
                </td>}

                {this.props.model &&
                <td>
                  <label>{i18n.pageFromModel}:</label>
                </td>}
                {this.props.model &&
                <td>
                  <label>{this.props.model.origin}</label>
                </td>}
              </tr>
            </tbody>
          </table>
          {this.mainButtons(true)}
        </div>
      </div>
    );
  }

  validateCSS() {
    const casesToCheck = [];
    Object.keys(this.props.pageContent).forEach((boxName, i) => {
      const box = this.props.pageContent[boxName];
      Object.keys(box).forEach((stateName, j) => {
        const state = box[stateName];
        if (state.styles) {
          Object.keys(state.styles).forEach((obj) => {
            const o = state.styles[obj];
            if (o.border) {
              this.checkBorder(o.border, i + 1, j + 1, obj, casesToCheck);
            }
          });
        }
      });
    });
    OptionIO.getCommon().get(
      'theme_mods_mpat-theme',
      (r) => {
        if (r.custom_css_post_id) {
          const res = window.CustomCSS.find(p => p.ID === r.custom_css_post_id);
          if (res) {
            casesToCheck.push(
              {
                type: 'additional',
                css: res.post_content
              }
            );
          }
          this.processCases(casesToCheck);
        }
      },
      (error) => {
        console.log(`${'error accessing option theme_mods_mpat-theme' + ' '}${error}`);
      });
  }

  processCases(cases) {
    const prcases = cases.map((cas) => {
      if (cas.type === 'additional') {
        return `/* additionalcss */\n${cas.css}\n/* endaddcss */`;
      }  // cas.type === 'border'
      return `.box_${cas.box}_state_${cas.state}_obj_${cas.object} { border: ${cas.css};}`;
    });
    const css = prcases.join('\n');
    const css1 = urlencode(css);
    const url = `${window.location.origin}/proxy.php?output=json&text=${css1}`;
    console.log(url);
    axios.get(url,
      { headers: { 'X-Proxy-URL': 'http://jigsaw.w3.org/css-validator/validator' } })
      .then(
      (res) => {
        if (!res.data.cssvalidation.validity) {
          let errorString = 'CSS Errors: \n';
          const result = res.data.cssvalidation.result;
          const errors = res.data.cssvalidation.errors;
          const errorNb = result.errorcount;
          const css2 = css.split('\n'); // to reconstruct lines with correct number
          for (let i = 0; i < errorNb; i++) {
            const error = errors[i];
            errorString += `${error.message} (context: ${error.context})\n`;
            errorString += `${css2[error.line - 1]}\n\n`;
          }
          window.alert(errorString);
        } else {
          window.alert('CSS fully valid');
        }
      })
      .catch(
      (error) => {
        window.alert(`CSS checking error: ${error}`);
      }
      );
  }


  checkBorder(css, bn, sn, on, caseList) {
    caseList.push(
      {
        type: 'border',
        box: bn,
        state: sn,
        object: on,
        css
      });
  }

  switchParentTo(e) {
    const newParentId = e.target.value;
    window.Post.postInfo.post_parent = `${newParentId}`;
    this.state.postParent = newParentId;
    this.forceUpdate();
  }

  switchTo(pageId) {
    if (canLeave() ||
      window.confirm(i18n.confirmLeave)) {
      window.location.href =
        `${window.location.origin}${window.location.pathname}?post=${pageId}&action=edit`;
    }
  }

  mainButtons(dup = false, buttonBack, buttonToggle) {
    const pageOptions =
      window.Pages.map((p, i) => (<option key={i + 1} value={p.ID}>{p.post_title}</option>));
    pageOptions.unshift(<option key="0" value="">{i18n.quickLink}:</option>);
    const saveTitle = saveTitles[this.state.willSaveTo];
    return (
      <div className="hard-right-top">
        <table>
          <tbody>
            <tr>
              {buttonBack &&
                <td>
                  {getTooltipped(
                    <button
                      type="button"
                      className={buttonBack.className}
                      onClick={buttonBack.onClick}
                    >{buttonBack.textContent}</button>
                    , i18n.ttBackToPageEditor)}
                </td>}
              {buttonToggle &&
                <td>
                  {getTooltipped(
                    <button
                      type="button"
                      className={buttonToggle.className}
                      onClick={buttonToggle.onClick}
                    >{buttonToggle.textContent}</button>
                    , i18n.ttToggleState)}
                </td>}
              <td>
                {getTooltipped(
                  <select
                    value=""
                    onChange={e => this.switchTo(e.target.value)}
                  >{pageOptions}
                  </select>
                  , i18n.ttQuickLink)}

              </td>
              {dup &&
                <td>
                  {getTooltipped(
                    <button
                      type="button"
                      id="duplicateStuff"
                      onClick={this.duplicate}
                      className="button green_white"
                    >{i18n.duplicate}</button>
                    , i18n.ttDuplicate)}
                </td>}
              <td>
                {getTooltipped(
                  <button
                    id="editLayout"
                    type="button"
                    onClick={this.editLayout}
                    className="button green_white"
                  >{i18n.editLayout}</button>
                  , i18n.ttEditLayout)}
              </td>
              <td>
                {getTooltipped(<UndoRedo />, i18n.ttUndoRedo)}
              </td>
              <td>
                {getTooltipped(
                  <button
                    type="button"
                    id="updateStuff"
                    onClick={this.update}
                    className="button updateButton green_white"
                  >{saveTitle}</button>
                  , i18n.ttSavePage)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}
/* FIXME oh my...*/
let $ = jQuery;
$(() => {
  $('#slugdiv-hide, #members-cp-hide').prop('checked', false);
  $('.columns-prefs-1 input').click();
});

function PreviewStyles({ context }) {
  let styles = '';
  const ratio = context.width / Constants.tv.resolutions.hdready.width;

  // FIXME Where does 'frontendStyles' come from?
  for (const selector in frontendStyles) {
    const singleStyle = frontendStyles[selector];
    let itemStyle = '';

    for (const directive in singleStyle) {
      if (directive === 'font-size') {
        itemStyle += `${directive}: ${singleStyle[directive] * ratio}px;`;
      } else {
        itemStyle += `${directive}: ${singleStyle[directive]};`;
      }
    }

    styles += `.mpat-frontend-preview ${selector}{ ${itemStyle}}`;
  }

  return (
    <style type="text/css">
      {styles}
    </style>
  );
}
