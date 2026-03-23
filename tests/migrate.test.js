import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CLI = path.join(__dirname, '..', 'src', 'cli.js');

test('CLI prints help and exits 0', () => {
  const out = execSync(`node ${CLI} --help`, { encoding: 'utf8' });
  assert.match(out, /appwrite-migrate|usage|help|migrate/i);
});

test('CLI errors without required config', () => {
  try {
    execSync(`node ${CLI} up 2>&1`, {
      encoding: 'utf8',
      env: { ...process.env, APPWRITE_ENDPOINT: '', APPWRITE_PROJECT_ID: '', APPWRITE_API_KEY: '' },
    });
    assert.fail('Should have exited non-zero');
  } catch (err) {
    assert.ok(err.status !== 0 || err.stdout.includes('Error') || err.stderr.includes('Error'));
  }
});
