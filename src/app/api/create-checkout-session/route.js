import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import { auth } from "@/lib/auth";

export async function POST(request) {
  try {
    const headersList = await headers();
    const origin = headersList.get("origin") || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const userSession = await auth.api.getSession({
      headers: await headers(),
    });

    const user = userSession?.user;
    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { price, title, bookingId } = await request.json();

    const session = await stripe.checkout.sessions.create({
      customer_email: user?.email,
      line_items: [
        {
          price_data: {
            currency: "usd",
            unit_amount: Math.round(Number(price) * 100),
            product_data: {
                name: title,
            }
          },
          quantity: 1,
        },
      ],
      metadata: {
        price: Number(price),
        userId: user.id,
        userEmail: user.email,
        title,
        bookingId,
      },
      mode: "payment",
      success_url: `${origin}/payment-success?session_id={CHECKOUT_SESSION_ID}&booking_id=${bookingId}&amount=${price}&title=${encodeURIComponent(title)}&email=${encodeURIComponent(user.email)}`,
      cancel_url: `${origin}/dashboard/bookings`,
    });
    
    return NextResponse.json({ url: session.url });
  } catch (err) {
    return NextResponse.json(
      { error: err.message },
      { status: err.statusCode || 500 },
    );
  }
}
