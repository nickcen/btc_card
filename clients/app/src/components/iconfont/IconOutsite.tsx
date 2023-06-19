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

const IconOutsite: FunctionComponent<Props> = ({ size, color, style: _style, ...rest }) => {
  const style = _style ? { ...DEFAULT_STYLE, ..._style } : DEFAULT_STYLE;

  return (
    <svg viewBox="0 0 1024 1024" width={size + 'px'} height={size + 'px'} style={style} {...rest}>
      <path
        d="M670.500571 822.857143c0 40.228571-26.843429 67.072-67.072 67.072h-402.285714c-40.228571 0-67.072-26.843429-67.072-67.072v-402.285714c0-40.228571 26.843429-67.072 67.072-67.072h187.757714L523.044571 219.428571H67.072C33.499429 219.428571 0 252.928 0 286.500571v670.427429c0 33.572571 33.499429 67.072 67.072 67.072h670.427429c33.572571 0 67.072-33.499429 67.072-67.072V501.028571L670.500571 635.099429v187.757714z"
        fill={getIconColor(color, 0, '#333333')}
      />
      <path
        d="M1017.417143 39.862857c0-6.582857-6.729143-6.582857-6.729143-13.238857 0 0 0-6.656-6.582857-6.656l-6.729143-6.656c-6.582857 0-6.582857-6.656-13.238857-6.656C977.481143 0 964.096 0 957.44 0H558.518857c-39.862857 0-66.486857 26.624-66.486857 66.56 0 39.862857 26.624 66.413714 66.56 66.413714h239.323429L312.539429 618.422857a64.292571 64.292571 0 0 0 0 93.037714 71.826286 71.826286 0 0 0 46.518857 19.968c13.312 0 33.28-6.582857 46.518857-19.968l485.449143-485.376v239.396572c0 39.862857 26.624 66.486857 66.486857 66.486857s66.486857-26.624 66.486857-66.56V66.56c0-6.582857 0-19.968-6.582857-26.624z"
        fill={getIconColor(color, 1, '#333333')}
      />
    </svg>
  );
};

IconOutsite.defaultProps = {
  size: 24,
};

export default IconOutsite;
