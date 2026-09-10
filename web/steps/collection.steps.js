const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const { newAccount, register } = require('../support/account');
const config = require('../support/config');

Given('I register a unique reader', async function () {
  this.account = newAccount();
  if (config.registrationMode === 'api') {
    await this.attach(
      'Registration via API: UI registration is NOT covered by this run.',
      'text/plain',
    );
    await register(this.api, this.account);
    return;
  }
  if (config.registrationMode !== 'ui')
    throw new Error('REGISTRATION_MODE must be ui or api');
  await this.page.goto('/register');
  await this.page.getByPlaceholder('First Name', { exact: true }).fill('QA');
  await this.page.getByPlaceholder('Last Name', { exact: true }).fill('Reader');
  await this.page
    .getByPlaceholder('UserName', { exact: true })
    .fill(this.account.userName);
  await this.page
    .getByPlaceholder('Password', { exact: true })
    .fill(this.account.password);
  // Observe the real response; do not mock registration or bypass reCAPTCHA.
  const registrationDialog = this.page.waitForEvent('dialog');
  // Prevent an unhandled rejection if CAPTCHA blocks the HTTP request.
  registrationDialog.catch(() => {});
  const [response] = await Promise.all([
    this.page.waitForResponse(
      (r) =>
        new URL(r.url()).pathname === '/Account/v1/User' &&
        r.request().method() === 'POST',
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
  await expect(this.page.locator('#userName-value')).toHaveText(
    this.account.userName,
  );
});
When('I search for {string}', async function (title) {
  this.bookTitle = title;
  await this.page
    .getByRole('link', { name: 'Book Store', exact: true })
    .click();
  await this.page
    .getByPlaceholder('Type to search', { exact: true })
    .fill(title);
  await expect(
    this.page.getByRole('link', { name: title, exact: true }),
  ).toHaveCount(1);
  await this.page.getByRole('link', { name: title, exact: true }).click();
  await expect(this.page.locator('#title-wrapper')).toContainText(title);
});
When('I add that book to my collection', async function () {
  const dialogPromise = this.page.waitForEvent('dialog');
  await this.page
    .getByRole('button', { name: 'Add To Your Collection', exact: true })
    .click();
  const dialog = await dialogPromise;
  const message = dialog.message();
  await dialog.accept();
  expect(message).toBe('Book added to your collection.');
});
Then('my collection contains that book after a reload', async function () {
  await this.page.getByRole('link', { name: 'Profile', exact: true }).click();
  await this.page.reload();
  await expect(
    this.page.getByRole('link', { name: this.bookTitle, exact: true }),
  ).toBeVisible();
  await expect(
    this.page.locator('tbody tr').filter({
      has: this.page.getByRole('link', { name: this.bookTitle, exact: true }),
    }),
  ).toHaveCount(1);
});
When('I delete that book from my collection', async function () {
  // DemoQA renders this action as a span, not an accessible button.
  await this.page
    .getByRole('row')
    .filter({
      has: this.page.getByRole('link', { name: this.bookTitle, exact: true }),
    })
    .locator('[title="Delete"]')
    .click();
  await expect(this.page.getByRole('dialog')).toContainText(
    'Do you want to delete this book?',
  );
  const dialogPromise = this.page.waitForEvent('dialog');
  await this.page
    .getByRole('dialog')
    .getByRole('button', { name: 'OK', exact: true })
    .click();
  const dialog = await dialogPromise;
  const message = dialog.message();
  await dialog.accept();
  expect(message).toBe('Book deleted.');
});
Then('my collection is empty after a reload', async function () {
  await this.page.reload();
  await expect(
    this.page.getByText('No rows found', { exact: true }),
  ).toBeVisible();
  await expect(
    this.page.getByRole('link', { name: this.bookTitle, exact: true }),
  ).toHaveCount(0);
});
When('I log out', async function () {
  await this.page.getByRole('button', { name: 'Log out', exact: true }).click();
  await expect(this.page).toHaveURL(/\/login$/);
});
Then('I cannot view my collection without logging in', async function () {
  await this.page.goto('/profile');
  await expect(
    this.page.getByText(
      'Currently you are not logged into the Book Store application.',
      { exact: false },
    ),
  ).toBeVisible();
  await expect(
    this.page.getByRole('button', { name: 'Log out', exact: true }),
  ).toHaveCount(0);
});
