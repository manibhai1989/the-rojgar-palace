import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, FileText, Home, Briefcase, Key, GraduationCap, BookOpen, IdCard, Shield, HelpCircle } from "lucide-react";

export const metadata: Metadata = {
    title: "Sitemap | The Job Palace",
    description: "Navigate through all sections of The Job Palace - Jobs, Results, Admit Cards, and more.",
};

const sitemapSections = [
    {
        title: "Main Sections",
        links: [
            { name: "Home", href: "/", icon: Home },
            { name: "Latest Jobs", href: "/jobs", icon: Briefcase },
            { name: "Results", href: "/results", icon: FileText },
            { name: "Admit Cards", href: "/admit-cards", icon: IdCard },
            { name: "Answer Keys", href: "/answer-keys", icon: Key },
            { name: "Syllabus", href: "/syllabus", icon: BookOpen },
            { name: "Admissions", href: "/admissions", icon: GraduationCap },
        ]
    },
    {
        title: "Legal & Support",
        links: [
            { name: "About Us", href: "/about", icon: HelpCircle },
            { name: "Contact Us", href: "/contact", icon: HelpCircle },
            { name: "Privacy Policy", href: "/privacy", icon: Shield },
            { name: "Terms & Conditions", href: "/terms", icon: Shield },
        ]
    }
];

export default function SitemapPage() {
    return (
        <main className="container mx-auto px-4 py-8 max-w-5xl font-sans">
            <h1 className="text-3xl md:text-5xl font-extrabold text-[#AC1E23] dark:text-red-400 mb-8 border-b-4 border-[#AC1E23] pb-4">
                Sitemap
            </h1>

            <div className="grid md:grid-cols-2 gap-8">
                {sitemapSections.map((section) => (
                    <div key={section.title} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
                            <span className="w-2 h-8 bg-amber-500 rounded-full" />
                            {section.title}
                        </h2>
                        <ul className="space-y-4">
                            {section.links.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="flex items-center gap-4 text-lg font-medium text-slate-600 dark:text-slate-300 hover:text-[#AC1E23] dark:hover:text-red-400 group transition-colors"
                                    >
                                        <div className="h-10 w-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center group-hover:bg-[#AC1E23] group-hover:text-white transition-all">
                                            <link.icon className="h-5 w-5" />
                                        </div>
                                        {link.name}
                                        <ArrowRight className="h-4 w-4 ml-auto opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>

            <div className="mt-12 bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded-xl p-8 text-center">
                <h3 className="text-xl font-bold text-blue-800 dark:text-blue-300 mb-2">Looking for XML Sitemap?</h3>
                <p className="text-blue-600 dark:text-blue-400 mb-4">Our XML Sitemap for search engines and crawlers is available here.</p>
                <Link
                    href="/sitemap.xml"
                    target="_blank"
                    rel="noopener noreferrer"
                    prefetch={false}
                    className="inline-flex items-center justify-center px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold transition-colors"
                >
                    View XML Sitemap
                </Link>
            </div>
        </main>
    );
}
