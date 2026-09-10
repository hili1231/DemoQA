const { When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');

When('I add that book to my collection', async function () {
  const dialogPromise = this.page.waitForEvent('dialog');
  const responsePromise = this.page.waitForResponse(
    (res) =>
      res.url().includes('/BookStore/v1/Books') &&
      res.request().method() === 'POST',
  );
  await this.page
    .getByRole('button', { name: 'Add To Your Collection', exact: true })
    .click();
  const [response, dialog] = await Promise.all([
    responsePromise,
    dialogPromise,
  ]);
  expect(response.status()).toBe(201);
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
  const row = this.page.locator('tbody tr').filter({
    has: this.page.getByRole('link', { name: this.bookTitle, exact: true }),
  });
  await row.locator('[title="Delete"]').click();
  await expect(this.page.getByRole('dialog')).toContainText(
    'Do you want to delete this book?',
  );
  const dialogPromise = this.page.waitForEvent('dialog');
  const responsePromise = this.page.waitForResponse(
    (res) =>
      res.url().includes('/BookStore/v1/Book') &&
      res.request().method() === 'DELETE',
  );
  await this.page.locator('#closeSmallModal-ok').click();
  const [response, dialog] = await Promise.all([
    responsePromise,
    dialogPromise,
  ]);
  expect(response.status()).toBe(204);
  const message = dialog.message();
  await dialog.accept();
  expect(message).toBe('Book deleted.');
});

Then('my collection is empty after a reload', async function () {
  await this.page.reload();
  await expect(
    this.page.getByRole('link', { name: this.bookTitle, exact: true }),
  ).toHaveCount(0);
  await expect(this.page.locator('tbody tr')).toHaveCount(0);
});
