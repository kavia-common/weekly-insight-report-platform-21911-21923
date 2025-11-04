import { useMemo } from 'react';

/**
 * PUBLIC_INTERFACE
 * useMockInsights returns placeholder AI insights to scaffold the Insights page ahead of backend integration.
 */
export function useMockInsights() {
  const data = useMemo(() => {
    return {
      summary: {
        sentiment: 'Positive',
        sentimentConfidence: 82,
        blockersCount: 3,
        themes: [
          { name: 'Delivery', count: 14 },
          { name: 'Collaboration', count: 11 },
          { name: 'Roadblocks', count: 7 },
        ],
        highlights: [
          'Frontend MVP shipped ahead of schedule',
          'API stability improved; reduced error rates by 35%',
          'Cross-team pairing increased velocity on core features',
        ],
      },
      trendsSeries: [
        { label: 'Wk 37', value: 8 },
        { label: 'Wk 38', value: 11 },
        { label: 'Wk 39', value: 9 },
        { label: 'Wk 40', value: 13 },
        { label: 'Wk 41', value: 12 },
        { label: 'Wk 42', value: 15 },
      ],
      groups: [
        {
          title: 'Top Themes',
          subtitle: 'Keywords and topics detected',
          items: [
            'Delivery: frequent mentions of release milestones and timelines.',
            'Collaboration: positive notes on design-dev sync efficiency.',
            'Roadblocks: environment setup inconsistencies reported.',
          ],
        },
        {
          title: 'Risks / Blockers',
          subtitle: 'Potential impediments to delivery',
          items: [
            'CI flakiness during peak hours increases cycle time.',
            'Onboarding delays due to environment provisioning.',
            'Limited access to staging data impacts testing fidelity.',
          ],
        },
        {
          title: 'Kudos & Highlights',
          subtitle: 'Wins and acknowledgements',
          items: [
            'Team Alpha reduced bug backlog by 22%.',
            'Successful stakeholder demo with positive feedback.',
            'Improved release notes clarity reduced support tickets.',
          ],
        },
        {
          title: 'Recommended Actions',
          subtitle: 'AI-suggested next steps',
          items: [
            'Harden CI runners and cache dependencies.',
            'Automate environment bootstrap scripts.',
            'Expand staging dataset with synthetic records.',
          ],
        },
      ],
    };
  }, []);

  return data;
}
