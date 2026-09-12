# DemoQA Playwright & Karate Automation

Refer to project skill at [.agents/skills/demoqa-automation/SKILL.md](./.agents/skills/demoqa-automation/SKILL.md) for full guidelines.

Use the skill as the maintained source of framework conventions. Keep scenarios independent, use observable assertions and event-based synchronization, and guarantee visible cleanup outcomes. Lifecycle helpers belong in support code.

The framework supports adding scenarios and data sets as needed. Follow the user's requested scope and preserve existing coverage.

Before submitting code changes, run `npm run lint`, `npm run format:check`, and the affected suites. Report any environment blocker explicitly rather than treating a dry run or old report as a passing test run.
