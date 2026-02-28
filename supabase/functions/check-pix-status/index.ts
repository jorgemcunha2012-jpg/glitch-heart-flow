import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const PARADISE_QUERY_URL = "https://multi.paradisepags.com/api/v1/query.php";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const PARADISE_API_KEY = Deno.env.get("PARADISE_API_KEY");
    if (!PARADISE_API_KEY) {
      throw new Error("PARADISE_API_KEY is not configured");
    }

    const { transaction_id } = await req.json();

    if (!transaction_id) {
      return new Response(
        JSON.stringify({ error: "Missing required field: transaction_id" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const url = `${PARADISE_QUERY_URL}?action=get_transaction&id=${transaction_id}`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "X-API-Key": PARADISE_API_KEY,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(`Paradise API error [${response.status}]: ${JSON.stringify(data)}`);
    }

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    console.error("Error checking PIX status:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
