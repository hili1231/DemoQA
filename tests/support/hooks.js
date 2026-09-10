const {
  BeforeAll,
  AfterAll,
  Before,
  After,
  Status,
  setDefaultTimeout,
} = require('@cucumber/cucumber');
const playwright = require('playwright');
const { randomUUID } = require('node:crypto');
const config = require('./test-config');
const { deleteAccount } = require('../fixtures/account.fixture');
let browser;
setDefaultTimeout(60_000);
BeforeAll(async function () {
  browser = await playwright[config.browserName].launch({
    headless: config.headless,
  });
});
Before(async function () {
  this.context = await browser.newContext({
    baseURL: config.baseURL,
    viewport: config.viewport,
    ...(config.mobile && config.browserName !== 'firefox'
      ? { hasTouch: true, isMobile: true }
      : {}),
  });
  this.context.setDefaultTimeout(config.timeout);
  this.context.setDefaultNavigationTimeout(30_000);
  this.api = await playwright.request.newContext({
    baseURL: config.baseURL,
    timeout: config.timeout,
  });
  this.page = await this.context.newPage();
  if (config.captureTrace)
    await this.context.tracing.start({ screenshots: true, snapshots: true });
});
After(async function ({ result }) {
  const errors = [];
  const attempt = async (label, action) => {
    try {
      await action();
    } catch {
      errors.push(label);
    }
  };
  if (result?.status === Status.FAILED && this.page) {
    await attempt('Failure screenshot capture failed', async () => {
      await this.attach(
        await this.page.screenshot({ fullPage: true }),
        'image/png',
      );
    });
  }
  // Every cleanup action is attempted even if capture or another cleanup fails.
  if (config.captureTrace && this.context) {
    await attempt('Trace capture failed', () =>
      this.context.tracing.stop({ path: `reports/trace-${randomUUID()}.zip` }),
    );
  }
  await attempt(
    'Disposable account cleanup failed; investigate orphan account',
    async () => {
      await deleteAccount(this.api, this.account);
    },
  );
  if (this.account?.userId && errors.some((x) => x.startsWith('Disposable'))) {
    await this.attach(
      `Cleanup account ID: ${this.account.userId}`,
      'text/plain',
    );
  }
  if (this.api)
    await attempt('API context disposal failed', () => this.api.dispose());
  if (this.context)
    await attempt('Browser context disposal failed', () =>
      this.context.close(),
    );
  if (errors.length) throw new Error(errors.join('; '));
});
AfterAll(async function () {
  if (browser) await browser.close();
});
