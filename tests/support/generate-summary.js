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
    const status = f.failed ? '❌ FAILED' : '✅ PASSED';
    const duration = `${(f.durationMillis / 1000).toFixed(2)}s`;
    lines.push(
      `| \`${f.relativePath || f.name}\` | ${f.passedCount} | ${f.failedCount} | ${duration} | ${status} |`,
    );
  }
  lines.push('');
  lines.push(
    `**Overall**: ${data.scenariosPassed} passed, ${data.scenariosfailed} failed in ${(data.elapsedTime / 1000).toFixed(2)}s`,
  );
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
  const lines = [
    '### 🎭 Playwright Web Test Results',
    '',
    '| Feature | Scenario | Steps Passed | Steps Failed | Duration | Status |',
    '| :--- | :--- | :--- | :--- | :--- | :--- |',
  ];
  let totalPassed = 0;
  let totalFailed = 0;
  let totalDuration = 0;

  for (const feature of data) {
    for (const el of feature.elements || []) {
      if (el.keyword !== 'Scenario') continue;
      const steps = el.steps || [];
      const passedSteps = steps.filter(
        (s) => s.result?.status === 'passed',
      ).length;
      const failedSteps = steps.filter(
        (s) => s.result?.status === 'failed',
      ).length;
      const isFailed = failedSteps > 0;
      if (isFailed) totalFailed++;
      else totalPassed++;

      const durationNs = steps.reduce(
        (acc, s) => acc + (s.result?.duration || 0),
        0,
      );
      totalDuration += durationNs;
      const duration = `${(durationNs / 1e9).toFixed(2)}s`;
      const status = isFailed ? '❌ FAILED' : '✅ PASSED';

      lines.push(
        `| ${feature.name} | ${el.name} | ${passedSteps}/${steps.length} | ${failedSteps} | ${duration} | ${status} |`,
      );
    }
  }
  lines.push('');
  lines.push(
    `**Overall**: ${totalPassed} passed, ${totalFailed} failed in ${(totalDuration / 1e9).toFixed(2)}s`,
  );
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

module.exports = { generateKarateSummary, generateCucumberSummary };
