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

const IconLink2: FunctionComponent<Props> = ({ size, color, style: _style, ...rest }) => {
  const style = _style ? { ...DEFAULT_STYLE, ..._style } : DEFAULT_STYLE;

  return (
    <svg viewBox="0 0 1024 1024" width={size + 'px'} height={size + 'px'} style={style} {...rest}>
      <path
        d="M747.52 552.96l146.773333-146.773333c37.546667-37.546667 37.546667-98.986667 0-136.533334l-136.533333-136.533333c-37.546667-37.546667-98.986667-37.546667-136.533333 0l-146.773334 146.773333c-37.546667 37.546667-37.546667 98.986667 0 136.533334l40.96 40.96 122.88-122.88c13.653333-13.653333 40.96-13.653333 54.613334 0 13.653333 13.653333 13.653333 40.96 0 54.613333L570.026667 512l40.96 40.96c37.546667 37.546667 98.986667 37.546667 136.533333 0z m-341.333333 341.333333l146.773333-146.773333c37.546667-37.546667 37.546667-98.986667 0-136.533333L512 566.613333l-122.88 122.88c-6.826667 6.826667-17.066667 10.24-27.306667 10.24-10.24 0-20.48-3.413333-27.306666-10.24-13.653333-13.653333-13.653333-40.96 0-54.613333l122.88-122.88-40.96-40.96c-37.546667-37.546667-98.986667-37.546667-136.533334 0l-146.773333 146.773333c-37.546667 37.546667-37.546667 98.986667 0 136.533334l136.533333 136.533333c37.546667 40.96 98.986667 40.96 136.533334 3.413333z"
        fill={getIconColor(color, 0, '#6D7793')}
      />
    </svg>
  );
};

IconLink2.defaultProps = {
  size: 24,
};

export default IconLink2;
