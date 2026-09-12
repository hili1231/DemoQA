# DemoQA Test Automation: Playwright (Web) & Karate (API)

[![Automated Tests](https://github.com/hili1231/DemoQA/actions/workflows/quality.yml/badge.svg)](https://github.com/hili1231/DemoQA/actions/workflows/quality.yml)

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

# Dry run to validate step bindings
npm run test:web:dry
```

#### Browser and Mobile Options

```bash
# Cross-browser
npx playwright install firefox webkit
BROWSER=firefox npm run test:web
BROWSER=webkit npm run test:web

# Mobile web emulation (390 x 844 viewport)
BROWSER=chromium MOBILE=true npm run test:web
```

For PowerShell, set variables with `$env:BROWSER = 'firefox'` before running `npm run test:web`, or edit `.env`. CI runs Chromium; other browsers are optional local configurations.

> **Registration**: DemoQA enforces reCAPTCHA on `/register`. Unattended tests use API registration (`REGISTRATION_MODE=api`) followed by UI login. For attended registration, set `REGISTRATION_MODE=ui` and `HEADLESS=false`; the test fills the form, then waits up to 150 seconds for you to complete reCAPTCHA and click Register. The unattended run does not claim UI registration coverage.

### API Tests (Karate)

```bash
# Run Karate API tests (automatically sets up Karate standalone runner)
npm run test:api
```

Both suites use `BASE_URL` from the environment or the project-root `.env`, defaulting to `https://demoqa.com`. Existing environment variables take precedence. Karate follows the Swagger API contract:

- `POST /Account/v1/User` (Register)
- `POST /Account/v1/GenerateToken` & `POST /Account/v1/Authorized` (Login / Auth)
- `GET /BookStore/v1/Books` (Search)
- `POST /BookStore/v1/Books` (Add to collection)
- `GET /Account/v1/User/{userId}` (Verify collection)
- `DELETE /BookStore/v1/Book` (Delete book)
- `DELETE /Account/v1/User/{userId}` (Cleanup)

The API has no logout endpoint: the final access check omits the token and expects 401; it does not claim to revoke the token. The web flow verifies actual UI logout and restricted profile access.

Account cleanup runs on failure as well as success. Karate's `afterScenario` hook invokes `tests/support/karate-cleanup.js`, keeping lifecycle requests out of the feature. Because Karate 1.4.1 only logs hook exceptions, the runner checks cleanup error markers and fails the overall run if cleanup fails. The CI summary also reports these failures.

The runner downloads Karate 1.4.1 to `target/karate-1.4.1.jar`, verifies its pinned SHA-256 before use, and only promotes a completed download to the cache. The old root-level `karate.jar` is not used. A checksum mismatch fails with instructions to remove the affected cache file and retry.

If a local network uses a custom certificate authority, configure runtime trust instead of disabling TLS verification. Node can use `NODE_EXTRA_CA_CERTS` pointing to a PEM file containing the trusted public CA certificates. On Windows, Java can use the Windows root store with `$env:JAVA_TOOL_OPTIONS = '-Djavax.net.ssl.trustStoreType=Windows-ROOT'`. These are local environment settings, not repository defaults.

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
├── .agents/
│   └── skills/
│       └── demoqa-automation/
│           └── SKILL.md            # Project automation skill
├── .github/workflows/
│   └── quality.yml                 # GitHub Actions CI (Node 24, Java 21, Playwright & Karate)
├── tests/
│   ├── api/
│   │   └── book-flow.feature       # Karate API end-to-end flow
│   ├── features/
│   │   └── book-store-flow.feature # Single continuous E2E web flow
│   ├── fixtures/
│   │   └── account.fixture.js      # Disposable account generation and cleanup
│   ├── step-definitions/
│   │   ├── authentication.steps.js # Auth & session step bindings
│   │   └── book-collection.steps.js# Search, collection, and deletion step bindings
│   └── support/
│       ├── browser-actions.js      # Dialog handling and response matching
│       ├── generate-summary.js     # CI Markdown summaries
│       ├── hooks.js                # Playwright lifecycle, tracing, failure screenshot
│       ├── karate-config.js        # Karate configuration and failure cleanup
│       ├── karate-cleanup.js       # Account teardown via Karate's HTTP client
│       ├── run-karate.js           # Automated runner for Karate standalone JAR
│       └── test-config.js          # Environment and browser options
├── GEMINI.md                       # Existing project rules reference
├── cucumber.js                     # Cucumber execution and reporting configuration
├── eslint.config.js                # ESLint 9 configuration
└── package.json
```

---

## Reports & Artifacts

- **Cucumber Reports**: Output to `reports/cucumber.html`, `reports/cucumber.json`, and `reports/cucumber.xml`. On failure, full-page screenshots are embedded directly.
- **Dry Run**: `npm run test:web:dry` checks bindings without starting a browser or replacing the last real reports. Skipped steps are not reported as successful execution.
- **Karate Reports**: Output to `reports/karate/karate-reports/karate-summary.html`.
- **CI Artifacts**: Both reports are archived and uploaded on every workflow run in GitHub Actions.
