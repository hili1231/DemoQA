# Testing Rules

## Web Automation (Playwright + Cucumber)

- Rely on semantic, accessible locators: `page.getByRole()`, `page.getByLabel()`, `page.getByPlaceholder()`, `page.getByText()`.
- Disambiguate strict-mode locator conflicts (e.g. use `#closeSmallModal-ok` for modal confirmation).
- Never use `page.waitForTimeout()` or arbitrary sleep delays.
- Register `page.once('dialog', ...)` prior to triggering native browser alert/confirm popups.
- Generate disposable test users per scenario (`user_${uuid}`) and clean up via API in `After` hooks.
- Keep `cucumber.js` require paths explicitly scoped to `tests/support/hooks.js` and `tests/step-definitions/**/*.js`.

## API Automation (Karate)

- Native Karate DSL only (`url`, `path`, `request`, `method`, `status`, `match`). Do not mix with Cucumber JS step definitions.
- Quote embedded variables in JSON bodies: `{ userName: '#(username)', password: '#(password)' }`.
- Generate UUIDs via Java interop (`java.util.UUID.randomUUID()`).
- Validate Swagger contract status codes: `201`, `200`, `204`, `401`.
- Clean up test data at the end of the scenario (`DELETE /Account/v1/User/{userId}`).

## Scripts & Tooling

- All scripts belong in `tests/support/`. Do not create a root `scripts/` directory.
- Guard standalone Node.js utilities with `if (require.main === module)`.
- Enforce ESLint 9 and Prettier formatting across the codebase.
