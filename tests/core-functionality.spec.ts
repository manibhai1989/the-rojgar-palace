import { test, expect } from '@playwright/test';

// 1. Link Testing & Legal Compliance
test.describe('Core Navigation & Compliance', () => {
    const staticPages = [
        '/',
        '/jobs',
        '/results',
        '/admit-cards',
        '/contact',
        '/privacy',
        '/terms'
    ];

    for (const path of staticPages) {
        test(`should load ${path} successfully`, async ({ page }) => {
            const response = await page.goto(path);
            expect(response?.status()).toBe(200);

            // Content Completeness Check (No Lorem Ipsum)
            const textContent = await page.locator('body').textContent();
            expect(textContent).not.toContain('Lorem ipsum');
            expect(textContent).not.toContain('lorem ipsum');
        });
    }
});

// 2. Form Testing
test('should submit contact form successfully', async ({ page }) => {
    await page.goto('/contact');

    await page.getByLabel('Full Name').fill('Test User');
    await page.getByLabel('Email Address').fill('test@example.com');
    await page.getByLabel('Subject').fill('Test Subject');
    await page.getByLabel('Message').fill('This is a test message form automation.');

    // Submit
    const submitBtn = page.getByRole('button', { name: 'Send Message' });
    await submitBtn.click();

    // Expect success toast or message
    await expect(page.getByText('Message sent successfully')).toBeVisible();
});

// 3. Dynamic Content (Search)
test('should search and handle results', async ({ page }) => {
    await page.goto('/');

    // Open Search Dialog
    const searchTrigger = page.getByRole('button', { name: 'Search website' });
    await searchTrigger.click();

    // Type Query
    const searchInput = page.getByPlaceholder('Type to search...');
    await expect(searchInput).toBeVisible();
    await searchInput.fill('Jobs');

    // Wait for network buffer
    await page.waitForTimeout(500);

    // Verify "Latest Jobs" suggestion is present matching the query
    await expect(page.getByText('Latest Jobs')).toBeVisible();
});
