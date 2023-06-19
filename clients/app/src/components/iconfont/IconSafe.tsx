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

const IconSafe: FunctionComponent<Props> = ({ size, color, style: _style, ...rest }) => {
  const style = _style ? { ...DEFAULT_STYLE, ..._style } : DEFAULT_STYLE;

  return (
    <svg viewBox="0 0 1024 1024" width={size + 'px'} height={size + 'px'} style={style} {...rest}>
      <path
        d="M68.266667 207.872L512 34.133333l443.733333 173.738667v260.676267C955.733333 709.632 766.702933 935.355733 512 989.866667 257.297067 934.5024 68.266667 709.632 68.266667 468.548267V207.906133zM427.52 750.933333l67.822933-63.2832 303.377067-283.0336L730.897067 341.333333l-303.377067 283.067734-134.417067-125.44L225.28 562.176l134.4512 125.44L427.52 750.933333z"
        fill={getIconColor(color, 0, '#6D7793')}
      />
    </svg>
  );
};

IconSafe.defaultProps = {
  size: 24,
};

export default IconSafe;
