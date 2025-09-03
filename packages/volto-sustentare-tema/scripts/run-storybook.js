#!/usr/bin/env node
const cp = require('child_process');
const path = require('path');

const rawArgs = process.argv.slice(2);
// Filter out pnpm-added noise flags that Storybook CLI doesn't accept
const args = rawArgs.filter((a) => a !== '--silent' && a !== '"--silent"' && a !== '--');
const cmd = args[0] || 'dev';
const rest = args.slice(1);

function spawnNodeBin(binPath, allArgs) {
  const res = cp.spawnSync(process.execPath, [binPath, ...allArgs], { stdio: 'inherit' });
  process.exit(res.status || 0);
}

try {
  // Try to resolve @storybook core bin from current workspace (supports hoisted installs)
  const bin = require.resolve('@storybook/core/bin/index.cjs', { paths: [process.cwd()] });
  spawnNodeBin(bin, [cmd, ...rest]);
} catch (e) {
  try {
    // Fallback to resolve without custom paths
    const bin = require.resolve('@storybook/core/bin/index.cjs');
    spawnNodeBin(bin, [cmd, ...rest]);
  } catch (err) {
    // Last resort: try pnpm exec or npx
    console.error('Could not resolve @storybook/core binary via Node resolution. Falling back to pnpm/npx exec.');
    const fallback = cp.spawnSync('pnpm', ['exec', '--', 'storybook', cmd, ...rest], { stdio: 'inherit' });
    if (fallback.status === 0) process.exit(0);
    const fallback2 = cp.spawnSync('npx', ['--no-install', 'storybook', cmd, ...rest], { stdio: 'inherit' });
    process.exit(fallback2.status || fallback.status || 1);
  }
}
