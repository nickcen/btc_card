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

const IconDevice2: FunctionComponent<Props> = ({ size, color, style: _style, ...rest }) => {
  const style = _style ? { ...DEFAULT_STYLE, ..._style } : DEFAULT_STYLE;

  return (
    <svg viewBox="0 0 1024 1024" width={size + 'px'} height={size + 'px'} style={style} {...rest}>
      <path
        d="M486.4 722.488889a51.2 51.2 0 0 1 51.029333 47.388444l0.170667 3.811556v128a51.2 51.2 0 0 1-102.286222 3.811555l-0.113778-3.811555V773.688889a51.2 51.2 0 0 1 51.2-51.2z"
        fill={getIconColor(color, 0, '#16FFBB')}
      />
      <path
        d="M670.72 901.688889c25.429333 0 46.08 22.926222 46.08 51.2 0 26.965333-18.773333 49.095111-42.666667 51.086222l-3.413333 0.113778H302.08c-25.429333 0-46.08-22.926222-46.08-51.2 0-26.965333 18.773333-49.095111 42.666667-51.086222l3.413333-0.113778h368.64zM107.463111 0H859.591111C918.983111 0 967.111111 54.840889 967.111111 122.538667V568.888889h-107.463111V122.538667H107.52v551.367111H739.555556V796.444444H107.463111C48.128 796.444444 0 741.603556 0 673.905778V122.538667C0 54.840889 48.128 0 107.463111 0z"
        fill={getIconColor(color, 1, '#16FFBB')}
      />
      <path
        d="M967.111111 512h-170.666667c-31.402667 0-56.888889 24.746667-56.888888 55.296v344.519111c0 30.549333 25.486222 55.296 56.888888 55.296h170.666667c31.402667 0 56.888889-24.746667 56.888889-55.296V567.296C1024 536.746667 998.513778 512 967.111111 512z m-170.666667 56.888889h170.666667v341.333333h-170.666667v-341.333333z"
        fill={getIconColor(color, 2, '#16FFBB')}
      />
    </svg>
  );
};

IconDevice2.defaultProps = {
  size: 24,
};

export default IconDevice2;
