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

const IconTelegram: FunctionComponent<Props> = ({ size, color, style: _style, ...rest }) => {
  const style = _style ? { ...DEFAULT_STYLE, ..._style } : DEFAULT_STYLE;

  return (
    <svg viewBox="0 0 1024 1024" width={size + 'px'} height={size + 'px'} style={style} {...rest}>
      <path
        d="M512 512m-512 0a512 512 0 1 0 1024 0 512 512 0 1 0-1024 0Z"
        fill={getIconColor(color, 0, '#5D5D6C')}
      />
      <path
        d="M677.410133 741.4784l86.016-405.572267c7.611733-35.703467-12.868267-49.732267-36.283733-40.96L221.525333 489.813333c-34.542933 13.448533-33.962667 32.768-5.870933 41.540267l129.365333 40.379733 300.2368-189.0304c13.994667-9.386667 26.897067-4.096 16.384 5.256534l-242.858666 219.477333-9.352534 133.461333c13.448533 0 19.319467-5.870933 26.3168-12.9024l63.1808-60.859733 131.106134 96.529067c23.995733 13.448533 40.96 6.485333 47.445333-22.2208h-0.068267z"
        fill={getIconColor(color, 1, '#13131B')}
      />
    </svg>
  );
};

IconTelegram.defaultProps = {
  size: 24,
};

export default IconTelegram;
