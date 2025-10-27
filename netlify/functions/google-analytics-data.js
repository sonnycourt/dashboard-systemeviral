// Fonction pour récupérer les données Google Analytics
// Property ID: 503555450

const storage = require('./storage.js');

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
    // Récupérer les événements du tracking
    const events = storage.getAllEvents();
    
    // Calculer les stats basées sur nos événements
    const totalEvents = events.length;
    const uniqueSessions = new Set(events.map(e => e.sessionId)).size;
    
    // Filtrer les optins
    const optins = events.filter(e => e.event === 'optin');
    const optinsCount = optins.length;
    
    // Filtrer les purchases
    const purchases = events.filter(e => e.event === 'purchase');
    const purchasesCount = purchases.length;
    
    // Calculer les conversions par source
    const sourceStats = {};
    events.forEach(event => {
      const source = event.utm_source || 'direct';
      if (!sourceStats[source]) {
        sourceStats[source] = { visits: 0, conversions: 0, revenue: 0 };
      }
      sourceStats[source].visits++;
      
      if (event.event === 'optin') {
        sourceStats[source].conversions++;
      }
      
      if (event.event === 'purchase' && event.data?.amount) {
        sourceStats[source].revenue += parseInt(event.data.amount) || 0;
      }
    });
    
    const sources = Object.entries(sourceStats).map(([name, stats]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      visits: stats.visits,
      conversions: stats.conversions,
      revenue: stats.revenue
    }));
    
    // Données en temps réel (last 5 minutes)
    const fiveMinutesAgo = Date.now() - (5 * 60 * 1000);
    const recentEvents = events.filter(e => 
      new Date(e.timestamp).getTime() > fiveMinutesAgo
    );
    const activeUsers = new Set(recentEvents.map(e => e.sessionId)).size;
    
    const gaData = {
      traffic: {
        total: events.length,
        today: uniqueSessions,
        sources: sources
      },
      performance: {
        conversionRate: optinsCount > 0 ? Math.round((purchasesCount / optinsCount) * 100) : 0,
        avgSessionDuration: 180 // En secondes (approximation)
      },
      realTime: {
        activeUsers: activeUsers
      }
    };

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(gaData)
    };

  } catch (error) {
    console.error('Google Analytics data error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error', details: error.message })
    };
  }
};

