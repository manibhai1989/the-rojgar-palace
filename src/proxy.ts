import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { rateLimit } from "@/lib/rate-limit";

export default withAuth(
    function middleware(req) {
        const ip = req.headers.get("x-forwarded-for") || "unknown";

        // Maintenance Mode Check
        if (process.env.MAINTENANCE_MODE === "true" && !req.nextUrl.pathname.startsWith("/maintenance")) {
            return NextResponse.rewrite(new URL("/maintenance", req.url));
        }

        // Rate Limiting for API routes
        if (req.nextUrl.pathname.startsWith("/api/")) {
            const { success, limit, remaining } = rateLimit(ip, 100); // 100 req/min

            if (!success) {
                return new NextResponse("Too Many Requests", { status: 429 });
            }
        }

        // Security Headers
        const response = NextResponse.next();
        response.headers.set("X-Frame-Options", "DENY");
        response.headers.set("X-Content-Type-Options", "nosniff");
        response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
        response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
        response.headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");

        return response;
    },
    {
        callbacks: {
            authorized: ({ token }) => !!token,
        },
        pages: {
            signIn: "/auth/signin",
        }
    }
);

export const config = {
    matcher: ["/admin/:path*", "/api/admin/:path*"]
};
