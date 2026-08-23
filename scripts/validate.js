#!/usr/bin/env node

"use strict";

const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const ROOT = path.join(__dirname, "..");
const FORMATS = ["png", "webp", "ico"];

async function main() {
  const filesByFormat = Object.fromEntries(
    FORMATS.map(format => {
      const dir = path.join(ROOT, "dist", format);
      if (!fs.existsSync(dir)) throw new Error(`Missing dist/${format}`);
      return [format, new Set(fs.readdirSync(dir).filter(file => file.endsWith(`.${format}`)))];
    })
  );
  const symbols = [...filesByFormat.png].map(file => path.basename(file, ".png"));
  if (!symbols.length) throw new Error("No PNG logos found");

  const folded = new Map();
  for (const symbol of symbols) {
    if (!/^[A-Za-z0-9._-]+$/.test(symbol)) throw new Error(`Unsafe ticker filename: ${symbol}`);
    const key = symbol.toLocaleLowerCase("en-US");
    if (folded.has(key) && folded.get(key) !== symbol) {
      throw new Error(`Case-colliding tickers: ${folded.get(key)} and ${symbol}`);
    }
    folded.set(key, symbol);
    for (const format of FORMATS) {
      const filename = `${symbol}.${format}`;
      if (!filesByFormat[format].has(filename)) throw new Error(`Missing dist/${format}/${filename}`);
    }
  }

  for (const symbol of symbols) {
    const metadata = await sharp(path.join(ROOT, "dist", "png", `${symbol}.png`)).metadata();
    if (metadata.width !== 128 || metadata.height !== 128) {
      throw new Error(`${symbol}.png is ${metadata.width}x${metadata.height}; expected 128x128`);
    }
  }
  console.log(`Validated ${symbols.length} symbols across ${FORMATS.length} formats.`);
}

main().catch(error => {
  console.error(error.message);
  process.exit(1);
});

