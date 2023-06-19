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

const IconTiaozhuan: FunctionComponent<Props> = ({ size, color, style: _style, ...rest }) => {
  const style = _style ? { ...DEFAULT_STYLE, ..._style } : DEFAULT_STYLE;

  return (
    <svg viewBox="0 0 1024 1024" width={size + 'px'} height={size + 'px'} style={style} {...rest}>
      <path
        d="M576.186182 549.236364l36.584727-37.236364L359.330909 265.309091a44.590545 44.590545 0 0 1 0-65.163636 45.940364 45.940364 0 0 1 66.001455 0l278.109091 274.618181c9.402182 9.309091 14.149818 23.272727 14.149818 37.236364 0 13.963636 0 27.927273-14.149818 37.236364l-278.109091 274.618181a45.940364 45.940364 0 0 1-66.001455 0 44.590545 44.590545 0 0 1 0-65.163636l216.855273-209.454545z"
        fill={getIconColor(color, 0, '#5D5D6C')}
      />
    </svg>
  );
};

IconTiaozhuan.defaultProps = {
  size: 24,
};

export default IconTiaozhuan;
