# DemoQA Test Automation: Playwright (Web) & Karate (API)

End-to-end automated test suites for [DemoQA Book Store](https://demoqa.com/books) and its [Swagger API](https://demoqa.com/swagger), using **Playwright with Cucumber** for web browser automation and **Karate** for API test automation.

Both suites validate the required single continuous flow:

1. **Register & login**
2. **Search and add book to collection**
3. **See list of your book collection**
4. **Delete book from your collection**
5. **Logout**

---

## Prerequisites

- **Node.js**: `22` or `24`
- **Java**: `17+` (required for Karate API runner)

---

## Quick Start

```bash
# Install dependencies
npm ci

# Install Playwright browser
npx playwright install chromium

# Run all tests (Karate API + Playwright Web)
npm test
```

---

## Running Specific Test Suites

### Web Tests (Playwright + Cucumber)

```bash
# Run all web scenarios (default: desktop Chromium, headless)
npm run test:web

# Run only the single end-to-end flow
npx cucumber-js --tags "@single-flow"

# Run specific domain areas
npx cucumber-js --tags "@authentication"
npx cucumber-js --tags "@book-search"
npx cucumber-js --tags "@book-collection"

# Dry run to validate step bindings
npm run test:web:dry
```

#### Browser and Mobile Options

```bash
# Cross-browser
BROWSER=firefox npm run test:web
BROWSER=webkit npm run test:web

# Mobile web emulation (390 x 844 viewport)
BROWSER=chromium MOBILE=true npm run test:web
```

> **Note on Registration Mode**: DemoQA enforces Google reCAPTCHA on `/register`. Unattended tests use API-assisted registration by default (`REGISTRATION_MODE=api`), followed by browser login through the UI. UI-only registration is accessible with `REGISTRATION_MODE=ui` when running attended or configured for testing.

### API Tests (Karate)

```bash
# Run Karate API tests (automatically sets up Karate standalone runner)
npm run test:api
```

Karate executes against `https://demoqa.com` following the Swagger API contract:

- `POST /Account/v1/User` (Register)
- `POST /Account/v1/GenerateToken` & `POST /Account/v1/Authorized` (Login / Auth)
- `GET /BookStore/v1/Books` (Search)
- `POST /BookStore/v1/Books` (Add to collection)
- `GET /Account/v1/User/{userId}` (Verify collection)
- `DELETE /BookStore/v1/Book` (Delete book)
- `DELETE /Account/v1/User/{userId}` (Cleanup)

---

## Code Quality & Formatting

```bash
# Run ESLint
npm run lint

# Check formatting
npm run format:check

# Auto-format
npm run format
```

---

## Project Structure

```
├── .github/workflows/
│   └── quality.yml             # GitHub Actions CI (Node 24, Java 21, Playwright & Karate)
├── scripts/
│   └── run-karate.js           # Automated runner for Karate standalone JAR
├── tests/
│   ├── api/
│   │   └── book-flow.feature   # Karate API end-to-end flow
│   ├── features/
│   │   ├── book-store-flow.feature # Single continuous E2E web flow
│   │   ├── authentication.feature  # Authentication scenario
│   │   ├── book-collection.feature # Collection management scenario
│   │   └── book-search.feature     # Catalog search scenario
│   ├── fixtures/
│   │   └── account.fixture.js  # Disposable account generation and cleanup
│   ├── step-definitions/
│   │   ├── authentication.steps.js
│   │   ├── book-collection.steps.js
│   │   └── book-search.steps.js
│   └── support/
│       ├── hooks.js            # Playwright lifecycle, tracing, failure screenshot
│       └── test-config.js      # Environment and browser options
├── cucumber.js                 # Cucumber execution and reporting configuration
├── eslint.config.js            # ESLint 9 configuration
└── package.json
```

---

## Reports & Artifacts

- **Cucumber Reports**: Output to `reports/cucumber.html`, `reports/cucumber.json`, and `reports/cucumber.xml`. On failure, full-page screenshots are embedded directly.
- **Karate Reports**: Output to `reports/karate/karate-reports/karate-summary.html`.
- **CI Artifacts**: Both reports are archived and uploaded on every workflow run in GitHub Actions.
