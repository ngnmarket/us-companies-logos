# Contributing to US Stock Logos

Thank you for helping improve the collection.

## Asset requirements

- Name the file with the exact US ticker symbol.
- Preserve ticker casing; do not automatically uppercase it.
- PNG and WebP outputs must fit within a transparent 128×128 canvas.
- Do not stretch, crop, add a background, add a watermark, or redraw a logo.
- Dotted and dashed tickers such as `BRK.A` are supported.
- Include a link to an official company, exchange, filing, or investor-relations source in the pull request.

## Adding or updating a logo

1. Place the best available source image in `logos/SYMBOL.png` (SVG, JPEG and WebP are also accepted).
2. Run `npm run process`.
3. Run `npm run validate`.
4. Commit the generated files under `dist/png`, `dist/webp`, and `dist/ico`.
5. Open a pull request titled `Add logo: SYMBOL` or `Update logo: SYMBOL`.

All logos and trademarks remain the property of their respective owners.
