import { test, expect } from '@playwright/test';

test('homepage has title and critical elements', async ({ page }) => {
    await page.goto('/');

    // Expect a title "to contain" a substring.
    await expect(page).toHaveTitle(/The Rojgar Palace/);

    // Check for the main heading
    const heading = page.getByRole('heading', { level: 1 });
    await expect(heading).toBeVisible();

    // Check if Search is visible (important for user experience)
    // Check if Search trigger button is visible
    // Use accessible name (aria-label) we just added
    const searchButton = page.getByRole('button', { name: 'Search website' });
    await expect(searchButton).toBeVisible();

    // Optional: Click it and check if dialog opens
    await searchButton.click();
    await expect(page.getByPlaceholder('Type to search...')).toBeVisible();
});
