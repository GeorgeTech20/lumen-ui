// Real Sigstore cosign signing/verification of the registry artifact (production signing path).
// Key-based + non-interactive here (COSIGN_PASSWORD=''); CI uses keyless OIDC (same bundle format).
// Usage: node tools/cosign.mjs sign|verify
import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

const CANDIDATES = [
  resolve('.tools/bin/cosign.exe'),
  resolve('.tools/bin/cosign'),
  'cosign',
];
const COSIGN = CANDIDATES.find((p) => p === 'cosign' || existsSync(p)) ?? 'cosign';

const KEY = 'registry/keys/cosign.key';
const PUB = 'registry/keys/cosign.pub';
const BLOB = 'registry/public/r/registry.json';
const BUNDLE = 'registry/public/r/registry.cosign.bundle';
const env = { ...process.env, COSIGN_PASSWORD: '' };

function run(args) {
  execFileSync(COSIGN, args, { env, stdio: 'inherit' });
}

const cmd = process.argv[2];
if (cmd === 'sign') {
  if (!existsSync(KEY)) {
    run(['generate-key-pair', '--output-key-prefix', 'registry/keys/cosign']);
  }
  run(['sign-blob', '--key', KEY, '--yes', '--bundle', BUNDLE, BLOB]);
  console.log('✔ cosign-signed registry.json -> registry.cosign.bundle');
} else if (cmd === 'verify') {
  run(['verify-blob', '--key', PUB, '--bundle', BUNDLE, BLOB]);
  console.log('✔ cosign verify-blob OK');
} else {
  console.error('usage: node tools/cosign.mjs sign|verify');
  process.exit(1);
}
