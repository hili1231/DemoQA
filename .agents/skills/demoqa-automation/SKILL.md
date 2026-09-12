---
name: demoqa-automation
description: Build, extend, review, and debug this repository's Playwright/Cucumber web automation and Karate API automation using maintainable QA framework practices.
---

# DemoQA automation

Use this skill when working on the repository's automation, fixtures, runners, reporting, or CI. Read the relevant implementation and package versions before changing behavior. Keep changes proportional to the user's request; support additional scenarios and data sets when requested without imposing a scenario-count limit.

## Framework structure

- `tests/features/web/`: Cucumber business scenarios. Keep each scenario independent; retain the existing complete reader journey when extending coverage.
- `tests/step-definitions/`: Reusable Cucumber bindings with observable assertions. Keep lifecycle work in support code and account operations in fixtures.
- `tests/fixtures/account.fixture.js`: Unique web-test credentials, API-assisted registration, and account deletion.
- `tests/support/hooks.js`: Browser/context lifecycle, screenshots, optional traces, and failure-safe teardown.
- `tests/support/browser-actions.js`: Scoped dialog handling and exact response matching.
- `tests/support/test-config.js`: Validated configuration and project-root `.env` loading.
- `tests/features/api/`: Karate business scenarios using native HTTP and assertion DSL.
- `tests/support/karate-config.js`: Karate configuration and scenario lifecycle hook registration.
- `tests/support/karate-cleanup.js`: API account teardown through Karate's HTTP client. This repository keeps cleanup in support code rather than feature files.
- `tests/support/run-karate.js`: Versioned, verified JAR acquisition and Java execution.
- `tests/support/generate-summary.js`: CI summaries derived from execution reports.
- `cucumber.js`, `eslint.config.js`, `.github/workflows/quality.yml`: Discovery, quality checks, and CI.

Place helper utilities in `tests/support/`; introduce further abstractions only when reuse or complexity justifies them. Guard standalone Node entry points with `require.main === module`. Karate's GraalJS function files are not Node modules; keep their lint globals scoped to those files. Cucumber must require only hooks and step definitions, never every support script.

## Scenario design and assertions

- Use business-readable steps with explicit outcomes. Add cases, outlines, and tags according to the requested coverage; avoid order dependencies and shared mutable accounts.
- Parameterize expected book data rather than embedding one book's author in a generic search binding.
- Assert persisted state after mutations, including both relevant API data and visible UI results for the web flow. Keep API-assisted setup distinguishable from UI coverage.
- Verify exact documented HTTP statuses, meaningful response fields, collection membership/cardinality, and authorization behavior. Confirm content type before assuming a response is parsed JSON.
- Do not weaken assertions, add broad retries, or skip a failing scenario simply to obtain green results. Distinguish an application failure from test-code and environment failures.
- Preserve the distinction between UI logout and an API request without authorization. DemoQA's API has no logout endpoint; a 401 without a token does not prove token revocation.

## Playwright practices

- Prefer roles, labels, placeholders, and stable visible text. Scope ambiguous locators to the relevant row or dialog. A stable application-specific selector is acceptable when accessible locators cannot identify the control reliably.
- Use Playwright's waiting assertions and response/event synchronization. Register response waits before actions; match the exact pathname and HTTP method.
- Use no fixed sleeps to synchronize the UI. A bounded timeout for a missing event is a failure deadline, not a synchronization delay.
- Accept or dismiss native dialogs while the triggering action is still executing. Capture the message for assertions afterward, observe concurrent promise rejections, and remove scoped listeners on failure.
- Wait for collection loading to complete before asserting an empty table; zero rows during loading is not evidence of an empty collection. Check the current DOM before assuming a table structure.
- Use separate contexts and unique accounts for scenarios. Avoid reusable authenticated state tied to an account that another scenario deletes.
- Unattended registration uses the API because the public register page has reCAPTCHA. Attended UI mode requires an interactive browser and a bounded opportunity for the user to complete it; do not bypass CAPTCHA or claim unattended UI registration coverage.

## Data isolation and teardown

- Generate unique usernames and valid random passwords. Record a returned user ID before later response assertions so cleanup remains possible after partial success.
- Run account cleanup on pass and failure. Handle scenarios that fail before registration or token acquisition, and attempt context disposal even when screenshots, traces, or diagnostic attachments fail.
- Keep teardown failures visible and include a recoverable account identifier without exposing passwords or tokens. Retain the original scenario failure alongside cleanup diagnostics.
- Check lifecycle failure semantics against the installed Karate version. In 1.4.1, an exception in `afterScenario` is logged rather than propagated as a scenario failure; preserve the runner's cleanup-error check and summary warning until an upgrade demonstrably replaces it.
- Keep per-scenario data and error markers isolated if parallel execution is added. Avoid automatically retrying non-idempotent registration or mutation requests.

## Karate and runner practices

- Use native Karate request/status/match steps for API behavior. Use quoted embedded expressions in JSON, for example `{ userId: '#(userId)' }`. Do not bind Karate scenarios to Cucumber JavaScript steps.
- Use lifecycle support code for cleanup, with explicit HTTP status checks and bounded network timeouts. Java interop in the lifecycle helper is separate from the business-flow DSL.
- Both suites must target the same configured `BASE_URL`. Load `.env` relative to the project root; environment variables take precedence. Validate settings before creating accounts or launching browsers.
- Pin the runner version and trusted checksum. Download to a temporary file, verify it, then promote it to the versioned cache; verify cached files before execution. Update the version and checksum together using the official release artifact.
- Propagate missing-runtime errors, child exit failures, signals, and cleanup failures as unsuccessful runs. Never map a missing exit status to success.
- Preserve TLS verification. Resolve local certificate trust through the runtime's trust configuration instead of disabling certificate checks.

## Reporting and validation

- Report actual execution status: failed, undefined, ambiguous, pending, skipped, and unknown must not become passed. Include hook failures and scenario outlines; distinguish hook counts from business-step counts.
- Dry runs validate discovery/bindings only and must not replace real-run reports. Missing or empty reports are not evidence of success.
- Keep credentials and optional traces out of version control. Avoid echoing tokens/passwords in diagnostics; review artifact content and retention when changing reporting.
- Run checks appropriate to the change: `npm run lint`, `npm run format:check`, `npm run test:web:dry`, and the affected existing suites (`npm run test:web`, `npm run test:api`, or `npm test`). Do not add tests solely because a review was requested; follow the user's requested scope.
- Explain what changed, what was actually executed, and any remaining limitation. Existing reports are historical evidence, not proof of a new run. Confirm the working-tree diff before finishing.
- When updating the skill itself, validate its frontmatter and ensure file references and version-specific guidance still match the repository.

## Primary references

- [Playwright dialogs](https://playwright.dev/docs/dialogs)
- [Playwright best practices](https://playwright.dev/docs/best-practices)
- [Karate 1.4.1 documentation and hooks](https://github.com/karatelabs/karate/blob/v1.4.1/README.md#hooks)
- [Karate 1.4.1 HTTP client](https://github.com/karatelabs/karate/blob/v1.4.1/karate-core/src/main/java/com/intuit/karate/Http.java)

Check the pinned version's documentation before adopting APIs from newer Karate or Playwright releases.
