import { defineConfig, devices } from '@playwright/test';
import { SESSION_FILE } from './smoke/session';

export default defineConfig({
  testDir: './smoke',
  workers: 1,
  timeout: 60_000,
  reporter: [['list']],
  use: {
    ...devices['Desktop Chrome'],
    baseURL: process.env.SMOKE_BASE_URL ?? 'http://localhost:3000',
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'sesion', testMatch: /session\.setup\.ts/ },
    {
      name: 'pantallas',
      testMatch: /\.smoke\.ts/,
      dependencies: ['sesion'],
      use: { storageState: SESSION_FILE },
    },
  ],
});
