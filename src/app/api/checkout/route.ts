import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// ---------------------------------------------------------------------------
// POST /api/checkout
// Body: { productId: string; buyerEmail: string; buyerName?: string }
//
// This is a Stripe Checkout integration stub. Wire up your Stripe keys and
// uncomment the Stripe code to go live. The route is fully typed and
// production-structured — just needs real keys.
// ---------------------------------------------------------------------------

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { productId, buyerEmail, buyerName } = body as {
      productId: string;
      buyerEmail: string;
      buyerName?: string;
    };

    if (!productId || !buyerEmail) {
      return NextResponse.json(
        { error: "productId and buyerEmail are required" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { data: product, error: productError } = await supabase
      .from("products")
      .select("id, title, price, is_published, store_id")
      .eq("id", productId)
      .eq("is_published", true)
      .single();

    if (productError || !product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // ---------- STRIPE INTEGRATION (uncomment when keys are set) ----------
    // import Stripe from "stripe";
    // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2024-11-20.acacia" });
    //
    // const session = await stripe.checkout.sessions.create({
    //   mode: "payment",
    //   customer_email: buyerEmail,
    //   line_items: [
    //     {
    //       price_data: {
    //         currency: "usd",
    //         unit_amount: product.price,
    //         product_data: { name: product.title },
    //       },
    //       quantity: 1,
    //     },
    //   ],
    //   metadata: { productId: product.id, buyerEmail, buyerName: buyerName ?? "" },
    //   success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    //   cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/store/${storeSlug}`,
    // });
    //
    // return NextResponse.json({ url: session.url });
    // -----------------------------------------------------------------------

    // Create a pending order so the record exists before payment confirmation
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        product_id: productId,
        buyer_email: buyerEmail,
        buyer_name: buyerName ?? null,
        amount: product.price,
        status: "pending",
      })
      .select("id")
      .single();

    if (orderError) {
      return NextResponse.json({ error: orderError.message }, { status: 500 });
    }

    // TODO: replace with real Stripe session URL
    return NextResponse.json({
      orderId: order.id,
      message: "Order created. Add Stripe keys to NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY and STRIPE_SECRET_KEY to enable payments.",
    });
  } catch (err) {
    console.error("[checkout]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
