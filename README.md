# DemoQA Playwright Tests

JavaScript browser tests using Playwright and Cucumber. The scenario covers registration, login, book search, adding and deleting a book, persistence after reload, and logout.

## Run

Requires Node.js 22 or 24.

```bash
npm ci
npx playwright install chromium
REGISTRATION_MODE=api npm test
```

API setup creates a disposable account; the remaining journey runs through the browser. UI registration is available with `REGISTRATION_MODE=ui`, but DemoQA requires reCAPTCHA and that mode cannot run unattended without an approved test configuration.

## Browsers and mobile web

```bash
npx playwright install firefox webkit
BROWSER=firefox REGISTRATION_MODE=api npm test
BROWSER=webkit REGISTRATION_MODE=api npm test
BROWSER=chromium MOBILE=true REGISTRATION_MODE=api npm test
```

Desktop Chromium is the default. Mobile web uses the Pixel 5 profile with Chromium. These are configured execution options; a successful run is needed to confirm compatibility.

Copy `.env.example` to `.env` for local settings, including `BASE_URL`, `HEADLESS` and `REGISTRATION_MODE`.

## Project structure

- `web/features/`: business scenarios
- `web/steps/`: step definitions with locators inline
- `web/support/`: browser setup, disposable accounts and cleanup
- `cucumber.js`: execution and reporting configuration

Each scenario gets a fresh browser context and its own account. Cleanup runs after failures too. Extract shared behaviour when multiple scenarios need it.

## Checks and reports

```bash
npm run lint
npm run format:check
npm run test:web:dry
```

The dry run validates step matching without executing the browser. Cucumber writes HTML, JSON and JUnit results to `reports/`, with screenshots on failure. GitHub Actions runs desktop Chromium and uploads the reports. Traces are optional for local debugging and can contain test credentials.
