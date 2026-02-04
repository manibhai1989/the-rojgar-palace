import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: "SarkariResultHub",
        short_name: "SarkariResult",
        description: "Your trusted platform for government job notifications, admit cards, and results.",
        start_url: "/",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#ff9933",
        icons: [
            {
                src: "/icon-192x192.png",
                sizes: "192x192",
                type: "image/png",
            },
            {
                src: "/icon-512x512.png",
                sizes: "512x512",
                type: "image/png",
            },
            {
                src: "/apple-touch-icon.png",
                sizes: "180x180",
                type: "image/png",
            },
        ],
    };
}
