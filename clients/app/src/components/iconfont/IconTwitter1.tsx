/* tslint:disable */
/* eslint-disable */

import React, { CSSProperties, SVGAttributes, FunctionComponent } from 'react';
import { getIconColor } from './helper';

interface Props extends Omit<SVGAttributes<SVGElement>, 'color'> {
  size?: number;
  color?: string | string[];
}

const DEFAULT_STYLE: CSSProperties = {
  display: 'block',
};

const IconTwitter1: FunctionComponent<Props> = ({ size, color, style: _style, ...rest }) => {
  const style = _style ? { ...DEFAULT_STYLE, ..._style } : DEFAULT_STYLE;

  return (
    <svg viewBox="0 0 1024 1024" width={size + 'px'} height={size + 'px'} style={style} {...rest}>
      <path
        d="M512 512m-512 0a512 512 0 1 0 1024 0 512 512 0 1 0-1024 0Z"
        fill={getIconColor(color, 0, '#5D5D6C')}
      />
      <path
        d="M780.049067 382.464c-3.1744 237.090133-154.760533 399.4624-381.064534 409.668267-93.320533 4.266667-160.938667-25.873067-219.784533-63.249067 68.949333 10.990933 154.5216-16.554667 200.260267-55.739733-67.618133-6.5536-107.656533-40.96-126.395734-96.3584a158.037333 158.037333 0 0 0 58.709334-1.467734c-61.0304-20.411733-104.584533-58.129067-106.837334-137.147733 17.1008 7.816533 34.952533 15.121067 58.6752 16.5888-45.6704-25.975467-79.428267-120.9344-40.7552-183.7056 67.754667 74.274133 149.265067 134.894933 283.136 143.086933-33.621333-143.633067 156.740267-221.525333 236.4416-124.996266 33.655467-6.485333 61.098667-19.285333 87.4496-33.211734-10.8544 33.3824-31.744 56.661333-57.2416 75.332267 27.989333-3.754667 52.736-10.581333 73.898667-21.060267-13.141333 27.2384-41.813333 51.677867-66.491733 72.260267z"
        fill={getIconColor(color, 1, '#13131B')}
      />
    </svg>
  );
};

IconTwitter1.defaultProps = {
  size: 24,
};

export default IconTwitter1;
