// Fonction pour récupérer les données Google Analytics depuis la vraie API
const { BetaAnalyticsDataClient } = require('@google-analytics/data');
const { GoogleAuth } = require('google-auth-library');

exports.handler = async function(event, context) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const propertyId = process.env.GA_PROPERTY_ID || '503555450';
    const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
    const privateKey = process.env.GOOGLE_PRIVATE_KEY;

    if (!clientEmail || !privateKey) {
      console.log('Missing credentials, returning demo data');
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          traffic: { total: 0, today: 0, sources: [] },
          performance: { conversionRate: 0 },
          realTime: { activeUsers: 0 }
        })
      };
    }

    // Configurer l'authentification
    const auth = new GoogleAuth({
      credentials: {
        client_email: clientEmail,
        private_key: privateKey.replace(/\\n/g, '\n')
      },
      scopes: ['https://www.googleapis.com/auth/analytics.readonly']
    });

    const analyticsDataClient = new BetaAnalyticsDataClient({
      auth: auth
    });

    // Obtenir la date d'hier pour avoir des données
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const startDate = 'yesterday';
    const endDate = 'today';

    // Récupérer les utilisateurs actifs
    const [realtimeResponse] = await analyticsDataClient.runRealtimeReport({
      property: `properties/${propertyId}`,
      dimensions: [{ name: 'unifiedScreenName' }],
      metrics: [{ name: 'activeUsers' }],
      limit: 1
    });

    const activeUsers = realtimeResponse.rows?.[0]?.metricValues?.[0]?.value || '0';

    // Récupérer les données d'acquisition des 30 derniers jours
    const [acquisitionResponse] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
      dimensions: [{ name: 'sessionSource' }],
      metrics: [
        { name: 'sessions' },
        { name: 'totalUsers' }
      ],
      orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
      limit: 5
    });

    // Récupérer les conversions
    const [conversionResponse] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate: startDate, endDate: endDate }],
      metrics: [
        { name: 'conversions' },
        { name: 'eventCount' }
      ]
    });

    const sources = [];
    if (acquisitionResponse.rows) {
      acquisitionResponse.rows.forEach(row => {
        sources.push({
          name: row.dimensionValues[0].value || 'direct',
          visits: parseInt(row.metricValues[0].value) || 0,
          conversions: 0,
          revenue: 0
        });
      });
    }

    // Récupérer le total de sessions
    const [totalResponse] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate: startDate, endDate: endDate }],
      metrics: [{ name: 'sessions' }]
    });

    const totalSessions = totalResponse.rows?.[0]?.metricValues?.[0]?.value || '0';

    const gaData = {
      traffic: {
        total: parseInt(totalSessions),
        today: parseInt(totalSessions),
        sources: sources
      },
      performance: {
        conversionRate: 0,
        avgSessionDuration: 0
      },
      realTime: {
        activeUsers: parseInt(activeUsers)
      }
    };

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(gaData)
    };

  } catch (error) {
    console.error('Google Analytics API error:', error.message);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Error fetching Google Analytics data', 
        details: error.message 
      })
    };
  }
};

