export async function GET() {
  // Données de test pour le développement local
  const now = new Date();
  const mockJourneys = [
    {
      sessionId: 'test-session-1',
      email: null,
      source: 'tiktok',
      medium: 'social',
      campaign: 'système_viral',
      steps: [
        {
          event: 'landing',
          timestamp: new Date(now.getTime() - 3600000).toISOString(),
          page: '/accueil',
          utm_source: 'tiktok',
          utm_medium: 'social',
          utm_campaign: 'système_viral'
        },
        {
          event: 'avatar_click',
          timestamp: new Date(now.getTime() - 3500000).toISOString(),
          page: '/accueil',
          utm_source: 'tiktok',
          utm_medium: 'social',
          utm_campaign: 'système_viral',
          avatar: 'employe-frustre'
        }
      ]
    },
    {
      sessionId: 'test-session-2',
      email: 'test@example.com',
      source: 'instagram',
      medium: 'social',
      campaign: 'système_viral',
      steps: [
        {
          event: 'landing',
          timestamp: new Date(now.getTime() - 7200000).toISOString(),
          page: '/accueil',
          utm_source: 'instagram',
          utm_medium: 'social',
          utm_campaign: 'système_viral'
        },
        {
          event: 'avatar_click',
          timestamp: new Date(now.getTime() - 7100000).toISOString(),
          page: '/accueil',
          utm_source: 'instagram',
          utm_medium: 'social',
          utm_campaign: 'système_viral',
          avatar: 'influenceur-fauche'
        },
        {
          event: 'optin',
          timestamp: new Date(now.getTime() - 7000000).toISOString(),
          page: '/accueil',
          utm_source: 'instagram',
          utm_medium: 'social',
          utm_campaign: 'système_viral',
          email: 'test@example.com'
        }
      ]
    },
    {
      sessionId: 'test-session-3',
      email: 'test2@example.com',
      source: 'email',
      medium: 'email',
      campaign: 'système_viral',
      steps: [
        {
          event: 'landing',
          timestamp: new Date(now.getTime() - 10800000).toISOString(),
          page: '/accueil',
          utm_source: 'email',
          utm_medium: 'email',
          utm_campaign: 'système_viral'
        },
        {
          event: 'avatar_click',
          timestamp: new Date(now.getTime() - 10700000).toISOString(),
          page: '/accueil',
          utm_source: 'email',
          utm_medium: 'email',
          utm_campaign: 'système_viral',
          avatar: 'entrepreneur-invisible'
        },
        {
          event: 'optin',
          timestamp: new Date(now.getTime() - 10600000).toISOString(),
          page: '/accueil',
          utm_source: 'email',
          utm_medium: 'email',
          utm_campaign: 'système_viral',
          email: 'test2@example.com'
        }
      ]
    },
    {
      sessionId: 'test-session-4',
      email: null,
      source: 'youtube',
      medium: 'social',
      campaign: 'système_viral',
      steps: [
        {
          event: 'landing',
          timestamp: new Date(now.getTime() - 5400000).toISOString(),
          page: '/accueil',
          utm_source: 'youtube',
          utm_medium: 'social',
          utm_campaign: 'système_viral'
        }
      ]
    }
  ];

  return new Response(JSON.stringify({ journeys: mockJourneys }), {
    headers: {
      'Content-Type': 'application/json'
    }
  });
}
