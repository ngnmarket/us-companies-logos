#!/usr/bin/env node

"use strict";

const fs = require("fs");
const path = require("path");
const { FORMATS, getLogoPath, listSymbols } = require("../lib");
const VERSION = require("../package.json").version;

const HELP = `
us-stock-logos v${VERSION}
Logo resources for US-listed stocks, ADRs, and ETFs

Usage:
  npx us-stock-logos <command> [options]

Commands:
  copy    Copy logo files to a destination directory
  list    List all available ticker symbols

Options (copy):
  --formats <list>   Comma-separated formats: png,webp,ico (default: png)
  --dest <path>      Destination directory (default: ./public/logos)
  --symbols <list>   Comma-separated symbols (default: all)

Examples:
  npx us-stock-logos copy
  npx us-stock-logos copy --formats=png,webp --dest=./public/logos/us
  npx us-stock-logos copy --symbols=AAPL,TSM,BRK.A --dest=./assets
  npx us-stock-logos list
`;

function parseArgs(argv) {
  const args = {};
  for (const arg of argv) {
    const match = arg.match(/^--([\w-]+)(?:=(.+))?$/);
    if (match) args[match[1]] = match[2] ?? true;
  }
  return args;
}

function copy(args) {
  const formats = String(args.formats || "png")
    .split(",")
    .map(value => value.trim().toLowerCase())
    .filter(Boolean);
  const invalid = formats.filter(format => !FORMATS.includes(format));
  if (invalid.length) throw new Error(`Invalid format(s): ${invalid.join(", ")}`);

  const symbols = args.symbols
    ? String(args.symbols).split(",").map(value => value.trim()).filter(Boolean)
    : listSymbols();
  const destination = path.resolve(String(args.dest || "./public/logos"));
  let copied = 0;
  let missing = 0;

  for (const format of formats) {
    const formatDestination = formats.length > 1 ? path.join(destination, format) : destination;
    fs.mkdirSync(formatDestination, { recursive: true });
    for (const symbol of symbols) {
      const source = getLogoPath(symbol, format);
      if (!fs.existsSync(source)) {
        console.warn(`[missing] ${symbol}.${format}`);
        missing += 1;
        continue;
      }
      fs.copyFileSync(source, path.join(formatDestination, `${symbol}.${format}`));
      copied += 1;
    }
  }

  console.log(`Copied ${copied} file(s) to ${destination}${missing ? `; ${missing} missing` : ""}.`);
}

try {
  const [command, ...rest] = process.argv.slice(2);
  if (!command || command === "--help" || command === "-h") console.log(HELP);
  else if (command === "list") console.log(listSymbols().join("\n"));
  else if (command === "copy") copy(parseArgs(rest));
  else throw new Error(`Unknown command "${command}"`);
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}

