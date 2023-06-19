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

const IconToPbangzhu: FunctionComponent<Props> = ({ size, color, style: _style, ...rest }) => {
  const style = _style ? { ...DEFAULT_STYLE, ..._style } : DEFAULT_STYLE;

  return (
    <svg viewBox="0 0 1024 1024" width={size + 'px'} height={size + 'px'} style={style} {...rest}>
      <path
        d="M512 744.727273c-128.535273 0-232.727273-104.192-232.727273-232.727273s104.192-232.727273 232.727273-232.727273 232.727273 104.192 232.727273 232.727273-104.192 232.727273-232.727273 232.727273z m-40.727273-134.539637v65.442909h83.2V610.210909H471.272727z m77.498182-52.433454c62.766545-15.336727 102.213818-65.442909 92.741818-117.853091-9.472-52.410182-65.000727-91.322182-130.56-91.531636-63.115636 0-117.457455 35.933091-129.861818 85.899636l74.24 12.032c5.841455-23.668364 33.442909-39.610182 63.069091-36.445091 29.649455 3.165091 51.153455 24.366545 49.198545 48.453818-1.978182 24.087273-26.763636 42.798545-56.66909 42.775273a42.821818 42.821818 0 0 0-26.763637 8.96c-7.074909 5.725091-11.054545 13.498182-11.054545 21.597091v45.800727h75.636363v-19.688727z"
        fill={getIconColor(color, 0, '#9C9CA4')}
      />
    </svg>
  );
};

IconToPbangzhu.defaultProps = {
  size: 24,
};

export default IconToPbangzhu;
