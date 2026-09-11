const fs = require('node:fs');
const path = require('node:path');
const https = require('node:https');
const { spawnSync } = require('node:child_process');

const KARATE_VERSION = '1.4.1';
const KARATE_JAR_URL = `https://github.com/karatelabs/karate/releases/download/v${KARATE_VERSION}/karate-${KARATE_VERSION}.jar`;
const PROJECT_ROOT = path.resolve(__dirname, '..', '..');
const JAR_PATH = path.resolve(PROJECT_ROOT, 'karate.jar');
const REPORTS_DIR = path.resolve(PROJECT_ROOT, 'reports', 'karate');
const FEATURE_PATH = path.resolve(PROJECT_ROOT, 'tests', 'api');

function download(url, dest) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        if (
          res.statusCode >= 300 &&
          res.statusCode < 400 &&
          res.headers.location
        ) {
          return resolve(download(res.headers.location, dest));
        }
        if (res.statusCode !== 200) {
          return reject(
            new Error(
              `Failed to download Karate JAR: HTTP ${res.statusCode} ${res.statusMessage}`,
            ),
          );
        }
        const file = fs.createWriteStream(dest);
        res.pipe(file);
        file.on('finish', () => file.close(resolve));
        file.on('error', (err) => {
          fs.unlink(dest, () => reject(err));
        });
      })
      .on('error', reject);
  });
}

async function main() {
  if (!fs.existsSync(JAR_PATH)) {
    console.log(`Downloading Karate standalone v${KARATE_VERSION}...`);
    try {
      await download(KARATE_JAR_URL, JAR_PATH);
      console.log('Karate standalone JAR downloaded successfully.');
    } catch (err) {
      console.error('Error downloading Karate JAR:', err.message);
      process.exit(1);
    }
  }

  fs.mkdirSync(REPORTS_DIR, { recursive: true });

  console.log(`Running Karate API tests from ${FEATURE_PATH}...`);

  const result = spawnSync(
    'java',
    ['-jar', JAR_PATH, FEATURE_PATH, '-o', REPORTS_DIR],
    {
      stdio: 'inherit',
      cwd: PROJECT_ROOT,
    },
  );

  if (result.error) {
    console.error('Failed to execute Java:', result.error.message);
    console.error('Please ensure Java (17+) is installed and in your PATH.');
    process.exit(1);
  }

  process.exit(result.status ?? 0);
}

if (require.main === module) {
  main();
}

module.exports = { main };
