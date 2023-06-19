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

const IconWallet: FunctionComponent<Props> = ({ size, color, style: _style, ...rest }) => {
  const style = _style ? { ...DEFAULT_STYLE, ..._style } : DEFAULT_STYLE;

  return (
    <svg viewBox="0 0 1024 1024" width={size + 'px'} height={size + 'px'} style={style} {...rest}>
      <path
        d="M742.8096 170.666667a170.666667 170.666667 0 0 1 170.666667 170.666666v307.2a170.666667 170.666667 0 0 1-170.666667 170.666667H281.1904a170.666667 170.666667 0 0 1-170.666667-170.666667v-307.2a170.666667 170.666667 0 0 1 170.666667-170.666666h461.6192z m0 102.4H281.1904a68.266667 68.266667 0 0 0-68.061867 63.146666l-0.2048 5.12v307.2a68.266667 68.266667 0 0 0 63.146667 68.096l5.12 0.170667h461.6192a68.266667 68.266667 0 0 0 68.061867-63.146667l0.2048-5.12v-307.2a68.266667 68.266667 0 0 0-63.146667-68.096L742.775467 273.066667z"
        fill={getIconColor(color, 0, '#333333')}
      />
      <path
        d="M273.066667 341.333333m34.133333 0l238.933333 0q34.133333 0 34.133334 34.133334l0 0q0 34.133333-34.133334 34.133333l-238.933333 0q-34.133333 0-34.133333-34.133333l0 0q0-34.133333 34.133333-34.133334Z"
        fill={getIconColor(color, 1, '#333333')}
      />
    </svg>
  );
};

IconWallet.defaultProps = {
  size: 24,
};

export default IconWallet;
