const fs = require('node:fs');
if (fs.existsSync('.env')) process.loadEnvFile('.env');
const baseURL = process.env.BASE_URL || 'https://demoqa.com';
const parsed = new URL(baseURL);
if (!['http:', 'https:'].includes(parsed.protocol))
  throw new Error('BASE_URL must be HTTP(S)');
const browserName = process.env.BROWSER || 'chromium';
const mobile = process.env.MOBILE === 'true';
if (!['chromium', 'firefox', 'webkit'].includes(browserName))
  throw new Error('Unsupported BROWSER');
module.exports = Object.freeze({
  baseURL,
  registrationMode: process.env.REGISTRATION_MODE || 'ui',
  browserName,
  mobile,
  headless: process.env.HEADLESS !== 'false',
  captureTrace: process.env.CAPTURE_TRACE === 'true',
  timeout: 20_000,
});
