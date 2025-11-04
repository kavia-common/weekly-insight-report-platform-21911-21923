import React from 'react';
import Card from '../common/Card';

/**
 * PUBLIC_INTERFACE
 * TrendsChart is a visual placeholder for future charts (submission rate / sentiment over time).
 */
export default function TrendsChart({ title = 'Trends Over Time', subtitle = 'Past 6 weeks', series = [] }) {
  // Render a simple bar line placeholder using divs; replace with real chart lib later.
  const max = Math.max(1, ...series.map((s) => s.value));
  return (
    <Card title={title} subtitle={subtitle}>
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          gap: 12,
          height: 160,
          padding: '8px 4px',
          background: 'linear-gradient(135deg, rgba(59,130,246,0.08) 0%, #f9fafb 100%)',
          borderRadius: 8,
          border: '1px dashed var(--color-border)',
        }}
        aria-label="Chart placeholder"
      >
        {series.map((pt) => (
          <div key={pt.label} style={{ display: 'grid', justifyItems: 'center', gap: 6 }}>
            <div
              style={{
                width: 16,
                height: Math.max(6, Math.round((pt.value / max) * 120)),
                background: 'var(--color-primary)',
                borderRadius: 4,
                boxShadow: '0 6px 18px rgba(37,99,235,0.25)',
              }}
              title={`${pt.label}: ${pt.value}`}
              aria-label={`${pt.label} ${pt.value}`}
            />
            <span style={{ fontSize: 11, color: 'var(--color-muted)' }}>{pt.label}</span>
          </div>
        ))}
      </div>
      <p className="text-muted" style={{ marginTop: 12 }}>
        This is a placeholder. Replace with a proper charting library in the future.
      </p>
    </Card>
  );
}
