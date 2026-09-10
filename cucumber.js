const fs = require('node:fs');
fs.mkdirSync('reports', { recursive: true });
module.exports = {
  default: {
    paths: ['web/features/**/*.feature'],
    require: ['web/support/**/*.js', 'web/steps/**/*.js'],
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
