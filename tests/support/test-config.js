const fs = require('node:fs');

if (fs.existsSync('.env')) process.loadEnvFile('.env');

const baseURL = process.env.BASE_URL || 'https://demoqa.com';
const parsedURL = new URL(baseURL);
if (!['http:', 'https:'].includes(parsedURL.protocol)) {
  throw new Error('BASE_URL must be HTTP(S)');
}

const browserName = process.env.BROWSER || 'chromium';
if (!['chromium', 'firefox', 'webkit'].includes(browserName)) {
  throw new Error('Unsupported BROWSER');
}

const mobile = process.env.MOBILE === 'true';

module.exports = Object.freeze({
  baseURL,
  browserName,
  mobile,
  viewport: mobile
    ? { width: 390, height: 844 }
    : { width: 1440, height: 1000 },
  registrationMode: process.env.REGISTRATION_MODE || 'api',
  headless: process.env.HEADLESS !== 'false',
  captureTrace: process.env.CAPTURE_TRACE === 'true',
  timeout: 20_000,
});
