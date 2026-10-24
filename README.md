# benmertu

My terminal business card. Run it, pick a link, it opens in your browser.

```
╭────────────────────────────────────────────────────╮
│                                                    │
│   _                                    _           │
│  | |__   ___ _ __  _ __ ___   ___ _ __| |_ _   _   │
│  | '_ \ / _ \ '_ \| '_ ` _ \ / _ \ '__| __| | | |  │
│  | |_) |  __/ | | | | | | | |  __/ |  | |_| |_| |  │
│  |_.__/ \___|_| |_|_| |_| |_|\___|_|   \__|\__,_|  │
│                                                    │
│  Forward Deployed Growth Hacker                    │
│  Technologist                                      │
│  MarTech Wizard                                    │
│                                                    │
├────────────────────────────────────────────────────┤
│                                                    │
│   ❯ GitHub    github.com/benmertu                  │
│     X         x.com/benmertu                       │
│     Website   mert.uykuseven.com.tr                │
│     Exit                                           │
│                                                    │
╰────────────────────────────────────────────────────╯
 ↑/↓ navigate · enter select · q quit
```

## Usage

```sh
npx benmertu
```

Or install it globally:

```sh
npm install -g benmertu
benmertu
```

## Keys

| Key                     | Action        |
| ----------------------- | ------------- |
| `↑` / `↓` or `k` / `j`  | Move          |
| `enter`                 | Open the link |
| `q`, `esc`, `ctrl+c`    | Quit          |

## Links

- GitHub: https://github.com/benmertu
- X: https://x.com/benmertu
- Website: https://mert.uykuseven.com.tr

## Notes

- No dependencies. Needs Node.js 14 or newer.
- Uses your terminal's default text color, so it reads well on dark and light themes.
- Honors `NO_COLOR`.
- When the output is not a terminal (a pipe, CI), it prints the links on one line instead of the menu.

## License

MIT
