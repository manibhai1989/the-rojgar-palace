"use client";

import { useReportWebVitals } from "next/web-vitals";

export function WebVitals() {
    useReportWebVitals((metric) => {
        // Log to console in development
        if (process.env.NODE_ENV === "development") {
            console.log(metric);
        }

        // Send to analytics endpoint (e.g., Vercel Analytics or Google Analytics)
        // const body = JSON.stringify(metric);
        // if (navigator.sendBeacon) {
        //   navigator.sendBeacon('/api/analytics', body);
        // }
    });

    return null;
}
