import { defineConfig } from '@playwright/test';
import dotenv from "dotenv";
dotenv.config();

export default defineConfig({
  testDir: './tests',
  use: {
    baseURL: `http://localhost:${process.env.PORT ? parseInt(process.env.PORT) : 3001}`,
    extraHTTPHeaders: {
      'Content-Type': 'application/json',
    },
  },
});
