import { Suspense } from "react";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, Briefcase, FileText, IdCard, Key, BookOpen, GraduationCap } from "lucide-react";
import { redirect } from "next/navigation";

interface SearchPageProps {
    searchParams: Promise<{ q?: string }>;
}

// Security: Input validation and sanitization
function sanitizeSearchQuery(input: string): string | null {
    // Remove leading/trailing whitespace
    const trimmed = input.trim();

    // Validate length (prevent DoS attacks with extremely long queries)
    if (trimmed.length === 0) return null;
    if (trimmed.length > 100) return null; // Max 100 characters

    // Remove potentially dangerous characters (prevent injection attacks)
    // Allow: letters, numbers, spaces, hyphens, apostrophes
    const sanitized = trimmed.replace(/[^\w\s\-']/g, '');

    // Prevent queries that are only special characters
    if (sanitized.length === 0) return null;

    // Prevent SQL-like keywords (defense in depth, Prisma already protects)
    const dangerousPatterns = /(\bDROP\b|\bDELETE\b|\bUPDATE\b|\bINSERT\b|\bEXEC\b|\bSCRIPT\b)/gi;
    if (dangerousPatterns.test(sanitized)) return null;

    return sanitized;
}

// Security: Escape HTML to prevent XSS
function escapeHtml(text: string): string {
    const map: { [key: string]: string } = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, (m) => map[m]);
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
    const { q } = await searchParams;
    const rawQuery = q || "";

    // Security: Validate and sanitize input
    const sanitizedQuery = sanitizeSearchQuery(rawQuery);

    // If query is invalid or malicious, redirect to search page
    if (rawQuery && !sanitizedQuery) {
        redirect('/search');
    }

    if (!sanitizedQuery) {
        return (
            <main className="container mx-auto px-4 py-16">
                <div className="text-center">
                    <Search className="h-16 w-16 mx-auto text-slate-400 mb-4" />
                    <h1 className="text-3xl font-bold mb-2">Search</h1>
                    <p className="text-slate-400">Enter a search query to find jobs, results, and more</p>
                </div>
            </main>
        );
    }

    try {
        // Security: Set query timeout to prevent DoS
        // Search across all tables with parameterized queries (Prisma handles this)
        const searchPromise = Promise.all([
            prisma.job.findMany({
                where: {
                    OR: [
                        { title: { contains: sanitizedQuery, mode: 'insensitive' } },
                        { organization: { contains: sanitizedQuery, mode: 'insensitive' } },
                        { category: { contains: sanitizedQuery, mode: 'insensitive' } },
                    ],
                },
                take: 10, // Limit results to prevent resource exhaustion
            }),
            prisma.result.findMany({
                where: {
                    OR: [
                        { title: { contains: sanitizedQuery, mode: 'insensitive' } },
                        { organization: { contains: sanitizedQuery, mode: 'insensitive' } },
                    ],
                },
                take: 10,
            }),
            prisma.admitCard.findMany({
                where: {
                    OR: [
                        { title: { contains: sanitizedQuery, mode: 'insensitive' } },
                        { organization: { contains: sanitizedQuery, mode: 'insensitive' } },
                    ],
                },
                take: 10,
            }),
            prisma.answerKey.findMany({
                where: {
                    OR: [
                        { title: { contains: sanitizedQuery, mode: 'insensitive' } },
                        { organization: { contains: sanitizedQuery, mode: 'insensitive' } },
                    ],
                },
                take: 10,
            }),
            prisma.syllabus.findMany({
                where: {
                    OR: [
                        { title: { contains: sanitizedQuery, mode: 'insensitive' } },
                        { organization: { contains: sanitizedQuery, mode: 'insensitive' } },
                    ],
                },
                take: 10,
            }),
            prisma.admission.findMany({
                where: {
                    OR: [
                        { title: { contains: sanitizedQuery, mode: 'insensitive' } },
                        { organization: { contains: sanitizedQuery, mode: 'insensitive' } },
                    ],
                },
                take: 10,
            }),
        ]);

        // Security: Timeout after 5 seconds to prevent resource exhaustion
        const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Search timeout')), 5000)
        );

        const [jobs, results, admitCards, answerKeys, syllabus, admissions] = await Promise.race([
            searchPromise,
            timeoutPromise
        ]) as [any[], any[], any[], any[], any[], any[]];

        const totalResults = jobs.length + results.length + admitCards.length + answerKeys.length + syllabus.length + admissions.length;

        // Security: Escape query for display to prevent XSS
        const displayQuery = escapeHtml(sanitizedQuery);

        return (
            <main className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">Search Results</h1>
                    <p className="text-slate-400">
                        Found {totalResults} results for &quot;{displayQuery}&quot;
                    </p>
                </div>

                <div className="space-y-8">
                    {/* Jobs */}
                    {jobs.length > 0 && (
                        <section>
                            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                                <Briefcase className="h-6 w-6 text-blue-400" />
                                Jobs ({jobs.length})
                            </h2>
                            <div className="grid gap-4">
                                {jobs.map((job) => (
                                    <Card key={job.id} className="bg-slate-900/50 border-white/10">
                                        <CardHeader>
                                            <CardTitle>
                                                <Link href={`/jobs/${job.slug}`} className="hover:text-blue-400 transition-colors">
                                                    {job.title}
                                                </Link>
                                            </CardTitle>
                                            <p className="text-sm text-slate-400">{job.organization}</p>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-sm text-slate-300 mb-2">{job.shortInfo}</p>
                                            <Link href={`/jobs/${job.slug}`}>
                                                <Button size="sm" variant="outline">View Details</Button>
                                            </Link>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Results */}
                    {results.length > 0 && (
                        <section>
                            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                                <FileText className="h-6 w-6 text-emerald-400" />
                                Results ({results.length})
                            </h2>
                            <div className="grid gap-4">
                                {results.map((result) => (
                                    <Card key={result.id} className="bg-slate-900/50 border-white/10">
                                        <CardContent className="p-4">
                                            <h3 className="font-semibold mb-1">{result.title}</h3>
                                            <p className="text-sm text-slate-400 mb-2">{result.organization}</p>
                                            <a href={result.link} target="_blank" rel="noopener noreferrer">
                                                <Button size="sm" variant="outline">View Result</Button>
                                            </a>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Admit Cards */}
                    {admitCards.length > 0 && (
                        <section>
                            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                                <IdCard className="h-6 w-6 text-orange-400" />
                                Admit Cards ({admitCards.length})
                            </h2>
                            <div className="grid gap-4">
                                {admitCards.map((card) => (
                                    <Card key={card.id} className="bg-slate-900/50 border-white/10">
                                        <CardContent className="p-4">
                                            <h3 className="font-semibold mb-1">{card.title}</h3>
                                            <p className="text-sm text-slate-400 mb-2">{card.organization}</p>
                                            <a href={card.link} target="_blank" rel="noopener noreferrer">
                                                <Button size="sm" variant="outline">Download</Button>
                                            </a>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </section>
                    )}

                    {totalResults === 0 && (
                        <div className="text-center py-16">
                            <Search className="h-16 w-16 mx-auto text-slate-400 mb-4" />
                            <h2 className="text-2xl font-bold mb-2">No results found</h2>
                            <p className="text-slate-400">Try searching with different keywords</p>
                        </div>
                    )}
                </div>
            </main>
        );
    } catch (error) {
        // Security: Don't expose internal errors to users
        console.error('Search error:', error);
        return (
            <main className="container mx-auto px-4 py-16">
                <div className="text-center">
                    <Search className="h-16 w-16 mx-auto text-red-400 mb-4" />
                    <h1 className="text-3xl font-bold mb-2">Search Error</h1>
                    <p className="text-slate-400">An error occurred while searching. Please try again.</p>
                </div>
            </main>
        );
    }
}
