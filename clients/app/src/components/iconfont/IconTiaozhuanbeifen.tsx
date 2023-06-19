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

const IconTiaozhuanbeifen: FunctionComponent<Props> = ({ size, color, style: _style, ...rest }) => {
  const style = _style ? { ...DEFAULT_STYLE, ..._style } : DEFAULT_STYLE;

  return (
    <svg viewBox="0 0 1024 1024" width={size + 'px'} height={size + 'px'} style={style} {...rest}>
      <path
        d="M474.7264 576.2048l37.2736 36.608 246.6816-253.44a44.5952 44.5952 0 0 1 65.1776 0 45.9776 45.9776 0 0 1 0 65.9968l-274.6368 278.0672c-9.3184 9.472-23.296 14.1824-37.2224 14.1824-13.9776 0-27.9552 0-37.2736-14.1824L200.192 425.3696a45.9776 45.9776 0 0 1 0-65.9968 44.5952 44.5952 0 0 1 65.1264 0l209.4592 216.832z"
        fill={getIconColor(color, 0, '#5D5D6C')}
      />
    </svg>
  );
};

IconTiaozhuanbeifen.defaultProps = {
  size: 24,
};

export default IconTiaozhuanbeifen;
