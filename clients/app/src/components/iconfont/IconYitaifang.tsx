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

const IconYitaifang: FunctionComponent<Props> = ({ size, color, style: _style, ...rest }) => {
  const style = _style ? { ...DEFAULT_STYLE, ..._style } : DEFAULT_STYLE;

  return (
    <svg viewBox="0 0 1024 1024" width={size + 'px'} height={size + 'px'} style={style} {...rest}>
      <path
        d="M512 512m-512 0a512 512 0 1 0 1024 0 512 512 0 1 0-1024 0Z"
        fill={getIconColor(color, 0, '#191922')}
      />
      <path
        d="M512 661.333333l-298.666667-163.306666L512 42.666667zM512 981.333333L213.333333 554.666667l298.666667 178.346666z"
        fill={getIconColor(color, 1, '#9C9CA4')}
      />
      <path
        d="M512 661.333333l298.666667-163.306666L512 42.666667zM512 981.333333l298.666667-426.666666-298.666667 178.346666z"
        fill={getIconColor(color, 2, '#5D5D6C')}
      />
    </svg>
  );
};

IconYitaifang.defaultProps = {
  size: 24,
};

export default IconYitaifang;
