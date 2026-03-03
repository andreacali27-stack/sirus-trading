export default {
  async fetch(request, env) {
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Content-Type': 'application/json'
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ error: { message: 'Metodo non supportato' } }), 
        { status: 405, headers: corsHeaders });
    }

    const apiKey = env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({
        error: { message: 'ANTHROPIC_API_KEY non trovata nelle variabili del Worker.' }
      }), { status: 500, headers: corsHeaders });
    }

    let body;
    try {
      body = await request.json();
    } catch(e) {
      return new Response(JSON.stringify({ error: { message: 'Richiesta non valida: ' + e.message } }), 
        { status: 400, headers: corsHeaders });
    }

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify(body)
      });

      const text = await response.text();

      if (!text || text.trim() === '') {
        return new Response(JSON.stringify({ error: { message: 'Anthropic ha restituito risposta vuota.' } }), 
          { status: 502, headers: corsHeaders });
      }

      return new Response(text, { status: response.status, headers: corsHeaders });

    } catch (err) {
      return new Response(JSON.stringify({ error: { message: 'Errore: ' + err.message } }), 
        { status: 500, headers: corsHeaders });
    }
  }
};
