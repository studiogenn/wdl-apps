#!/usr/bin/env node
// Wrapper: sets PATH so Turbopack can spawn node child processes
const { spawn } = require('child_process');
const path = require('path');

process.env.PATH = `/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:${process.env.PATH || ''}`;

const next = path.resolve(__dirname, '../apps/web/node_modules/next/dist/bin/next');
const webDir = path.resolve(__dirname, '../apps/web');

const child = spawn(process.execPath, [next, 'dev', webDir], {
  stdio: 'inherit',
  env: process.env,
});

child.on('exit', (code) => process.exit(code ?? 0));
