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

const IconLianjie1: FunctionComponent<Props> = ({ size, color, style: _style, ...rest }) => {
  const style = _style ? { ...DEFAULT_STYLE, ..._style } : DEFAULT_STYLE;

  return (
    <svg viewBox="0 0 1075 1024" width={size + 'px'} height={size + 'px'} style={style} {...rest}>
      <path
        d="M241.5616 183.808L840.192 782.336l70.4512-70.3488L312.0128 113.408 241.5616 183.808zM254.9248 766.208c-74.24-74.24-76.032-188.6208-4.0448-260.6592L344.7808 411.648 283.4944 350.3104 189.5936 444.2112c-103.3216 103.3216-100.6592 274.944 5.8368 381.44s278.1696 109.1584 381.44 5.888l93.9008-93.9008-61.2864-61.3376-93.9008 93.9008c-72.0384 72.0384-186.4704 70.144-260.6592-3.9936z"
        fill={getIconColor(color, 0, '#FF6363')}
      />
      <path
        d="M444.3136 189.4912L350.4128 283.392 411.648 344.7296l93.9008-93.9008c71.9872-71.9872 186.368-70.144 260.608 4.096 74.24 74.1376 76.032 188.5696 4.096 260.608l-93.9008 93.8496 61.2864 61.3376 93.9008-93.9008c103.3216-103.3216 100.6592-274.944-5.8368-381.44s-278.1696-109.1584-381.44-5.888z"
        fill={getIconColor(color, 1, '#FF6363')}
      />
    </svg>
  );
};

IconLianjie1.defaultProps = {
  size: 24,
};

export default IconLianjie1;
