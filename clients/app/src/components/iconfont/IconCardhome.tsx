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

const IconCardhome: FunctionComponent<Props> = ({ size, color, style: _style, ...rest }) => {
  const style = _style ? { ...DEFAULT_STYLE, ..._style } : DEFAULT_STYLE;

  return (
    <svg viewBox="0 0 1024 1024" width={size + 'px'} height={size + 'px'} style={style} {...rest}>
      <path
        d="M922.417493 620.8c-46.933333 186.88-215.893333 325.248-417.28 325.248-127.573333 0-242.090667-55.509333-320.853333-143.658667a23.808 23.808 0 0 1 17.450667-39.68c97.024-1.194667 223.658667-18.858667 359.296-52.992 128.597333-32.341333 242.986667-73.941333 327.850666-116.394666 18.218667-9.130667 38.485333 7.68 33.536 27.52zM505.137493 85.333333c177.92 0 330.666667 108.032 396.16 262.058667 71.210667-0.298667 116.437333 10.410667 122.112 32.981333 2.730667 10.794667-3.925333 23.466667-18.346666 37.418667-57.728 55.978667-242.346667 132.309333-468.394667 189.226667C308.82816 664.32 108.76416 684.373333 32.689493 661.632c-18.261333-5.461333-29.44-13.354667-32.085333-23.850667-5.205333-20.608 23.424-48.170667 76.373333-78.293333a434.773333 434.773333 0 0 1-2.218666-43.776C74.758827 278.016 267.441493 85.333333 505.137493 85.333333z"
        fill={getIconColor(color, 0, '#333333')}
      />
    </svg>
  );
};

IconCardhome.defaultProps = {
  size: 24,
};

export default IconCardhome;
