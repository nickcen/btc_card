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

const IconView: FunctionComponent<Props> = ({ size, color, style: _style, ...rest }) => {
  const style = _style ? { ...DEFAULT_STYLE, ..._style } : DEFAULT_STYLE;

  return (
    <svg viewBox="0 0 1536 1024" width={size + 'px'} height={size + 'px'} style={style} {...rest}>
      <path
        d="M1535.104 511.552h0.768l0.128 0.128C1404.928 810.432 1136.384 1024 767.36 1024h-1.152C398.976 1022.848 131.84 810.112 0.896 512.448H0.128C0 512.448 0 512.32 0 512.32 131.072 213.568 399.616 0 768.64 0h1.152c367.232 1.152 634.368 213.888 765.312 511.552zM415.104 512c0 188.864 157.888 342.016 353.024 342.016 195.008 0 353.152-153.152 353.152-342.016 0-188.864-158.08-342.016-353.152-342.016C573.248 169.984 415.04 323.2 415.04 512z"
        fill={getIconColor(color, 0, '#23232F')}
      />
      <path
        d="M558.912 512c0 111.936 93.632 202.56 209.152 202.56 115.456 0 209.088-90.624 209.088-202.496 0-111.872-93.632-202.56-209.088-202.56-115.392 0-209.152 90.688-209.152 202.56z"
        fill={getIconColor(color, 1, '#23232F')}
      />
    </svg>
  );
};

IconView.defaultProps = {
  size: 24,
};

export default IconView;
