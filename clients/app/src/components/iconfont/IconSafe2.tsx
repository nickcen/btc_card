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

const IconSafe2: FunctionComponent<Props> = ({ size, color, style: _style, ...rest }) => {
  const style = _style ? { ...DEFAULT_STYLE, ..._style } : DEFAULT_STYLE;

  return (
    <svg viewBox="0 0 1024 1024" width={size + 'px'} height={size + 'px'} style={style} {...rest}>
      <path
        d="M253.8496 136.533333h516.3008A117.316267 117.316267 0 0 1 887.466667 253.8496v516.266667A117.3504 117.3504 0 0 1 770.1504 887.466667H253.8496A117.3504 117.3504 0 0 1 136.533333 770.116267V253.8496A117.316267 117.316267 0 0 1 253.8496 136.533333z m223.6416 598.186667l293.2736-332.970667c19.080533-21.6064 19.080533-56.695467 0-78.336-19.0464-21.6064-49.937067-21.6064-68.983467 0l-258.7648 293.751467-120.797866-137.079467c-19.0464-21.6064-49.937067-21.6064-68.983467 0-19.080533 21.640533-19.080533 56.695467 0 78.336l155.272533 176.298667c19.0464 21.640533 49.9712 21.640533 68.983467 0z"
        fill={getIconColor(color, 0, '#6D7793')}
      />
    </svg>
  );
};

IconSafe2.defaultProps = {
  size: 24,
};

export default IconSafe2;
