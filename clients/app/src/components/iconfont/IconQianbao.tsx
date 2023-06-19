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

const IconQianbao: FunctionComponent<Props> = ({ size, color, style: _style, ...rest }) => {
  const style = _style ? { ...DEFAULT_STYLE, ..._style } : DEFAULT_STYLE;

  return (
    <svg viewBox="0 0 1024 1024" width={size + 'px'} height={size + 'px'} style={style} {...rest}>
      <path
        d="M1024 204.8h-102.4V0H153.6a153.6 153.6 0 0 0-153.6 153.6v870.4h1024v-307.2h-256a102.4 102.4 0 0 1 0-204.8h256z m-204.8 0H153.6a51.2 51.2 0 0 1 0-102.4h665.6z"
        fill={getIconColor(color, 0, '#515151')}
      />
      <path
        d="M768 614.4m-51.2 0a51.2 51.2 0 1 0 102.4 0 51.2 51.2 0 1 0-102.4 0Z"
        fill={getIconColor(color, 1, '#515151')}
      />
    </svg>
  );
};

IconQianbao.defaultProps = {
  size: 24,
};

export default IconQianbao;
