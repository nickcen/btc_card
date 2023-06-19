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

const IconADengluyitaifang: FunctionComponent<Props> = ({ size, color, style: _style, ...rest }) => {
  const style = _style ? { ...DEFAULT_STYLE, ..._style } : DEFAULT_STYLE;

  return (
    <svg viewBox="0 0 1024 1024" width={size + 'px'} height={size + 'px'} style={style} {...rest}>
      <path
        d="M512 668.39552L174.08 497.3568 512 20.48zM512 1003.52L174.08 556.68736l337.92 186.78784z"
        fill={getIconColor(color, 0, '#9C9CA4')}
      />
      <path
        d="M512 668.39552L849.92 497.3568 512 20.48zM512 1003.52l337.92-446.83264-337.92 186.78784z"
        fill={getIconColor(color, 1, '#5D5D6C')}
      />
    </svg>
  );
};

IconADengluyitaifang.defaultProps = {
  size: 24,
};

export default IconADengluyitaifang;
