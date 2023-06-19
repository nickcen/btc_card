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

const IconTokenEth: FunctionComponent<Props> = ({ size, color, style: _style, ...rest }) => {
  const style = _style ? { ...DEFAULT_STYLE, ..._style } : DEFAULT_STYLE;

  return (
    <svg viewBox="0 0 1592 1024" width={size + 'px'} height={size + 'px'} style={style} {...rest}>
      <path
        d="M796.444444 682.666667L398.222222 502.442667 796.444444 0zM796.444444 1024l-398.222222-455.111111 398.222222 190.236444zM796.444444 682.666667l398.222223-180.224L796.444444 0zM796.444444 1024l398.222223-455.111111-398.222223 190.236444z"
        fill={getIconColor(color, 0, '#333333')}
      />
    </svg>
  );
};

IconTokenEth.defaultProps = {
  size: 24,
};

export default IconTokenEth;
