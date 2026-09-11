# Test Plan: DemoQA Book Store Application (Web & API)

**Application Under Test**:

- Web Application: [https://demoqa.com/books](https://demoqa.com/books)
- API Contract: [https://demoqa.com/swagger](https://demoqa.com/swagger)
- Author: Senior QA Engineer Candidate

---

## 1. Introduction & Objectives

This test plan defines the testing strategy, test scenarios, error cases, and automation approach for the **DemoQA Book Store Application**. It covers both the frontend user interface and the underlying RESTful API contract to ensure full functional correctness, security, data consistency, and error resilience.

---

## 2. System Architecture & Scope

### In-Scope Functional Areas

1. **User Account Management**:
   - User registration with password complexity enforcement.
   - User authentication, JWT token generation, and authorization checks.
   - Session lifecycle (login, persistence, and logout).
2. **Book Store Catalog & Search**:
   - Catalog browsing and detail inspection.
   - Real-time client-side search filtering by title, author, and publisher.
3. **Personal Book Collection CRUD**:
   - Adding single and multiple books to a user's collection.
   - Viewing user-specific collections.
   - Deleting single books via confirmation modal.
   - Bulk deletion of collection books.
4. **API Contract & Integration**:
   - Swagger endpoint validation (`/Account/v1/*` and `/BookStore/v1/*`).
   - HTTP status code adherence (200, 201, 204, 400, 401, 404).
   - Error response structure (`code` and `message` fields).

### Out-of-Scope

- DemoQA third-party advertisements and external non-bookstore widgets.
- Solving Google reCAPTCHA automatically on UI registration (unattended automation utilizes API-assisted registration).

---

## 3. Test Matrix & Detailed Scenarios

### 3.1 Authentication & Authorization

| Test ID   | Area     | Scenario               | Steps / Trigger                                               | Expected Result                                                                     | Layer     |
| :-------- | :------- | :--------------------- | :------------------------------------------------------------ | :---------------------------------------------------------------------------------- | :-------- |
| `AUTH-01` | Register | Valid Registration     | `POST /Account/v1/User` with unique username & valid password | 201 Created; returns `userID`, `username`, empty `books` array                      | API & Web |
| `AUTH-02` | Register | Weak Password          | Password < 8 characters or lacking special characters         | 400 Bad Request; code `1300` with password complexity message                       | API       |
| `AUTH-03` | Register | Duplicate Username     | Register with already existing username                       | 406 Not Acceptable; user already exists error                                       | API       |
| `AUTH-04` | Token    | Generate Token Success | `POST /Account/v1/GenerateToken` with valid credentials       | 200 OK; `status: "Success"`, non-empty JWT token returned                           | API       |
| `AUTH-05` | Token    | Generate Token Failure | `POST /Account/v1/GenerateToken` with incorrect password      | 200 OK; `status: "Failed"`, `token: null`, `result: "User authorization failed."`   | API       |
| `AUTH-06` | Auth     | Authorized Check       | `POST /Account/v1/Authorized` with valid credentials          | 200 OK; body returns `true`                                                         | API       |
| `AUTH-07` | UI       | UI Login               | Fill username + password on `/login`, click "Login"           | URL redirects to `/profile`; logged-in username displayed                           | Web       |
| `AUTH-08` | UI       | UI Logout              | Click "Logout" on `/profile`                                  | URL redirects to `/login`; token cleared from local storage                         | Web       |
| `AUTH-09` | Security | Unauthorized Access    | Navigate to `/profile` without active login session           | UI displays warning: "Currently you are not logged into the Book Store application" | Web & API |

---

### 3.2 Book Store Catalog & Search

| Test ID  | Area    | Scenario              | Steps / Trigger                                     | Expected Result                                                   | Layer |
| :------- | :------ | :-------------------- | :-------------------------------------------------- | :---------------------------------------------------------------- | :---- |
| `CAT-01` | Catalog | Get All Books         | `GET /BookStore/v1/Books`                           | 200 OK; JSON array of book objects with `isbn`, `title`, `author` | API   |
| `CAT-02` | Catalog | Get Single Book       | `GET /BookStore/v1/Book?ISBN=9781449325862`         | 200 OK; returns details for "Git Pocket Guide"                    | API   |
| `CAT-03` | Catalog | Get Non-existent Book | `GET /BookStore/v1/Book?ISBN=0000000000`            | 400 Bad Request; ISBN not found error message                     | API   |
| `CAT-04` | Search  | Search Existing Title | Type "Git Pocket Guide" in search input             | Exactly 1 book row displayed in table                             | Web   |
| `CAT-05` | Search  | Search by Author      | Type author name (e.g. "Silverman")                 | Matching books by author displayed                                | Web   |
| `CAT-06` | Search  | Search Non-existent   | Type random string "xyz987"                         | Table displays 0 rows; no matches                                 | Web   |
| `CAT-07` | Search  | Search Resilience     | Type special characters `<script>alert(1)</script>` | Input sanitized; no XSS execution; 0 rows displayed               | Web   |

---

### 3.3 Book Collection Management

| Test ID  | Area    | Scenario                 | Steps / Trigger                                                                     | Expected Result                                                                         | Layer     |
| :------- | :------ | :----------------------- | :---------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------- | :-------- |
| `COL-01` | Add     | Add Book to Collection   | Click "Add To Your Collection" with valid session                                   | Native alert: "Book added to your collection."; `POST /BookStore/v1/Books` returns 201  | Web & API |
| `COL-02` | Add     | Duplicate Add Book       | Add book already present in user collection                                         | 400 Bad Request; message indicates book already exists in collection                    | API       |
| `COL-03` | Add     | Unauthenticated Add      | `POST /BookStore/v1/Books` without Bearer token                                     | 401 Unauthorized; code `1200`, message "User not authorized!"                           | API       |
| `COL-04` | View    | Verify Persistence       | Refresh `/profile` page after adding book                                           | Book remains visible in user collection table                                           | Web & API |
| `COL-05` | Delete  | Delete Single Book       | Click trash icon on book row $\rightarrow$ confirm in modal (`#closeSmallModal-ok`) | Modal confirms deletion; alert "Book deleted."; `DELETE /BookStore/v1/Book` returns 204 | Web & API |
| `COL-06` | Delete  | Empty State Verification | Refresh `/profile` after book deletion                                              | Table contains 0 rows; deleted book link count is 0                                     | Web & API |
| `COL-07` | Delete  | Delete Non-existent      | `DELETE /BookStore/v1/Book` with unowned ISBN                                       | 400 Bad Request; message "ISBN supplied is not available in User's Collection!"         | API       |
| `COL-08` | Cleanup | Delete User Account      | `DELETE /Account/v1/User/{userId}` with Bearer token                                | 204 No Content; user and associated collection purged                                   | API       |

---

## 4. Automation Strategy & Frameworks

### 4.1 Web Automation (Playwright + Cucumber)

- **Framework**: Playwright `^1.63.0` paired with Cucumber `^13.2.1`.
- **Design Pattern**: Behavior-Driven Development (BDD) with modular step definitions and isolated fixtures.
- **Resilience Best Practices**:
  - Auto-waiting web-first assertions (`expect(locator).toBeVisible()`).
  - Strict modal scoping (`#closeSmallModal-ok`) to prevent selector ambiguity.
  - Network-event and dialog-event concurrent synchronization (`Promise.all([waitForResponse, waitForEvent('dialog')])`).
  - Disposable user lifecycle per scenario with cleanup in `After` hooks.

### 4.2 API Automation (Karate Framework)

- **Framework**: Karate `1.4.1` standalone runner.
- **Design Pattern**: Declarative BDD syntax testing the Swagger API contract directly.
- **Coverage**:
  - Register $\rightarrow$ Login $\rightarrow$ Search catalog $\rightarrow$ Add book $\rightarrow$ View collection $\rightarrow$ Delete book $\rightarrow$ Verify unauthenticated status $\rightarrow$ Account teardown.

---

## 5. Test Execution & CI/CD Pipeline

Tests run in **GitHub Actions** on every push and pull request:

1. **Lint & Format**: ESLint 9 + Prettier style verification.
2. **Karate API Suite**: Runs against `https://demoqa.com` in headless CI container.
3. **Playwright Web Suite**: Runs against Chromium headless with automatic report and failure screenshot capture.
4. **Artifact Archiving**: HTML, JSON, and JUnit test reports uploaded automatically.
