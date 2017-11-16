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
 * Marco Ferrari (marco.ferrari@finconsgroup.com)
 **/
import React from 'react';

import Constants from '../../../constants';
const i18n = Constants.locstr;

export const formTypes = [
    {
        name: 'fontSize',
        label: i18n.formTypes.fontSize.label,
        fieldType: 'TextInput',
        fieldProps: {
            placeholder: i18n.formTypes.fontSize.placeholder,
            defaultValue: '0pt'
        }
    },
    {
        name: 'fontWeight',
        label: i18n.formTypes.fontWeight.label,
        fieldType: 'TextInput',
        fieldProps: {
            placeholder: i18n.formTypes.fontWeight.placeholder,
            defaultValue: '400'
        }
    },
    {
        name: 'border',
        label: i18n.formTypes.border.label,
        fieldType: 'TextInput',
        fieldProps: {
            placeholder: i18n.formTypes.border.placeholder,
            defaultValue: 'none'
        }
    },
    {
        name: 'borderRadius',
        label: i18n.formTypes.borderRadius.label,
        fieldType: 'TextInput',
        fieldProps: {
            placeholder: i18n.formTypes.borderRadius.placeholder,
            defaultValue: '0px'
        }
    },
    {
        name: 'margin',
        label: i18n.formTypes.margin.label,
        fieldType: 'TextInput',
        fieldProps: {
            placeholder: i18n.formTypes.margin.placeholder,
            defaultValue: '0px'
        }
    },
    {
        name: 'padding',
        label: i18n.formTypes.padding.label,
        fieldType: 'TextInput',
        fieldProps: {
            placeholder: i18n.formTypes.padding.placeholder,
            defaultValue: '0px'
        }
    },
    {
        name: 'color',
        label: i18n.formTypes.color.label,
        fieldType: 'ChromePicker',
        fieldProps: {
            placeholder: i18n.formTypes.color.placeholder,
            defaultValue: '#000'
        }
    },
    {
        name: 'backgroundColor',
        label: i18n.formTypes.backgroundColor.label,
        fieldType: 'ChromePicker',
        fieldProps: {
            placeholder: i18n.formTypes.backgroundColor.placeholder,
            defaultValue: 'transparent'
        }
    }
];
