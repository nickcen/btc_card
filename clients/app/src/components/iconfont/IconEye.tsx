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

const IconEye: FunctionComponent<Props> = ({ size, color, style: _style, ...rest }) => {
  const style = _style ? { ...DEFAULT_STYLE, ..._style } : DEFAULT_STYLE;

  return (
    <svg viewBox="0 0 1024 1024" width={size + 'px'} height={size + 'px'} style={style} {...rest}>
      <path
        d="M972.288 522.2912h0.4096l0.1024 0.1024c-78.6432 185.0368-239.7696 317.3376-461.1584 317.3376h-0.7168c-220.3136-0.7168-380.6208-132.5056-459.1616-316.928H51.2L51.2 522.752c78.6432-185.0368 239.7696-317.3376 461.1584-317.3376h0.7168c220.3136 0.7168 380.6208 132.4544 459.1616 316.8768z m-672.0512 0.256a211.8656 211.8656 0 1 0 423.68 0 211.8656 211.8656 0 0 0-423.68 0z"
        fill={getIconColor(color, 0, '#333333')}
      />
    </svg>
  );
};

IconEye.defaultProps = {
  size: 24,
};

export default IconEye;
