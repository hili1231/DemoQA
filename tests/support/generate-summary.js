const fs = require('node:fs');
const path = require('node:path');

function generateKarateSummary() {
  const summaryJsonPath = path.resolve(
    __dirname,
    '..',
    '..',
    'reports',
    'karate',
    'karate-reports',
    'karate-summary-json.txt',
  );
  if (!fs.existsSync(summaryJsonPath)) {
    return 'Karate summary report not found.';
  }
  const data = JSON.parse(fs.readFileSync(summaryJsonPath, 'utf8'));
  const lines = [
    '### ⚡ Karate API Test Results',
    '',
    '| Feature | Scenarios Passed | Scenarios Failed | Duration | Status |',
    '| :--- | :--- | :--- | :--- | :--- |',
  ];
  for (const f of data.featureSummary || []) {
    const status = f.failed ? 'FAILED' : 'PASSED';
    const duration = `${(f.durationMillis / 1000).toFixed(2)}s`;
    lines.push(
      `| \`${f.relativePath || f.name}\` | ${f.passedCount} | ${f.failedCount} | ${duration} | ${status} |`,
    );
  }
  lines.push('');
  lines.push(
    `**Overall**: ${data.scenariosPassed} passed, ${data.scenariosfailed} failed in ${(data.elapsedTime / 1000).toFixed(2)}s`,
  );
  const cleanupPath = path.resolve(
    __dirname,
    '..',
    '..',
    'reports',
    'karate',
    'cleanup-status.json',
  );
  if (fs.existsSync(cleanupPath)) {
    const cleanup = JSON.parse(fs.readFileSync(cleanupPath, 'utf8'));
    if (cleanup.failures)
      lines.push(
        `**Cleanup failed for ${cleanup.failures} scenario(s). The overall run failed.**`,
      );
  }
  return lines.join('\n');
}

function generateCucumberSummary() {
  const cucumberJsonPath = path.resolve(
    __dirname,
    '..',
    '..',
    'reports',
    'cucumber.json',
  );
  if (!fs.existsSync(cucumberJsonPath)) {
    return 'Cucumber summary report not found.';
  }
  const data = JSON.parse(fs.readFileSync(cucumberJsonPath, 'utf8'));
  return renderCucumberSummary(data);
}

function cell(value) {
  return String(value ?? '')
    .replaceAll('|', '\\|')
    .replace(/[\r\n]+/g, ' ');
}

function scenarioStatus(steps) {
  if (!steps.length) return 'unknown';
  const statuses = steps.map((step) => step.result?.status || 'unknown');
  for (const status of ['failed', 'ambiguous', 'undefined', 'pending']) {
    if (statuses.includes(status)) return status;
  }
  if (statuses.some((status) => !['passed', 'skipped'].includes(status)))
    return 'unknown';
  return statuses.includes('skipped') ? 'skipped' : 'passed';
}

function renderCucumberSummary(data) {
  const lines = [
    '### 🎭 Playwright Web Test Results',
    '',
    '| Feature | Scenario | Steps Passed | Steps Failed | Duration | Status |',
    '| :--- | :--- | :--- | :--- | :--- | :--- |',
  ];
  let totalPassed = 0;
  let totalFailed = 0;
  let totalSkipped = 0;
  let totalDuration = 0;

  for (const feature of data) {
    for (const el of feature.elements || []) {
      if (
        el.type !== 'scenario' &&
        !['Scenario', 'Scenario Outline'].includes(el.keyword)
      )
        continue;
      const steps = el.steps || [];
      const visibleSteps = steps.filter((step) => !step.hidden);
      const passedSteps = visibleSteps.filter(
        (s) => s.result?.status === 'passed',
      ).length;
      const failedSteps = visibleSteps.filter((s) =>
        ['failed', 'ambiguous', 'undefined', 'pending'].includes(
          s.result?.status,
        ),
      ).length;
      const state = scenarioStatus(steps);
      if (state === 'passed') totalPassed++;
      else if (state === 'skipped') totalSkipped++;
      else totalFailed++;

      const durationNs = steps.reduce(
        (acc, s) => acc + (s.result?.duration || 0),
        0,
      );
      totalDuration += durationNs;
      const duration = `${(durationNs / 1e9).toFixed(2)}s`;
      const icon =
        state === 'passed' ? '✅' : state === 'skipped' ? '⏭️' : '❌';
      const status = `${icon} ${state.toUpperCase()}`;

      lines.push(
        `| ${cell(feature.name)} | ${cell(el.name)} | ${passedSteps}/${visibleSteps.length} | ${failedSteps} | ${duration} | ${status} |`,
      );
    }
  }
  lines.push('');
  lines.push(
    `**Overall**: ${totalPassed} passed, ${totalFailed} failed/incomplete, ${totalSkipped} skipped in ${(totalDuration / 1e9).toFixed(2)}s`,
  );
  if (totalPassed + totalFailed + totalSkipped === 0)
    lines.push('No scenarios were reported.');
  return lines.join('\n');
}

function main() {
  const type = process.argv[2];
  let markdown = '';
  if (type === 'api') {
    markdown = generateKarateSummary();
  } else if (type === 'web') {
    markdown = generateCucumberSummary();
  } else {
    markdown = `${generateKarateSummary()}\n\n---\n\n${generateCucumberSummary()}`;
  }

  console.log(markdown);

  if (process.env.GITHUB_STEP_SUMMARY) {
    fs.appendFileSync(
      process.env.GITHUB_STEP_SUMMARY,
      `\n${markdown}\n`,
      'utf8',
    );
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  generateKarateSummary,
  generateCucumberSummary,
  renderCucumberSummary,
};
