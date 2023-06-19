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

const IconHelp: FunctionComponent<Props> = ({ size, color, style: _style, ...rest }) => {
  const style = _style ? { ...DEFAULT_STYLE, ..._style } : DEFAULT_STYLE;

  return (
    <svg viewBox="0 0 1024 1024" width={size + 'px'} height={size + 'px'} style={style} {...rest}>
      <path
        d="M512 1024C229.2224 1024 0 794.7776 0 512S229.2224 0 512 0s512 229.2224 512 512-229.2224 512-512 512z m-89.6-295.9872v143.9744h183.04V728.064H422.4z m170.496-115.3536c138.0864-33.7408 224.8704-143.9744 204.032-259.2768-20.8384-115.3024-143.0016-200.9088-287.232-201.3696-138.8544 0-258.4064 79.0528-285.696 188.9792l163.328 26.4704c12.8512-52.0704 73.5744-87.1424 138.752-80.1792 65.2288 6.9632 112.5376 53.6064 108.2368 106.5984-4.352 52.992-58.88 94.1568-124.672 94.1056a94.208 94.208 0 0 0-58.88 19.712c-15.5648 12.5952-24.32 29.696-24.32 47.5136v100.8128h166.4v-43.3664z"
        fill={getIconColor(color, 0, '#333333')}
      />
    </svg>
  );
};

IconHelp.defaultProps = {
  size: 24,
};

export default IconHelp;
