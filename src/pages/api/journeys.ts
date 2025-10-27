export async function GET() {
  // Retourner un tableau vide pour forcer l'utilisation des vraies Netlify Functions
  return new Response(JSON.stringify({ journeys: [] }), {
    headers: {
      'Content-Type': 'application/json'
    }
  });
}
