import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  use: {
    baseURL: 'http://localhost:4321',
    trace: 'on-first-retry',
  },
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:4321',
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
  projects: [{ name: 'chromium', use: { browserName: 'chromium' } }],
});
