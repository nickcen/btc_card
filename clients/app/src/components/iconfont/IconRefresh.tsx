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

const IconRefresh: FunctionComponent<Props> = ({ size, color, style: _style, ...rest }) => {
  const style = _style ? { ...DEFAULT_STYLE, ..._style } : DEFAULT_STYLE;

  return (
    <svg viewBox="0 0 1024 1024" width={size + 'px'} height={size + 'px'} style={style} {...rest}>
      <path
        d="M516.9664 921.6C316.6208 921.6 153.6 760.832 153.6 563.2s163.0208-358.4 363.3664-358.4c60.672 0 120.7808 15.104 173.8752 43.6224a53.7088 53.7088 0 0 1-50.8416 94.464 260.3008 260.3008 0 0 0-123.0336-30.8224c-141.2096 0-256.1024 112.64-256.1024 251.136s114.8928 251.136 256.1024 251.136c116.736 0 218.6752-77.312 247.8592-188.0576a53.7088 53.7088 0 0 1 103.7824 27.392C826.9312 811.3152 682.2912 921.6 516.9664 921.6z"
        fill={getIconColor(color, 0, '#333333')}
      />
      <path
        d="M817.5616 376.0128l-95.3856-257.9456a22.7328 22.7328 0 0 0-40.192-5.888l-165.2736 231.2704c-10.9568 15.36-1.7408 37.5296 16.384 39.3728l260.608 26.624c17.2544 1.792 30.208-16.384 23.8592-33.4336z"
        fill={getIconColor(color, 1, '#333333')}
      />
    </svg>
  );
};

IconRefresh.defaultProps = {
  size: 24,
};

export default IconRefresh;
