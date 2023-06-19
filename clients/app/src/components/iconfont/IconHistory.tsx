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

const IconHistory: FunctionComponent<Props> = ({ size, color, style: _style, ...rest }) => {
  const style = _style ? { ...DEFAULT_STYLE, ..._style } : DEFAULT_STYLE;

  return (
    <svg viewBox="0 0 1024 1024" width={size + 'px'} height={size + 'px'} style={style} {...rest}>
      <path
        d="M512 102.4a408.2688 408.2688 0 0 0-280.576 111.2064A51.2 51.2 0 0 0 301.568 288.256 307.2 307.2 0 1 1 204.8 512a51.2 51.2 0 0 0-102.4 0.0512 409.6 409.6 0 1 0 409.6-409.6z m0 175.2576a38.4 38.4 0 0 0-38.4 38.4V512c0 21.1968 17.2032 38.4 38.4 38.4h201.2672a38.4 38.4 0 0 0 38.4-38.4l-0.3072-5.2224a38.4 38.4 0 0 0-38.0928-33.1776H550.4V316.0576a38.4 38.4 0 0 0-38.4-38.4z"
        fill={getIconColor(color, 0, '#333333')}
      />
    </svg>
  );
};

IconHistory.defaultProps = {
  size: 24,
};

export default IconHistory;
