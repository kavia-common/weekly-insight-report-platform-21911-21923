import React from 'react';
import './Badge.css';

/**
 * PUBLIC_INTERFACE
 * Badge component to show small status labels.
 */
export default function Badge({ children, tone = 'info' }) {
  return <span className={`badge badge-${tone}`}>{children}</span>;
}
