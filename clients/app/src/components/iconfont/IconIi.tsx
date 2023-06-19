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

const IconIi: FunctionComponent<Props> = ({ size, color, style: _style, ...rest }) => {
  const style = _style ? { ...DEFAULT_STYLE, ..._style } : DEFAULT_STYLE;

  return (
    <svg viewBox="0 0 2048 1024" width={size + 'px'} height={size + 'px'} style={style} {...rest}>
      <path
        d="M1024 668.8S704.768 275.84 545.536 224c-159.104-51.712-331.136 50.56-331.136 277.248 0 226.56 179.456 327.424 346.368 294.784 166.912-32.768 296.448-228.48 296.448-228.48l135.424 153.6S795.648 967.424 560.768 1016.576C325.76 1065.728 0 864 0 544S209.408 0.384 480.256 0.384c270.848 0 548.096 346.88 709.376 543.744 161.28 196.736 360.96 353.92 567.296 176.896 206.336-176.896 44.8-445.568-59.136-497.024-103.808-51.328-243.2-25.344-345.984 76.16-102.784 101.632-149.888 162.816-149.888 162.816L1069.44 300.16S1198.592 123.648 1405.696 39.04c206.976-84.608 422.272-30.336 540.8 151.04 118.656 181.248 156.16 423.424-13.952 641.024-170.112 217.728-514.944 204.8-676.992 59.904C1093.504 746.112 1024 668.8 1024 668.8z"
        fill={getIconColor(color, 0, '#5D5D6C')}
      />
    </svg>
  );
};

IconIi.defaultProps = {
  size: 24,
};

export default IconIi;
