const { When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const { actWithDialog, isResponse } = require('../support/browser-actions');

async function reloadCollection(world) {
  const [response] = await Promise.all([
    world.page.waitForResponse((res) =>
      isResponse(res, `/Account/v1/User/${world.account.userId}`, 'GET'),
    ),
    world.page.reload(),
  ]);
  expect(response.status()).toBe(200);
  return response.json();
}

When('I search for {string} by {string}', async function (title, author) {
  this.bookTitle = title;
  this.bookAuthor = author;
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
});

When('I add that book to my collection', async function () {
  const message = await actWithDialog(this.page, async () => {
    const [response] = await Promise.all([
      this.page.waitForResponse((res) =>
        isResponse(res, '/BookStore/v1/Books', 'POST'),
      ),
      this.page
        .getByRole('button', { name: 'Add To Your Collection', exact: true })
        .click(),
    ]);
    expect(response.status()).toBe(201);
  });
  expect(message).toBe('Book added to your collection.');
});

Then('my collection contains that book after a reload', async function () {
  await this.page.getByRole('link', { name: 'Profile', exact: true }).click();
  const profile = await reloadCollection(this);
  expect(profile.books).toHaveLength(1);
  expect(profile.books[0]).toMatchObject({
    title: this.bookTitle,
    author: this.bookAuthor,
  });
  await expect(
    this.page.getByRole('link', { name: this.bookTitle, exact: true }),
  ).toBeVisible();
  await expect(
    this.page.locator('tbody tr').filter({
      has: this.page.getByRole('link', { name: this.bookTitle, exact: true }),
    }),
  ).toHaveCount(1);
  await expect(
    this.page.locator('tbody tr').filter({
      has: this.page.getByRole('link', { name: this.bookTitle, exact: true }),
    }),
  ).toContainText(this.bookAuthor);
});

When('I delete that book from my collection', async function () {
  const row = this.page.locator('tbody tr').filter({
    has: this.page.getByRole('link', { name: this.bookTitle, exact: true }),
  });
  await row.locator('[title="Delete"]').click();
  await expect(this.page.getByRole('dialog')).toContainText(
    'Do you want to delete this book?',
  );
  const message = await actWithDialog(this.page, async () => {
    const [response] = await Promise.all([
      this.page.waitForResponse((res) =>
        isResponse(res, '/BookStore/v1/Book', 'DELETE'),
      ),
      this.page.locator('#closeSmallModal-ok').click(),
    ]);
    expect(response.status()).toBe(204);
  });
  expect(message).toBe('Book deleted.');
});

Then('my collection is empty after a reload', async function () {
  const profile = await reloadCollection(this);
  expect(profile.books).toEqual([]);
  await expect(
    this.page.getByRole('button', { name: /log\s*out/i }),
  ).toBeVisible();
  await expect(
    this.page.getByRole('link', { name: this.bookTitle, exact: true }),
  ).toHaveCount(0);
  await expect(this.page.locator('tbody tr')).toHaveCount(0);
});
