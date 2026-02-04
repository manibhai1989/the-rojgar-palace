import type { Metadata } from "next";
import { Outfit, Noto_Sans_Devanagari } from "next/font/google"; // Changed Inter to Outfit

import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { WebVitals } from "@/components/performance/web-vitals";
import { cn } from "@/lib/utils";
import { LanguageProvider } from "@/contexts/language-context";
import { AccessibilityControls } from "@/components/a11y/accessibility-controls";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { MobileNav } from "@/components/layout/mobile-nav";
import { SmartProgressBar } from "@/components/ui/smart-progress-bar";
import { Providers } from "./providers";
import { WhatsAppFloat } from "@/components/ui/whatsapp-float";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";
import { CookieConsent } from "@/components/legal/CookieConsent";

const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });
const notoDevanagari = Noto_Sans_Devanagari({
  subsets: ["devanagari"],
  variable: "--font-noto-sans-devanagari",
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://therojgarpalace.in'),
  title: {
    default: "The Rojgar Palace | No.1 Govt Job Portal",
    template: "%s | The Rojgar Palace"
  },
  description: "The Rojgar Palace - Your trusted destination for latest government jobs, results, admit cards, and exam updates in India. Get instant notifications for UPSC, SSC, Banking, Railways, and more.",
  keywords: ["Govt Jobs", "Sarkari Result", "Admit Card", "Latest Jobs", "UPSC", "SSC", "Banking Jobs", "Railway Jobs", "Sarkari Naukri"],
  authors: [{ name: "The Rojgar Palace" }],
  creator: "The Rojgar Palace",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://therojgarpalace.in",
    siteName: "The Rojgar Palace",
    title: "The Rojgar Palace | No.1 Govt Job Portal",
    description: "Your trusted destination for latest government jobs, results, admit cards, and exam updates in India.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "The Rojgar Palace",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "The Rojgar Palace | No.1 Govt Job Portal",
    description: "Latest Government Jobs, Results, and Admit Cards.",
    images: ["/og-image.png"],
    creator: "@the_rojgarpalace",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};


// ... previous imports

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={cn(
          "min-h-screen font-sans antialiased text-base md:text-lg",
          outfit.variable,
          notoDevanagari.variable
        )}
      >
        <GoogleAnalytics />
        <Providers>
          {/* ... existing provider content ... */}
          <LanguageProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
              themes={["light", "dark", "modern"]}
            >
              <div className="relative flex min-h-screen flex-col">
                <SmartProgressBar />
                <Header />
                <main className="flex-1 container mx-auto px-4 py-4">
                  <Breadcrumbs className="mb-4" />
                  {children}
                </main>
                <Footer />
                <MobileNav />
                <Toaster />
                <WebVitals />
                <AccessibilityControls />
                <WhatsAppFloat />
                <CookieConsent />
              </div>
            </ThemeProvider>
          </LanguageProvider>
        </Providers>
      </body>
    </html>
  );
}
