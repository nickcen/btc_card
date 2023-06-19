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

const IconTianjia: FunctionComponent<Props> = ({ size, color, style: _style, ...rest }) => {
  const style = _style ? { ...DEFAULT_STYLE, ..._style } : DEFAULT_STYLE;

  return (
    <svg viewBox="0 0 1024 1024" width={size + 'px'} height={size + 'px'} style={style} {...rest}>
      <path
        d="M512 512m-512 0a512 512 0 1 0 1024 0 512 512 0 1 0-1024 0Z"
        fill={getIconColor(color, 0, '#3A3A49')}
      />
      <path
        d="M204.8 460.8m51.2 0l512 0q51.2 0 51.2 51.2l0 0q0 51.2-51.2 51.2l-512 0q-51.2 0-51.2-51.2l0 0q0-51.2 51.2-51.2Z"
        fill={getIconColor(color, 1, '#9C9CA4')}
      />
      <path
        d="M563.2 256v512a51.2 51.2 0 0 1-102.4 0V256a51.2 51.2 0 1 1 102.4 0z"
        fill={getIconColor(color, 2, '#9C9CA4')}
      />
    </svg>
  );
};

IconTianjia.defaultProps = {
  size: 24,
};

export default IconTianjia;
