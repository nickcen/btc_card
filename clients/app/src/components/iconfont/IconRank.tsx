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

const IconRank: FunctionComponent<Props> = ({ size, color, style: _style, ...rest }) => {
  const style = _style ? { ...DEFAULT_STYLE, ..._style } : DEFAULT_STYLE;

  return (
    <svg viewBox="0 0 1024 1024" width={size + 'px'} height={size + 'px'} style={style} {...rest}>
      <path
        d="M85.333333 384m42.666667 0l768 0q42.666667 0 42.666667 42.666667l0 0q0 42.666667-42.666667 42.666666l-768 0q-42.666667 0-42.666667-42.666666l0 0q0-42.666667 42.666667-42.666667Z"
        fill={getIconColor(color, 0, '#333333')}
      />
      <path
        d="M85.333333 554.666667m42.666667 0l768 0q42.666667 0 42.666667 42.666666l0 0q0 42.666667-42.666667 42.666667l-768 0q-42.666667 0-42.666667-42.666667l0 0q0-42.666667 42.666667-42.666666Z"
        fill={getIconColor(color, 1, '#333333')}
      />
      <path
        d="M314.837333 298.666667h391.125334c3.2 0 9.685333 0 12.928-2.56 3.2-5.12 6.442667-7.637333 6.442666-12.714667 0-2.56-6.442667-7.68-12.928-12.757333 0 0-113.109333-84.053333-180.992-137.557334 0 0-6.485333-5.077333-19.413333-5.077333-6.485333 0-12.928 0-22.613333 7.68L305.152 275.712C301.909333 278.314667 298.666667 283.392 298.666667 285.866667c0 5.12 6.485333 12.757333 16.170666 12.757333zM314.837333 725.333333h391.125334c3.2 0 9.685333 0 12.928 2.56 3.2 5.12 6.442667 7.637333 6.442666 12.714667 0 2.56-6.442667 7.68-12.928 12.757333 0 0-113.109333 84.053333-180.992 137.557334 0 0-6.485333 5.077333-19.413333 5.077333-6.485333 0-12.928 0-22.613333-7.68l-184.234667-140.074667C301.909333 745.685333 298.666667 740.608 298.666667 738.133333c0-5.12 6.485333-12.757333 16.170666-12.757333z"
        fill={getIconColor(color, 2, '#333333')}
      />
    </svg>
  );
};

IconRank.defaultProps = {
  size: 24,
};

export default IconRank;
