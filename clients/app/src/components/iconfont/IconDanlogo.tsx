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

const IconDanlogo: FunctionComponent<Props> = ({ size, color, style: _style, ...rest }) => {
  const style = _style ? { ...DEFAULT_STYLE, ..._style } : DEFAULT_STYLE;

  return (
    <svg viewBox="0 0 1137 1024" width={size + 'px'} height={size + 'px'} style={style} {...rest}>
      <path
        d="M1137.777778 1013.930667c-5.492938 6.106074-13.286716 10.069333-22.426864 10.069333h-458.145186l-74.682469-90.529185c-5.044148-6.181926-13.368889-6.181926-18.482568 0L489.516247 1024H30.90963c-8.83042 0-19.165235-5.985975-24.588642-11.706469L572.049383 632.098765l565.728395 381.831902z"
        fill={getIconColor(color, 0, '#FFFFFF')}
      />
      <path
        d="M568.888889 0v637.067062L8.697679 1011.358025a31.80721 31.80721 0 0 1-4.582716-37.477136l538.459654-958.261729C548.427852 5.202173 558.648889 0 568.888889 0"
        fill={getIconColor(color, 1, '#9E9E9E')}
      />
      <path
        d="M568.888889 637.433679V0c10.233679 0 20.473679 5.208494 26.314271 15.625481l538.453334 958.805334c7.168 12.73679 4.456296 27.445728-4.051753 36.92721L568.888889 637.433679z"
        fill={getIconColor(color, 2, '#D8D8D8')}
      />
      <path
        d="M763.429926 761.249185l-29.708642-53.127901-1.694025-2.970864-31.326815-55.953383-68.051753-121.742222-51.64879-92.311704a10.17679 10.17679 0 0 0-17.888395 0l-51.655111 92.311704-68.051753 121.742222-31.333136 55.947062-1.47279 2.667457-29.929876 53.437629c-3.988543 7.092148 0.96079 15.928889 8.868345 15.928889h99.283753l74.277926 90.484938c5.063111 6.175605 13.337284 6.175605 18.413037 0l74.221037-90.478617h98.834963c7.901235 0 12.850568-8.849383 8.862025-15.928889"
        fill={getIconColor(color, 3, '#13131B')}
      />
    </svg>
  );
};

IconDanlogo.defaultProps = {
  size: 24,
};

export default IconDanlogo;
