const fs = require('node:fs');
const path = require('node:path');
const { createHash, randomUUID } = require('node:crypto');
const { Readable } = require('node:stream');
const { pipeline } = require('node:stream/promises');
const { spawnSync } = require('node:child_process');

const KARATE_VERSION = '1.4.1';
const KARATE_JAR_URL = `https://github.com/karatelabs/karate/releases/download/v${KARATE_VERSION}/karate-${KARATE_VERSION}.jar`;
const KARATE_SHA256 =
  'de03685d4721adf1a4642e9401fc364d7a2bcd296a9ce6427b4827b941c821be';
const PROJECT_ROOT = path.resolve(__dirname, '..', '..');
const JAR_PATH = path.resolve(
  PROJECT_ROOT,
  'target',
  `karate-${KARATE_VERSION}.jar`,
);
const REPORTS_DIR = path.resolve(PROJECT_ROOT, 'reports', 'karate');
const FEATURE_PATH = path.resolve(PROJECT_ROOT, 'tests', 'features', 'api');

async function verifyJar(file) {
  const hash = createHash('sha256');
  for await (const chunk of fs.createReadStream(file)) hash.update(chunk);
  if (hash.digest('hex') !== KARATE_SHA256) {
    throw new Error(
      `Karate JAR checksum mismatch: ${file}. Remove this file and retry.`,
    );
  }
}

async function ensureJar() {
  if (fs.existsSync(JAR_PATH)) {
    await verifyJar(JAR_PATH);
    return;
  }
  fs.mkdirSync(path.dirname(JAR_PATH), { recursive: true });
  const temporaryPath = `${JAR_PATH}.${randomUUID()}.download`;
  try {
    console.log(`Downloading Karate standalone v${KARATE_VERSION}...`);
    const response = await fetch(KARATE_JAR_URL, {
      signal: AbortSignal.timeout(120_000),
    });
    if (!response.ok)
      throw new Error(`Karate download failed: HTTP ${response.status}`);
    await pipeline(
      Readable.fromWeb(response.body),
      fs.createWriteStream(temporaryPath, { flags: 'wx' }),
    );
    await verifyJar(temporaryPath);
    fs.renameSync(temporaryPath, JAR_PATH);
  } finally {
    fs.rmSync(temporaryPath, { force: true });
  }
}

async function main() {
  const config = require('./test-config');
  await ensureJar();
  fs.mkdirSync(REPORTS_DIR, { recursive: true });
  console.log(`Running Karate API tests against ${config.baseURL}...`);
  const cleanupRun = randomUUID();
  const cleanupDirectory = path.resolve(
    REPORTS_DIR,
    'cleanup-errors',
    cleanupRun,
  );
  const cleanupStatusPath = path.resolve(REPORTS_DIR, 'cleanup-status.json');
  fs.writeFileSync(cleanupStatusPath, JSON.stringify({ failures: 0 }));
  const result = spawnSync(
    'java',
    [
      `-Ddemoqa.baseUrl=${config.baseURL}`,
      `-Ddemoqa.cleanupRun=${cleanupRun}`,
      `-Dkarate.config.dir=${path.resolve(PROJECT_ROOT, 'tests', 'support')}`,
      '-jar',
      JAR_PATH,
      FEATURE_PATH,
      '-o',
      REPORTS_DIR,
      '-f',
      'html,junit:xml',
      '-C',
    ],
    { stdio: 'inherit', cwd: PROJECT_ROOT },
  );
  if (result.error)
    throw new Error('Failed to execute Java; ensure Java 17+ is in PATH.', {
      cause: result.error,
    });
  if (result.signal)
    console.error(`Karate terminated by signal ${result.signal}`);
  const cleanupFailures = fs.existsSync(cleanupDirectory)
    ? fs.readdirSync(cleanupDirectory).length
    : 0;
  fs.writeFileSync(
    cleanupStatusPath,
    JSON.stringify({ failures: cleanupFailures }),
  );
  if (cleanupFailures)
    console.error(
      `Account cleanup failed for ${cleanupFailures} scenario(s); see ${cleanupDirectory}`,
    );
  process.exitCode = cleanupFailures ? 1 : (result.status ?? 1);
}

if (require.main === module) {
  main().catch((error) => {
    console.error(error.message);
    if (error.cause?.code) console.error(`Cause: ${error.cause.code}`);
    process.exitCode = 1;
  });
}

module.exports = { main };
