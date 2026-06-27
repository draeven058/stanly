import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// ---------------------------------------------------------------------------
// POST /api/webhooks/stripe
// Stripe sends events here after payment. Register this URL in the Stripe
// dashboard: Developers → Webhooks → Add endpoint.
//
// Required events to listen for:
//   - checkout.session.completed
//   - checkout.session.expired
//   - charge.refunded
// ---------------------------------------------------------------------------

export async function POST(request: Request) {
  const body = await request.text();
  const sig = request.headers.get("stripe-signature");

  // ---------- STRIPE WEBHOOK VERIFICATION (uncomment when keys are set) ----------
  // import Stripe from "stripe";
  // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2024-11-20.acacia" });
  //
  // let event: Stripe.Event;
  // try {
  //   event = stripe.webhooks.constructEvent(body, sig!, process.env.STRIPE_WEBHOOK_SECRET!);
  // } catch (err) {
  //   return NextResponse.json({ error: "Webhook signature verification failed" }, { status: 400 });
  // }
  //
  // switch (event.type) {
  //   case "checkout.session.completed": {
  //     const session = event.data.object as Stripe.Checkout.Session;
  //     await fulfillOrder(session);
  //     break;
  //   }
  //   case "charge.refunded": {
  //     const charge = event.data.object as Stripe.Charge;
  //     await refundOrder(charge.payment_intent as string);
  //     break;
  //   }
  // }
  // -------------------------------------------------------------------------------

  return NextResponse.json({ received: true });
}

async function fulfillOrder(session: {
  metadata?: Record<string, string>;
  id: string;
  customer_email?: string | null;
}) {
  const supabase = await createClient();
  const { productId, buyerEmail, buyerName } = session.metadata ?? {};

  if (!productId) return;

  await supabase
    .from("orders")
    .update({ status: "completed", stripe_session_id: session.id })
    .eq("product_id", productId)
    .eq("buyer_email", buyerEmail ?? session.customer_email ?? "")
    .eq("status", "pending");

  // TODO: send delivery email with download link
  // await sendDeliveryEmail({ buyerEmail, buyerName, productId });
}

async function refundOrder(paymentIntentId: string) {
  const supabase = await createClient();
  await supabase
    .from("orders")
    .update({ status: "refunded" })
    .eq("stripe_session_id", paymentIntentId);
}
