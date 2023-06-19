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

const IconPoint: FunctionComponent<Props> = ({ size, color, style: _style, ...rest }) => {
  const style = _style ? { ...DEFAULT_STYLE, ..._style } : DEFAULT_STYLE;

  return (
    <svg viewBox="0 0 1024 1024" width={size + 'px'} height={size + 'px'} style={style} {...rest}>
      <path
        d="M867.293867 473.156267l-194.7648-113.117867a77.755733 77.755733 0 0 0-106.018134 28.5696l-5.9392 10.308267V128.4096a82.670933 82.670933 0 1 0-165.341866 0v474.760533l-70.144-70.178133a126.634667 126.634667 0 0 0-179.2 0 67.618133 67.618133 0 0 0 0 96.529067l229.922133 229.956266c4.369067 4.7104 8.942933 9.284267 13.653333 13.653334l14.2336 14.2336c4.983467 4.949333 10.683733 9.1136 16.896 12.322133a344.064 344.064 0 0 0 205.9264 67.652267 278.971733 278.971733 0 0 0 278.971734-278.971734v-152.1664a77.4144 77.4144 0 0 0-38.229334-63.044266z"
        fill={getIconColor(color, 0, '#6D7793')}
      />
    </svg>
  );
};

IconPoint.defaultProps = {
  size: 24,
};

export default IconPoint;
