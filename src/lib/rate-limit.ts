import { LRUCache } from "lru-cache";
import { NextResponse } from "next/server";

const tokenCache = new LRUCache({
    max: 500,
    ttl: 60 * 1000, // 1 minute window
});

export function rateLimit(ip: string, limit: number = 10) {
    const tokenCount = (tokenCache.get(ip) as number[]) || [0];
    const currentUsage = tokenCount[0];

    if (currentUsage >= limit) {
        return { success: false, limit, remaining: 0 };
    }

    tokenCache.set(ip, [currentUsage + 1]);
    return { success: true, limit, remaining: limit - (currentUsage + 1) };
}
