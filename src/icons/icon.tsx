import type { SVGAttributes, SVGProps } from 'react';
// @ts-ignore generated
import iconsSpriteUrl from './icons-sprite.svg';
// @ts-ignore generated
import type { IconName } from './types';

type IconProps = Omit<SVGProps<SVGSVGElement>, 'name'> & {
  name: IconName;
  size?: SVGAttributes<SVGSVGElement>['width'];
  title?: string;
};

export { iconsSpriteUrl, type IconName };

export function Icon({ name, size = '1em', title, ...props }: IconProps) {
  return (
    <svg width={size} height={size} {...props}>
      {title ? <title>{title}</title> : null}
      <use href={`${iconsSpriteUrl}#${name}`} />
    </svg>
  );
}
