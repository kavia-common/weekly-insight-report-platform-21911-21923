import React from 'react';
import './Card.css';

/**
 * PUBLIC_INTERFACE
 * Card container with optional header and actions.
 */
export default function Card({ title, subtitle, actions, children }) {
  return (
    <section className="card" aria-label={title || 'Card'}>
      {(title || actions) && (
        <header className="card-header">
          <div>
            {title && <h2 className="card-title">{title}</h2>}
            {subtitle && <p className="card-subtitle">{subtitle}</p>}
          </div>
          <div className="card-actions">{actions}</div>
        </header>
      )}
      <div className="card-body">{children}</div>
    </section>
  );
}
