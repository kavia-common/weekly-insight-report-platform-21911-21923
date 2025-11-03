import React from 'react';
import './Modal.css';

/**
 * PUBLIC_INTERFACE
 * Modal placeholder. Non-interactive portal to keep deps minimal.
 */
export default function Modal({ title = 'Modal', open = false, onClose, children }) {
  if (!open) return null;
  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label={title}>
      <div className="modal">
        <header className="modal-header">
          <h3>{title}</h3>
          <button className="modal-close" onClick={onClose} aria-label="Close modal">✕</button>
        </header>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}
