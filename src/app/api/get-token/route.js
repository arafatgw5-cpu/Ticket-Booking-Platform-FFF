import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(req) {
    try {
        // Get the current Better Auth session using headers
        const session = await auth.api.getSession({
            headers: await headers()
        });

        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Call the Express backend to get a JWT token
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/jwt`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: session.user.email })
        });

        if (!response.ok) {
            return NextResponse.json({ error: "Failed to generate token" }, { status: response.status });
        }

        const data = await response.json();
        return NextResponse.json({ token: data.token });
    } catch (error) {
        console.error("Token generation error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
