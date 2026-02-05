
import * as cheerio from 'cheerio';
import { SOURCES, SourceConfig } from './registry';

export interface ScrapedJob {
    sourceId: string;
    title: string;
    link: string;
    dateFound: string;
    status: 'NEW' | 'PROCESSED' | 'IGNORED';
}

/**
 * The Crawler Engine
 * Fetches HTML, parses it, and extracts relevant PDF links.
 */
export class CrawlerEngine {

    // Fetch a single source
    static async scanSource(source: SourceConfig): Promise<ScrapedJob[]> {
        console.log(`[Crawler] Scanning ${source.name} (${source.url})...`);
        const foundJobs: ScrapedJob[] = [];

        try {
            // 1. Fetch HTML
            const response = await fetch(source.url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                },
                next: { revalidate: 0 } // No cache for crawler
            });

            if (!response.ok) {
                console.error(`[Crawler] Failed to fetch ${source.url}: ${response.status} ${response.statusText}`);
                return [];
            }

            const html = await response.text();

            // 2. Parse HTML
            const $ = cheerio.load(html);
            const elements = $(source.selector);

            // 3. Extract & Filter
            elements.each((_, element) => {
                const link = $(element);
                const href = link.attr('href');
                const text = link.text().trim();

                if (!href) return;

                // Normalize URL
                let absoluteUrl = href;
                if (!href.startsWith('http')) {
                    const baseUrl = new URL(source.url).origin;
                    absoluteUrl = href.startsWith('/') ? `${baseUrl}${href}` : `${baseUrl}/${href}`;
                }

                // Filter by Keywords & Extension (loose check for now)
                const hasKeyword = source.keywords.some(k => text.toLowerCase().includes(k.toLowerCase()));
                const isPdf = absoluteUrl.toLowerCase().endsWith('.pdf');

                if (hasKeyword || isPdf) {
                    foundJobs.push({
                        sourceId: source.id,
                        title: text || "Untitled Notification",
                        link: absoluteUrl,
                        dateFound: new Date().toISOString(),
                        status: 'NEW'
                    });
                }
            });

            console.log(`[Crawler] Found ${foundJobs.length} potential jobs from ${source.name}`);
            return foundJobs;

        } catch (error) {
            console.error(`[Crawler] Error scanning ${source.name}:`, error);
            return [];
        }
    }

    // Scan ALL sources
    static async scanAll(): Promise<ScrapedJob[]> {
        const allJobs: ScrapedJob[] = [];
        // Sequential scanning to be polite to servers
        for (const source of SOURCES) {
            const jobs = await this.scanSource(source);
            allJobs.push(...jobs);
        }
        return allJobs;
    }
}
