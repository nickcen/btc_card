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

const IconJiantou: FunctionComponent<Props> = ({ size, color, style: _style, ...rest }) => {
  const style = _style ? { ...DEFAULT_STYLE, ..._style } : DEFAULT_STYLE;

  return (
    <svg viewBox="0 0 1024 1024" width={size + 'px'} height={size + 'px'} style={style} {...rest}>
      <path
        d="M708.266667 401.066667V597.333333h85.333333V256h-341.333333v85.333333h196.266666L256 733.866667l59.733333 59.733333 392.533334-392.533333z"
        fill={getIconColor(color, 0, '#444444')}
      />
    </svg>
  );
};

IconJiantou.defaultProps = {
  size: 24,
};

export default IconJiantou;
