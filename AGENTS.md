# Project Rules & Guidelines: DemoQA Playwright & Karate Automation

This repository contains automated test suites for [DemoQA Book Store](https://demoqa.com/books) and its [Swagger API](https://demoqa.com/swagger), using **Playwright with Cucumber** for web browser automation and **Karate** for API test automation.

Refer to the custom workspace skill at [`.agents/skills/demoqa-automation/SKILL.md`](.agents/skills/demoqa-automation/SKILL.md) for full operational workflows and architectural details.

---

## 1. General Repository Rules

- **Runtime & Engines**: Node.js `>=22 <25` and Java `17+` (CI uses Temurin 21).
- **Code Standards**:
  - Code must pass ESLint 9 (`npm run lint`) and Prettier (`npm run format:check`).
  - Use CommonJS modules (`require` / `module.exports`) across JavaScript test and support files.
- **Directory Restrictions**:
  - Do **not** create a root `scripts/` folder. All test helpers, scripts, and runners must reside under `tests/support/`.
  - Node helper scripts in `tests/support/` must guard top-level execution using `if (require.main === module) { main(); }` to prevent side effects when required by other tools.

---

## 2. Playwright Web Automation Rules

- **BDD Framework**: Cucumber (`@cucumber/cucumber`) driving Playwright.
- **Locators**:
  - Prefer user-visible, semantic locators: `page.getByRole()`, `page.getByLabel()`, `page.getByPlaceholder()`, `page.getByText()`.
  - Disambiguate strict-mode locator conflicts (e.g. use `#closeSmallModal-ok` for modal confirmation instead of ambiguous text matches).
  - Use case-insensitive regular expressions for buttons with variable casing or whitespace (`/log\s*out/i`).
- **Timing & Waiting**:
  - **Never** use `page.waitForTimeout()` or arbitrary sleeps. Use Playwright's web-first assertions (`await expect(locator).toBeVisible()`) and network synchronization (`page.waitForResponse()`).
- **Dialogs**:
  - Register `page.once('dialog', async dialog => await dialog.accept())` **before** triggering actions that produce native alert/confirm dialogs.
- **Test Data Isolation**:
  - Scenarios must generate isolated disposable accounts (`user_${uuid}`) and clean them up via API in `After` hooks (`account.fixture.js`).
- **Cucumber Scoping**:
  - `cucumber.js` must explicitly scope require paths (`require: ['tests/support/hooks.js', 'tests/step-definitions/**/*.js']`) so that non-Cucumber scripts in `tests/support/` are not parsed as step definitions.

---

## 3. Karate API Automation Rules

- **Pure Karate DSL**:
  - Scenarios in `tests/api/*.feature` must use native Karate syntax (`url`, `path`, `request`, `method`, `status`, `match`). Do not mix with JavaScript step definitions.
- **Variable Syntax**:
  - Embedded Karate variables in JSON bodies must be quoted: `{ userName: '#(username)', password: '#(password)' }`.
- **Dynamic Identity & Contract Validation**:
  - Generate UUIDs via Java interop (`java.util.UUID.randomUUID()`).
  - Validate exact Swagger status codes (`201` for creations, `200` for token and reads, `204` for deletions, `401` for unauthorized).
  - Always clean up the user account (`DELETE /Account/v1/User/{userId}`) at the conclusion of the test.

---

## 4. Verification Workflow

Before committing or submitting changes, ensure all gates pass:

```bash
npm run lint          # ESLint 9 validation
npm run format:check  # Prettier style check
npm run test:api      # Standalone Karate API test execution
npm run test:web      # Playwright web Cucumber test execution
npm test              # Full test suite execution (API + Web)
```
