import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const PAGES = [
  { path: '/', name: 'home' },
  { path: '/herramientas', name: 'tools-hub' },
  { path: '/herramientas/validador-nif', name: 'validador-nif' },
  { path: '/herramientas/calculadora-iva', name: 'calculadora-iva' },
  { path: '/guias', name: 'guias-hub' },
  { path: '/guias/cumplimiento/sanciones-verifactu-2026', name: 'article' },
  { path: '/mcp', name: 'mcp-landing' },
  { path: '/sobre', name: 'sobre' },
  { path: '/legal/privacidad', name: 'privacidad' },
];

for (const { path, name } of PAGES) {
  test(`axe: ${name} has no critical or serious a11y violations`, async ({ page }) => {
    await page.goto(path);
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();
    const blocking = results.violations.filter(
      (v) => v.impact === 'critical' || v.impact === 'serious',
    );
    expect.soft(blocking, `Violations:\n${JSON.stringify(blocking, null, 2)}`).toEqual([]);
  });
}
