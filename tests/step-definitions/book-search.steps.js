const { When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');

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
});

Then('I see the details for {string}', async function (title) {
  await expect(this.page.locator('#title-wrapper')).toContainText(title);
});
