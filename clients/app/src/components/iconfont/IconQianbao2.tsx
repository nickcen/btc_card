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

const IconQianbao2: FunctionComponent<Props> = ({ size, color, style: _style, ...rest }) => {
  const style = _style ? { ...DEFAULT_STYLE, ..._style } : DEFAULT_STYLE;

  return (
    <svg viewBox="0 0 1024 1024" width={size + 'px'} height={size + 'px'} style={style} {...rest}>
      <path
        d="M808.704 153.6a79.3856 79.3856 0 0 1 79.1552 79.6416v119.4752h-19.7888A79.3856 79.3856 0 0 1 947.2 432.3328v119.5008a79.3856 79.3856 0 0 1-79.104 79.616h19.7632v159.3088A79.3856 79.3856 0 0 1 808.704 870.4H155.904A79.3856 79.3856 0 0 1 76.8 790.7584V233.216A79.3856 79.3856 0 0 1 155.904 153.6h652.8z m-18.1504 78.5408H174.08c-23.4752 0-42.496 17.92-42.496 39.9872v479.744c0 22.0672 19.0208 39.9872 42.496 39.9872h616.4992c23.5008 0 42.5216-17.92 42.5216-39.9872v-119.936h-191.3344c-46.9504 0-85.0176-35.7888-85.0176-79.9488v-119.936c0-44.16 38.0672-79.9744 85.0176-79.9744h191.3344V272.128c0-22.0672-19.0208-39.9872-42.496-39.9872z m64.768 168.32h-211.2c-29.184 0-52.8128 27.4176-52.8128 61.2608v61.2864c0 33.8176 23.6288 61.2608 52.7872 61.2608h211.2256c29.184 0 52.8128-27.4432 52.8128-61.2608v-61.2864c0-33.8432-23.6544-61.2608-52.8128-61.2608z"
        fill={getIconColor(color, 0, '#5D5D6C')}
      />
      <path
        d="M466.2784 332.8H224.9216C213.8112 332.8 204.8 321.3312 204.8 307.2s9.0112-25.6 20.1216-25.6h241.3568c11.1104 0 20.1216 11.4688 20.1216 25.6s-9.0112 25.6-20.1216 25.6z"
        fill={getIconColor(color, 1, '#5D5D6C')}
      />
    </svg>
  );
};

IconQianbao2.defaultProps = {
  size: 24,
};

export default IconQianbao2;
