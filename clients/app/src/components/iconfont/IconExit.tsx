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

const IconExit: FunctionComponent<Props> = ({ size, color, style: _style, ...rest }) => {
  const style = _style ? { ...DEFAULT_STYLE, ..._style } : DEFAULT_STYLE;

  return (
    <svg viewBox="0 0 1024 1024" width={size + 'px'} height={size + 'px'} style={style} {...rest}>
      <path
        d="M597.3504 0a85.2992 85.2992 0 1 1 0 170.6496H256c-47.104 0-85.3504 37.888-85.3504 84.6848V768c0 47.104 37.888 85.3504 84.6848 85.3504h342.016a85.2992 85.2992 0 1 1 0 170.6496H170.6496A170.7008 170.7008 0 0 1 0 853.3504V170.6496A170.6496 170.6496 0 0 1 170.6496 0z m213.2992 256c12.7488 0 25.088 5.6832 33.3312 16.0256l170.6496 213.2992a42.6496 42.6496 0 0 1 0 53.2992l-170.6496 213.3504a42.7008 42.7008 0 0 1-75.9808-26.624v-128H426.6496a85.3504 85.3504 0 0 1 0-170.7008H768v-128A42.6496 42.6496 0 0 1 810.6496 256z"
        fill={getIconColor(color, 0, '#333333')}
      />
    </svg>
  );
};

IconExit.defaultProps = {
  size: 24,
};

export default IconExit;
