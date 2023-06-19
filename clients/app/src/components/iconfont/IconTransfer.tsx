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

const IconTransfer: FunctionComponent<Props> = ({ size, color, style: _style, ...rest }) => {
  const style = _style ? { ...DEFAULT_STYLE, ..._style } : DEFAULT_STYLE;

  return (
    <svg viewBox="0 0 1024 1024" width={size + 'px'} height={size + 'px'} style={style} {...rest}>
      <path
        d="M282.709333 0h316.16L377.514667 261.034667h560.64s85.845333 0 85.845333 82.773333C1024 426.666667 938.154667 426.666667 938.154667 426.666667H74.24S-56.661333 398.677333 43.264 284.16A16263.850667 16263.850667 0 0 0 282.709333 0zM741.290667 1024H425.130667l221.354666-261.034667h-560.64S0 762.965333 0 680.192C0 597.333333 85.845333 597.333333 85.845333 597.333333H949.76s130.901333 27.989333 30.976 142.506667C880.896 854.442667 741.290667 1024 741.290667 1024z"
        fill={getIconColor(color, 0, '#333333')}
      />
    </svg>
  );
};

IconTransfer.defaultProps = {
  size: 24,
};

export default IconTransfer;
