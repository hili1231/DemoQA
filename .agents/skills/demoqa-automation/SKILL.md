---
name: demoqa-automation
description: Run, maintain, debug, and author Playwright web and Karate API test automation flows for the DemoQA bookstore application following the project's strict architecture and testing rules.
---

# DemoQA Automation Skill

This skill provides the authoritative procedures, architecture patterns, and strict quality rules for the DemoQA Book Store test automation framework. It encompasses **Playwright (Web)** browser automation with Cucumber BDD and **Karate (API)** contract testing against Swagger endpoints.

---

## 1. Project Architecture & File Mapping

```
├── .agents/
│   └── skills/
│       └── demoqa-automation/
│           └── SKILL.md            # This skill specification
├── .github/workflows/
│   └── quality.yml                 # CI workflow (Node 24, Java 21, Playwright & Karate)
├── tests/
│   ├── api/
│   │   └── book-flow.feature       # Karate API end-to-end flow (Swagger contract)
│   ├── features/
│   │   └── book-store-flow.feature # Single continuous E2E web flow (assignment requirement)
│   ├── fixtures/
│   │   └── account.fixture.js      # Disposable user generation & API teardown
│   ├── step-definitions/
│   │   ├── authentication.steps.js # Auth & session step bindings
│   │   └── book-collection.steps.js# Search, collection, and deletion step bindings
│   └── support/
│       ├── hooks.js                # Playwright lifecycle, tracing, failure screenshots
│       ├── run-karate.js           # Automated runner for Karate standalone JAR
│       └── test-config.js          # Environment, baseUrl, and browser launch options
├── AGENTS.md                       # Project rules & guidelines
├── cucumber.js                     # Cucumber CLI execution and reporting configuration
├── eslint.config.js                # ESLint 9 configuration
└── package.json
```

---

## 2. Command Reference

| Task                 | Command                | Purpose                                                        |
| :------------------- | :--------------------- | :------------------------------------------------------------- |
| **Run All Tests**    | `npm test`             | Executes both Karate API and Playwright Web suites in sequence |
| **Run API Tests**    | `npm run test:api`     | Executes Karate standalone JAR against `tests/api/`            |
| **Run Web Tests**    | `npm run test:web`     | Executes Playwright Web scenarios via Cucumber                 |
| **Web Dry Run**      | `npm run test:web:dry` | Verifies Cucumber step bindings without launching browsers     |
| **Lint Code**        | `npm run lint`         | Runs ESLint 9 with recommended JavaScript rules                |
| **Check Formatting** | `npm run format:check` | Verifies file formatting with Prettier                         |
| **Auto-format**      | `npm run format`       | Applies Prettier formatting across the codebase                |

---

## 3. Strict Rules & Best Practices

### 3.1 Web Automation Rules (Playwright + Cucumber)

1. **Prioritize Resilient, User-Facing Locators**:
   - Use `page.getByRole()`, `page.getByLabel()`, `page.getByPlaceholder()`, or `page.getByText()`.
   - Avoid brittle implementation-bound selectors (`div > div:nth-child(2) > span`).
2. **Handle Strict Mode Disambiguation**:
   - DemoQA UI contains overlapping button text (e.g. "OK" occurs within "Go To Book Store", "Delete All Books", and the delete confirmation dialog).
   - Target unambiguous modal selectors such as `#closeSmallModal-ok` for modal confirmation.
3. **No Hardcoded Sleep Statements**:
   - **Never** use `page.waitForTimeout()` or fixed timer delays.
   - Rely on Playwright auto-waiting assertions (`expect(locator).toBeVisible()`) and network synchronization (`page.waitForResponse()`).
4. **Dialog Handling Pre-Registration**:
   - DemoQA triggers native browser `window.alert` and `window.confirm` dialogs on book addition and deletion.
   - **Always** register the dialog event handler (`page.once('dialog', async dialog => await dialog.accept())`) **before** clicking the button that triggers the dialog.
