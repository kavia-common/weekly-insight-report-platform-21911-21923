import React from 'react';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import { useMockReports } from '../hooks/useMockReports';

export default function MyReports() {
  const { myReports } = useMockReports();

  return (
    <div className="container">
      <h2>My Reports</h2>
      <p className="text-muted">Your recent submissions and statuses.</p>

      <div style={{ display: 'grid', gap: 16 }}>
        {myReports.map((r) => (
          <Card
            key={r.id}
            title={r.title}
            subtitle={`Submitted ${r.submittedAt} • ${r.period}`}
            actions={<Badge tone={r.status === 'Submitted' ? 'success' : r.status === 'Draft' ? 'warn' : 'info'}>{r.status}</Badge>}
          >
            <p style={{ marginTop: 0 }}>{r.summary}</p>
            <div className="hr" />
            <div style={{ display: 'flex', gap: 8 }}>
              <Button variant="ghost">View</Button>
              <Button variant="secondary">Edit</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
