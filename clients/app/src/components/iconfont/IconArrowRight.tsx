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

const IconArrowRight: FunctionComponent<Props> = ({ size, color, style: _style, ...rest }) => {
  const style = _style ? { ...DEFAULT_STYLE, ..._style } : DEFAULT_STYLE;

  return (
    <svg viewBox="0 0 2244 1024" width={size + 'px'} height={size + 'px'} style={style} {...rest}>
      <path
        d=""
        fill={getIconColor(color, 0, '#333333')}
      />
    </svg>
  );
};

IconArrowRight.defaultProps = {
  size: 24,
};

export default IconArrowRight;
