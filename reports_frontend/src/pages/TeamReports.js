import React from 'react';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import { useMockReports } from '../hooks/useMockReports';

export default function TeamReports() {
  const { teamReports } = useMockReports();

  return (
    <div className="container">
      <h2>Team Reports</h2>
      <p className="text-muted">Recent updates across your team.</p>

      <div style={{ display: 'grid', gap: 16 }}>
        {teamReports.map((r) => (
          <Card
            key={r.id}
            title={`${r.author} — ${r.title}`}
            subtitle={`Submitted ${r.submittedAt} • ${r.period}`}
            actions={<Badge tone="info">Team</Badge>}
          >
            <p style={{ marginTop: 0 }}>{r.summary}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
