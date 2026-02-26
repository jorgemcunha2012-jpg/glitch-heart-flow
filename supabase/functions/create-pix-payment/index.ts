import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const PARADISE_API_URL = "https://multi.paradisepags.com/api/v1/transaction.php";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const PARADISE_API_KEY = Deno.env.get("PARADISE_API_KEY");
    if (!PARADISE_API_KEY) {
      throw new Error("PARADISE_API_KEY is not configured");
    }

    const { amount, description, reference, customer, source, metadata } = await req.json();

    if (!amount || !description || !reference || !customer) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: amount, description, reference, customer" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const body: Record<string, unknown> = {
      amount,
      description,
      reference,
      customer,
      source: source || "api_externa",
      ...(metadata && { metadata }),
    };

    const response = await fetch(PARADISE_API_URL, {
      method: "POST",
      headers: {
        "X-API-Key": PARADISE_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
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
    console.error("Error creating PIX payment:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
