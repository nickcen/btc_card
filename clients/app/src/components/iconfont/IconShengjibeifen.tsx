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

const IconShengjibeifen: FunctionComponent<Props> = ({ size, color, style: _style, ...rest }) => {
  const style = _style ? { ...DEFAULT_STYLE, ..._style } : DEFAULT_STYLE;

  return (
    <svg viewBox="0 0 1024 1024" width={size + 'px'} height={size + 'px'} style={style} {...rest}>
      <path
        d="M0 0h1024v1024H0z"
        fill={getIconColor(color, 0, '#333333')}
      />
      <path
        d="M962.56 512C962.56 263.168 760.968533 61.44 512 61.44 263.133867 61.44 61.44 263.0656 61.44 512c0 248.900267 201.659733 450.56 450.56 450.56 248.9344 0 450.56-201.796267 450.56-450.56zM555.4176 246.340267l164.522667 150.596266a65.2288 65.2288 0 1 1-88.064 96.3584l-55.296-50.619733v286.8224c0 35.9424-29.0816 65.194667-65.194667 65.194667a65.1264 65.1264 0 0 1-65.160533-65.194667v-286.037333l-53.76 49.5616a65.262933 65.262933 0 0 1-88.405334-95.914667l163.191467-150.6304c4.949333-4.676267 10.513067-8.192 16.4864-11.0592 0.648533-0.3072 1.297067-0.477867 1.9456-0.648533a13.312 13.312 0 0 0 1.3312-0.375467c5.973333-2.4576 12.1856-4.027733 18.670933-4.539733 2.218667-0.136533 4.437333-0.136533 6.621867-0.136534 5.597867 0 11.195733 0.887467 16.622933 2.4576 0.887467 0.273067 1.7408 0.477867 2.594134 0.682667a28.7744 28.7744 0 0 1 3.515733 1.024c0.4096 0.170667 0.853333 0.273067 1.297067 0.375467a7.168 7.168 0 0 1 1.297066 0.375466c6.382933 2.8672 11.946667 6.621867 16.9984 11.195734l0.4096 0.238933a1.365333 1.365333 0 0 1 0.375467 0.273067z"
        fill={getIconColor(color, 1, '#333333')}
      />
    </svg>
  );
};

IconShengjibeifen.defaultProps = {
  size: 24,
};

export default IconShengjibeifen;
