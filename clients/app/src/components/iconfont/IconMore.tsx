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

const IconMore: FunctionComponent<Props> = ({ size, color, style: _style, ...rest }) => {
  const style = _style ? { ...DEFAULT_STYLE, ..._style } : DEFAULT_STYLE;

  return (
    <svg viewBox="0 0 1024 1024" width={size + 'px'} height={size + 'px'} style={style} {...rest}>
      <path
        d="M819.2 614.4a102.4 102.4 0 1 0-0.1024-204.9024A102.4 102.4 0 0 0 819.2 614.4z m-307.2 0a102.4 102.4 0 1 0-0.1024-204.9024A102.4 102.4 0 0 0 512 614.4z m-204.8-102.4a102.4 102.4 0 1 1-204.9024-0.1024A102.4 102.4 0 0 1 307.2 512z"
        fill={getIconColor(color, 0, '#333333')}
      />
    </svg>
  );
};

IconMore.defaultProps = {
  size: 24,
};

export default IconMore;
