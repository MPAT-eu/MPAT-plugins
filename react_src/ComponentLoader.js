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
 * Marco Ferrari (marco.ferrari@finconsgroup.com)
 **/
import React from 'react';
import deepAssign from 'assign-deep';
import constants from './constants';

const i18n = constants.locstr.componentLoader;
const debug = false;

function ComponentLoader() {
  let components = [];

  /**
   * (string) type - component name.
   * (object) classes - contains component classes for the edit, view and preview.
   */
  this.registerComponent = function registerComponent(type, classes, options = {}, defaults = {}, styles = {}) {
    if (this.getComponentByType(type) === undefined) {
      if (debug) {
        console.log('ComponentLoader.registerComponent', type, options, defaults);
      }
      components.push({ type, classes, options, defaults, styles });
      components.sort((a, b) => a.type.localeCompare(b.type));
    } else {
      console.error(`component ${type} already exists`);
    }
  };

  /**
   * return components (object).
   */
  this.getComponents = function getComponents() {
    return components;
  };

  /**
   * (string) type - component name.
   * return single component (object).
   */
  this.getComponentByType = function getComponentByType(type) {
    for (let i = 0; i < components.length; i++) {
      if (components[i].type === type) {
        return components[i];
      }
    }
  };

  this.getComponentProperties = function getComponentProperties(type) {
    for (let i = 0; i < components.length; i++) {
      if (components[i].type === type) {
        return components[i].options;
      }
    }
  };

  this.getComponentProperty = function getComponentProperty(type, propertyName) {
    for (let i = 0; i < components.length; i++) {
      if (components[i].type === type) {
        return (components[i].options && components[i].options[propertyName]) ?
          components[i].options[propertyName] : false;
      }
    }
  };

  // TODO find a way to force only the default keys to be accepted. Anything else coming from options should be discarded
  this.getComponentOptions = function getComponentOptions(type) {
    const componentDefinition = this.getComponentByType(type);
    const defaultComponentOptions = {
      isHotSpottable: false,
      hasNavigableGUI: false,
      isScrollable: false,
      isStylable: false,
      isComponentTrigger: false
    };
    return Object.assign(defaultComponentOptions, componentDefinition.options);
  };
  this.getComponentOption = function getComponentOptions(type, optionName) {
    const componentOptions = this.getComponentOptions(type);
    return componentOptions[optionName] || null;
  };

  this.getComponentDefaults = (type) => {
    const componentDefinition = this.getComponentByType(type);
    const defaultComponentValues = {
      frontendView: 'default',
      navigable: false,
      scrollable: false,
      hotSpotMeta: { isHotSpot: false },
      compScreen: false,
      compScreenMeta: {},
      dontVisualizeFocus: false,
      cloneModel: false, // is this component the model for one or more clones ? if yes, lock
      data: {},
      styles: {
        container: {}
      }
    };
    return Object.assign(defaultComponentValues, componentDefinition.defaults);
  };

  this.getComponentDefault = (type, name) => {
    const componentDefaults = this.getComponentDefaults(type);
    return componentDefaults[name];
  };

  this.getComponentStyles = (type) => {
    const componentDefinition = this.getComponentByType(type);
    const defaultStyles = {
      container: {
        containerTitle: {
          label: i18n.containerTitle.label,
          fieldType: 'separator'
        },
        fontSize: {
          label: i18n.fontSize.label,
          fieldType: 'number',
          fieldProps: {
            placeholder: i18n.fontSize.label,
            minValue: 15,
            maxValue: 50
          },
          suffix: 'px',
          sanitizeValue: v => (v.substring(0, v.indexOf('px')) || ''),
          sanitizeCallback: e => (`${e.target.value}px`)
        },
        lineHeight: {
          label: i18n.lineHeight.label,
          fieldType: 'number',
          fieldProps: {
            placeholder: i18n.lineHeight.label,
            minValue: 5,
            maxValue: 50
          },
          suffix: 'px',
          sanitizeValue: v => (v.substring(0, v.indexOf('px')) || ''),
          sanitizeCallback: e => (`${e.target.value}px`)
        },
        fontWeight: {
          label: i18n.fontWeight.label,
          fieldType: 'select',
          fieldProps: {
            options: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
            placeholder: i18n.fontWeight.placeholder
          }
        },
        border: {
          name: 'border',
          label: i18n.border.label,
          fieldType: 'text',
          fieldProps: {
            placeholder: i18n.border.placeholder
          }
        },
        borderRadius: {
          label: i18n.borderRadius.label,
          fieldType: 'number',
          fieldProps: {
            placeholder: i18n.borderRadius.placeholder,
            minValue: 15,
            maxValue: 50
          },
          suffix: 'px',
          sanitizeValue: v => (v.substring(0, v.indexOf('px')) || ''),
          sanitizeCallback: e => (`${e.target.value}px`)
        },
        margin: {
          label: i18n.margin.label,
          fieldType: 'number',
          fieldProps: {
            placeholder: i18n.margin.placeholder,
            minValue: 15,
            maxValue: 50
          },
          suffix: 'px',
          sanitizeValue: v => (v.substring(0, v.indexOf('px')) || ''),
          sanitizeCallback: e => (`${e.target.value}px`)
        },
        padding: {
          label: i18n.padding.label,
          fieldType: 'number',
          fieldProps: {
            placeholder: i18n.padding.placeholder,
            minValue: 15,
            maxValue: 50
          },
          suffix: 'px',
          sanitizeValue: v => (v.substring(0, v.indexOf('px')) || ''),
          sanitizeCallback: e => (`${e.target.value}px`)
        },
        color: {
          label: i18n.color.label,
          fieldType: 'color'
        },
        backgroundColor: {
          label: i18n.backgroundColor.label,
          fieldType: 'color',
          fieldProps: {
            defaultValue: 'transparent'
          }
        }
      }
    };
    return deepAssign({}, defaultStyles, componentDefinition.styles);
  };

  /**
   * (string) type - component name.
   */
  this.unregisterComponent = function unregisterComponent(type) {
    components = components.filter(el => el.type !== type);
  };

  /**
   * (string) type - component name.
   * (object) new_classes - contains component classes for the edit, view and preview.
   */
  this.overwriteComponent = function (type, newClasses, options = {}, defaults = {}, styles = {}) {
    for (let i = 0; i < components.length; i++) {
      if (components[i].type === type) {
        components[i].classes = newClasses;
        components[i].options = options;
        components[i].defaults = defaults;
        components[i].styles = styles;
        break;
      }
    }
  };

  /**
   * (string) type - component name.
   * (string) element - name of a component class. Such as edit, view or preview.
   * (object) params - properties of a component, such as id, context and component.
   */
  this.renderComponent = function renderComponent(type, element, params) {
    let component_class;

    for (let i = 0; i < components.length; i++) {
      if (components[i].type === type) {
        component_class = components[i].classes[element];
        return React.createElement(component_class, params);
      }
    }
  };

  /**
   * (string) type - component name
   * (string) label - label to show in views selection form
   * (object) viewClass - class to be added to views of the component
   */
  this.registerFrontendView = function registerFrontendView(type, label, viewClass) {
    for (let i = 0; i < components.length; i++) {
      if (components[i].type === type) {
        if (components[i].classes.views === undefined) {
          components[i].classes.views = {};
        }
        components[i].classes.views[label] = viewClass;
        break;
      }
    }
  };

  /**
   * (string) type - component name
   * return all views registered for a component
   */
  this.getFrontendViews = function getFrontendViews(type) {
    const component = this.getComponentByType(type);
    return (component.classes.views !== undefined) ? Object.keys(component.classes.views) : [];
  };

  this.getFrontendView = function getFrontendView(type, view = 'default') {
    if (type === 'clone') return null;
    const component = this.getComponentByType(type);
    let componentView = null;
    if ((view === 'default' || !view) && component.classes.view) {
      componentView = component.classes.view;
    } else if (component.classes.views && component.classes.views[view]) {
      componentView = component.classes.views[view];
    }
    return componentView;
  };
}
// export an instance of a ComponentLoader
export const componentLoader = new ComponentLoader();
