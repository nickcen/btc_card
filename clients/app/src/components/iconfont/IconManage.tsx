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

const IconManage: FunctionComponent<Props> = ({ size, color, style: _style, ...rest }) => {
  const style = _style ? { ...DEFAULT_STYLE, ..._style } : DEFAULT_STYLE;

  return (
    <svg viewBox="0 0 1024 1024" width={size + 'px'} height={size + 'px'} style={style} {...rest}>
      <path
        d="M458.410667 970.752a140.3904 140.3904 0 0 0 141.312 0l285.354666-167.287467A144.042667 144.042667 0 0 0 955.733333 679.287467V344.746667c0-51.029333-27.136-98.645333-70.656-124.142934L599.620267 53.248a139.8784 139.8784 0 0 0-141.2096 0l-285.354667 167.253333A144.042667 144.042667 0 0 0 102.4 344.746667v334.574933c0 51.029333 27.136 98.645333 70.656 124.177067l285.354667 167.287466z m29.4912-827.938133a49.083733 49.083733 0 0 1 48.196266 0L829.2352 307.2c14.916267 8.260267 24.098133 23.790933 24.098133 40.482133v328.704c0 16.725333-9.181867 32.221867-24.098133 40.516267l-293.137067 164.352a49.7664 49.7664 0 0 1-48.196266 0l-293.137067-164.352A46.455467 46.455467 0 0 1 170.666667 676.420267v-328.738134c0-16.6912 9.181867-32.221867 24.098133-40.482133l293.137067-164.386133z"
        fill={getIconColor(color, 0, '#6D7793')}
      />
      <path
        d="M522.274133 575.761067c-8.328533 0-16.554667-2.1504-23.893333-6.417067l-235.6224-136.192a47.854933 47.854933 0 0 1-17.5104-65.467733 47.854933 47.854933 0 0 1 65.4336-17.5104l211.490133 122.231466 202.5472-118.3744a47.9232 47.9232 0 0 1 48.3328 82.7392l-226.542933 132.369067a48.128 48.128 0 0 1-24.234667 6.621867z"
        fill={getIconColor(color, 1, '#6D7793')}
      />
      <path
        d="M520.055467 839.338667a47.9232 47.9232 0 0 1-47.9232-47.9232v-263.509334a47.9232 47.9232 0 1 1 95.880533 0v263.611734c0 26.385067-21.469867 47.8208-47.957333 47.8208z"
        fill={getIconColor(color, 2, '#6D7793')}
      />
    </svg>
  );
};

IconManage.defaultProps = {
  size: 24,
};

export default IconManage;
