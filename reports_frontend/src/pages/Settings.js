import React from 'react';
import Card from '../components/common/Card';
import Input from '../components/common/Input';
import Button from '../components/common/Button';

export default function Settings() {
  return (
    <div className="container">
      <h2>Settings</h2>
      <p className="text-muted">Manage preferences. Supabase config is not required yet.</p>

      <Card title="Profile">
        <div style={{ display: 'grid', gap: 12 }}>
          <Input label="Display Name" placeholder="Your name" />
          <Input label="Email" placeholder="email@example.com" type="email" />
          <div style={{ display: 'flex', gap: 12 }}>
            <Button variant="primary">Save</Button>
            <Button variant="ghost">Cancel</Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
