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

const IconTokenAll: FunctionComponent<Props> = ({ size, color, style: _style, ...rest }) => {
  const style = _style ? { ...DEFAULT_STYLE, ..._style } : DEFAULT_STYLE;

  return (
    <svg viewBox="0 0 1592 1024" width={size + 'px'} height={size + 'px'} style={style} {...rest}>
      <path
        d="M359.936 227.555556l244.280889 568.888888H473.088L420.977778 669.752889H179.939556L127.829333 796.444444H0L244.280889 227.555556h115.655111zM302.08 382.691556l-82.375111 206.904888H384.568889L302.08 382.691556zM1098.524444 796.444444v-113.777777h-304.867555V227.555556h-134.542222v568.888888zM1592.888889 796.444444v-113.777777h-304.924445V227.555556h-134.485333v568.888888z"
        fill={getIconColor(color, 0, '#333333')}
      />
    </svg>
  );
};

IconTokenAll.defaultProps = {
  size: 24,
};

export default IconTokenAll;
