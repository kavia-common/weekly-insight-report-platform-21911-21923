import { useMemo } from 'react';

/**
 * PUBLIC_INTERFACE
 * Returns mock reports for UI scaffolding ahead of backend integration.
 */
export function useMockReports() {
  const data = useMemo(() => {
    const now = new Date();
    return {
      myReports: [
        {
          id: 'me-1',
          title: 'Week 42 Summary',
          status: 'Submitted',
          period: 'Oct 14 - Oct 18',
          submittedAt: now.toLocaleDateString(),
          summary: 'Delivered v1 of insights page, resolved deployment issue, planned KPI tracking.',
        },
        {
          id: 'me-2',
          title: 'Week 41 Summary',
          status: 'Draft',
          period: 'Oct 7 - Oct 11',
          submittedAt: '—',
          summary: 'Drafted accomplishments and next steps; pending blocker notes.',
        },
      ],
      teamReports: [
        {
          id: 't-1',
          author: 'Alex P.',
          title: 'Backend Milestone',
          period: 'Oct 14 - Oct 18',
          submittedAt: now.toLocaleDateString(),
          summary: 'API endpoints for reports completed; started analytics aggregation.',
        },
        {
          id: 't-2',
          author: 'Riley S.',
          title: 'Frontend Shell',
          period: 'Oct 14 - Oct 18',
          submittedAt: now.toLocaleDateString(),
          summary: 'Implemented layout shell with navigation and theme.',
        },
      ],
    };
  }, []);

  return data;
}
