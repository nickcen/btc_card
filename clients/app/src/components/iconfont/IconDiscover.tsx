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

const IconDiscover: FunctionComponent<Props> = ({ size, color, style: _style, ...rest }) => {
  const style = _style ? { ...DEFAULT_STYLE, ..._style } : DEFAULT_STYLE;

  return (
    <svg viewBox="0 0 1024 1024" width={size + 'px'} height={size + 'px'} style={style} {...rest}>
      <path
        d="M513.8432 584.430933c173.294933-45.124267 314.845867-105.6768 359.1168-150.050133 11.025067-11.093333 16.145067-21.162667 14.062933-29.696-4.369067-17.92-39.048533-26.4192-93.627733-26.180267C743.185067 256.341333 626.107733 170.666667 489.642667 170.666667 307.438933 170.666667 159.744 323.4816 159.744 512c0 11.741867 0.580267 23.313067 1.706667 34.747733-40.618667 23.893333-62.532267 45.738667-58.538667 62.122667 2.013867 8.260267 10.581333 14.5408 24.576 18.8416 58.333867 18.090667 211.729067 2.184533 386.389333-43.281067zM489.642667 853.333333c154.4192 0 283.989333-109.738667 319.931733-257.9456 3.822933-15.701333-11.741867-29.0816-25.7024-21.845333-65.058133 33.6896-152.7808 66.696533-251.357867 92.3648-103.970133 27.067733-201.079467 41.0624-275.456 41.984-15.6672 0.2048-23.825067 19.421867-13.380266 31.470933C304.093867 809.301333 391.850667 853.333333 489.642667 853.333333z"
        fill={getIconColor(color, 0, '#333333')}
      />
    </svg>
  );
};

IconDiscover.defaultProps = {
  size: 24,
};

export default IconDiscover;
