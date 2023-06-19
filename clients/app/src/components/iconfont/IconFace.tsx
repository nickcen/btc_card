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

const IconFace: FunctionComponent<Props> = ({ size, color, style: _style, ...rest }) => {
  const style = _style ? { ...DEFAULT_STYLE, ..._style } : DEFAULT_STYLE;

  return (
    <svg viewBox="0 0 1024 1024" width={size + 'px'} height={size + 'px'} style={style} {...rest}>
      <path
        d="M0 365.738667V0h365.738667v146.261333H146.204444V365.795556H0z m512 438.840889c117.020444 0 212.138667-95.118222 219.420444-219.420445H292.579556c7.281778 124.302222 102.4 219.420444 219.420444 219.420445zM146.261333 658.204444H0V1024h365.738667v-146.261333H146.204444V658.204444zM1024 365.795556h-146.261333V146.204444H658.204444V0H1024v365.738667zM1024 1024v-365.738667h-146.261333v219.477334H658.204444V1024H1024zM438.840889 292.579556v146.261333H292.579556V292.579556h146.261333z m292.579555 146.261333V292.579556h-146.261333v146.261333h146.261333z"
        fill={getIconColor(color, 0, '#16FFBB')}
      />
    </svg>
  );
};

IconFace.defaultProps = {
  size: 24,
};

export default IconFace;
