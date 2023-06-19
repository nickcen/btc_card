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

const IconFuzhi: FunctionComponent<Props> = ({ size, color, style: _style, ...rest }) => {
  const style = _style ? { ...DEFAULT_STYLE, ..._style } : DEFAULT_STYLE;

  return (
    <svg viewBox="0 0 1024 1024" width={size + 'px'} height={size + 'px'} style={style} {...rest}>
      <path
        d="M689.322667 260.846933H303.957333v475.818667H240.366933V204.731733h422.434134v40.106667h69.632V136.533333H170.666667v668.330667h133.3248V887.466667H853.333333V416.631467l-164.010666-155.784534z m-18.6368 77.346134l96.4608 91.613866h-96.4608V338.193067z m-297.0624 481.041066V329.045333h227.4304v168.96h182.613333v321.194667H373.6576z"
        fill={getIconColor(color, 0, '#9C9CA4')}
      />
    </svg>
  );
};

IconFuzhi.defaultProps = {
  size: 24,
};

export default IconFuzhi;
