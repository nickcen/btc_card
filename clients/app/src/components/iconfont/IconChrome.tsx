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

const IconChrome: FunctionComponent<Props> = ({ size, color, style: _style, ...rest }) => {
  const style = _style ? { ...DEFAULT_STYLE, ..._style } : DEFAULT_STYLE;

  return (
    <svg viewBox="0 0 1024 1024" width={size + 'px'} height={size + 'px'} style={style} {...rest}>
      <path
        d="M339.427903 511.966154A172.41595 172.41595 0 0 0 511.957621 684.495872 172.41595 172.41595 0 0 0 684.48734 511.966154 172.41595 172.41595 0 0 0 511.957621 339.436436 172.359066 172.359066 0 0 0 339.427903 511.966154z"
        fill={getIconColor(color, 0, '#333333')}
      />
      <path
        d="M968.737588 281.243919l-423.787142-22.298598c-119.911852-6.996754-234.078401 60.410999-273.499138 173.496749L113.76836 190.115463A511.730085 511.730085 0 0 1 510.080443 0.008533a507.065582 507.065582 0 0 1 257.571568 68.545437 512.526463 512.526463 0 0 1 201.085577 212.689949zM276.002042 610.318901l-192.55295-378.848639A511.161243 511.161243 0 0 0 0 511.966154c0 255.978811 187.433374 468.043034 432.433537 505.586593l131.573109-257.685336c-118.887936 22.412367-233.680212-42.833788-288.004604-149.491625z m713.441387-282.486838l-288.402793 14.903655c78.329516 91.469762 79.524084 223.384175 13.709087 324.524248l-231.34796 355.924315a509.682254 509.682254 0 0 0 284.534669-67.976595 511.502548 511.502548 0 0 0 221.506997-627.375623z"
        fill={getIconColor(color, 1, '#333333')}
      />
    </svg>
  );
};

IconChrome.defaultProps = {
  size: 24,
};

export default IconChrome;
