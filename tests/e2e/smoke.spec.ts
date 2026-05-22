import { expect, test } from '@playwright/test';

test('home: hero loads and CTA navigates to /herramientas', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1, name: /cumple verifactu/i })).toBeVisible();
  await page.getByRole('link', { name: /ver herramientas/i }).click();
  await expect(page).toHaveURL(/\/herramientas\/?$/);
  await expect(page.getByRole('heading', { level: 1, name: /herramientas/i })).toBeVisible();
});

test('validador NIF: valid input shows success badge', async ({ page }) => {
  await page.goto('/herramientas/validador-nif');
  await page.locator('input[placeholder*="12345678Z"]').fill('12345678Z');
  await expect(page.getByText(/dni válido/i)).toBeVisible();
});

test('validador NIF: invalid letter shows error', async ({ page }) => {
  await page.goto('/herramientas/validador-nif');
  await page.locator('input[placeholder*="12345678Z"]').fill('12345678A');
  await expect(page.getByText(/letra de control errónea/i)).toBeVisible();
});

test('article: TOC + ad placeholder + MCP CTA in sidebar', async ({ page, viewport }) => {
  test.skip((viewport?.width ?? 0) < 1024, 'sidebar shown only on lg screens');
  await page.goto('/guias/cumplimiento/sanciones-verifactu-2026');
  await expect(page.getByRole('heading', { level: 1, name: /sanciones verifactu/i })).toBeVisible();
  await expect(page.getByText(/en esta guía/i)).toBeVisible();
  await expect(page.getByText(/ad placeholder/i).first()).toBeVisible();
  await expect(page.getByRole('link', { name: /conocer el mcp/i })).toBeVisible();
});
