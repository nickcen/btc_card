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

const IconShibai: FunctionComponent<Props> = ({ size, color, style: _style, ...rest }) => {
  const style = _style ? { ...DEFAULT_STYLE, ..._style } : DEFAULT_STYLE;

  return (
    <svg viewBox="0 0 1024 1024" width={size + 'px'} height={size + 'px'} style={style} {...rest}>
      <path
        d="M512 66.064516C265.711484 66.064516 66.064516 265.711484 66.064516 512s199.646968 445.935484 445.935484 445.935484 445.935484-199.646968 445.935484-445.935484S758.288516 66.064516 512 66.064516z m204.469677 571.573678c6.804645 6.804645 6.804645 17.837419 0 24.625548l-54.205935 54.205935a17.424516 17.424516 0 0 1-24.625548 0L512 590.831484l-125.638194 125.638193a17.441032 17.441032 0 0 1-24.625548 0l-54.205935-54.205935a17.441032 17.441032 0 0 1 0-24.625548L433.185032 512l-125.654709-125.638194a17.441032 17.441032 0 0 1 0-24.625548l54.205935-54.205935a17.441032 17.441032 0 0 1 24.625548 0L512 433.185032l125.638194-125.654709a17.441032 17.441032 0 0 1 24.625548 0l54.205935 54.205935c6.804645 6.771613 6.804645 17.820903 0 24.625548L590.831484 512l125.638193 125.638194z"
        fill={getIconColor(color, 0, '#FF6363')}
      />
    </svg>
  );
};

IconShibai.defaultProps = {
  size: 24,
};

export default IconShibai;
