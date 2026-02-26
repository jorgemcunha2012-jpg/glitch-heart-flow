import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const TIKTOK_EVENTS_URL = "https://business-api.tiktok.com/open_api/v1.3/event/track/";

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const PIXEL_ID = Deno.env.get('TIKTOK_ADS_ID');
  if (!PIXEL_ID) {
    return new Response(JSON.stringify({ error: 'TIKTOK_ADS_ID not configured' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const ACCESS_TOKEN = Deno.env.get('TIKTOK_ADS_TOKEN');
  if (!ACCESS_TOKEN) {
    return new Response(JSON.stringify({ error: 'TIKTOK_ADS_TOKEN not configured' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const { event, event_id, properties, ttclid, page_url, page_referrer } = await req.json();

    if (!event) {
      return new Response(JSON.stringify({ error: 'Missing event name' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Build user object with all attribution signals
    const user: Record<string, unknown> = {
      ip: req.headers.get('x-forwarded-for') || req.headers.get('cf-connecting-ip') || '',
      user_agent: req.headers.get('user-agent') || '',
    };

    // ttclid is critical for TikTok attribution
    if (ttclid) {
      user.ttclid = ttclid;
    }

    const eventData: Record<string, unknown> = {
      event,
      event_id: event_id || crypto.randomUUID(),
      event_time: Math.floor(Date.now() / 1000),
      user,
    };

    // Add page context
    if (page_url) {
      eventData.page = {
        url: page_url,
        ...(page_referrer && { referrer: page_referrer }),
      };
    }

    if (properties) {
      eventData.properties = properties;
    }

    const payload = {
      event_source: "web",
      event_source_id: PIXEL_ID,
      data: [eventData],
    };

    console.log("Sending TikTok event:", JSON.stringify(payload));

    const response = await fetch(TIKTOK_EVENTS_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Access-Token': ACCESS_TOKEN,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok || data.code !== 0) {
      console.error(`TikTok Events API error [${response.status}]:`, data);
      throw new Error(`TikTok API error [${response.status}]: ${JSON.stringify(data)}`);
    }

    console.log(`TikTok event "${event}" tracked successfully:`, data);

    return new Response(JSON.stringify({ success: true, event, data }), {
      status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: unknown) {
    console.error("Error tracking TikTok event:", error);
    const msg = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: msg }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