5. **Dynamic Account Isolation & Cleanup**:
   - Never share static test user accounts. Every scenario must generate a unique disposable account (`user_${uuid}`).
   - Register the disposable account during setup and ensure teardown (`deleteAccount(user.userId, user.token)`) executes in `After` hooks, even if the scenario fails.
6. **Case-Insensitive Text & Regex Matching**:
   - DemoQA buttons and messages frequently alter casing or spacing across releases (e.g. "Logout" vs "Log out"). Use regular expressions: `getByRole('button', { name: /log\s*out/i })`.
7. **Table & Empty-State Structure**:
   - DemoQA renders book rows in a standard HTML `<table>`. Verify empty state using `expect(page.locator('tbody tr')).toHaveCount(0)`, not obsolete ReactTable classes like `.rt-noData`.

### 3.2 API Automation Rules (Karate Framework)

1. **Native Karate DSL Only**:
   - Use native Karate keywords: `url`, `path`, `request`, `method`, `status`, `match`.
   - Do **not** mix Cucumber JavaScript step definitions with Karate `.feature` files.
2. **Quoted Embedded Variable Syntax**:
   - In JSON request bodies, always enclose embedded variables in quotes:
     ```cucumber
     And request { userName: '#(username)', password: '#(password)' }
     ```
     Unquoted `#(username)` is invalid JSON in Karate and causes syntax evaluation failures.
3. **Dynamic UUID Generation via Java Interop**:
   - Generate unique usernames and valid passwords using Java utilities directly in Karate `Background`:
     ```cucumber
     * def uuid = java.util.UUID.randomUUID() + ''
     * def username = 'user_' + uuid.substring(0, 8)
     * def password = 'Password123!'
     ```
4. **Exact HTTP Status Verification**:
   - Verify explicit HTTP status codes matching the Swagger contract:
     - `201 Created`: User registration (`POST /Account/v1/User`), Book addition (`POST /BookStore/v1/Books`).
     - `200 OK`: Token generation (`POST /Account/v1/GenerateToken`), Book catalog query (`GET /BookStore/v1/Books`), User profile query (`GET /Account/v1/User/{userId}`).
     - `204 No Content`: Book deletion (`DELETE /BookStore/v1/Book`), User deletion (`DELETE /Account/v1/User/{userId}`).
     - `401 Unauthorized`: Unauthenticated request verification (`GET /Account/v1/User/{userId}`).

### 3.3 Test Support & Script Location Rules

1. **Location of Scripts**:
   - All helper scripts must reside in `tests/support/` (e.g. `tests/support/run-karate.js`).
   - Do not re-create a standalone `scripts/` directory.
2. **Main Module Guarding**:
   - Any standalone Node.js utility in `tests/support/` must be guarded with:
     ```javascript
     if (require.main === module) {
       main();
     }
     ```
   - This prevents unintended execution when modules are required or imported.
3. **Cucumber Configuration Scoping**:
   - In `cucumber.js`, explicitly require only hook and step files (`require: ['tests/support/hooks.js', 'tests/step-definitions/**/*.js']`) to prevent Cucumber from evaluating non-Cucumber support scripts during startup.

---

## 4. Single Continuous E2E Flow Specification

Both Web and API test suites must automate the single 5-step flow:

1. **Register & Login**: Register disposable user $\rightarrow$ authenticate and obtain authorization token $\rightarrow$ log into bookstore.
2. **Search & Add Book**: Search catalog for target title (`"Git Pocket Guide"`, ISBN `9781449325862`) $\rightarrow$ add to collection $\rightarrow$ handle alert dialog.
3. **View Collection**: Navigate to profile $\rightarrow$ verify book title and author appear in collection table.
4. **Delete Book**: Click trash icon $\rightarrow$ confirm in modal (`#closeSmallModal-ok`) $\rightarrow$ handle deletion alert $\rightarrow$ verify collection is empty (`tbody tr` count is 0).
5. **Logout**: Click Logout button $\rightarrow$ verify redirection/prompt to login (`/Currently you are not logged into the Book Store application/i`).
