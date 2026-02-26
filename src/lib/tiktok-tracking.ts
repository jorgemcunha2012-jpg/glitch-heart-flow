import { supabase } from "@/integrations/supabase/client";
import { getUtms } from "@/lib/utm";

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
    const utms = getUtms();

    const { data, error } = await supabase.functions.invoke("tiktok-conversion", {
      body: {
        event,
        event_id,
        properties,
        // Attribution data
        ttclid: utms.ttclid || undefined,
        page_url: window.location.href,
        page_referrer: document.referrer || undefined,
      },
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
