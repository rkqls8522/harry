import React, { memo, useMemo } from 'react';

const Button = memo(({ children, variant = 'default', size = 'md', ...props }) => {
  const className = useMemo(() => {
    const base = 'rounded px-3 py-1 font-medium';
    const variants = {
      default: 'bg-blue-600 text-white',
      outline: 'border border-gray-300 text-gray-700 bg-white hover:bg-gray-50',
    };
    const sizes = {
      sm: 'text-sm',
      md: 'text-base',
    };
    return `${base} ${variants[variant]} ${sizes[size]}`;
  }, [variant, size]);

  return (
    <button className={className} {...props}>
      {children}
    </button>
  );
});

export default Button;
