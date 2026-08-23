# US Stock Logos

A community-maintained logo resource for US-listed stocks, ADRs, and exchange-traded funds.

Logos are distributed in three formats:

| Format | Size | Directory |
| --- | --- | --- |
| PNG | Up to 128×128px | `dist/png/` |
| WebP | Up to 128×128px | `dist/webp/` |
| ICO | 16×16, 32×32 and 48×48px | `dist/ico/` |

Images are placed on a transparent 128×128 canvas without stretching or cropping.

## Install

```bash
npm install us-stock-logos
```

## JavaScript and TypeScript

```js
const { getLogoPath, getLogoUrl, hasLogo, listSymbols } = require("us-stock-logos");

getLogoPath("AAPL", "png");
getLogoUrl("TSM", "webp");
hasLogo("BRK.A");
listSymbols();
```

CDN URLs use jsDelivr:

```text
https://cdn.jsdelivr.net/npm/us-stock-logos/dist/png/AAPL.png
https://cdn.jsdelivr.net/npm/us-stock-logos/dist/webp/TSM.webp
```

The GitHub-backed CDN is also available:

```text
https://cdn.jsdelivr.net/gh/ngnmarket/us-companies-logos@main/dist/png/AAPL.png
https://cdn.jsdelivr.net/gh/ngnmarket/us-companies-logos@main/dist/webp/TSM.webp
```

Ticker casing is preserved. Do not uppercase user input blindly: US data feeds can contain symbols whose casing is semantically significant.

## CLI

```bash
npx us-stock-logos list
npx us-stock-logos copy
npx us-stock-logos copy --formats=png,webp --dest=./public/logos/us
npx us-stock-logos copy --symbols=AAPL,TSM,BRK.A --dest=./assets
```

When multiple formats are requested, each is written to its own subdirectory.

## Development

Place source images in `logos/`, then run:

```bash
npm install
npm run process
npm run validate
```

Raw files in `logos/` are intentionally ignored. The normalized files in `dist/` are the distributable assets.

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md). Contributions should cite an official company, exchange, filing, or investor-relations source for the submitted logo.

## License and trademarks

The package tooling is MIT licensed. Company logos and trademarks remain the property of their respective owners. Their inclusion does not imply affiliation or endorsement.
