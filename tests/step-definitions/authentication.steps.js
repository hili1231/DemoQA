const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const {
  createAccount,
  registerAccount,
} = require('../fixtures/account.fixture');
const config = require('../support/test-config');
const { actWithDialog, isResponse } = require('../support/browser-actions');

Given('I register a unique reader', { timeout: 180_000 }, async function () {
  this.account = createAccount();

  if (config.registrationMode === 'api') {
    await this.attach(
      'Account setup uses the API; this run does not cover UI registration.',
      'text/plain',
    );
    await registerAccount(this.api, this.account);
    return;
  }

  await this.page.goto('/register');
  await this.page.getByPlaceholder('First Name', { exact: true }).fill('QA');
  await this.page.getByPlaceholder('Last Name', { exact: true }).fill('Reader');
  await this.page
    .getByPlaceholder('UserName', { exact: true })
    .fill(this.account.userName);
  await this.page
    .getByPlaceholder('Password', { exact: true })
    .fill(this.account.password);

  console.log(
    'Complete reCAPTCHA in the browser, then click Register (within 150 seconds).',
  );
  const message = await actWithDialog(
    this.page,
    async () => {
      const response = await this.page.waitForResponse(
        (res) => isResponse(res, '/Account/v1/User', 'POST'),
        { timeout: 150_000 },
      );
      const body = await response.json();
      this.account.userId = body.userID || body.userId;
      expect(response.status()).toBe(201);
      expect(this.account.userId).toBeTruthy();
    },
    150_000,
  );
  expect(message).toBe('User Registered Successfully.');
});

When('I log in to the bookstore', async function () {
  await this.page.goto('/login');
  await this.page
    .getByPlaceholder('UserName', { exact: true })
    .fill(this.account.userName);
  await this.page
    .getByPlaceholder('Password', { exact: true })
    .fill(this.account.password);
  await this.page.getByRole('button', { name: 'Login', exact: true }).click();
  await expect(this.page).toHaveURL(/\/profile(?:\?.*)?$/);
});

When('I log out', async function () {
  await this.page.getByRole('button', { name: /log\s*out/i }).click();
  await expect(this.page).toHaveURL(/\/login$/);
});

Then('I cannot view my collection without logging in', async function () {
  await this.page.goto('/profile');
  await expect(
    this.page.getByText(
      /Currently you are not logged into the Book Store application/i,
    ),
  ).toBeVisible();
  await expect(
    this.page.getByRole('button', { name: /log\s*out/i }),
  ).toHaveCount(0);
});
