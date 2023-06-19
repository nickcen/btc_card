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

const IconSelect: FunctionComponent<Props> = ({ size, color, style: _style, ...rest }) => {
  const style = _style ? { ...DEFAULT_STYLE, ..._style } : DEFAULT_STYLE;

  return (
    <svg viewBox="0 0 1024 1024" width={size + 'px'} height={size + 'px'} style={style} {...rest}>
      <path
        d="M512 0a512 512 0 1 0 0 1024A512 512 0 0 0 512 0z m258.56 480.841143L497.883429 726.162286c-13.897143 12.434286-32.109714 18.651429-50.322286 18.578285a74.605714 74.605714 0 0 1-50.322286-18.578285l-143.798857-129.462857a59.099429 59.099429 0 0 1 0-89.819429c27.574857-24.795429 72.265143-24.795429 99.84 0l94.354286 84.845714 223.085714-200.777143c27.574857-24.795429 72.265143-24.795429 99.84 0 27.574857 24.868571 27.574857 65.097143 0 89.892572z"
        fill={getIconColor(color, 0, '#333333')}
      />
    </svg>
  );
};

IconSelect.defaultProps = {
  size: 24,
};

export default IconSelect;
