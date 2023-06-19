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

const IconEdit: FunctionComponent<Props> = ({ size, color, style: _style, ...rest }) => {
  const style = _style ? { ...DEFAULT_STYLE, ..._style } : DEFAULT_STYLE;

  return (
    <svg viewBox="0 0 1024 1024" width={size + 'px'} height={size + 'px'} style={style} {...rest}>
      <path
        d="M153.6 665.6h162.1504l410.8288-388.7616a43.8272 43.8272 0 0 0 0-67.4304l-76.4928-67.4304a57.9072 57.9072 0 0 0-38.2464-13.9776c-14.336 0-28.1088 5.0176-38.2464 13.9776L153.6 522.5984V665.6z m0 128v102.4h716.8v-102.4H153.6z"
        fill={getIconColor(color, 0, '#333333')}
      />
    </svg>
  );
};

IconEdit.defaultProps = {
  size: 24,
};

export default IconEdit;
