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

const IconEmail: FunctionComponent<Props> = ({ size, color, style: _style, ...rest }) => {
  const style = _style ? { ...DEFAULT_STYLE, ..._style } : DEFAULT_STYLE;

  return (
    <svg viewBox="0 0 1126 1024" width={size + 'px'} height={size + 'px'} style={style} {...rest}>
      <path
        d="M972.8 0a153.6 153.6 0 0 1 153.6 153.6v694.0672a153.6 153.6 0 0 1-153.6 153.6H153.6a153.6 153.6 0 0 1-153.6-153.6V153.6a153.6 153.6 0 0 1 153.6-153.6h819.2zM203.264 277.4528c-21.4016-16.9984-50.7904-12.4416-67.6864 7.8848-16.9472 21.504-12.4416 96.768 7.8848 113.664l312.6784 246.4256a153.1904 153.1904 0 0 0 106.0864 42.9056c38.4 0 76.8-14.6944 106.1376-42.9056l313.7536-246.3744c21.504-16.9984 24.8832-93.3888 10.1888-113.664a49.4592 49.4592 0 0 0-67.7376-7.936l-316.0576 248.6272-4.5056 3.3792c-21.4528 22.6304-57.5488 22.6304-80.128 0l-2.2528-2.2528z"
        fill={getIconColor(color, 0, '#333333')}
      />
    </svg>
  );
};

IconEmail.defaultProps = {
  size: 24,
};

export default IconEmail;
