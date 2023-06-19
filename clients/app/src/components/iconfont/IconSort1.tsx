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

const IconSort1: FunctionComponent<Props> = ({ size, color, style: _style, ...rest }) => {
  const style = _style ? { ...DEFAULT_STYLE, ..._style } : DEFAULT_STYLE;

  return (
    <svg viewBox="0 0 1280 1024" width={size + 'px'} height={size + 'px'} style={style} {...rest}>
      <path
        d="M427.392 0c21.12 0 42.24 8.192 59.2 24.448 16.96 16.32 25.408 40.832 25.408 61.248v860.8C512 987.264 473.92 1024 431.616 1024s-80.448-32.64-80.448-77.504V269.248l-207.36 199.936a85.12 85.12 0 0 1-59.2 24.448 85.12 85.12 0 0 1-59.2-24.448c-33.92-28.544-33.92-77.568 0-110.208L368.128 28.544l0.192-0.192c8.384-8.064 16.832-16.192 29.44-24.32h4.224a54.912 54.912 0 0 0 12.672-1.984A54.848 54.848 0 0 1 427.392 0z m769.088 526.272c20.992 0 42.048 8.128 58.88 24.512 33.536 32.64 33.536 81.536-4.224 114.176l-344.512 334.528c-16.832 16.32-37.76 24.512-58.816 24.512-41.984 0-79.808-32.64-79.808-77.504V77.44C768 36.736 805.76 0 847.808 0c41.984 0 79.808 32.64 79.808 77.504v677.248l210.048-203.968c16.832-16.384 37.76-24.512 58.816-24.512z"
        fill={getIconColor(color, 0, '#333333')}
      />
    </svg>
  );
};

IconSort1.defaultProps = {
  size: 24,
};

export default IconSort1;
