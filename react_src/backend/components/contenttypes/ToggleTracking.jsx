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
 * Jean-Claude Dufourd (jean-claude.dufourd@telecom-paristech.fr
 *
 **/
import React from 'react';
import { TextInput, SelectInput } from '../helpers/Inputs';
import { componentLoader } from '../../../ComponentLoader';
import {getTooltipped} from '../../tooltipper.jsx';
import Constants from '../../../constants';

const i18n = Constants.locstr.toggleTracking;

function editView(params) {
    const { id, data, changeAreaContent, context, stateId } = params;

    return (
        <ToggleTrackingEdit id={id} {...data} changeAreaContent={changeAreaContent} />
    );
}

function preview({ button, disabledText, enabledText }) {
    return (
        <div>[{button} ] {disabledText} / {enabledText}</div>
    );
}


class ToggleTrackingEdit extends React.PureComponent {

    static defaultProps = {
        button: '0',
        disabledText: '',
        enabledText: ''
    }

    onChange(key, value) {
        this.props.changeAreaContent({ [key]: value });
    }

    render() {
        const { button, disabledText, enabledText } = this.props;
        return (
            <div className="component editHeader">
                <h2>{i18n.title}</h2>
                <table>
                    <tbody>
                        <tr>
                            <td>
                                <div>
                                    {i18n.enabledText}<br />
                                    {getTooltipped(
                                        <TextInput value={enabledText} onChange={e => this.onChange('enabledText', e.target.value)} tr={true} />
                                        , i18n.ttEnabledText)}
                                </div>
                                <div>
                                    {i18n.disabledText}<br />
                                    {getTooltipped(
                                        <TextInput value={disabledText} onChange={e => this.onChange('disabledText', e.target.value)} tr={true} />
                                        , i18n.ttDisabledText)}
                                </div>
                                {getTooltipped(
                                    <SelectInput
                                        label={i18n.button}
                                        value={button}
                                        options={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => ({ name: n, value: n }))}
                                        onChange={e => this.onChange('button', e.target.value)}
                                        tr={true}
                                    />
                                    , i18n.ttButton)}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    }
}

componentLoader.registerComponent(
    'toggletracking', {
        edit: editView,
        preview
    }, {
        isHotSpottable: false,
        isScrollable: false,
        hasNavigableGUI: true,
        isStylable: true
    }, {
        navigable: true
    }
);
