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

    // 2. Fetch Latest Jobs for Dynamic URLs
    const jobs = await prisma.job.findMany({
        select: { slug: true, updatedAt: true },
        orderBy: { updatedAt: 'desc' },
        take: 1000,
    });

    const jobUrls = jobs.map((job) => ({
        url: `${baseUrl}/jobs/${job.slug}`,
        lastModified: job.updatedAt,
        changeFrequency: 'weekly' as const,
        priority: 0.9,
    }));

    // 3. Fetch Latest Results
    const results = await prisma.result.findMany({
        select: { id: true, updatedAt: true },
        orderBy: { updatedAt: 'desc' },
        take: 500,
    });

    const resultUrls = results.map((result) => ({
        url: `${baseUrl}/results/${result.id}`,
        lastModified: result.updatedAt,
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    }));

    // 4. Fetch Latest Admit Cards
    const admitCards = await prisma.admitCard.findMany({
        select: { id: true, updatedAt: true },
        orderBy: { updatedAt: 'desc' },
        take: 500,
    });

    const admitCardUrls = admitCards.map((card) => ({
        url: `${baseUrl}/admit-cards/${card.id}`,
        lastModified: card.updatedAt,
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    }));

    // 5. Fetch Latest Answer Keys
    const answerKeys = await prisma.answerKey.findMany({
        select: { id: true, updatedAt: true },
        orderBy: { updatedAt: 'desc' },
        take: 300,
    });

    const answerKeyUrls = answerKeys.map((item) => ({
        url: `${baseUrl}/answer-keys/${item.id}`,
        lastModified: item.updatedAt,
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    }));

    // 6. Fetch Latest Syllabus
    const syllabus = await prisma.syllabus.findMany({
        select: { id: true, updatedAt: true },
        orderBy: { updatedAt: 'desc' },
        take: 300,
    });

    const syllabusUrls = syllabus.map((item) => ({
        url: `${baseUrl}/syllabus/${item.id}`,
        lastModified: item.updatedAt,
        changeFrequency: 'monthly' as const,
        priority: 0.7,
    }));

    // 7. Fetch Latest Admissions
    const admissions = await prisma.admission.findMany({
        select: { id: true, updatedAt: true },
        orderBy: { updatedAt: 'desc' },
        take: 300,
    });

    const admissionUrls = admissions.map((item) => ({
        url: `${baseUrl}/admissions/${item.id}`,
        lastModified: item.updatedAt,
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    }));

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
