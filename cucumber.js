const fs = require('node:fs');
fs.mkdirSync('reports', { recursive: true });
module.exports = {
  default: {
    paths: ['tests/features/**/*.feature'],
    require: ['tests/support/hooks.js', 'tests/step-definitions/**/*.js'],
    format: [
      'progress',
      'html:reports/cucumber.html',
      'json:reports/cucumber.json',
      'junit:reports/cucumber.xml',
    ],
    parallel: 1,
    retry: 0,
    tags: 'not @manual',
  },
};
