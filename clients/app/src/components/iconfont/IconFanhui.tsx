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

const IconFanhui: FunctionComponent<Props> = ({ size, color, style: _style, ...rest }) => {
  const style = _style ? { ...DEFAULT_STYLE, ..._style } : DEFAULT_STYLE;

  return (
    <svg viewBox="0 0 1024 1024" width={size + 'px'} height={size + 'px'} style={style} {...rest}>
      <path
        d="M420.386133 558.7968c-17.442133-15.36-44.2368-41.745067-39.253333-46.7968 4.983467-5.051733 43.588267-46.7968 69.5296-70.212267l247.978667-239.9232c24.234667-23.381333 24.234667-58.504533 0-81.92a59.835733 59.835733 0 0 0-84.650667 0L257.058133 465.237333C244.974933 476.842667 238.933333 494.455467 238.933333 512s0 35.1232 18.158934 46.7968l356.864 345.258667a59.835733 59.835733 0 0 0 84.6848 0c24.234667-23.415467 24.234667-58.538667 0-81.92l-278.254934-263.338667z"
        fill={getIconColor(color, 0, '#333333')}
      />
    </svg>
  );
};

IconFanhui.defaultProps = {
  size: 24,
};

export default IconFanhui;
