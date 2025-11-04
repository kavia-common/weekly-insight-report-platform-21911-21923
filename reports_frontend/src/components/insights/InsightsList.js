import React from 'react';
import Card from '../common/Card';

/**
 * PUBLIC_INTERFACE
 * InsightsList renders grouped insight items (themes, risks, kudos, actions).
 */
export default function InsightsList({ groups }) {
  if (!groups || groups.length === 0) return null;

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      {groups.map((g) => (
        <Card key={g.title} title={g.title} subtitle={g.subtitle}>
          <ul style={{ margin: 0, paddingLeft: 18 }}>
            {g.items.map((item, idx) => (
              <li key={idx} style={{ marginBottom: 8 }}>
                {item}
              </li>
            ))}
          </ul>
        </Card>
      ))}
    </div>
  );
}
