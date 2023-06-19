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

const IconWaring: FunctionComponent<Props> = ({ size, color, style: _style, ...rest }) => {
  const style = _style ? { ...DEFAULT_STYLE, ..._style } : DEFAULT_STYLE;

  return (
    <svg viewBox="0 0 1137 1024" width={size + 'px'} height={size + 'px'} style={style} {...rest}>
      <path
        d="M1127.994596 862.776889L628.510151 33.905778a69.688889 69.688889 0 0 0-119.239111 0l-499.484444 828.871111c-13.198222 22.186667-13.084444 49.550222 0.512 71.509333 12.686222 20.650667 34.816 32.995556 59.164444 32.995556H1068.37504a68.835556 68.835556 0 0 0 59.164444-32.995556c13.482667-21.959111 13.653333-49.379556 0.455112-71.509333z m-477.809778 39.196444l-162.531556-0.113777v-159.573334l162.360889 0.113778 0.170667 159.573333zM487.823929 662.186667L487.25504 341.333333h161.905778l-0.455111 321.080889-160.881778-0.227555z"
        fill={getIconColor(color, 0, '#333333')}
      />
    </svg>
  );
};

IconWaring.defaultProps = {
  size: 24,
};

export default IconWaring;
