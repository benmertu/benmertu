#!/usr/bin/env node
'use strict';

const readline = require('readline');
const { spawn } = require('child_process');

const GITHUB_URL = 'https://github.com/benmertu';
const X_URL      = 'https://x.com/benmertu';
const SITE_URL   = 'https://mert.uykuseven.com.tr';

const ASCII_ART = `
 _                                    _
| |__   ___ _ __  _ __ ___   ___ _ __| |_ _   _
| '_ \\ / _ \\ '_ \\| '_ \` _ \\ / _ \\ '__| __| | | |
| |_) |  __/ | | | | | | | |  __/ |  | |_| |_| |
|_.__/ \\___|_| |_|_| |_| |_|\\___|_|   \\__|\\__,_|
`;

const MENU_ITEMS = [
  { label: 'GitHub',  hint: 'github.com/benmertu',  url: GITHUB_URL },
  { label: 'X',       hint: 'x.com/benmertu',          url: X_URL },
  { label: 'Website', hint: 'mert.uykuseven.com.tr',   url: SITE_URL },
  { label: 'Exit',    hint: '',                         url: null },
];

const TITLES = [
  'Forward Deployed Growth Hacker',
  'Technologist',
  'MarTech Wizard',
];
const HELP    = '↑/↓ navigate · enter select · q quit';

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
  console.log(`benmertu: ${GITHUB_URL} | ${X_URL} | ${SITE_URL}`);
  process.exit(0);
}

// --- Styling ---------------------------------------------------------------
const useColor = !process.env.NO_COLOR && process.stdout.isTTY;
const trueColor = useColor && /truecolor|24bit/i.test(process.env.COLORTERM || '');

const sgr   = (code, s) => (useColor ? `\x1B[${code}m${s}\x1B[0m` : s);
const bold  = (s) => sgr('1', s);
const dim   = (s) => sgr('2', s);
const cyan  = (s) => sgr('36', s);

function selectedStyle(s) {
  return trueColor ? `\x1B[1;38;2;255;255;255;48;2;123;47;247m${s}\x1B[0m`
                   : sgr('1;7;36', s);
}

// --- Layout ----------------------------------------------------------------
const LOGO_LINES = ASCII_ART.split('\n').filter((l) => l.trim().length);
const LOGO_W     = Math.max(...LOGO_LINES.map((l) => l.length));
const PAD        = 2;
const INNER_W    = LOGO_W + PAD * 2;

// Pads plain text to the inner width; `style` is applied to the text only.
function row(plain, style = (s) => s) {
  const fill = ' '.repeat(Math.max(INNER_W - PAD - plain.length, 0));
  return `${dim('│')}${' '.repeat(PAD)}${style(plain)}${fill}${dim('│')}`;
}

function menuRow(item, isSelected) {
  const marker = isSelected ? '❯' : ' ';
  const label  = item.label.padEnd(9);
  const plain  = ` ${marker} ${label}${item.hint}`;
  const padded = plain + ' '.repeat(Math.max(INNER_W - PAD * 2 - plain.length, 0));
  const body   = isSelected ? selectedStyle(padded) : dim(padded);
  return `${dim('│')}${' '.repeat(PAD)}${body}${' '.repeat(PAD)}${dim('│')}`;
}

function buildFrame(selected) {
  const bar = '─'.repeat(INNER_W);
  const frame = [
    dim(`╭${bar}╮`),
    row(''),
    ...LOGO_LINES.map((l) => `${dim('│')}${' '.repeat(PAD)}${bold(l.padEnd(LOGO_W))}${' '.repeat(PAD)}${dim('│')}`),
    row(''),
    ...TITLES.map((t) => row(t, bold)),
    row(''),
    dim(`├${bar}┤`),
    row(''),
    ...MENU_ITEMS.map((item, i) => menuRow(item, i === selected)),
    row(''),
    dim(`╰${bar}╯`),
    ' ' + dim(HELP),
  ];
  return frame;
}

// --- Terminal lifecycle ----------------------------------------------------
let cleanedUp = false;
const cleanup = () => {
  if (cleanedUp) return;
  cleanedUp = true;
  process.stdout.write('\x1B[?25h');
  process.stdin.setRawMode(false);
  process.stdin.destroy();
};
process.on('exit',   cleanup);
process.on('SIGINT',  () => { cleanup(); process.exit(0); });
process.on('SIGTERM', () => { cleanup(); process.exit(0); });

let frameHeight = 0;
function render(selected) {
  const frame = buildFrame(selected);
  if (frameHeight) process.stdout.write(`\x1B[${frameHeight}A`);
  process.stdout.write(frame.map((l) => `\x1B[2K${l}\n`).join(''));
  frameHeight = frame.length;
}

function choose(item) {
  cleanup();
  if (item.url) {
    console.log(`\n  ${cyan('→')} Opening ${bold(item.label)}…\n`);
    open(item.url);
  } else {
    console.log();
  }
  process.exit(0);
}

function main() {
  let selected = 0;
  process.stdout.write('\n\x1B[?25l');
  render(selected);

  readline.emitKeypressEvents(process.stdin);
  process.stdin.setRawMode(true);
  process.stdin.resume();

  const count = MENU_ITEMS.length;
  process.stdin.on('keypress', (_, key) => {
    if (!key) return;

    if (key.name === 'up' || key.name === 'k') {
      selected = (selected - 1 + count) % count;
      render(selected);
    } else if (key.name === 'down' || key.name === 'j') {
      selected = (selected + 1) % count;
      render(selected);
    } else if (key.name === 'return') {
      choose(MENU_ITEMS[selected]);
    } else if (key.name === 'q' || key.name === 'escape' || (key.ctrl && key.name === 'c')) {
      cleanup();
      console.log();
      process.exit(0);
    }
  });
}

main();
