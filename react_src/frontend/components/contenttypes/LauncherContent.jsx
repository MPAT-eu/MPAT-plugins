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
 * Benedikt Vogel    (vogel@irt.de)
 * Jean-Claude Dufourd (jean-claude.dufourd@telecom-paristech.fr
 * Stefano Miccoli (stefano.miccoli@finconsgroup.com)
 * Marco Ferrari (marco.ferrari@finconsgroup.com)
 **/
import React, { PropTypes as Types } from 'react';
import autobind from 'class-autobind';
import styleType from 'react-style-proptype';
import { createHandler, handlersWithTag } from '../../utils';
import { classnames } from '../../../functions';
import { registerHandlers, unregisterHandlers } from '../../RemoteBinding';
import { trackAction } from '../../analytics';
import { Dot } from '../icons/Icons';
import { pageElemType, pageElemDefaults } from '../../types';
import { componentLoader } from '../../../ComponentLoader';
import { application } from '../../appData';
import Constants from '../../../constants';

export const itemType = Types.shape({
  title: Types.string,
  appUrl: Types.string,
  thumbnail: Types.string,
  description: Types.string
});

function CarouselLauncher({ items, elementFormat = 'landscape', currentIndex,
                            orientation = 'horizontal', styles, focused }) {
  /* positioning
    LauncherScrollContainer
    verticalOffset => margin-top = -0.5*LauncherElement height
    (horizontal) focusedOffset  => margin-left = -0.5*LauncherElementFocused width
    - index*LauncherElementNormal width

    LauncherElementSize LANDSCAPE
    focused: 268x142 + padding:10 = 288x162 (16:9) +border  +margin = 324x180
    normal:  204x106 + padding:10 = 224x126 (16:9)          +margin = 244x180
    focusedOffset = focusedWidth / 2 = 162

    LauncherElementSize SQUARE
    focused: 142x142 + padding:10 = 162x162  +border  +margin = 198x180
    normal:  106x106 + padding:10 = 126x126           +margin = 146x180
    focusedOffset = focusedWidth / 2 = 99
  */

  let focusedOffset;
  const css = [];
  const activeElementStyles = styles.itemActive || {};
  let containerStyle = {};
  if (orientation === 'horizontal') {
    let normalWidth;
    if (elementFormat === 'landscape') {
      css.push({ width: 268, height: 142, margin: '6px 15px', ...activeElementStyles });
      css.push({ width: 204, height: 106, margin: '27px 10px' });
      focusedOffset = 162;
      normalWidth = 224;
    } else if (elementFormat === 'square') {
      css.push({ width: 142, height: 142, margin: '6px 15px', ...activeElementStyles });
      css.push({ width: 106, height: 106, margin: '27px 10px' });
      focusedOffset = 99;
      normalWidth = 126;
    }
    containerStyle = {
      width: items.length * normalWidth + focusedOffset,
      marginLeft: -focusedOffset - normalWidth * currentIndex,
      marginTop: -80
    };
  } else {
    let marginLeft;
    let width;
    if (elementFormat === 'landscape') {
      css.push({ width: 268, height: 142, margin: '15px 3px', ...activeElementStyles });
      css.push({ width: 204, height: 106, margin: '10px 38px' });
      marginLeft = -150;
      width = 350;
    } else if (elementFormat === 'square') {
      css.push({ width: 142, height: 142, margin: '15px 3px', ...activeElementStyles });
      css.push({ width: 106, height: 106, margin: '10px 24px' });
      marginLeft = -87;
      width = 200;
    }
    focusedOffset = 89;
    containerStyle = {
      width,
      height: items.length * 126 + focusedOffset,
      marginTop: -focusedOffset - 126 * currentIndex,
      marginLeft
    };
  }

  return (
    <div>
      {currentIndex !== 0 && orientation === 'horizontal' &&
        <div style={{ marginLeft: (-focusedOffset - 5) }} className="launcherElementArrowLeft" />
      }
      {currentIndex !== (items.length - 1) && orientation === 'horizontal' &&
        <div style={{ marginRight: (-focusedOffset+15) }} className="launcherElementArrowRight" />
      }
      <div
        style={containerStyle}
        className="launcherScrollContainer"
      >
        {items.map((item, i) =>
          <LauncherElement
            key={i}
            focused={focused && i === currentIndex}
            item={item}
            css={i === currentIndex ? css[0] : css[1]}
          />
        )}
      </div>
    </div>
  );
}

CarouselLauncher.propTypes = {
  items: Types.arrayOf(itemType),
  elementFormat: Types.string,
  currentIndex: Types.number.isRequired,
  orientation: Types.string,
  focused: Types.bool.isRequired
};

function PageCountDisplay({ pageCount, currentPage }) {
  if (pageCount <= 1) {
    return null;
  }
  const dots = [];
  for (let i = 0; i < pageCount; i++) {
    dots.push(<span key={i}><Dot radius={i === currentPage ? 5 : 3} /></span>);
  }
  return (
    <div className="paginationDots">{dots}</div>
  );
}

PageCountDisplay.propTypes = {
  pageCount: Types.number.isRequired,
  currentPage: Types.number.isRequired
};

function PaginationLauncher({ items, currentIndex, width, height, cols, rows,
  paginationInfo = true, focused, styles }) {
  const ipp = cols * rows;
  const currentPage = Math.floor(currentIndex / ipp);
  const currentItems = items.slice(currentPage * ipp, (currentPage + 1) * ipp);
  const pageCount = Math.ceil(items.length / ipp);
  const m = 10;    // margin around the launcher elements, min 3 for border
  const p = 20;    // padding between launcher elements
  const w = (width - 2 * m - (cols - 1) * p) / cols;
  const h = (height - 2 * m - (rows - 1) * p) / rows;
  const itemStyle = (i) => {
    const col = Math.floor(i / cols);
    const row = i % cols;
    const itemFocused = focused && i === currentIndex % ipp;
    const activeElementStyles = itemFocused ? styles.itemActive : {};
    return {
      width: w,
      height: h,
      left: m + (w + p) * row - (itemFocused ? 5 : 0),
      top: m + (h + p) * col - (itemFocused ? 5 : 0),
      ...activeElementStyles
    };
  };
  return (
    <div className="paginationLauncherContainer">
      <div>
        {currentItems.map((item, i) =>
          <LauncherElement
            key={i}
            focused={focused && i === currentIndex % ipp}
            item={item}
            css={itemStyle(i)}
          />
        )}
      </div>
      {paginationInfo &&
        <PageCountDisplay currentPage={currentPage} pageCount={pageCount} />
      }
    </div>
  );
}

PaginationLauncher.propTypes = {
  items: Types.arrayOf(itemType).isRequired,
  currentIndex: Types.number.isRequired,
  width: Types.number.isRequired,
  height: Types.number.isRequired,
  cols: Types.number.isRequired,
  rows: Types.number.isRequired,
  paginationInfo: Types.bool,
  focused: Types.bool.isRequired
};

function pageCoordsFromIndex(i, n, rows, cols) {
  const ipp = rows * cols;
  const page = Math.floor(i / ipp);
  const nPages = Math.ceil(n / ipp);
  const iCurPage = i % ipp;
  const row = Math.floor(iCurPage / cols);
  const col = Math.floor(iCurPage % cols);
  if (row < 0 || row >= rows || col < 0 || col >= cols || page < 0 || page >= nPages) {
    return;
  }
  return { page, row, col };
}

function indexFromPageCoords(page, row, col, nRows, nCols, n) {
  const nPages = Math.ceil(n / (nRows * nCols));
  const i = nRows * nCols * page + row * nCols + col;
  if (row < 0 || row >= nRows || col < 0 || col >= nCols || page < 0 || page >= nPages) {
    return;
  }
  if (i < 0 || i >= n) {
    return;
  }
  return i;
}

function scrollHorizontalPaginationHorizontal(isLeft, currentIndex, nItems, rows, cols) {
  const coords = pageCoordsFromIndex(currentIndex, nItems, rows, cols);
  let { page, col } = coords;
  const { row } = coords;
  if (isLeft) {
    col--;
    if (col < 0) {
      page--;
      col = cols - 1;
    }
  } else {
    col++;
    if (col >= cols) {
      page++;
      col = 0;
    }
  }
  let newIndex = indexFromPageCoords(page, row, col, rows, cols, nItems);
  if (newIndex === undefined) {
    newIndex = indexFromPageCoords(page, row - 1, col, rows, cols, nItems);
  }
  return newIndex;
}

function scrollHorizontalPaginationVertical(isLeft, currentIndex, nItems, rows, cols) {
  const coords = pageCoordsFromIndex(currentIndex, nItems, rows, cols);
  let { col } = coords;
  const { page, row } = coords;
  if (isLeft) {
    col--;
  } else {
    col++;
  }
  let newIndex = indexFromPageCoords(page, row, col, rows, cols, nItems);
  if (newIndex === undefined) {
    newIndex = indexFromPageCoords(page, row - 1, col, rows, cols, nItems);
  }
  return newIndex;
}

function scrollVerticalPaginationHorizontal(isUp, currentIndex, nItems, rows, cols) {
  const coords = pageCoordsFromIndex(currentIndex, nItems, rows, cols);
  let { row } = coords;
  const { page, col } = coords;
  if (isUp) {
    row--;
  } else {
    row++;
  }
  let newIndex = indexFromPageCoords(page, row, col, rows, cols, nItems);
  if (newIndex === undefined) {
    newIndex = indexFromPageCoords(page, row, col - 1, rows, cols, nItems);
  }
  return newIndex;
}

function scrollVerticalPaginationVertical(isUp, currentIndex, nItems, rows, cols) {
  const coords = pageCoordsFromIndex(currentIndex, nItems, rows, cols);
  let { page, row } = coords;
  const { col } = coords;
  if (isUp) {
    row--;
    if (row < 0) {
      page--;
      row = rows - 1;
    }
  } else {
    row++;
    if (row >= rows) {
      page++;
      row = 0;
    }
  }
  let newIndex = indexFromPageCoords(page, row, col, rows, cols, nItems);
  if (newIndex === undefined) {
    newIndex = indexFromPageCoords(page, row, col - 1, rows, cols, nItems);
  }
  return newIndex;
}

export function LauncherElement({ item: { title = '', roleData = {}, thumbnail = '',
  description = '', contentIcon }, css = {}, focused = false }) {
  if (css.borderWidth || css.borderStyle) {
    // border is present, then render differently
    const css1 = Object.assign({}, css, {borderWidth: 0});
    const css2 = {
      borderStyle: css.borderStyle,
      borderWidth: css.borderWidth,
      borderColor: css.borderColor,
      width: css.width, height: css.height, position: 'absolute', top: css.top, left: css.left,
      boxSizing: 'border-box',
      zIndex: 10
    };
    return (
      <div style={css1}>
        <div
          className={classnames({ launcherElement: true, focused })}
          style={{ width: css.width, height: css.height, position: 'absolute', top: css.top, left: css.left }}
        >
          <img
            src={thumbnail}
            role="presentation"
            width="100%"
            height="100%"
            style={{ objectFit: 'cover' }}
          />
          {!(title === '' && description === '') &&
          <div className="launcherElementLabel">
            <a href={roleData.appUrl}>{title}</a>
            <p>{description}</p>
          </div>
          }
          {contentIcon && <div className={"launcherContentIcon "+contentIcon} />}
        </div>
        <div style={css2}/>
      </div>
    );
  }
  return (
    <div className={classnames({ launcherElement: true, focused })} style={css}>
      <img
        src={thumbnail}
        role="presentation"
        width="100%"
        height="100%"
        style={{ objectFit: 'cover' }}
      />
      {!(title === '' && description === '') &&
        <div className="launcherElementLabel">
          <a href={roleData.appUrl}>{title}</a>
          <p>{description}</p>
        </div>
      }
      {contentIcon && <div className={"launcherContentIcon "+contentIcon} />}
    </div>
  );
}

LauncherElement.propTypes = {
  item: itemType,
  css: styleType,
  focused: Types.bool
};

class LauncherContent extends React.Component {

  static propTypes = {
    ...pageElemType,
    scrollStyle: Types.oneOf(['carousel', 'pagination']),
    listArray: Types.arrayOf(itemType),
    bgColor: Types.string, // TODO maybe create a custom 'color string' Type
    elementFormat: Types.oneOf(['landscape', 'square'])
  };

  static defaultProps = {
    ...pageElemDefaults,
    nRows: 1,
    nCols: 1
  };

  constructor(props) {
    super(props);
    autobind(this);

    this.state = { currentIndex: 0 };

    if (this.props.listArray !== undefined) {
      if (this.props.scrollStyle === 'carousel') {
        this.state.currentIndex = Math.floor(this.props.listArray.length / 2.1);
      } else { // pagination
        const page = Math.max(Math.min(
          parseInt(props.queryParams, 10),
          Math.ceil(props.listArray.length / 6) - 1), 0
        );
        if (!isNaN(page)) {
          this.state.currentIndex = page * 6;
        }
      }
    } else { console.log('LauncherContent: listarray undefined in frontend'); }

    const clang = window.MPATGlobalInformation.application_manager.app_language;
    Constants.locstr.setLanguage(clang);
    this.monthNames = Constants.locstr.launcher.frontend.monthNames;
    this.dayNames = Constants.locstr.launcher.frontend.dayNames;
  }

  componentDidMount() {
    // Register Key Handlers
    const { orientation = 'horizontal', scrollStyle = 'pagination' } = this.props;
    let handlers;
    if (scrollStyle === 'carousel') {
      handlers = [
        createHandler(
          orientation === 'horizontal' ? KeyEvent.VK_LEFT : KeyEvent.VK_UP,
          this.scrollCarousel.bind(null, true)
        ),
        createHandler(
          orientation === 'horizontal' ? KeyEvent.VK_RIGHT : KeyEvent.VK_DOWN,
          this.scrollCarousel.bind(null, false)
        )
      ];
    } else {
      handlers = [
        createHandler(KeyEvent.VK_LEFT, this.scrollPagination.bind(null, -1, 0)),
        createHandler(KeyEvent.VK_RIGHT, this.scrollPagination.bind(null, 1, 0)),
        createHandler(KeyEvent.VK_UP, this.scrollPagination.bind(null, 0, -1)),
        createHandler(KeyEvent.VK_DOWN, this.scrollPagination.bind(null, 0, 1))
      ];
    }
    handlers.push(createHandler(KeyEvent.VK_ENTER, this.enter));
    registerHandlers(this, handlersWithTag('focused', handlers));
  }

  componentDidUpdate(_, { currentIndex }) {
    if (this.state.currentIndex !== currentIndex) {
      const curItem = this.props.listArray[this.state.currentIndex];
      if (curItem.role === 'control' &&
        this.props.targetComponent &&
        curItem.roleData.triggerAction === 'focus') {
        const { targetState, targetLabel } = curItem.roleData;
        trackAction('launcher', 'control', '');
        this.props.setAreaState(this.props.targetComponent, targetState, targetLabel);
      }
    }
  }

  componentWillUnmount() {
    unregisterHandlers(this);
  }

  scrollCarousel(isPrev) {
    const { listArray } = this.props;
    let i = this.state.currentIndex;
    const nItems = this.props.listArray.length;
    const direction = isPrev ? -1 : 1;
    if (application.application_manager.smooth_navigation &&
      ((isPrev && i < 1) || (!isPrev && i >= nItems - 1))) {
      return false;
    }
    i += direction;
    trackAction('launcher', (isPrev) ? 'prev' : 'next',
      listArray[Math.min(Math.max(i, 0), listArray.length - 1)].title);
    this.setState({ currentIndex: Math.min(Math.max(i, 0), listArray.length - 1) });
  }

  scrollPagination(hor, ver) {
    const { orientation = 'horizontal', listArray } = this.props;
    let { currentIndex } = this.state;
    const rows = this.props.nRows;
    const cols = this.props.nCols;
    if (ver === 0) {
      if (orientation === 'horizontal') {
        currentIndex = scrollHorizontalPaginationHorizontal(hor < 0, currentIndex,
          listArray.length, rows, cols);
      } else {
        currentIndex = scrollHorizontalPaginationVertical(hor < 0, currentIndex,
          listArray.length, rows, cols);
      }
    } else if (orientation === 'horizontal') {
      currentIndex = scrollVerticalPaginationHorizontal(ver < 0, currentIndex,
        listArray.length, rows, cols);
    } else {
      currentIndex = scrollVerticalPaginationVertical(ver < 0, currentIndex,
        listArray.length, rows, cols);
    }
    if (currentIndex === undefined) {
      return false;
    }
    trackAction('launcher', (hor + ver < 0) ? 'prev' : 'next',
      listArray[Math.min(Math.max(currentIndex, 0), listArray.length - 1)].title);
    this.setState({ currentIndex: Math.min(Math.max(currentIndex, 0), listArray.length - 1) });
  }

  enter() {
    const curItem = this.props.listArray[this.state.currentIndex];
    if (curItem.role === 'link') {
      trackAction('launcher', 'goto', curItem.roleData.appUrl);
      this.props.pageUtils.goToPage(curItem.appUrl);
    } else if (curItem.role === 'control' && this.props.targetComponent) {
      if (curItem.roleData.triggerAction === 'enter') {
        const { targetState, targetLabel } = curItem.roleData;
        trackAction('launcher', 'control', targetLabel);
        this.props.setAreaState(this.props.targetComponent, targetState);
      }
    } else { // backward compatibility
      trackAction('launcher', 'goto', curItem.appUrl);
      this.props.pageUtils.goToPage(curItem.appUrl);
    }
  }

  render() {
    const items = this.props.listArray;
    const { currentIndex } = this.state;
    const { position, scrollStyle = 'pagination', style = 'standard', orientation = 'horizontal',
      elementFormat = 'landscape', paginationInfo = true } = this.props;
    const date = new Date();
    const LauncherView = scrollStyle === 'carousel' ? CarouselLauncher : PaginationLauncher;
    return (
      <div
        className={classnames({ launcherContainer: true, arte: style === 'arte' })}
      >
        {style === 'arte' &&
          <div id="arte-top-bar">
            <div id="arte-date" className="grid_text_color">
              {this.dayNames[date.getDay()]},
            {date.getDate()}
              . {this.monthNames[date.getMonth()]}
              {date.getFullYear()}
              <span className="grid_highlight_text_color">
                {date.getHours() < 10 ? '0' : ''}
                {date.getHours()}.{date.getMinutes() < 10 ? '0' : ''}
                {date.getMinutes()} UHR
            </span>
            </div>
          </div>}
        {style === 'arte' &&
          <div id="arte-bottom-bar">
            <div id="arte-fokus-logo" />
            <div id="arte-left-area">
              <img src="http://static-cdn.arte.tv/redbutton/images/navig_DE.png" alt="" />
              <img src="http://static-cdn.arte.tv/redbutton/images/valid_DE.png" alt="" />
            </div>
            <div id="arte-right-area">
              <div className="item grid_text_color">
                <span className="pict red" />
                BEENDEN
            </div>
              <div className="item grid_text_color">
                <span className="pict blue" />
                HILFE/IMPRESSUM
            </div>
            </div>
          </div>}
        <LauncherView
          items={items}
          currentIndex={currentIndex}
          elementFormat={elementFormat}
          orientation={orientation}
          rows={+this.props.nRows}
          cols={+this.props.nCols}
          paginationInfo={paginationInfo}
          focused={this.props.focused}
          styles={this.props.componentStyles}
          {...position}
        />
      </div>
    );
  }
}

componentLoader.registerComponent('launcher', { view: LauncherContent }, {
  isStylable: true
});
