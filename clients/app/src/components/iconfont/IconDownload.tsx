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

const IconDownload: FunctionComponent<Props> = ({ size, color, style: _style, ...rest }) => {
  const style = _style ? { ...DEFAULT_STYLE, ..._style } : DEFAULT_STYLE;

  return (
    <svg viewBox="0 0 1024 1024" width={size + 'px'} height={size + 'px'} style={style} {...rest}>
      <path
        d="M270.7456 269.5168a39.2192 39.2192 0 0 0-53.0944 0l-53.0432 49.9712a33.8944 33.8944 0 0 0 0 49.9712l299.008 281.5488c1.3312 1.2288 25.088 14.592 48.7936 14.592 23.3984 0 46.6944-13.4144 47.9744-14.592l299.008-281.6a33.8944 33.8944 0 0 0 0-49.92l-53.0432-49.9712a39.168 39.168 0 0 0-53.0432 0L584.448 428.544V85.2992c0-18.8416-16.2304-34.0992-36.2496-34.0992H475.8016c-19.968 0-36.1984 15.2576-36.1984 34.0992v343.1936L270.7456 269.5168zM182.784 921.6H841.216C913.8688 921.6 972.8 857.4464 972.8 778.24v-179.2c0-19.8144-14.7456-35.84-32.9216-35.84h-65.792c-18.2272 0-32.9216 16.0256-32.9216 35.84v107.52c0 39.5776-29.4912 71.68-65.8432 71.68H248.6784c-36.352 0-65.8432-32.1024-65.8432-71.68v-107.52c0-19.8144-14.6944-35.84-32.8704-35.84H84.1216c-18.176 0-32.9216 16.0256-32.9216 35.84v179.2C51.2 857.4464 110.1312 921.6 182.8352 921.6z"
        fill={getIconColor(color, 0, '#333333')}
      />
    </svg>
  );
};

IconDownload.defaultProps = {
  size: 24,
};

export default IconDownload;
