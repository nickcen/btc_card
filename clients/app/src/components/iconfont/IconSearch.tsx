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

const IconSearch: FunctionComponent<Props> = ({ size, color, style: _style, ...rest }) => {
  const style = _style ? { ...DEFAULT_STYLE, ..._style } : DEFAULT_STYLE;

  return (
    <svg viewBox="0 0 1024 1024" width={size + 'px'} height={size + 'px'} style={style} {...rest}>
      <path
        d="M993.768448 993.1264c41.984-42.496 40.7552-106.8544-4.9664-151.1424-49.408-47.8208-92.2624-90.3168-120.8832-118.7328a3689.7792 3689.7792 0 0 0-33.536-33.024l0.768-4.3008c0.256-1.536 0.3584-2.2528 0.6656-2.9184 1.1776-2.56 2.56-4.9664 3.9424-7.424l0.6144-1.024c48.128-85.0944 67.328-176.0768 57.0368-273.5616-27.392-259.072-274.688-442.5216-530.2784-392.8576C118.914048 56.32-43.697152 300.8512 10.779648 543.6928c67.2768 300.1856 392.0384 447.0784 661.0944 298.5984 11.8784-6.5024 17.5104-5.4784 27.2384 3.584 27.5456 25.856 46.8992 45.568 76.1344 75.3152 17.408 17.664 38.1952 38.912 66.3552 67.072 45.7216 45.7728 109.8752 47.7696 152.2176 4.864zM762.088448 449.2288c0.8192 172.544-138.24 311.9104-312.4224 313.2416-167.2192 1.28-309.4528-139.6736-310.272-307.456-1.024-173.312 136.5504-314.88 307.456-316.3136 172.8-1.3312 314.4704 138.0864 315.2384 310.528z"
        fill={getIconColor(color, 0, '#333333')}
      />
    </svg>
  );
};

IconSearch.defaultProps = {
  size: 24,
};

export default IconSearch;
