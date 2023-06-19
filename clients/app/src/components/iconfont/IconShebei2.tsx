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

const IconShebei2: FunctionComponent<Props> = ({ size, color, style: _style, ...rest }) => {
  const style = _style ? { ...DEFAULT_STYLE, ..._style } : DEFAULT_STYLE;

  return (
    <svg viewBox="0 0 1024 1024" width={size + 'px'} height={size + 'px'} style={style} {...rest}>
      <path
        d="M923.776 727.3728h51.456v101.5808H48.768v-101.5808h51.456V219.392h823.552v507.9552zM203.1872 321.024v355.5584h617.6256v-355.584H203.1872z"
        fill={getIconColor(color, 0, '#5D5D6C')}
      />
    </svg>
  );
};

IconShebei2.defaultProps = {
  size: 24,
};

export default IconShebei2;
