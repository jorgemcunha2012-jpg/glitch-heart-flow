const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { username } = await req.json();

    if (!username) {
      return new Response(
        JSON.stringify({ success: false, error: 'Username is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const cleanUsername = username.replace(/^@/, '').trim();

    console.log('Fetching avatar for:', cleanUsername);

    const response = await fetch(`https://unavatar.io/tiktok/${cleanUsername}?json`, {
      headers: { 'User-Agent': 'TikTok-Avatar-Proxy/1.0' },
    });

    if (!response.ok) {
      console.error('Unavatar error:', response.status);
      return new Response(
        JSON.stringify({ success: true, avatarUrl: null, username: cleanUsername }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    const avatarUrl = data?.url || null;

    console.log('Avatar URL found:', avatarUrl ? 'yes' : 'no');

    return new Response(
      JSON.stringify({ success: true, avatarUrl, username: cleanUsername }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
