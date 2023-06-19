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

const IconMedium: FunctionComponent<Props> = ({ size, color, style: _style, ...rest }) => {
  const style = _style ? { ...DEFAULT_STYLE, ..._style } : DEFAULT_STYLE;

  return (
    <svg viewBox="0 0 1024 1024" width={size + 'px'} height={size + 'px'} style={style} {...rest}>
      <path
        d="M512 512m-512 0a512 512 0 1 0 1024 0 512 512 0 1 0-1024 0Z"
        fill={getIconColor(color, 0, '#5D5D6C')}
      />
      <path
        d="M358.4 512m-204.8 0a204.8 204.8 0 1 0 409.6 0 204.8 204.8 0 1 0-409.6 0Z"
        fill={getIconColor(color, 1, '#13131B')}
      />
      <path
        d="M588.8 512a204.8 89.6 90 1 0 179.2 0 204.8 89.6 90 1 0-179.2 0Z"
        fill={getIconColor(color, 2, '#13131B')}
      />
      <path
        d="M793.6 512a204.8 38.4 90 1 0 76.8 0 204.8 38.4 90 1 0-76.8 0Z"
        fill={getIconColor(color, 3, '#13131B')}
      />
    </svg>
  );
};

IconMedium.defaultProps = {
  size: 24,
};

export default IconMedium;
