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

const IconJinggao: FunctionComponent<Props> = ({ size, color, style: _style, ...rest }) => {
  const style = _style ? { ...DEFAULT_STYLE, ..._style } : DEFAULT_STYLE;

  return (
    <svg viewBox="0 0 1024 1024" width={size + 'px'} height={size + 'px'} style={style} {...rest}>
      <path
        d="M66.064516 512c0 246.288516 199.646968 445.935484 445.935484 445.935484s445.935484-199.646968 445.935484-445.935484S758.288516 66.064516 512 66.064516 66.064516 265.711484 66.064516 512z m445.935484 115.612903a82.580645 82.580645 0 1 1 0 165.161291 82.580645 82.580645 0 0 1 0-165.161291z m66.725161-379.870968L561.548387 587.247484h-99.096774L436.868129 247.741935h141.873548z"
        fill={getIconColor(color, 0, '#FF6363')}
      />
    </svg>
  );
};

IconJinggao.defaultProps = {
  size: 24,
};

export default IconJinggao;
