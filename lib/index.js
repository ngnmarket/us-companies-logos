"use strict";

const fs = require("fs");
const path = require("path");

const FORMATS = Object.freeze(["png", "webp", "ico"]);
const DIST_DIR = path.join(__dirname, "..", "dist");

function assertFormat(format) {
  if (!FORMATS.includes(format)) {
    throw new TypeError(`Unsupported format "${format}". Valid formats: ${FORMATS.join(", ")}`);
  }
}

function normalizeSymbol(symbol) {
  const value = String(symbol ?? "").trim();
  if (!value || value === "." || value === ".." || !/^[A-Za-z0-9._-]+$/.test(value)) {
    throw new TypeError(`Invalid US ticker symbol "${value}"`);
  }
  return value;
}

function getLogoPath(symbol, format = "png") {
  assertFormat(format);
  return path.join(DIST_DIR, format, `${normalizeSymbol(symbol)}.${format}`);
}

function getLogoUrl(symbol, format = "png") {
  assertFormat(format);
  const ticker = encodeURIComponent(normalizeSymbol(symbol));
  return `https://cdn.jsdelivr.net/npm/us-stock-logos/dist/${format}/${ticker}.${format}`;
}

function listSymbols() {
  const pngDir = path.join(DIST_DIR, "png");
  if (!fs.existsSync(pngDir)) return [];
  return fs
    .readdirSync(pngDir)
    .filter(file => file.endsWith(".png"))
    .map(file => path.basename(file, ".png"))
    .sort((a, b) => a.localeCompare(b, "en", { sensitivity: "case" }));
}

function hasLogo(symbol, format = "png") {
  return fs.existsSync(getLogoPath(symbol, format));
}

module.exports = { getLogoPath, getLogoUrl, listSymbols, hasLogo, FORMATS };

