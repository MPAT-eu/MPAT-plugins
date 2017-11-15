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
 * Jean-Claude Dufourd (jean-claude.dufourd@telecom-paristech.fr
 *
 **/
import React from 'react';
import GalleryPreview from './GalleryPreview';
import GalleryEdit from './GalleryEdit';
import { componentLoader } from '../../../../ComponentLoader';

// FIXME I dont think this line is doing anything because we dont have a style loader
// require('react-image-crop/dist/ReactCrop.css');


function editView(params) {
  const { id, data, changeAreaContent, context, stateId } = params;

  return (
    <GalleryEdit
      id={id}
      {...data}
      context={context}
      changeAreaContent={changeAreaContent}
    />
  );
}

function preview(content = {}) {
  return (
    <GalleryPreview content={content.data === '' ? undefined : content.data} />
  );
}
componentLoader.registerComponent(
  'gallery', {
    edit: editView,
    preview
  }, {
    isStylable: true
  }, {
    navigable: true
  }, {
    arrowStyles: {
        containerTitle: {
            label: "Arrow styles",
            fieldType: "separator"
        },
        fontSize: {
            label: "Arrow Size",
            fieldType: "number",
            fieldProps: {
                placeholder: 'size in px',
                minValue: 10,
                maxValue: 50
            },
            suffix: 'px',
            sanitizeValue: (v) => (v.substring(0, v.indexOf('px')) || ''),
            sanitizeCallback: (e) => (`${e.target.value}px`)
        },
        color: {
            label: "Arrow color",
            fieldType: "color",
        },
        backgroundColor: {
            label: "Arrow background color",
            fieldType: "color",
        },
        padding: {
            label: "Arrow padding",
            fieldType: "number",
            fieldProps: {
                placeholder: 'size in px',
                minValue: 0,
                maxValue: 50
            },
            suffix: 'px',
            sanitizeValue: (v) => (v.substring(0, v.indexOf('px')) || ''),
            sanitizeCallback: (e) => (`${e.target.value}px`)
        },
        borderRadius: {
            label: "Arrow border radius",
            fieldType: "number",
            fieldProps: {
                placeholder: 'size in px',
                minValue: 0,
                maxValue: 50
            },
            suffix: 'px',
            sanitizeValue: (v) => (v.substring(0, v.indexOf('px')) || ''),
            sanitizeCallback: (e) => (`${e.target.value}px`)
        }
    },
    dotStylesFocused: {
        containerTitle: {
            label: "Dots styles",
            fieldType: "separator"
        },

        fill: {
            label: "Dot focused color",
            fieldType: "color",
        }
    },
    dotStyles: {
        fill: {
            label: "Dots color",
            fieldType: "color",
        }
    }
  }
);

