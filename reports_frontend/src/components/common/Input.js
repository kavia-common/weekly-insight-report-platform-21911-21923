import React from 'react';
import './Input.css';

/**
 * PUBLIC_INTERFACE
 * Input field with label and helper text.
 */
export default function Input({ label, helper, id, ...rest }) {
  const inputId = id || `input-${Math.random().toString(36).slice(2, 8)}`;
  return (
    <div className="field">
      {label && <label htmlFor={inputId} className="label">{label}</label>}
      <input id={inputId} className="control" {...rest} />
      {helper && <div className="helper">{helper}</div>}
    </div>
  );
}
