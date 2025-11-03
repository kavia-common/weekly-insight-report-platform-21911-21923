import React from 'react';

export default function AuthError() {
  return (
    <div className="container">
      <h2>Authentication Error</h2>
      <p className="text-muted">There was a problem completing the sign-in. Please try again.</p>
    </div>
  );
}
