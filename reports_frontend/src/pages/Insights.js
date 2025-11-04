import React from 'react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { useMockInsights } from '../hooks/useMockInsights';
import TrendsChart from '../components/insights/TrendsChart';
import SummaryCards from '../components/insights/SummaryCards';
import InsightsList from '../components/insights/InsightsList';
import { supabase } from '../utils/supabase';

/**
 * PUBLIC_INTERFACE
 * Insights page shows AI summaries, trends, and suggested actions using mock data.
 * Gracefully handles unauthenticated state if Supabase is configured.
 */
export default function Insights() {
  const { summary, trendsSeries, groups } = useMockInsights();
  const [userEmail, setUserEmail] = React.useState('');
  const [checkedAuth, setCheckedAuth] = React.useState(false);

  React.useEffect(() => {
    let mounted = true;
    const check = async () => {
      try {
        const { data } = await supabase.auth.getUser();
        if (!mounted) return;
        if (data?.user?.email) setUserEmail(data.user.email);
      } catch {
        // ignore; supabase may not be configured
      } finally {
        if (mounted) setCheckedAuth(true);
      }
    };
    check();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="container">
      <h2>Insights & Analytics</h2>
      <p className="text-muted">AI-summarized trends and metrics from your team’s weekly updates.</p>

      {!userEmail && checkedAuth && (
        <Card
          title="You are browsing as guest"
          subtitle="Sign in to view personalized insights and export options"
          actions={<Button variant="primary" onClick={() => (window.location.href = '/settings')}>Sign in</Button>}
        >
          <p style={{ marginTop: 0 }}>
            Supabase auth not detected or user is not signed in. The content below uses sample data.
          </p>
        </Card>
      )}

      <div style={{ display: 'grid', gap: 16, marginTop: 16 }}>
        <SummaryCards summary={summary} />
        <TrendsChart title="Submission Rate" subtitle="Past 6 weeks" series={trendsSeries} />
        <InsightsList groups={groups} />
      </div>
    </div>
  );
}
