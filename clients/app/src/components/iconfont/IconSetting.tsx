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

const IconSetting: FunctionComponent<Props> = ({ size, color, style: _style, ...rest }) => {
  const style = _style ? { ...DEFAULT_STYLE, ..._style } : DEFAULT_STYLE;

  return (
    <svg viewBox="0 0 1024 1024" width={size + 'px'} height={size + 'px'} style={style} {...rest}>
      <path
        d="M534.766933 142.4384l295.799467 165.649067c14.097067 7.918933 22.766933 22.493867 22.766933 38.263466v331.298134c0 15.7696-8.669867 30.378667-22.766933 38.229333l-295.799467 165.6832c-14.097067 7.850667-31.4368 7.850667-45.533866 0l-295.799467-165.649067A43.963733 43.963733 0 0 1 170.666667 677.649067v-331.298134c0-15.7696 8.669867-30.378667 22.766933-38.229333l295.799467-165.6832c14.097067-7.850667 31.4368-7.850667 45.533866 0zM512 357.410133c-87.9616 0-159.300267 69.188267-159.300267 154.589867s71.338667 154.624 159.300267 154.624 159.300267-69.2224 159.300267-154.624c0-85.4016-71.338667-154.624-159.300267-154.624z"
        fill={getIconColor(color, 0, '#333333')}
      />
    </svg>
  );
};

IconSetting.defaultProps = {
  size: 24,
};

export default IconSetting;
