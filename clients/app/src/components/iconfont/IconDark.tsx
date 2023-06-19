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

const IconDark: FunctionComponent<Props> = ({ size, color, style: _style, ...rest }) => {
  const style = _style ? { ...DEFAULT_STYLE, ..._style } : DEFAULT_STYLE;

  return (
    <svg viewBox="0 0 1024 1024" width={size + 'px'} height={size + 'px'} style={style} {...rest}>
      <path
        d="M551.424 0a502.784 502.784 0 0 0-69.7344 256c0 281.2928 230.912 509.5936 516.7104 512-93.0816 158.464-265.216 256.0512-451.584 256C259.0208 1024 25.6 794.7776 25.6 512S258.9696 0 546.816 0h4.608z"
        fill={getIconColor(color, 0, '#333333')}
      />
    </svg>
  );
};

IconDark.defaultProps = {
  size: 24,
};

export default IconDark;
