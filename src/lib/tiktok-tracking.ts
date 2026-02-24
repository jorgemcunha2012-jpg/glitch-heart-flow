import { supabase } from "@/integrations/supabase/client";

type TikTokEvent =
  | "ViewContent"
  | "InitiateCheckout"
  | "AddPaymentInfo"
  | "CompletePayment"
  | "SubmitForm";

interface TrackOptions {
  event: TikTokEvent;
  event_id?: string;
  properties?: Record<string, unknown>;
}

export async function trackTikTokEvent({ event, event_id, properties }: TrackOptions) {
  try {
    const { data, error } = await supabase.functions.invoke("tiktok-conversion", {
      body: { event, event_id, properties },
    });

    if (error) {
      console.warn(`TikTok tracking error for "${event}":`, error);
      return null;
    }

    console.log(`TikTok event "${event}" sent`);
    return data;
  } catch (err) {
    console.warn("TikTok tracking failed silently:", err);
    return null;
  }
}
