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

const IconAdd: FunctionComponent<Props> = ({ size, color, style: _style, ...rest }) => {
  const style = _style ? { ...DEFAULT_STYLE, ..._style } : DEFAULT_STYLE;

  return (
    <svg viewBox="0 0 1024 1024" width={size + 'px'} height={size + 'px'} style={style} {...rest}>
      <path
        d="M0 438.857143m73.142857 0l877.714286 0q73.142857 0 73.142857 73.142857l0 0q0 73.142857-73.142857 73.142857l-877.714286 0q-73.142857 0-73.142857-73.142857l0 0q0-73.142857 73.142857-73.142857Z"
        fill={getIconColor(color, 0, '#333333')}
      />
      <path
        d="M512 0a73.142857 73.142857 0 0 1 73.142857 73.142857v877.714286a73.142857 73.142857 0 1 1-146.285714 0V73.142857a73.142857 73.142857 0 0 1 73.142857-73.142857z"
        fill={getIconColor(color, 1, '#333333')}
      />
    </svg>
  );
};

IconAdd.defaultProps = {
  size: 24,
};

export default IconAdd;
