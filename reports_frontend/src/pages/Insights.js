import React from 'react';
import Card from '../components/common/Card';

export default function Insights() {
  return (
    <div className="container">
      <h2>Insights & Analytics</h2>
      <p className="text-muted">AI-summarized trends and metrics will appear here.</p>

      <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
        <Card title="Submission Rate" subtitle="Past 4 weeks">
          <p>Placeholder chart area. Add a chart library in the future.</p>
        </Card>
        <Card title="Top Themes" subtitle="Mention frequency">
          <ul>
            <li>Delivery • Collaboration • Roadblocks</li>
          </ul>
        </Card>
        <Card title="Team Sentiment" subtitle="Experimental">
          <p>Overall positive with occasional blockers flagged.</p>
        </Card>
      </div>
    </div>
  );
}
