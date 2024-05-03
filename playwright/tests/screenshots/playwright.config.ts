import { defineConfig, devices } from '@playwright/test';
import defaultConfig from '../../playwright.base';

export default defineConfig(defaultConfig, {
  testDir: './',
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 700, height: 1000},
        contextOptions: { reducedMotion: 'reduce' },
      }
    }
  ],
  webServer: {
    command: 'npm run start:standalone',
    url: 'http://localhost:3000/mock.html',
    reuseExistingServer: !process.env.CI
  }
});
