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

const IconGoogle: FunctionComponent<Props> = ({ size, color, style: _style, ...rest }) => {
  const style = _style ? { ...DEFAULT_STYLE, ..._style } : DEFAULT_STYLE;

  return (
    <svg viewBox="0 0 1024 1024" width={size + 'px'} height={size + 'px'} style={style} {...rest}>
      <path
        d="M905.495273 431.010909h-397.824v163.467636h227.281454a194.094545 194.094545 0 0 1-84.386909 127.534546c-37.841455 25.320727-86.202182 40.308364-143.034182 40.308364-109.986909 0-203.031273-74.333091-236.311272-174.219637a256.093091 256.093091 0 0 1-13.218909-80.290909c0-27.834182 4.887273-54.923636 13.218909-80.244364 33.373091-99.793455 126.417455-174.08 236.450909-174.08 61.998545 0 117.573818 21.317818 161.419636 63.162182L790.202182 195.490909c-73.216-68.282182-168.680727-110.126545-282.530909-110.126545a422.120727 422.120727 0 0 0-422.306909 422.632727 422.120727 422.120727 0 0 0 422.306909 422.493091c114.036364 0 209.640727-37.888 279.458909-102.4 79.825455-73.541818 125.952-181.899636 125.952-310.644364 0-29.928727-2.606545-58.647273-7.586909-86.434909z"
        fill={getIconColor(color, 0, '#333333')}
      />
    </svg>
  );
};

IconGoogle.defaultProps = {
  size: 24,
};

export default IconGoogle;
