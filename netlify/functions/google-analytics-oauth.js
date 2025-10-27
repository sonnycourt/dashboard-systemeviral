// Google Analytics OAuth Flow
// Property ID: 503555450

// Import du module Google Auth
const { GoogleAuth } = require('google-auth-library');
const fetch = require('node-fetch');

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

  try {
    // Récupérer les credentials depuis les variables d'environnement
    const credentials = {
      type: "service_account",
      project_id: process.env.GA_PROJECT_ID,
      private_key_id: process.env.GA_PRIVATE_KEY_ID,
      private_key: process.env.GA_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      client_email: process.env.GA_CLIENT_EMAIL,
      client_id: process.env.GA_CLIENT_ID,
      auth_uri: "https://accounts.google.com/o/oauth2/auth",
      token_uri: "https://oauth2.googleapis.com/token"
    };

    if (!credentials.project_id || !credentials.private_key) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ 
          error: 'Missing Google Analytics credentials',
          message: 'Please configure GA credentials in Netlify environment variables'
        })
      };
    }

    // Authentifier avec Google
    const auth = new GoogleAuth({
      credentials: credentials,
      scopes: ['https://www.googleapis.com/auth/analytics.readonly']
    });

    const client = await auth.getClient();
    
    // Property ID
    const propertyId = '503555450';
    
    // Récupérer les données de la dernière semaine
    const startDate = '7daysAgo';
    const endDate = 'today';
    
    // Call à l'API Google Analytics
    const url = `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${await client.getAccessToken()}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        dateRanges: [{ startDate, endDate }],
        dimensions: [{ name: 'source' }],
        metrics: [
          { name: 'sessions' },
          { name: 'conversions' },
          { name: 'totalRevenue' }
        ]
      })
    });

    const data = await response.json();

    // Formater les données
    const sessions = data.rows?.reduce((sum, row) => sum + parseInt(row.metricValues[0].value), 0) || 0;
    const conversions = data.rows?.reduce((sum, row) => sum + parseInt(row.metricValues[1].value), 0) || 0;
    const revenue = data.rows?.reduce((sum, row) => sum + parseFloat(row.metricValues[2].value || 0), 0) || 0;

    const gaData = {
      traffic: {
        total: sessions,
        today: sessions, // Approximation pour aujourd'hui
        sources: data.rows?.map(row => ({
          name: row.dimensionValues[0].value || 'direct',
          visits: parseInt(row.metricValues[0].value) || 0,
          conversions: parseInt(row.metricValues[1].value) || 0,
          revenue: parseFloat(row.metricValues[2].value || 0) || 0
        })) || []
      },
      performance: {
        conversionRate: sessions > 0 ? Math.round((conversions / sessions) * 100) : 0,
        avgSessionDuration: 180 // À calculer depuis GA
      },
      realTime: {
        activeUsers: sessions // Approximation
      }
    };

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(gaData)
    };

  } catch (error) {
    console.error('Google Analytics OAuth error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Google Analytics connection failed',
        details: error.message
      })
    };
  }
};

