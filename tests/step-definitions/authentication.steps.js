const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const {
  createAccount,
  registerAccount,
} = require('../fixtures/account.fixture');
const config = require('../support/test-config');

Given('I register a unique reader', async function () {
  this.account = createAccount();

  if (config.registrationMode === 'api') {
    await this.attach(
      'Account setup uses the API; this run does not cover UI registration.',
      'text/plain',
    );
    await registerAccount(this.api, this.account);
    return;
  }

  if (config.registrationMode !== 'ui') {
    throw new Error('REGISTRATION_MODE must be ui or api');
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

  const registrationDialog = this.page.waitForEvent('dialog');
  registrationDialog.catch(() => {});
  const [response] = await Promise.all([
    this.page.waitForResponse(
      (response) =>
        new URL(response.url()).pathname === '/Account/v1/User' &&
        response.request().method() === 'POST',
    ),
    this.page.getByRole('button', { name: 'Register', exact: true }).click(),
  ]);

  const body = await response.json();
  this.account.userId = body.userID || body.userId;
  expect(response.status()).toBe(201);
  expect(this.account.userId).toBeTruthy();

  const dialog = await registrationDialog;
  const message = dialog.message();
  await dialog.accept();
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

Then('I see my reader profile', async function () {
  await expect(this.page.locator('#userName-value')).toHaveText(
    this.account.userName,
  );
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
