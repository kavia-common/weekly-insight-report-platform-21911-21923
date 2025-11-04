import React from 'react';
import Card from '../common/Card';
import Badge from '../common/Badge';

/**
 * PUBLIC_INTERFACE
 * SummaryCards renders high-level AI summary metrics (sentiment, blockers, highlights).
 */
export default function SummaryCards({ summary }) {
  if (!summary) return null;

  const toneFromSentiment = (s) => {
    if (s === 'Positive') return 'success';
    if (s === 'Mixed') return 'warn';
    return 'error';
  };

  return (
    <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
      <Card title="Overall Sentiment" subtitle="Experimental signal">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Badge tone={toneFromSentiment(summary.sentiment)}>{summary.sentiment}</Badge>
          <span className="text-muted">confidence {summary.sentimentConfidence}%</span>
        </div>
      </Card>
      <Card title="Top Themes" subtitle="Most mentioned">
        <ul style={{ margin: 0, paddingLeft: 18 }}>
          {summary.themes.map((t) => (
            <li key={t.name} style={{ marginBottom: 6 }}>
              <strong>{t.name}</strong> — {t.count} mentions
            </li>
          ))}
        </ul>
      </Card>
      <Card title="Blockers" subtitle="Count across reports">
        <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--color-primary)' }}>
          {summary.blockersCount}
        </div>
        <p className="text-muted" style={{ marginTop: 8 }}>
          {summary.blockersCount === 0 ? 'No critical blockers detected' : 'Follow up recommended'}
        </p>
      </Card>
      <Card title="Highlights" subtitle="Wins and kudos">
        <ul style={{ margin: 0, paddingLeft: 18 }}>
          {summary.highlights.map((h, idx) => (
            <li key={idx} style={{ marginBottom: 6 }}>{h}</li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
