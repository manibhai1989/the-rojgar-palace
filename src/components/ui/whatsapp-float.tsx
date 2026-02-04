"use client";

import { MessageCircle } from "lucide-react";
import { motion } from "framer-motion";

export function WhatsAppFloat() {
    const phoneNumber = "1234567890"; // Replace with your WhatsApp number
    const message = "Hello! I found your website and would like to get in touch.";

    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

    return (
        <motion.a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-6 right-6 z-50 group"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
                type: "spring",
                stiffness: 260,
                damping: 20,
                delay: 1
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
        >
            {/* Pulse Animation Ring */}
            <span className="absolute inset-0 animate-ping rounded-full bg-green-500/40" />

            {/* Main Button */}
            <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-green-600 shadow-2xl shadow-green-500/50 transition-all duration-300 group-hover:shadow-green-500/70 group-hover:from-green-400 group-hover:to-green-500">
                <MessageCircle className="h-7 w-7 text-white" strokeWidth={2.5} />
            </div>

            {/* Tooltip */}
            <span className="absolute right-16 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white opacity-0 shadow-xl transition-opacity duration-300 group-hover:opacity-100">
                Chat with us on WhatsApp
                <span className="absolute right-0 top-1/2 h-0 w-0 -translate-y-1/2 translate-x-full border-8 border-transparent border-l-slate-900" />
            </span>
        </motion.a>
    );
}
