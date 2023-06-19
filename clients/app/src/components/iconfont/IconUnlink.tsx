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

const IconUnlink: FunctionComponent<Props> = ({ size, color, style: _style, ...rest }) => {
  const style = _style ? { ...DEFAULT_STYLE, ..._style } : DEFAULT_STYLE;

  return (
    <svg viewBox="0 0 1024 1024" width={size + 'px'} height={size + 'px'} style={style} {...rest}>
      <path
        d="M233.04192 173.38368l617.6768 617.69728 72.68352-72.66304-617.6768-617.69728-72.704 72.66304zM246.82496 774.28736c-76.5952-76.5952-78.47936-194.6624-4.13696-269.0048l96.8704-96.8704-63.2832-63.2832-96.8704 96.8704c-106.5984 106.5984-103.87456 283.70944 6.0416 393.6256 109.93664 109.93664 287.04768 112.66048 393.6256 6.06208l96.91136-96.8704-63.2832-63.2832-96.89088 96.8704c-74.3424 74.3424-192.43008 72.43776-268.98432-4.11648z"
        fill={getIconColor(color, 0, '#333333')}
      />
      <path
        d="M442.20416 179.24096l-96.8704 96.8704 63.2832 63.2832 96.8704-96.8704c74.28096-74.28096 192.34816-72.41728 268.94336 4.17792 76.55424 76.55424 78.45888 194.6624 4.17792 268.94336l-96.8704 96.8704 63.2832 63.2832 96.8704-96.8704c106.5984-106.5984 103.87456-283.70944-6.06208-393.6256-109.91616-109.93664-287.0272-112.64-393.6256-6.06208z"
        fill={getIconColor(color, 1, '#333333')}
      />
    </svg>
  );
};

IconUnlink.defaultProps = {
  size: 24,
};

export default IconUnlink;
