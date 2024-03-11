import { defineConfig } from '@playwright/test';
import defaultConfig from '../../playwright.base';

export default defineConfig(defaultConfig, {
  testDir: './',
  webServer: {
    command: 'npm run start:standalone',
    url: 'http://localhost:3000/mock.html',
    reuseExistingServer: !process.env.CI
  }
});
