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

const IconEth2: FunctionComponent<Props> = ({ size, color, style: _style, ...rest }) => {
  const style = _style ? { ...DEFAULT_STYLE, ..._style } : DEFAULT_STYLE;

  return (
    <svg viewBox="0 0 1024 1024" width={size + 'px'} height={size + 'px'} style={style} {...rest}>
      <path
        d="M139.662222 460.572444L512 625.777778l372.394667-165.205334L512 0 139.662222 460.572444z m0 97.962667L512 1024l372.394667-465.464889L512 753.095111l-372.337778-194.56z"
        fill={getIconColor(color, 0, '#16FFBB')}
      />
    </svg>
  );
};

IconEth2.defaultProps = {
  size: 24,
};

export default IconEth2;
