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
 *
 **/
import React from 'react';
import ComponentEditor from './ComponentEditor';
import TextSubmit from '../helpers/TextSubmit';
import { ArrowLeft } from '../icons';
import { wait } from '../../utils';
import { classnames } from '../../../functions';
import LocalizedStrings from 'react-localization';
import Constants from '../../../constants';
import PageEditor from './PageEditor';

const i18n = Constants.locstr.stateEditor;
export default class StateEditor extends React.PureComponent {

  state = {
    collapseStateList: true,
    saveSuccess: null
  };

  onClickCollapse = (e) => {
    e.preventDefault();
    this.setState({ collapseStateList: !this.state.collapseStateList });
  };

  onClickBack = (e) => {
    e.preventDefault();
    this.props.onClickBack();
  };

  saveTemplate = (name) => {
    wait(1000).then(() => {
      this.setState({ saveSuccess: null });
    });
    this.props.saveTemplate(this.props.content, name).then((response) => {
      this.setState({ saveSuccess: true });
    }).catch((reason) => {
      this.setState({ saveSuccess: false });
    });
  };


  render() {
    const {
      id,
      stateId = '_0',
      getAreas,
      changeAreaState,
      changeAreaStateType,
      changeAreaStateContent,
      changeAreaStateMeta,
      changeAreaStateStyle,
      addAreaState,
      deleteAreaState,
      editAreaStateName,
      setStateActive,
      content,
      editContext,
      getComponentStates,
      pageContent,
      mainButtons,
      chooseTargetView,
      model,
      editMode
    } = this.props;

    const bindStateId = fn => fn.bind(null, stateId);
    const editViewProps = {
      id,
      stateId,
      model,
      editMode,
      getAreas,
      getComponentStates,
      pageContent,
      curEditContext: editContext,
      content: content[stateId],
      changeAreaStateType: bindStateId(changeAreaStateType),
      changeAreaStateMeta: bindStateId(changeAreaStateMeta),
      changeAreaStateContent: bindStateId(changeAreaStateContent),
      changeAreaStateStyle: bindStateId(changeAreaStateStyle),
    };
    const collapsed = this.state.collapseStateList;
    return (
      <div>
        <h2>{i18n.title}</h2>
        {chooseTargetView()}
        {mainButtons(false,
          {
            className: "button-back green_white",
            onClick: this.onClickBack,
            textContent: 'Page Editor'
          },
          {
            className: "button-collapse white_blue",
            onClick: this.onClickCollapse,
            textContent: i18n.txtToggleStateDisplay
          })}
        <div style={{ overflow: 'hidden', position: 'relative' }}>
          <div
            className={classnames({ 'state-menu': true, collapsed, editHeader: true }, )}
            style={{ zIndex: 9, border: '1px solid black', height: '100%', overflow: 'auto' }}
          >
            <h1>{i18n.stateManagement}</h1>
            <TextSubmit onClickSubmit={addAreaState} tooltiptext={i18n.ttTitle} placeholder={i18n.phTitle} />
            <ul>
              {content && Object.keys(content).map(key => (
                <li
                  key={key}
                  className={classnames({ selected: key === stateId })}
                  onClick={() => changeAreaState(key)}
                >
                  <input
                    disabled
                    id={key + 'input'}
                    type="text"
                    value={content[key].stateTitle}
                    onChange={(ev) => {
                      editAreaStateName(key, ev.target.value);
                      ev.stopPropagation();
                      ev.preventDefault();
                    }}
                    onKeyPress={(ev) => {
                      const keyCode = ev.which || ev.keyCode;
                      if (keyCode === 13) {
                        document.getElementById(key + 'input').disabled = true;
                        ev.stopPropagation();
                        ev.preventDefault();
                      }
                    }}
                  />
                  <span
                    className="dashicons dashicons-edit"
                    onClick={(e) => {
                      e.stopPropagation();
                      document.getElementById(key + 'input').disabled = false;
                    }}
                  />
                  {Object.keys(content).length > 1 &&
                    <span
                      className="dashicons dashicons-trash"
                      onClick={(e) => { e.stopPropagation(); deleteAreaState(key); }}
                    />
                  }
                  {Object.keys(content).length > 1 &&
                    <span
                      className={content[key].stateActive === true ? "dashicons dashicons-star-filled" : "dashicons dashicons-star-empty"}
                      onClick={(e) => { e.stopPropagation(); setStateActive(key); }}
                    />
                  }
                </li>
              ))}
            </ul>
          </div>
          <ComponentEditor {...editViewProps} />
        </div>
      </div>
    );
  }
}

// the above false && is the equivalent of a comment
