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

const IconGuanbi1: FunctionComponent<Props> = ({ size, color, style: _style, ...rest }) => {
  const style = _style ? { ...DEFAULT_STYLE, ..._style } : DEFAULT_STYLE;

  return (
    <svg viewBox="0 0 1024 1024" width={size + 'px'} height={size + 'px'} style={style} {...rest}>
      <path
        d="M512 512m-512 0a512 512 0 1 0 1024 0 512 512 0 1 0-1024 0Z"
        fill={getIconColor(color, 0, '#23232F')}
      />
      <path
        d="M0 512C0 229.236364 229.236364 0 512 0s512 229.236364 512 512-229.236364 512-512 512S0 794.763636 0 512z m746.775273 172.544a20.014545 20.014545 0 0 0 0-28.299636L602.484364 512l144.290909-144.290909a20.014545 20.014545 0 0 0 0-28.253091l-62.231273-62.231273a20.014545 20.014545 0 0 0-28.299636 0L512 421.515636l-144.290909-144.290909a20.014545 20.014545 0 0 0-28.253091 0L277.224727 339.456a20.014545 20.014545 0 0 0 0 28.299636L421.515636 512l-144.290909 144.290909a20.014545 20.014545 0 0 0 0 28.253091l62.231273 62.231273a20.014545 20.014545 0 0 0 28.299636 0l144.244364-144.290909 144.290909 144.290909a20.014545 20.014545 0 0 0 28.253091 0l62.231273-62.231273z"
        fill={getIconColor(color, 1, '#FF6363')}
      />
    </svg>
  );
};

IconGuanbi1.defaultProps = {
  size: 24,
};

export default IconGuanbi1;
