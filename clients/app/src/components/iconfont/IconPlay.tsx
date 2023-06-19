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

const IconPlay: FunctionComponent<Props> = ({ size, color, style: _style, ...rest }) => {
  const style = _style ? { ...DEFAULT_STYLE, ..._style } : DEFAULT_STYLE;

  return (
    <svg viewBox="0 0 1024 1024" width={size + 'px'} height={size + 'px'} style={style} {...rest}>
      <path
        d="M512 1024A512 512 0 1 0 512 0a512 512 0 0 0 0 1024zM365.714286 302.445714a73.142857 73.142857 0 0 1 119.954285-56.173714l251.465143 209.554286a73.142857 73.142857 0 0 1 0 112.347428L485.668571 777.728A73.142857 73.142857 0 0 1 365.714286 721.554286v-419.108572z"
        fill={getIconColor(color, 0, '#333333')}
      />
    </svg>
  );
};

IconPlay.defaultProps = {
  size: 24,
};

export default IconPlay;
