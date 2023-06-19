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

const IconEdge: FunctionComponent<Props> = ({ size, color, style: _style, ...rest }) => {
  const style = _style ? { ...DEFAULT_STYLE, ..._style } : DEFAULT_STYLE;

  return (
    <svg viewBox="0 0 1024 1024" width={size + 'px'} height={size + 'px'} style={style} {...rest}>
      <path
        d="M56.939451 454.491723C87.03033 217.803355 248.519942 3.071659 538.052216 0.056883c174.743251 3.412954 318.428619 82.59349 404.036885 233.502944 43.003222 78.782358 56.313743 161.546495 59.157872 252.8999v107.394289H358.815243c3.014776 264.845239 389.873125 255.857794 556.425286 139.134763v215.6987c-97.553605 58.589046-318.88368 110.977891-490.213976 43.62893-145.960671-54.777914-249.942006-207.564493-249.316299-354.492167-4.778136-190.499722 94.766359-316.665259 249.316299-388.451061-32.76436 40.614154-57.79269 85.380735-70.818798 162.968559h362.683257s21.217198-216.722586-205.346073-216.722587C298.121542 203.013887 144.140429 327.131652 56.939451 454.548606v-0.056883z"
        fill={getIconColor(color, 0, '#333333')}
      />
    </svg>
  );
};

IconEdge.defaultProps = {
  size: 24,
};

export default IconEdge;
