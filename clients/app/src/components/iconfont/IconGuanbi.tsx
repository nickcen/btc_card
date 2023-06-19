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

const IconGuanbi: FunctionComponent<Props> = ({ size, color, style: _style, ...rest }) => {
  const style = _style ? { ...DEFAULT_STYLE, ..._style } : DEFAULT_STYLE;

  return (
    <svg viewBox="0 0 1024 1024" width={size + 'px'} height={size + 'px'} style={style} {...rest}>
      <path
        d="M680.95138 294.776797m24.135912 24.135911l0 0q24.135911 24.135911 0 48.271823l-337.902761 337.902761q-24.135911 24.135911-48.271823 0l0 0q-24.135911-24.135911 0-48.271823l337.902761-337.902761q24.135911-24.135911 48.271823 0Z"
        fill={getIconColor(color, 0, '#9C9CA4')}
      />
      <path
        d="M729.223203 680.95138m-24.135911 24.135912l0 0q-24.135911 24.135911-48.271823 0l-337.902761-337.902761q-24.135911-24.135911 0-48.271823l0 0q24.135911-24.135911 48.271823 0l337.902761 337.902761q24.135911 24.135911 0 48.271823Z"
        fill={getIconColor(color, 1, '#9C9CA4')}
      />
    </svg>
  );
};

IconGuanbi.defaultProps = {
  size: 24,
};

export default IconGuanbi;
