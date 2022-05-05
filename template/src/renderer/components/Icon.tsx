import { CSSProperties } from 'react';
import classnames from 'classnames';
import { isNumber } from '@fujia/hammer';

const importAll = (requireContext: __WebpackModuleApi.RequireContext) => requireContext.keys().forEach(requireContext);

try {
  importAll(require.context('../assets/icons', true, /\.svg$/));
} catch (error) {}

interface IconProps {
  name: string;
  className?: string;
  style?: CSSProperties;
  size?: number;
}

export const Icon = (props: IconProps) => {
  const { name, className, style = {}, size } = props;
  const classNameList = classnames('icon', {
    [`${className}`]: className,
  });

  if (!name) return null;

  const mergeStyles = { ...style };

  if (isNumber(size)) {
    mergeStyles.height = size;
    mergeStyles.width = size;
  }

  return (
    <svg className={classNameList} style={mergeStyles}>
      <use xlinkHref={`#${name}`} />
    </svg>
  );
};
