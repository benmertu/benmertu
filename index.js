#!/usr/bin/env node
'use strict';

const readline = require('readline');
const { spawn } = require('child_process');

const GITHUB_URL = 'https://github.com/mertuykuseven';
const X_URL      = 'https://x.com/benmertu';

const ASCII_ART = `
 _                                    _
| |__   ___ _ __  _ __ ___   ___ _ __| |_ _   _
| '_ \\ / _ \\ '_ \\| '_ \` _ \\ / _ \\ '__| __| | | |
| |_) |  __/ | | | | | | | |  __/ |  | |_| |_| |
|_.__/ \\___|_| |_|_| |_| |_|\\___|_|   \\__|\\__,_|
`;

const MENU_ITEMS = [
  { label: 'Click to open Github Profile on your browser', url: GITHUB_URL },
  { label: 'Click to open my X (twitter) profile',        url: X_URL },
  { label: 'exit',                                         url: null },
];

function getOpenCmd(platform) {
  if (platform === 'win32') return 'start';
  if (platform === 'darwin') return 'open';
  return 'xdg-open';
}

function open(url) {
  const isWin = process.platform === 'win32';
  const cmd   = getOpenCmd(process.platform);
  const child = spawn(cmd, [url], {
    detached: !isWin,
    shell:     isWin,
    stdio:    'ignore',
  });
  child.unref();
}

if (!process.stdin.isTTY) {
  console.log(`benmertu: ${GITHUB_URL} | ${X_URL}`);
  process.exit(0);
}

let cleanedUp = false;
const cleanup = () => {
  if (cleanedUp) return;
  cleanedUp = true;
  process.stdin.setRawMode(false);
  process.stdin.destroy();
};
process.on('exit',   cleanup);
process.on('SIGINT',  () => { cleanup(); process.exit(0); });
process.on('SIGTERM', () => { cleanup(); process.exit(0); });

function renderMenu(selected, firstRender) {
  if (!firstRender) {
    // Move cursor up N lines to overwrite previous render
    process.stdout.write(`\x1B[${MENU_ITEMS.length}A`);
  }
  MENU_ITEMS.forEach((item, i) => {
    const prefix = i === selected ? '> ' : '  ';
    process.stdout.write(`${prefix}${item.label}\n`);
  });
}
