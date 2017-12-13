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
 * Jean-Claude Dufourd (jean-claude.dufourd@telecom-paristech.fr
 * Benedikt Vogel    (vogel@irt.de)
 * Stefano Miccoli (stefano.miccoli@finconsgroup.com)
 * Marco Ferrari (marco.ferrari@finconsgroup.com)
 **/
import React, { PropTypes as Types } from 'react';
import { pageElemContainerType, pageElemDefaults } from '../types';
import { componentLoader } from '../../ComponentLoader';
import { classnames } from '../../functions';
import HotSpot from './hotspot/HotSpot';
import SideMenu from './contenttypes/SideMenuContent';

function sanitize(value) {
  if (typeof value === 'string') {
    const i = value.indexOf('px');
    if (i > 0) {
      return +(value.substring(0, i));
    }
    let v = +value;
    if (isNaN(v)) v = 0;
    return v;
  }
  return 0;
}

function calcStyle(x, y, w, h, b = 0) {
  return {
    left: (x * 10) - b,
    top: (y * 10) - b,
    width: (w * 10) + b,
    height: (h * 10) + b
  };
}

export default class PageElement extends React.Component {

  static propTypes = {
    ...pageElemContainerType,
    i: Types.string.isRequired,
    x: Types.number.isRequired,
    y: Types.number.isRequired,
    w: Types.number.isRequired,
    h: Types.number.isRequired,
    type: Types.string.isRequired,
    // eslint-disable-next-line react/forbid-prop-types
    data: Types.object,
    focusedStyles: Types.object,
    styles: Types.object,
    navigable: Types.bool.isRequired,
    queryParams: Types.oneOfType([
      Types.string,
      Types.array,
      Types.object
    ])
  };

  static defaultProps = {
    ...pageElemDefaults,
    type: 'text',
    focusedStyles: {}, // styles to be applied to the component wrapper for focused component border
    styles: { // styles to be applied to the component
      container: {} // backward compatibility, TODO remove it (every area should already come with styles container) when legacy compatibility is dropped
    }
  };

  render() {
    const { focused, styles, focusedStyles, active, type, data, hotSpotMeta, queryParams, allowMedia,
      setAreaState, frontendView, moveTo, pageUtils, dontVisualizeFocus, navigable
    } = this.props;
    const Content = componentLoader.getFrontendView(type, frontendView);
    const { x, y, w, h } = this.props;
    const padding = sanitize(styles.container && styles.container.padding || 0);
    const border = sanitize(styles.container && styles.container.border || 0);
    const position = calcStyle(0, 0, w, h);
    const positionH = calcStyle(x, y, w, h);
    let highlightStyles = Object.assign({}, focusedStyles);
    if (focusedStyles && focusedStyles.borderWidth) {
      const bWidth = focusedStyles.borderWidth;
      highlightStyles = Object.assign({}, highlightStyles, { top: -bWidth, left: -bWidth, right: -bWidth, bottom: -bWidth });
    }
    const style = { ...this.props.styles.container, ...{ top: 0, left: 0, right: 0, bottom: 0, position: 'absolute' } };
    if (dontVisualizeFocus || !focused) {
      highlightStyles.borderColor = 'transparent';
    }
    const elementClasses = {
      'page-element': true,
      active
    };
    elementClasses[`${type}-component`] = true;
    // if (style.backgroundColor) highlightStyles.backgroundColor = style.backgroundColor;
    // if (style.background) highlightStyles.background = style.background;

    return (
      (data && data.sidemenu) ?
        <SideMenu
          id={this.props.i}
          position={Object.assign({}, style, positionH)}
          focused={focused}
          setAreaState={setAreaState}
          pageUtils={pageUtils}
          navigable={navigable}
          componentStyles={this.props.styles}
          {...data}
        />
      :
      (hotSpotMeta.isHotSpot ?
        <HotSpot {...this.props} style={positionH} componentStyle={this.props.styles.container} />
        :
        <div
          style={positionH}
          className={classnames(elementClasses)}
        >
          {Content ?
            <div style={style}>
              <Content
                id={this.props.i}
                position={calcStyle(0, 0, w, h)}
                allowMedia={allowMedia}
                queryParams={queryParams}
                active={active}
                focused={focused}
                setAreaState={setAreaState}
                moveTo={moveTo}
                pageUtils={pageUtils}
                navigable={navigable}
                componentStyles={this.props.styles}
                {...data}
              />
            </div>
              :
            <div
              dangerouslySetInnerHTML={{ __html:
                `<!-- unable to load view "${frontendView}" for component "${type}" -->` }}
            />
            }
          <div
            className={classnames({ highlight: true, focused, dontVisualizeFocus })}
            style={highlightStyles}
          />
        </div>
      )
    );
  }
}
