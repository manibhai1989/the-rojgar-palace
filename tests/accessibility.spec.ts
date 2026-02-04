import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility (Axe)', () => {
    test('homepage should not have any automatically detectable accessibility issues', async ({ page }) => {
        await page.goto('/');

        const accessibilityScanResults = await new AxeBuilder({ page })
            .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
            .analyze();

        if (accessibilityScanResults.violations.length > 0) {
            console.log('Home Violations:', JSON.stringify(accessibilityScanResults.violations, null, 2));
        }

        expect(accessibilityScanResults.violations).toEqual([]);
    });

    test('contact page should be accessible', async ({ page }) => {
        await page.goto('/contact');

        const accessibilityScanResults = await new AxeBuilder({ page })
            .withTags(['wcag2a', 'wcag2aa'])
            .analyze();

        expect(accessibilityScanResults.violations).toEqual([]);
    });

    test('search dialog should be accessible', async ({ page }) => {
        await page.goto('/');

        // Open search
        await page.getByRole('button', { name: 'Search website' }).click();
        await expect(page.getByPlaceholder('Type to search...')).toBeVisible();

        // Scan the dialog content specifically (or page with dialog open)
        const accessibilityScanResults = await new AxeBuilder({ page })
            .include('[role="dialog"]') // Scan only the dialog
            .withTags(['wcag2a', 'wcag2aa'])
            .analyze();

        expect(accessibilityScanResults.violations).toEqual([]);
    });
});
