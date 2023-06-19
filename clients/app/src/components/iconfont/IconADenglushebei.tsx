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

const IconADenglushebei: FunctionComponent<Props> = ({ size, color, style: _style, ...rest }) => {
  const style = _style ? { ...DEFAULT_STYLE, ..._style } : DEFAULT_STYLE;

  return (
    <svg viewBox="0 0 1024 1024" width={size + 'px'} height={size + 'px'} style={style} {...rest}>
      <path
        d="M501.76 645.12a40.96 40.96 0 0 1 40.84736 37.89824L542.72 686.08v102.4a40.96 40.96 0 0 1-81.80736 3.06176L460.8 788.48V686.08a40.96 40.96 0 0 1 40.96-40.96z"
        fill={getIconColor(color, 0, '#9C9CA4')}
      />
      <path
        d="M648.192 798.72c20.92032 0 37.888 18.3296 37.888 40.96 0 21.59616-15.4624 39.28064-35.06176 40.84736L648.192 880.64H345.088c-20.92032 0-37.888-18.3296-37.888-40.96 0-21.59616 15.4624-39.28064 35.06176-40.84736L345.088 798.72h303.104z"
        fill={getIconColor(color, 1, '#9C9CA4')}
      />
      <path
        d="M787.34336 184.32C833.21856 184.32 870.4 221.696 870.4 267.81696v306.6368h-81.92V266.24H204.8v378.88h552.00768v81.92H205.93664c-45.02528 0-81.67424-36.01408-83.01568-80.9472L122.88 643.54304V267.81696C122.88 221.696 160.06144 184.32 205.93664 184.32z"
        fill={getIconColor(color, 2, '#9C9CA4')}
      />
      <path
        d="M901.12 542.72H778.24c-22.6304 0-40.96 18.39104-40.96 41.07264V839.5776A41.02144 41.02144 0 0 0 778.24 880.64h122.88c22.6304 0 40.96-18.39104 40.96-41.07264V583.7824A41.02144 41.02144 0 0 0 901.12 542.72z m-143.36 40.96h163.84v245.76H757.76V583.68z"
        fill={getIconColor(color, 3, '#9C9CA4')}
      />
    </svg>
  );
};

IconADenglushebei.defaultProps = {
  size: 24,
};

export default IconADenglushebei;
