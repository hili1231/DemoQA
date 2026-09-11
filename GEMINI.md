# Antigravity Rules: DemoQA Playwright & Karate Automation

Refer to [AGENTS.md](./AGENTS.md) and the project skill at [.agents/skills/demoqa-automation/SKILL.md](./.agents/skills/demoqa-automation/SKILL.md) for full guidelines.

## Quick Summary of Rules

1. **Locators & Waiting**: User-facing locators (`getByRole`, etc.); disambiguate modal buttons (`#closeSmallModal-ok`); strictly zero hardcoded sleeps (`page.waitForTimeout` forbidden).
2. **Dialogs**: Register `page.once('dialog', ...)` before triggering actions that produce alerts.
3. **Data Isolation**: Create unique disposable accounts per scenario (`user_${uuid}`) and tear down via API in `After` hooks.
4. **Karate API**: Native Karate DSL only; quote embedded variables `#(var)` in JSON; validate Swagger status codes; tear down created accounts.
5. **Support Scripts**: Place utilities in `tests/support/` (no root `scripts/` folder); guard with `if (require.main === module)`; scope `cucumber.js` require paths.
6. **Verification Gate**: All PRs/commits must pass `npm run lint`, `npm run format:check`, and `npm test`.
