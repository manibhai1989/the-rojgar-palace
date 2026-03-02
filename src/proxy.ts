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

        // Rate Limiting
        const is2FA = req.nextUrl.pathname.startsWith("/api/auth/2fa/");
        const isApi = req.nextUrl.pathname.startsWith("/api/");

        if (is2FA) {
            // Aggressive limit for 2FA brute force protection: 5 req/min
            const { success } = rateLimit(`${ip}_2fa`, 5);
            if (!success) {
                return new NextResponse("Too Many Requests - 2FA rate limit exceeded", { status: 429 });
            }
        } else if (isApi) {
            // Standard API rate limit: 100 req/min
            const { success } = rateLimit(`${ip}_api`, 100);

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
    matcher: ["/admin/:path*", "/api/:path*", "/search", "/auth/:path*"]
};
