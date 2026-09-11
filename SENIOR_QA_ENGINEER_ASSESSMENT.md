# Senior QA Engineer Assessment: Test Strategy, Planning, Leadership & Technical Execution

**Candidate**: Senior QA Engineer  
**Role**: Senior Quality Assurance Engineer  
**Repository**: [https://github.com/hili1231/DemoQA](https://github.com/hili1231/DemoQA)  
**Date**: September 2026

---

# Table of Contents

1. [Executive Summary](#executive-summary)
2. [Part 1: Technical Excellence](#part-1-technical-excellence)
   - [1.1 Test Strategy & Design](#11-test-strategy--design)
     - [Q1: 30-Day QA Transformation Plan & Immediate Priorities](#q1-30-day-qa-transformation-plan--immediate-priorities)
     - [Q2: Processes, Tooling, Environments & Team Integration](#q2-processes-tooling-environments--team-integration)
     - [Q3: Measuring Success & QA Metrics](#q3-measuring-success--qa-metrics)
   - [1.2 Test Planning & Automation](#12-test-planning--automation)
     - [Task A: Comprehensive Test Plan (DemoQA Book Store Application)](#task-a-comprehensive-test-plan-demoqa-book-store-application)
     - [Task B: Automated Single Flow Implementation (Playwright & Karate)](#task-b-automated-single-flow-implementation-playwright--karate)
3. [Part 2: Leadership & Soft Skills](#part-2-leadership--soft-skills)
   - [2.1 Mentoring Scenario](#21-mentoring-scenario)
     - [Task A: 3-Month Junior QA Development & Mentoring Plan](#task-a-3-month-junior-qa-development--mentoring-plan)
     - [Task B: Constructive Code Review Exercise](#task-b-constructive-code-review-exercise)
4. [Part 3: Strategic & Analytical Thinking](#part-3-strategic--analytical-thinking)
   - [Multi-Currency Settlement with FX Conversion](#feature-multi-currency-settlement-with-fx-conversion)
     - [Task A: Risk-Based Test Strategy](#task-a-risk-based-test-strategy)
     - [Task B: Test Data Strategy](#task-b-test-data-strategy)
5. [Submission Deliverables & Verification Checklist](#submission-deliverables--verification-checklist)

---

# Executive Summary

This document presents a comprehensive technical strategy and assessment submission for the Senior QA Engineer position. It addresses:

- **Part 1**: Establishing a high-performing QA organization in a fast-moving fintech environment (Golang microservices, Next.js dashboard, 100K tx/day), coupled with a complete test plan and live automated implementations in Playwright (Web) and Karate (API) for the DemoQA bookstore.
- **Part 2**: Leadership frameworks for mentoring a junior engineer across technical programming skills, defect reporting quality, and constructive code reviews.
- **Part 3**: A strategic, risk-based testing and test data architecture for a critical financial feature: Multi-Currency Settlement with dynamic FX Conversion and provider fallback.

---

# Part 1: Technical Excellence

## 1.1 Test Strategy & Design

### Context Overview

- **Backend**: Golang microservices handling high-risk transactions, refunds, and settlements.
- **Frontend**: Next.js merchant dashboard and customer checkout flows.
- **Scale**: 100,000 transactions/day, deploying daily.
- **Team**: 1 Senior QA (Lead), 3 Backend Engineers, 2 Frontend Engineers, 2 Junior QAs (manual only).
- **Current State**: Zero test automation, absence of formal quality gates, frequent production bugs.

---

### Q1: 30-Day QA Transformation Plan & Immediate Priorities

#### What to Prioritize First

In a financial payment system processing 100K transactions/day deploying daily, **financial correctness, transaction integrity, and release safety** are the top priorities. The primary objective is to **stop the bleeding immediately** without grinding development velocity to a halt.

```
+-----------------------------------------------------------------------------------+
|                            30-DAY STRATEGIC TIMELINE                              |
+---------------------+----------------------+---------------------+----------------+
| Days 1-7:           | Days 8-15:           | Days 16-23:         | Days 24-30:    |
| Triage & Baseline   | Process & Gateways   | Automation Base     | Scale & Upskill|
| - Defect audit      | - "Three Amigos"     | - CI Smoke gates    | - Junior QAs   |
| - Critical journey  | - Severity rubric    | - Go API contract   |   write tests  |
|   mapping           | - Staging sandbox    | - Playwright smoke  | - KPI review   |
+---------------------+----------------------+---------------------+----------------+
```

#### Detailed Phase Breakdown

#### Phase 1 (Days 1–7): Discovery, Stabilization & Triage

1. **Audit Production Incidents & Bug Root Causes**:
   - Analyze the last 3–6 months of production bugs. Categorize by layer (Backend calculation, DB race condition, Frontend state, 3rd-party integration failure).
2. **Map Critical Paths**:
   - Identify the "Crown Jewels" (Payment authorization, capture, refunds, merchant settlement payout, webhook delivery).
3. **Establish an Immediate Manual Smoke Gate**:
   - Create a standardized, lightweight 15-minute manual Smoke Test Checklist for daily releases, executed by the two junior QAs before any production deployment.
4. **Define Bug Severity & Priority Rubric**:
   - Align with Product and Engineering on strict P0/P1/P2/P3 definitions with required SLAs.

#### Phase 2 (Days 8–15): Shift-Left & Quality Process Introduction

1. **Implement "Three Amigos" Requirements Review**:
   - Introduce a mandatory 20-minute grooming session per feature between Product Manager, Lead Dev, and QA before coding starts to identify edge cases, negative flows, and acceptance criteria upfront.
2. **Standardize Definition of Done (DoD)**:
   - PRs must have: unit tests passing, QA review sign-off, and non-breaking contract verification.
3. **Restructure Defect Reporting**:
   - Implement structured bug templates in Jira/Linear requiring: Environment, Exact Repro Steps, Expected vs. Actual, Network Payload/cURL, Console/Server logs.

#### Phase 3 (Days 16–23): Automation Foundation & CI/CD Gating

1. **Setup Core Automation Repositories**:
   - **Backend**: Go integration tests (`testify` + `testcontainers-go` for PostgreSQL/Redis dependencies) targeting payment and refund APIs.
   - **Frontend**: Playwright framework testing the Next.js checkout flow and merchant dashboard authentication.
2. **Integrate into CI Pipeline (GitHub Actions)**:
   - Configure blocking smoke test runs on Pull Requests:
     - Linting & formatting.
     - Unit & Go API contract tests.
     - Headless Playwright checkout smoke tests.
   - Target execution time: **< 6 minutes**.

#### Phase 4 (Days 24–30): Enablement, Measurement & Continuous Improvement

1. **Upskill Junior QA Engineers**:
   - Transition the 2 manual QAs into automation contributors. Pair with them to convert daily manual smoke checks into automated Playwright/Karate scripts.
2. **Establish Quality Review Cadence**:
   - Review 30-day outcomes with the VP of Engineering and Product. Present baseline quality metrics and roadmap for the next 60 days.

---

### Q2: Processes, Tooling, Environments & Team Integration

#### 1. End-to-End Testing Workflow

```
  [Product Spec] ──> [Three Amigos Grooming] ──> [Development & Unit Tests]
                                                          │
  [Prod Monitor] <── [Canary Release] <── [Staging/CI] <── [PR Review + Smoke Gate]
```

- **Pre-Development**: Acceptance criteria written in Gherkin format (BDD). Edge cases identified before code is written.
- **In-Development**: Developers own unit tests (>80% coverage on financial math). QA creates test plans and prepares test data.
- **Pre-Merge (PR Gate)**: Automated CI checks run unit tests, Go API integration tests, and Playwright smoke tests.
- **Pre-Deployment (Staging)**: Daily release candidate deployed to staging. Automated regression suite runs; Junior QAs execute exploratory testing charters.
- **Post-Deployment (Production)**: Automated synthetic monitors probe checkout health every 2 minutes. Datadog/Sentry alerts monitor error rates.

#### 2. Tooling Architecture

| Layer                   | Recommended Tool                                    | Rationale                                                                                              |
| :---------------------- | :-------------------------------------------------- | :----------------------------------------------------------------------------------------------------- |
| **Backend API Testing** | Go native `testing`, `testify`, `testcontainers-go` | Native language alignment with backend devs; zero overhead; tests spin up real DB instances in Docker. |
| **Contract Testing**    | Pact / OpenAPI Schemathesis                         | Ensures Go microservice payload changes never break Next.js frontend pages.                            |
| **E2E UI Automation**   | Playwright (TypeScript)                             | Fast, reliable auto-waiting, native network mocking, handles Next.js SSR/hydration seamlessly.         |
| **API BDD Automation**  | Karate Framework                                    | Declarative BDD testing for complex multi-step API journeys without boilerplate.                       |
| **CI/CD**               | GitHub Actions                                      | Parallelized matrix execution, automated PR comments, artifact upload.                                 |
| **Defect Tracking**     | Linear / Jira                                       | Structured fields for steps, expected vs. actual, logs, and root cause tagging.                        |
| **Observability**       | Sentry & Datadog                                    | Live tracing of transaction errors, latency anomalies, and frontend hydration exceptions.              |

#### 3. Environment Strategy

1. **Local (Dev Machine)**:
   - `docker-compose.yml` or dev containers providing localized Go services, PostgreSQL, Redis, and mocked external payment gateways.
2. **Ephemeral PR Environments (Preview)**:
   - Next.js frontend deployed via Vercel preview URLs, pointing to a shared sandbox API gateway.
3. **Staging Environment**:
   - Full production parity. Connected to external payment processor sandboxes (Stripe/Adyen test mode). Sanitized seed data with automated daily database restore.
4. **Production**:
   - Feature flags (LaunchDarkly or PostHog) to decouple deployment from release. Synthetic probes run read-only smoke checks continually.

#### 4. QA Integration with the Development Team

- **Quality as a Team Ownership Culture**: QA does not "own" quality alone; QA provides the infrastructure, visibility, and standards so that developers write testable code and ship safely.
- **Pairing Cadence**:
  - QA pairs with Backend devs on API contract definition and DB migration verification.
  - QA pairs with Frontend devs on accessible locators (`data-testid`, ARIA roles).
  - QA pairs with Junior QAs daily on test design and automation tasks.

---

### Q3: Measuring Success & QA Metrics

To evaluate and demonstrate the concrete business and technical impact of the QA function, we track three balanced tiers of metrics:

```
+--------------------------------------------------------------------------------+
|                             QA METRIC FRAMEWORK                                |
+--------------------------------+-------------------------------+---------------+
| Tier 1: Quality & Stability    | Tier 2: Velocity & Efficiency | Tier 3: Team  |
| - Defect Escape Rate (<3%)     | - CI Pipeline Duration (<7m)  | - Bug Reject  |
| - Production Sev0/Sev1 = 0     | - MTTR (<30 min)              |   Rate (<5%)  |
| - Flaky Test Rate (<1%)        | - Deployment Frequency (Daily)| - Automation %|
+--------------------------------+-------------------------------+---------------+
```

#### Tier 1: Quality & Stability Metrics (Business Value)

1. **Defect Escape Rate (DER)**:
   $$\text{DER} = \frac{\text{Bugs Found in Production}}{\text{Total Bugs (QA + Production)}} \times 100$$
   - _Target_: **< 3%** within 90 days.
2. **High-Severity Incidents (P0/P1)**:
   - _Target_: **0 production payment or settlement discrepancies**.
3. **Flaky Test Ratio**:
   - _Target_: **< 1%**. Any test that fails intermittently is quarantined immediately into a dedicated track.

#### Tier 2: Velocity & Efficiency Metrics (Engineering Productivity)

1. **Mean Time to Detect (MTTD) & Mean Time to Resolve (MTTR)**:
   - Demonstrates that when an issue occurs, synthetic monitoring catches it in seconds, and rollback/fix takes < 30 minutes.
2. **CI Test Execution Duration**:
   - _Target_: PR smoke gate executes in **under 6 minutes** through parallelization.
3. **Deployment Frequency & Change Failure Rate (DORA Metrics)**:
   - Change Failure Rate target: **< 5%** while sustaining daily production releases.

#### Tier 3: Process & Team Health Metrics

1. **Bug Rejection Rate**:
   - Tracks how many QA-filed bugs are rejected as "Cannot Reproduce" or "Working as Designed".
   - _Target_: **< 5%** (indicates clear, reproducible, and accurate bug reports).
2. **Manual vs. Automated Regression Ratio**:
   - Progression tracking of the 2 junior QAs automating repetitive manual tasks.

---

## 1.2 Test Planning & Automation

### Task A: Comprehensive Test Plan (DemoQA Book Store Application)

**Application Under Test**:

- Web Application: [https://demoqa.com/books](https://demoqa.com/books)
- API Specification: [https://demoqa.com/swagger](https://demoqa.com/swagger)

#### 1. Scope and Test Objectives

- Verify complete end-to-end user journeys for readers browsing the bookstore, managing accounts, searching books, modifying their personal collections, and authenticating securely.
- Validate API contract conformity, HTTP status codes, data integrity, error resilience, and payload validation.
- Provide reliable, reproducible, unattended test automation across Web and API layers.

#### 2. Architecture & System Dependencies

- **Frontend**: React / Next.js single-page application with responsive table views, dynamic modal dialogs, and browser alerts.
- **Backend API**: Express / Node.js microservices exposing Account and BookStore v1 resources.
- **Authentication**: Stateless Bearer JWT tokens returned from `/Account/v1/GenerateToken` and `/Account/v1/Login`.

#### 3. Test Coverage Matrix by Functional Area

| Area           | Feature                 | Test Scenarios                                 | Expected Response / Status               | Automation Layer |
| :------------- | :---------------------- | :--------------------------------------------- | :--------------------------------------- | :--------------- |
| **Auth**       | Account Registration    | Valid username + complex password              | 201 Created, `userID` generated          | API & Web        |
| **Auth**       | Registration Validation | Weak password (<8 chars, missing special char) | 400 Bad Request (Code 1300)              | API              |
| **Auth**       | Registration Duplicate  | Register existing username                     | 406 Not Acceptable / Duplicate Error     | API              |
| **Auth**       | Token Generation        | Valid credentials                              | 200 OK, `status: Success`, JWT token     | API              |
| **Auth**       | Token Generation        | Invalid password                               | 200 OK, `status: Failed`, `token: null`  | API              |
| **Auth**       | UI Login                | Valid credentials                              | Redirect to `/profile`, show username    | Web              |
| **Auth**       | UI Logout               | Click Logout button                            | Redirect to `/login`, clear session      | Web              |
| **Catalog**    | Book Search             | Search by title ("Git Pocket Guide")           | Exactly 1 matching book returned         | Web & API        |
| **Catalog**    | Book Search             | Search with non-matching term                  | "No rows found" / empty result           | Web & API        |
| **Catalog**    | Search Resilience       | Search with XSS (`<script>alert(1)</script>`)  | Sanitized input, no script execution     | Web              |
| **Collection** | Add Book                | Add single book with valid Bearer token        | 201 Created, book appended to collection | API & Web        |
| **Collection** | Duplicate Add           | Add book already in collection                 | 400 Bad Request ("ISBN already present") | API              |
| **Collection** | Unauthorized Add        | Add book without Bearer token                  | 401 Unauthorized                         | API              |
| **Collection** | View Collection         | Fetch user profile with token                  | 200 OK, list contains added book         | API & Web        |
| **Collection** | View Collection         | Access `/profile` unauthenticated              | 401 Unauthorized / Warning banner        | API & Web        |
| **Collection** | Delete Single Book      | Delete existing book by ISBN + userId          | 204 No Content, row removed              | API & Web        |
| **Collection** | Delete Non-existent     | Delete ISBN not in user collection             | 400 Bad Request / 404 Not Found          | API              |
| **Account**    | Teardown / Cleanup      | Delete user account by `userId`                | 204 No Content, user purged              | API              |

#### 4. Error Handling & Edge Cases

1. **Network Interruption**: Resilient retries and timeout thresholds (20s action timeout, 30s navigation timeout).
2. **Concurrency / Race Conditions**: Rapid double-clicking "Add To Your Collection" must not produce duplicate entries in the database.
3. **Dynamic Alert & Modal Synchronization**: Handling window `dialog` events concurrently with HTTP REST responses to avoid race conditions.
4. **Token Expiry**: Verification that expired or malformed JWT tokens fail with HTTP 401.

---

### Task B: Automated Single Flow Implementation (Playwright & Karate)

The repository implements the exact single continuous flow across both Web (Playwright) and API (Karate):

1. **Register & login**
2. **Search and add book to collection**
3. **See list of your book collection**
4. **Delete book from your collection**
5. **Logout**

#### Architecture & Implementation Details

```
tests/
├── api/
│   └── book-flow.feature        # Karate BDD API implementation (5 steps)
├── features/
│   └── book-store-flow.feature  # Playwright BDD Single E2E Web Flow (5 steps)
├── fixtures/
│   └── account.fixture.js       # Disposable account generator & API cleanup
├── step-definitions/
│   ├── authentication.steps.js  # Resilient logout and profile locators
│   ├── book-collection.steps.js # Modal `#closeSmallModal-ok` & table verification
│   └── book-search.steps.js     # Catalog search bindings
└── support/
    ├── hooks.js                 # Browser context, tracing, screenshot on failure
    └── test-config.js           # Cross-browser & mobile viewport options
```

#### Running the Automations

```bash
# Install dependencies
npm ci
npx playwright install chromium

# Run Karate API Tests
npm run test:api

# Run Playwright Web Tests
npm run test:web

# Run Everything
npm test
```

- **Live Repository**: [https://github.com/hili1231/DemoQA](https://github.com/hili1231/DemoQA)
- **CI Build**: [GitHub Actions Workflow #34562838573](https://github.com/hili1231/DemoQA/actions/runs/34562838573) (`✓ Completed successfully`).

---

# Part 2: Leadership & Soft Skills

## 2.1 Mentoring Scenario

### Situation

A junior QA engineer (6 months experience):

- Eager to learn automation, but struggles with programming fundamentals.
- Test cases are too vague and miss critical edge cases.
- Gets discouraged when developers reject their bugs.
- Has difficulty estimating testing effort accurately.

---

### Task A: 3-Month Junior QA Development & Mentoring Plan

#### 1. Three-Month Structured Roadmap

```
+-----------------------------------------------------------------------------------+
|                        3-MONTH JUNIOR QA ROADMAP                                  |
+---------------------+----------------------+--------------------------------------+
| Month 1:            | Month 2:             | Month 3:                             |
| Quality Fundamentals| Edge Cases & First   | Independent Automation               |
| & Defect Excellence | Automation Steps     | & Estimation Mastery                 |
| - Bug reporting     | - Boundary values    | - Independent PRs                    |
| - Repro steps & logs| - JS fundamentals    | - Fibonacci estimation               |
| - Dev empathy       | - Playwright locators| - Pair reviewing                     |
+---------------------+----------------------+--------------------------------------+
```

##### Month 1: Foundation of Defect Excellence & Technical Confidence

- **Goal**: Transform bug reporting quality, eliminate bug rejections, and build dev rapport.
- **Focus Areas**:
  - Writing reproducible bug reports with root-cause artifacts (Network har, console logs, environment context).
  - Understanding developer perspectives: Why bugs get rejected (ambiguity, lack of environment specs, duplicate issues).
  - Introduction to Browser DevTools (DOM inspection, Network tab, Storage).
- **Milestone**: 0 bugs rejected due to "insufficient information" over 4 consecutive sprints.

##### Month 2: Edge Case Analysis & Practical Automation Fundamentals

- **Goal**: Master test design techniques and write first clean automated test scripts.
- **Focus Areas**:
  - Test Design Techniques: Equivalence Partitioning (EP), Boundary Value Analysis (BVA), State Transition Diagrams.
  - JavaScript Fundamentals: Variables, Promises, `async/await`, arrays, and objects.
  - Playwright Basics: Locators, resilient auto-waiting, avoiding hardcoded sleeps.
- **Milestone**: Independently designs a complete test matrix covering edge cases for a feature and automates 3 smoke tests.

##### Month 3: Estimation Mastery & Independent Delivery

- **Goal**: Accurate task estimation and contributing production-ready test automation.
- **Focus Areas**:
  - Estimation: Breaking user stories into test tasks $\le 4$ hours; using reference stories and complexity buffers.
  - Page Object Model (POM) and modular test architecture.
  - Git workflows: branching, committing, creating clean PRs, responding to code reviews.
- **Milestone**: Estimates sprint testing tasks within $\pm 15\%$ accuracy; delivers an automated regression suite PR approved by team.

---

#### 2. Structure of 1:1 Sessions (Bi-Weekly, 45 Minutes)

To build trust, psychological safety, and technical mastery, 1:1 sessions are structured consistently:

```
+-------------------------------------------------------------------------------+
|                       45-MINUTE 1:1 SESSION STRUCTURE                         |
+--------------------+--------------------+--------------------+----------------+
| 10 min:            | 15 min:            | 15 min:            | 5 min:         |
| Psychological      | Work & Defect      | Hands-on Pairing / | Actionable     |
| Check-in           | Retrospective      | Technical Practice | Next Steps     |
+--------------------+--------------------+--------------------+----------------+
```

1. **Check-in & Emotional Wellbeing (10 min)**:
   - "How are you feeling about your workload this week? What made you feel proud? What felt frustrating?"
   - Address any friction with developers constructively, reinforcing that bug discovery is a service to the team.
2. **Work Review & Defect Retrospective (15 min)**:
   - Review recent test cases and bug tickets together.
   - Celebrate well-crafted bug reports. Analyze any rejected bugs without judgment: "How could we have structured this so the dev could reproduce it in 30 seconds?"
3. **Hands-on Technical Pairing (15 min)**:
   - Pair-program on an automation script or model boundary values for an upcoming feature ticket.
4. **Actionable Commitments (5 min)**:
   - Agree on 1–2 specific, bite-sized goals for the next session (e.g., "Complete JavaScript.info Chapter on Promises; add network logs to your next 3 bug reports").

---

#### 3. Specific Resources and Exercises

| Skill Gap                 | Curated Resource                                                                                                                                        | Practical Exercise                                                                                                                                  |
| :------------------------ | :------------------------------------------------------------------------------------------------------------------------------------------------------ | :-------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Programming Struggles** | [JavaScript.info](https://javascript.info) (Part 1: Code Quality & Objects)<br>[Playwright Official Docs & Tutorial](https://playwright.dev/docs/intro) | Write a script to fetch a random book from DemoQA Swagger API and print the title using `fetch` and `async/await`.                                  |
| **Vague Test Cases**      | _Explore It!_ by Elisabeth Hendrickson<br>Test Heuristics Cheat Sheet (James Bach)                                                                      | Take a simple Login box. Apply boundary value analysis and generate 8 edge cases (SQL injection, unicode, max-length, leading/trailing whitespace). |
| **Bug Rejections**        | Internal "Gold Standard Bug Template"                                                                                                                   | Shadow a developer while they fix a bug reported by the junior QA to see what information the dev actually uses.                                    |
| **Inaccurate Estimation** | Planning Poker / Task Decomposition Guides                                                                                                              | Break down a payment flow feature into 4 granular subtasks: Happy path testing (1h), Edge cases (2h), Regression (1h), Buffer (1h).                 |

---

#### 4. How to Measure Progress

- **Quantitative Metrics**:
  - **Bug Rejection Rate**: Target reduction from current baseline (~30%) to **< 5%**.
  - **Estimation Variance**: Estimated vs. actual testing hours within a **$\pm 15\%$ range**.
  - **Automation Contribution**: Number of automated test scenarios authored and merged into main (target: **5+ scripts/month** by Month 3).
- **Qualitative Metrics**:
  - Peer feedback from developers during sprint retrospectives ("Bug reports are clear and easy to reproduce").
  - Autonomous participation in grooming sessions, actively proposing edge cases.

---

### Task B: Constructive Code Review Exercise

#### Junior Engineer's Original Script

```javascript
// test for login
const test = require('playwright');
test('login test', async () => {
  const browser = await test.chromium.launch();
  const page = await browser.newPage();
  await page.goto('<http://localhost:3000/login>');
  await page.fill('#email', 'test@test.com');
  await page.fill('#password', 'password123');
  await page.click('#submit');
  await page.waitForTimeout(5000);
  const url = page.url();
  if (url.includes('dashboard')) {
    console.log('TEST PASSED');
  } else {
    console.log('TEST FAILED');
  }
  await browser.close();
});
```

---

#### Constructive Feedback to Junior Engineer

**Hi Alex!** 👋 Great start on this login test! You've successfully automated the core user interaction flow—opening the browser, entering credentials, submitting, and checking the outcome. That's the heart of automated testing.

I've put together some suggestions below that will help make this script faster, more reliable, and aligned with standard Playwright best practices. Let's walk through them together!

---

#### Specific Issues & Why They Matter

1. **Incorrect Framework Import (`require('playwright')`)**:
   - _Why it matters_: In Playwright Test runner, we import `{ test, expect }` from `'@playwright/test'`, not `'playwright'`. Using `@playwright/test` gives you built-in test fixtures, browser management, reporting, and assertions automatically.
2. **Manual Browser & Context Lifecycle Management**:
   - _Why it matters_: Manually launching `test.chromium.launch()` and `browser.close()` is redundant in Playwright Test and bypasses isolated browser contexts. Playwright provides a pre-configured, clean `{ page }` fixture for every test, ensuring tests run in complete isolation and close automatically even if the test fails.
3. **Hardcoded Sleep (`waitForTimeout(5000)`)**:
   - _Why it matters_: Fixed sleeps make test runs unnecessarily slow (wasting 5 seconds on every run) and cause flaky test failures on slower CI runners if the page takes 5.1 seconds. Playwright features built-in **auto-waiting** web-first assertions that poll automatically until the condition passes.
4. **Using `if/else` with `console.log()` instead of Assertions (`expect`)**:
   - _Why it matters_: CI/CD test runners look at exit codes and assertion errors to know if a build should pass or fail. `console.log('TEST FAILED')` prints text to the screen, but the test runner thinks the test passed with exit code 0! We use `await expect(page).toHaveURL(...)` so failures halt execution and alert the team.
5. **Fragile CSS Selectors (`#email`, `#submit`)**:
   - _Why it matters_: Generic ID selectors can change during frontend redesigns. Playwright recommends user-facing locators like `getByLabel('Email')` or `getByRole('button', { name: 'Sign in' })`, which mirror how real users interact with the page and ensure accessibility.
6. **Hardcoded Credentials & URLs**:
   - _Why it matters_: Hardcoding `http://localhost:3000` prevents running the test against staging or production environments. Using `baseURL` in `playwright.config.js` and environment variables keeps the code reusable and secure.

---

#### Corrected, Production-Ready Code

```javascript
import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('should successfully log in and redirect to merchant dashboard', async ({
    page,
  }) => {
    // 1. Navigate to login (uses baseURL configured in playwright.config.ts)
    await page.goto('/login');

    // 2. Fill credentials using accessible, user-facing locators
    await page
      .getByLabel('Email address')
      .fill(process.env.TEST_USER_EMAIL || 'test@test.com');
    await page
      .getByLabel('Password')
      .fill(process.env.TEST_USER_PASSWORD || 'password123');

    // 3. Submit login
    await page.getByRole('button', { name: 'Sign in' }).click();

    // 4. Web-first assertion: auto-waits up to 5s for URL change, fails CI properly if condition not met
    await expect(page).toHaveURL(/\/dashboard/);

    // 5. Verify a key dashboard element is visible to guarantee hydration
    await expect(
      page.getByRole('heading', { name: 'Merchant Overview' }),
    ).toBeVisible();
  });
});
```

Let's pair on your next PR and migrate your existing login test together. You're making awesome progress! 🚀

---

# Part 3: Strategic & Analytical Thinking

## Feature: Multi-Currency Settlement with FX Conversion

### Requirements Overview

- **Currencies**: Merchants can settle in any of **15 supported currencies** (USD, EUR, GBP, JPY, CAD, AUD, SGD, CHF, HKD, NZD, SEK, NOK, DKK, BHD, AED).
- **Rate Providers**: Real-time FX rates from **3 external providers** with an automated dynamic fallback mechanism.
- **Quote Locking**: Quoted FX rate locked for **60 seconds** after quote generation.
- **Thresholds**: Minimum settlement threshold varies per currency (e.g. 100 JPY vs 1 USD vs 0.500 BHD).
- **Regulatory**: Cross-border transactions require strict AML/sanction checks and compliance reporting.

---

### Task A: Risk-Based Test Strategy

```
+------------------------------------------------------------------------------------+
|                         RISK-BASED TESTING MATRIX                                  |
+-------------------+--------------------------------+-------------------------------+
| Risk Level        | Failure Scenario               | Mitigation Strategy           |
+-------------------+--------------------------------+-------------------------------+
| HIGH              | - FX rate slippage after 60s   | - Millisecond clock-travel    |
| (Financial Loss / | - Currency rounding truncation |   boundary tests (59s vs 61s) |
|  Compliance Breach| - Provider 1/2/3 failover      | - Strict decimal assertions   |
|                   | - Sanctioned entity settlement | - Chaos/circuit-breaker tests |
+-------------------+--------------------------------+-------------------------------+
| MEDIUM            | - Min settlement bypass        | - Equivalence partitioning    |
| (Merchant Impact /| - Concurrent double-settlement | - Concurrency & DB lock tests |
|  Reconciliation)  | - Discrepancy in ledger balance| - Multi-currency ledger audit |
+-------------------+--------------------------------+-------------------------------+
| LOW               | - UI currency symbol display   | - Visual regression tests     |
| (Cosmetic)        | - Minor notification delay     | - Asynchronous queue polling  |
+-------------------+--------------------------------+-------------------------------+
```

#### 1. Risk Identification & Categorization

##### High-Impact Risks (Direct Financial Loss, Regulatory Penalties, or Systemic Outage)

1. **FX Rate Slippage / Quote Expiration Failure**:
   - _Risk_: Transactions execute using an expired locked rate after the 60-second window, exposing the business to severe foreign exchange volatility losses.
2. **Provider Failover Cascade & Stale Rates**:
   - _Risk_: Provider 1 times out; fallback to Provider 2/3 fails, receives stale/zero rates, or produces conflicting quote spreads that get executed.
3. **Multi-Currency Rounding & Precision Errors**:
   - _Risk_: Currencies have different decimal precisions (e.g. JPY has 0 decimals; USD/EUR have 2 decimals; BHD/KWD have 3 decimals). Inappropriate float rounding causes balance discrepancies, reconciliation failures, or truncation fraud.
4. **Regulatory Sanction Bypass**:
   - _Risk_: Cross-border settlement executed to a sanctioned individual, bank, or jurisdiction without triggering mandatory compliance halts.

##### Medium-Impact Risks (Operational Degradation, Merchant Inconvenience)

1. **Minimum Settlement Threshold Bypass**:
   - _Risk_: Merchant attempts payout below threshold (e.g., $0.10 USD or 10 JPY), causing transaction fees to exceed settlement value.
2. **Race Conditions & Double Payouts**:
   - _Risk_: Merchant clicks "Settle" twice rapidly; concurrent requests process simultaneous conversions from the same balance.
3. **Internal Ledger Discrepancies**:
   - _Risk_: Debited source currency does not match credited destination currency after settlement ledger posting.

##### Low-Impact Risks (Cosmetic & Non-Blocking)

1. **Currency Symbol & Locale Display**:
   - _Risk_: Formatting `$1,000.00` vs `1.000,00 €` or displaying incorrect currency symbols on PDF invoices.
2. **Non-Critical Notifications**:
   - _Risk_: Merchant email receipt delayed by 2 minutes during high settlement traffic.

---

#### 2. Risk-Based Testing Approach & Coverage Definition

| Risk Level | Test Strategy & Coverage Approach                                                                                                                                                                                                   | Target Test Types                            | Gate Requirement                                                            |
| :--------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------- | :-------------------------------------------------------------------------- |
| **High**   | **Exhaustive Automated Coverage (100%)**.<br>- Property-based testing for all 15 currency pairs.<br>- Millisecond-precise boundary tests for quote locking.<br>- Fault injection (Chaos engineering) simulating provider downtimes. | Unit, Contract, Integration, Fault-Injection | **Blocking CI Gate**: 0 defects tolerated. Must pass on every pull request. |
| **Medium** | **Automated Scenario Coverage & Concurrency Testing**.<br>- Concurrency tests verifying database row-level locking during settlement.<br>- Boundary Value Analysis on minimum thresholds for all 15 currencies.                     | Integration & E2E Automated Tests            | **Pre-Release Gate**: Automated regression in staging environment.          |
| **Low**    | **Sampling & Visual Regression**.<br>- Automated visual snapshots of merchant settlement reports across desktop/mobile.<br>- Exploratory edge-case testing.                                                                         | Visual Regression & Exploratory              | Tracked via normal sprint backlog.                                          |

---

#### 3. Proposed Testing Environments

1. **Local & Ephemeral PR Environments**:
   - Go microservices running with mock FX providers simulating instant responses, delayed responses, and HTTP 500 errors.
2. **Staging Multi-Currency Sandbox**:
   - **Time-Travel Testing Service**: Capability to advance system clocks by 59s, 60s, and 61s to test quote expiry deterministically.
   - Connected to real sandbox provider endpoints with synthetic rate feeds.
   - Pre-seeded with 15 merchant accounts holding balances across all 15 currencies.
3. **Production Canary & Shadowing**:
   - **Shadow Settlement Engine**: Inbound settlement requests generate real quotes from live providers in shadow mode to compare calculations against legacy systems without transferring real funds.

---

### Task B: Test Data Strategy

#### 1. What Test Data is Needed?

To validate 15 currencies, dynamic rates, thresholds, and compliance, the test suite requires:

- **Currency Configuration Master**:
  - ISO code, symbol, decimal precision (0, 2, or 3), active/inactive status, minimum settlement amount.
- **Merchant Persona Test Profiles**:
  - Verified merchant, Unverified merchant, Suspended merchant, Merchant in high-risk jurisdiction, Merchant with bank accounts in each of the 15 currencies.
- **Transaction Amount Matrices**:
  - Below minimum threshold (e.g., $0.99 USD, 99 JPY, 0.499 BHD).
  - Exact minimum threshold ($1.00 USD, 100 JPY, 0.500 BHD).
  - Normal settlement amount ($5,000 USD).
  - High-value threshold triggering enhanced regulatory reporting ($100,000+ USD equivalent).
- **FX Provider Rate Scenarios**:
  - Normal market rates, extreme market volatility spikes (+/- 25%), inverse rates, provider parity mismatch.
- **Compliance & Sanction Datasets**:
  - Specially Designated Nationals (SDN) test entities to trigger compliance blocking.

---

#### 2. Managing Currency-Specific Test Data

To ensure consistency, currency-specific rules are defined in a **single source of truth configuration fixture**:

```javascript
// Test fixture: Currency rules across all 15 supported currencies
export const SUPPORTED_CURRENCIES = {
  USD: { code: 'USD', decimals: 2, minSettlement: '1.00', symbol: '$' },
  EUR: { code: 'EUR', decimals: 2, minSettlement: '1.00', symbol: '€' },
  GBP: { code: 'GBP', decimals: 2, minSettlement: '1.00', symbol: '£' },
  JPY: { code: 'JPY', decimals: 0, minSettlement: '100', symbol: '¥' },
  BHD: { code: 'BHD', decimals: 3, minSettlement: '0.500', symbol: 'BD' },
  AED: { code: 'AED', decimals: 2, minSettlement: '5.00', symbol: 'AED' },
  // ... remaining 9 currencies
};
```

- **Factory Pattern for Test Data Generation**:
  Dynamic test factories generate settlement payloads using exact decimal precisions without float arithmetic issues (using `Decimal.js` or Go's `shopspring/decimal`).
- **Database Isolation**:
  Each test suite execution operates on independent merchant account IDs with freshly seeded balances to prevent test contamination.

---

#### 3. Handling FX Rate Testing: Mocking vs. Real Providers

A world-class test strategy combines **deterministic mock testing (90%)** with **real-world sandbox verification (10%)**:

```
+-------------------------------------------------------------------------------+
|                       MOCKING VS REAL PROVIDER STRATEGY                       |
+-----------------------------------+-------------------------------------------+
| MOCK PROVIDERS (90% of Suite)     | REAL SANDBOX PROVIDERS (10% of Suite)     |
| - Fast, deterministic (<5ms)      | - Validates 3rd-party contract drift      |
| - Simulates rate spikes & errors  | - Verifies authentic network latency      |
| - Tests 60s expiration boundary   | - Nightly staging monitor runs            |
+-----------------------------------+-------------------------------------------+
```

##### Mocking Strategy (CI Pipeline & Unit/Integration Tests)

- **Why Mock?** Real FX feeds fluctuate continuously; tests asserting exact converted settlement values would fail unpredictably. External providers rate-limit API calls and incur costs.
- **Mocking Architecture**:
  - Implement a configurable mock server (WireMock or Go mock HTTP server).
  - Simulate deterministic test scenarios:
    - **Scenario A (Normal)**: Provider 1 returns rate 1.0850.
    - **Scenario B (Provider 1 Fails)**: Provider 1 returns HTTP 504 Gateway Timeout $\rightarrow$ System falls back to Provider 2 within 200ms without merchant disruption.
    - **Scenario C (All Providers Down)**: Provider 1, 2, and 3 all fail $\rightarrow$ System halts settlement with merchant-friendly error: `"FX conversion service temporarily unavailable; your funds remain safe."`
    - **Scenario D (Quote Expiry Boundary)**:
      - At $T = 59.9\text{s}$: Settlement succeeds with locked rate.
      - At $T = 60.1\text{s}$: Settlement rejected with code `QUOTE_EXPIRED`; prompts merchant for rate refresh.

##### Real Sandbox Provider Strategy (Staging & Nightly Smoke Checks)

- Run an automated nightly verification job against authentic third-party sandbox APIs (e.g., Bloomberg, XE, OANDA test environments).
- **Purpose**: Detect external API breaking changes, schema drift, SSL protocol updates, or unexpected rate format changes before they affect production.

---

# Submission Deliverables & Verification Checklist

| Deliverable Requirement              | Status       | Evidence / Verification                                                                                                                                                          |
| :----------------------------------- | :----------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Written Document (PDF/Doc)**       | **Complete** | Comprehensive markdown covering Parts 1, 2, and 3 formatted for PDF/Google Docs conversion.                                                                                      |
| **Part 1.1: Test Strategy & Design** | **Complete** | 30-day plan, process & tooling roadmap, environment strategy, and 3-tier metric framework.                                                                                       |
| **Part 1.2 Task A: Test Plan**       | **Complete** | Full bookstore test plan covering functional, API, edge cases, error codes, and traceabilities.                                                                                  |
| **Part 1.2 Task B: Web Automation**  | **Complete** | Playwright Web E2E single flow (`tests/features/book-store-flow.feature`), resilient locators, passing tests.                                                                    |
| **Part 1.2 Task B: API Automation**  | **Complete** | Karate API E2E single flow (`tests/api/book-flow.feature`), idiomatic BDD, passing in 5.8s.                                                                                      |
| **Part 2.1 Task A: Mentoring Plan**  | **Complete** | 3-month roadmap, 45-min bi-weekly 1:1 structure, curated exercises, and KPIs.                                                                                                    |
| **Part 2.1 Task B: Code Review**     | **Complete** | Constructive review explaining the _why_, encouraging tone, and production-ready Playwright code.                                                                                |
| **Part 3 Task A: Risk Strategy**     | **Complete** | High/Med/Low risk categorization, test coverage matrix, and multi-currency testing environments.                                                                                 |
| **Part 3 Task B: Test Data**         | **Complete** | 15-currency test data fixtures, decimal precision rules, and mock vs real provider architecture.                                                                                 |
| **Git Repository**                   | **Complete** | [https://github.com/hili1231/DemoQA](https://github.com/hili1231/DemoQA) with green CI status ([Run #34562838573](https://github.com/hili1231/DemoQA/actions/runs/34562838573)). |

---

_End of Assessment Submission._
