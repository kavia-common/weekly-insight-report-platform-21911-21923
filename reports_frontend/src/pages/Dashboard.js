import React from 'react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';

export default function Dashboard() {
  return (
    <div className="container">
      <h2>Dashboard</h2>
      <p className="text-muted">Welcome to your weekly insights. Quick links and summaries appear here.</p>
      <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', marginTop: 16 }}>
        <Card title="Submit Weekly Report" subtitle="Capture achievements, blockers, and next week plan" actions={<Button variant="primary" onClick={() => (window.location.href = '/submit')}>Start</Button>}>
          <p>Submit your report to keep your team aligned and track your progress.</p>
        </Card>
        <Card title="My Reports" subtitle="Recent submissions and statuses">
          <p>Review and update your latest weekly reports.</p>
        </Card>
        <Card title="Team Insights" subtitle="AI-generated summaries">
          <p>See trends and highlights from your team’s weekly updates.</p>
        </Card>
      </div>
    </div>
  );
}
