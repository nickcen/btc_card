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

const IconShuaxin: FunctionComponent<Props> = ({ size, color, style: _style, ...rest }) => {
  const style = _style ? { ...DEFAULT_STYLE, ..._style } : DEFAULT_STYLE;

  return (
    <svg viewBox="0 0 1024 1024" width={size + 'px'} height={size + 'px'} style={style} {...rest}>
      <path
        d="M512 238.933333c50.551467 0 99.157333 13.789867 141.482667 39.458134a34.133333 34.133333 0 1 1-35.396267 58.368 204.8 204.8 0 1 0 91.613867 228.932266 34.133333 34.133333 0 1 1 65.877333 17.885867A273.066667 273.066667 0 1 1 512 238.933333z"
        fill={getIconColor(color, 0, '#5D5D6C')}
      />
      <path
        d="M715.707733 387.208533l-63.5904-171.963733a15.1552 15.1552 0 0 0-26.794666-3.925333l-110.1824 154.180266c-7.304533 10.24-1.160533 25.019733 10.922666 26.248534l173.738667 17.749333c11.502933 1.194667 20.138667-10.922667 15.906133-22.289067z"
        fill={getIconColor(color, 1, '#5D5D6C')}
      />
    </svg>
  );
};

IconShuaxin.defaultProps = {
  size: 24,
};

export default IconShuaxin;
