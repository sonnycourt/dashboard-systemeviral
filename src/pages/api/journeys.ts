export async function GET() {
  // Données de test pour le développement local
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
          timestamp: new Date().toISOString(),
          page: '/accueil',
          utm_source: 'tiktok',
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
