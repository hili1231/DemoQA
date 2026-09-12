const fs = require('node:fs');
const path = require('node:path');

const envFile = path.resolve(__dirname, '..', '..', '.env');
if (fs.existsSync(envFile)) process.loadEnvFile(envFile);

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
const registrationMode = process.env.REGISTRATION_MODE || 'api';
if (!['api', 'ui'].includes(registrationMode)) {
  throw new Error('REGISTRATION_MODE must be ui or api');
}
for (const name of ['MOBILE', 'HEADLESS', 'CAPTURE_TRACE']) {
  if (process.env[name] && !['true', 'false'].includes(process.env[name])) {
    throw new Error(`${name} must be true or false`);
  }
}
if (registrationMode === 'ui' && process.env.HEADLESS !== 'false') {
  throw new Error(
    'UI registration requires HEADLESS=false for attended reCAPTCHA completion',
  );
}

module.exports = Object.freeze({
  baseURL,
  browserName,
  mobile,
  viewport: mobile
    ? { width: 390, height: 844 }
    : { width: 1440, height: 1000 },
  registrationMode,
  headless: process.env.HEADLESS !== 'false',
  captureTrace: process.env.CAPTURE_TRACE === 'true',
  timeout: 20_000,
});
