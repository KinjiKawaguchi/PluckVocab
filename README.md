# PluckVocab

Pluck words from any page to build your vocabulary.

## Install

Coming soon on the Chrome Web Store.

## Usage

1. Select a word on any webpage
2. Right-click and choose **Pluck "\<word\>"**
3. Open the popup to see your vocabulary

## Development

### Setup

```sh
bun install
bun run build
bun run open    # launch chromium with extension loaded
```

### Scripts

| Script | Description |
|---|---|
| `bun run build` | Production build |
| `bun run dev` | Watch mode |
| `bun run open` | Launch Chromium with extension loaded |
| `bun run lint` | Lint with Biome |
| `bun run lint:fix` | Lint and auto-fix |
| `bun run format` | Format with Biome |
| `bun run typecheck` | Type check with tsc |
| `bun run test:unit` | Run unit tests |
| `bun run test:e2e` | Run Playwright E2E tests |
| `bun run zip` | Package `dist/` into `pluckvocab.zip` |

Architecture decisions are recorded in [`docs/adr/`](docs/adr/).

## Roadmap

- [x] Pluck words from any page via context menu
- [ ] Export / import vocabulary
- [ ] Word definitions via dictionary API
- [ ] Spaced repetition review
- [ ] Firefox support

## License

[MIT](LICENSE)
