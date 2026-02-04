import { test, expect } from '@playwright/test';

test.describe('Pre-Launch Smoke Test', () => {
    test('critical paths should be operational', async ({ page }) => {
        // 1. Home Page Load
        await page.goto('/');

        // Handle Cookie Banner (if present)
        const cookieButton = page.getByRole('button', { name: 'Accept All' });
        if (await cookieButton.isVisible()) {
            await cookieButton.click();
        }

        await expect(page).toHaveTitle(/The Rojgar Palace/);
        await expect(page.locator('h1').first()).toBeVisible();

        // 2. Navigation to Latest Jobs
        const firstJobLink = page.locator('a[href^="/jobs/"]').first();
        const jobTitle = await firstJobLink.textContent();
        await firstJobLink.click();

        // 3. Job Details Load
        await expect(page).toHaveURL(/\/jobs\/.*/);
        await expect(page.getByRole('heading', { level: 1 })).toContainText(jobTitle?.trim() || '');

        // 4. Contact Page Form
        await page.goto('/contact');
        await expect(page.getByRole('button', { name: 'Send Message' })).toBeVisible();

        // 5. Search Functionality (Quick Check)
        await page.getByRole('button', { name: 'Search website' }).click();
        const searchInput = page.getByPlaceholder('Type to search...');
        await searchInput.fill('Railways');
        // Expect at least "No results" or results container, but ensure no error
        await expect(page.getByText('Search', { exact: true })).toBeVisible();
    });
});
