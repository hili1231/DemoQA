const fs = require('node:fs');
fs.mkdirSync('reports', { recursive: true });
const common = {
  paths: ['tests/features/web/**/*.feature'],
  require: ['tests/support/hooks.js', 'tests/step-definitions/**/*.js'],
  parallel: 1,
  retry: 0,
  tags: 'not @manual',
};
module.exports = {
  default: {
    ...common,
    format: [
      'progress',
      'html:reports/cucumber.html',
      'json:reports/cucumber.json',
      'junit:reports/cucumber.xml',
    ],
  },
  dry: { ...common, dryRun: true, format: ['progress'] },
};
