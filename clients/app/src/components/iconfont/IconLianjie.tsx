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

const IconLianjie: FunctionComponent<Props> = ({ size, color, style: _style, ...rest }) => {
  const style = _style ? { ...DEFAULT_STYLE, ..._style } : DEFAULT_STYLE;

  return (
    <svg viewBox="0 0 1024 1024" width={size + 'px'} height={size + 'px'} style={style} {...rest}>
      <path
        d="M358.4 563.2h307.2V460.8H358.4v102.4z m-180.3264-51.2c0-98.1504 71.6288-174.9504 163.2768-174.9504H460.8V256H341.3504C209.92 256 102.4 371.2 102.4 512s107.52 256 238.9504 256H460.8v-81.0496H341.3504c-91.648 0-163.328-76.9024-163.328-174.9504m504.6272-256H563.2v81.0496h119.4496c91.5968 0 163.2256 76.8 163.2256 174.9504 0 98.048-71.6288 174.9504-163.2256 174.9504H563.2V768h119.4496C814.08 768 921.6 652.8 921.6 512s-107.52-256-238.9504-256"
        fill={getIconColor(color, 0, '#5D5D6C')}
      />
    </svg>
  );
};

IconLianjie.defaultProps = {
  size: 24,
};

export default IconLianjie;
