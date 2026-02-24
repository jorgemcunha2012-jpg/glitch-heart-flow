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

    const apiKey = Deno.env.get('FIRECRAWL_API_KEY');
    if (!apiKey) {
      return new Response(
        JSON.stringify({ success: false, error: 'Firecrawl not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const cleanUsername = username.replace(/^@/, '').trim();
    const tiktokUrl = `https://www.tiktok.com/@${cleanUsername}`;

    console.log('Scraping TikTok profile:', tiktokUrl);

    const response = await fetch('https://api.firecrawl.dev/v1/scrape', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: tiktokUrl,
        formats: ['html'],
        waitFor: 3000,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Firecrawl error:', data);
      return new Response(
        JSON.stringify({ success: false, error: 'Failed to scrape profile' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const html = data?.data?.html || data?.html || '';
    
    // Try multiple patterns to find the avatar URL
    let avatarUrl = '';
    
    // Pattern 1: og:image meta tag (usually the profile picture)
    const ogMatch = html.match(/<meta[^>]*property="og:image"[^>]*content="([^"]+)"/i) 
      || html.match(/<meta[^>]*content="([^"]+)"[^>]*property="og:image"/i);
    if (ogMatch) {
      avatarUrl = ogMatch[1];
    }

    // Pattern 2: Look for avatar image in common TikTok patterns
    if (!avatarUrl) {
      const avatarMatch = html.match(/https:\/\/p\d+-sign[^"'\s]+?\/tos-[^"'\s]+?-avt[^"'\s]+/i);
      if (avatarMatch) {
        avatarUrl = avatarMatch[0];
      }
    }

    // Pattern 3: Any tiktokcdn avatar URL
    if (!avatarUrl) {
      const cdnMatch = html.match(/(https:\/\/[^"'\s]*tiktokcdn[^"'\s]*avt[^"'\s]*)/i);
      if (cdnMatch) {
        avatarUrl = cdnMatch[1];
      }
    }

    console.log('Avatar URL found:', avatarUrl ? 'yes' : 'no');

    return new Response(
      JSON.stringify({ 
        success: true, 
        avatarUrl: avatarUrl || null,
        username: cleanUsername,
      }),
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
