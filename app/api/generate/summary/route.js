export async function POST(req) {
  try {
    const body = await req.json();
    const { text } = body || {};
    if (!text || text.trim().length === 0) {
      return new Response(JSON.stringify({ message: 'No text provided' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ message: 'Server misconfiguration: missing API key' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }

    // Use Google's Generative Language (Gemini) endpoint. We'll pass the API key as a query parameter.
    // The exact request shape can vary across versions; this implementation uses a simple prompt wrapper.
    const url = `https://generativelanguage.googleapis.com/v1beta2/models/text-bison-001:generate?key=${apiKey}`;

    const payload = {
      prompt: {
        text: `Summarize the following text in 2-3 short sentences, suitable for a listing preview:\n\n${text}`,
      },
      maxOutputTokens: 180,
      temperature: 0.2,
    };

    const aiRes = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!aiRes.ok) {
      const txt = await aiRes.text();
      return new Response(JSON.stringify({ message: 'AI service error', detail: txt }), { status: 502, headers: { 'Content-Type': 'application/json' } });
    }

    const json = await aiRes.json();

    // Try to extract a reasonable text result from the API response.
    let result = '';
    if (json?.candidates && json.candidates.length > 0) {
      // Some versions return candidates with a 'output' array or 'content' property
      const cand = json.candidates[0];
      if (typeof cand === 'string') result = cand;
      else if (cand?.content) result = cand.content;
      else if (cand?.output && Array.isArray(cand.output)) result = cand.output.map((o) => o?.content || '').join('\n');
      else result = JSON.stringify(cand);
    } else if (json?.output && Array.isArray(json.output)) {
      result = json.output.map((o) => o?.content || '').join('\n');
    } else {
      result = JSON.stringify(json);
    }

    return new Response(JSON.stringify({ result }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (err) {
    console.error('Summary generation error:', err);
    return new Response(JSON.stringify({ message: 'Internal server error' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
