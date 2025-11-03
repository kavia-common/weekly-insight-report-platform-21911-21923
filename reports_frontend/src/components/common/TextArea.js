import React from 'react';
import './Input.css';

/**
 * PUBLIC_INTERFACE
 * TextArea field with label and helper text.
 */
export default function TextArea({ label, helper, id, rows = 4, ...rest }) {
  const inputId = id || `textarea-${Math.random().toString(36).slice(2, 8)}`;
  return (
    <div className="field">
      {label && <label htmlFor={inputId} className="label">{label}</label>}
      <textarea id={inputId} className="control" rows={rows} {...rest} />
      {helper && <div className="helper">{helper}</div>}
    </div>
  );
}
