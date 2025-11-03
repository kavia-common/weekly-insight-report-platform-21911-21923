import React from 'react';
import './Button.css';

/**
 * PUBLIC_INTERFACE
 * Button component with variants and sizes.
 */
export default function Button({ children, variant = 'primary', size = 'md', ...rest }) {
  return (
    <button className={`btn btn-${variant} btn-${size}`} {...rest}>
      {children}
    </button>
  );
}
