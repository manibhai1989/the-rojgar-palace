import { MetadataRoute } from 'next';
import prisma from '@/lib/prisma';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://therojgarpalace.in';

    // 1. Static Pages
    const staticPages = [
        '',
        '/jobs',
        '/results',
        '/admit-cards',
        '/syllabus',
        '/answer-keys',
        '/admissions',
        '/about',
        '/contact',
        '/terms',
        '/site-map'
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: route === '' ? 1.0 : 0.8,
    }));

    // 2. Fetch Dynamic URLs with Fallbacks
    let jobUrls: any[] = [];
    let resultUrls: any[] = [];
    let admitCardUrls: any[] = [];
    let answerKeyUrls: any[] = [];
    let syllabusUrls: any[] = [];
    let admissionUrls: any[] = [];

    try {
        const jobs = await prisma.job.findMany({
            select: { slug: true, updatedAt: true },
            orderBy: { updatedAt: 'desc' },
            take: 1000,
        });
        jobUrls = jobs.map((job) => ({
            url: `${baseUrl}/jobs/${job.slug}`,
            lastModified: job.updatedAt,
            changeFrequency: 'weekly' as const,
            priority: 0.9,
        }));
    } catch (e) { console.error("Sitemap: Jobs query failed", e); }

    try {
        const results = await prisma.result.findMany({
            select: { id: true, updatedAt: true },
            orderBy: { updatedAt: 'desc' },
            take: 500,
        });
        resultUrls = results.map((result) => ({
            url: `${baseUrl}/results/${result.id}`,
            lastModified: result.updatedAt,
            changeFrequency: 'weekly' as const,
            priority: 0.8,
        }));
    } catch (e) { console.error("Sitemap: Results query failed", e); }

    try {
        const admitCards = await prisma.admitCard.findMany({
            select: { id: true, updatedAt: true },
            orderBy: { updatedAt: 'desc' },
            take: 500,
        });
        admitCardUrls = admitCards.map((card) => ({
            url: `${baseUrl}/admit-cards/${card.id}`,
            lastModified: card.updatedAt,
            changeFrequency: 'weekly' as const,
            priority: 0.8,
        }));
    } catch (e) { console.error("Sitemap: Admit cards query failed", e); }

    try {
        const answerKeys = await prisma.answerKey.findMany({
            select: { id: true, updatedAt: true },
            orderBy: { updatedAt: 'desc' },
            take: 300,
        });
        answerKeyUrls = answerKeys.map((item) => ({
            url: `${baseUrl}/answer-keys/${item.id}`,
            lastModified: item.updatedAt,
            changeFrequency: 'weekly' as const,
            priority: 0.8,
        }));
    } catch (e) { console.error("Sitemap: Answer keys query failed", e); }

    try {
        const syllabus = await prisma.syllabus.findMany({
            select: { id: true, updatedAt: true },
            orderBy: { updatedAt: 'desc' },
            take: 300,
        });
        syllabusUrls = syllabus.map((item) => ({
            url: `${baseUrl}/syllabus/${item.id}`,
            lastModified: item.updatedAt,
            changeFrequency: 'monthly' as const,
            priority: 0.7,
        }));
    } catch (e) { console.error("Sitemap: Syllabus query failed", e); }

    try {
        const admissions = await prisma.admission.findMany({
            select: { id: true, updatedAt: true },
            orderBy: { updatedAt: 'desc' },
            take: 300,
        });
        admissionUrls = admissions.map((item) => ({
            url: `${baseUrl}/admissions/${item.id}`,
            lastModified: item.updatedAt,
            changeFrequency: 'weekly' as const,
            priority: 0.8,
        }));
    } catch (e) { console.error("Sitemap: Admissions query failed", e); }

    return [
        ...staticPages,
        ...jobUrls,
        ...resultUrls,
        ...admitCardUrls,
        ...answerKeyUrls,
        ...syllabusUrls,
        ...admissionUrls
    ];
}
