#!/usr/bin/env node

"use strict";

const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const SOURCE_DIR = path.join(__dirname, "..", "logos");
const DIST_DIR = path.join(__dirname, "..", "dist");
const IMAGE_SIZE = 128;
const ICO_SIZES = [16, 32, 48];
const CONCURRENCY = Math.max(1, Number(process.env.LOGO_CONCURRENCY || 8));

function buildIco(images, sizes) {
  const headerSize = 6;
  const entrySize = 16;
  let offset = headerSize + entrySize * images.length;
  const offsets = images.map(image => {
    const current = offset;
    offset += image.length;
    return current;
  });
  const output = Buffer.alloc(offset);
  output.writeUInt16LE(0, 0);
  output.writeUInt16LE(1, 2);
  output.writeUInt16LE(images.length, 4);
  images.forEach((image, index) => {
    const entry = headerSize + index * entrySize;
    output.writeUInt8(sizes[index], entry);
    output.writeUInt8(sizes[index], entry + 1);
    output.writeUInt8(0, entry + 2);
    output.writeUInt8(0, entry + 3);
    output.writeUInt16LE(1, entry + 4);
    output.writeUInt16LE(32, entry + 6);
    output.writeUInt32LE(image.length, entry + 8);
    output.writeUInt32LE(offsets[index], entry + 12);
    image.copy(output, offsets[index]);
  });
  return output;
}

async function processLogo(filename) {
  const extension = path.extname(filename).toLowerCase();
  if (![".png", ".jpg", ".jpeg", ".webp", ".svg"].includes(extension)) return false;
  const symbol = path.basename(filename, extension);
  const source = path.join(SOURCE_DIR, filename);
  const png = await sharp(source)
    .resize(IMAGE_SIZE, IMAGE_SIZE, {
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
      withoutEnlargement: true,
    })
    .png({ compressionLevel: 9 })
    .toBuffer();

  fs.writeFileSync(path.join(DIST_DIR, "png", `${symbol}.png`), png);
  await sharp(png).webp({ lossless: true }).toFile(path.join(DIST_DIR, "webp", `${symbol}.webp`));
  const icons = await Promise.all(
    ICO_SIZES.map(size =>
      sharp(png)
        .resize(size, size, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
        .sharpen({ sigma: 0.5 })
        .png({ compressionLevel: 9 })
        .toBuffer()
    )
  );
  fs.writeFileSync(path.join(DIST_DIR, "ico", `${symbol}.ico`), buildIco(icons, ICO_SIZES));
  return true;
}

async function worker(queue, result) {
  while (queue.length) {
    const filename = queue.pop();
    try {
      if (await processLogo(filename)) result.processed += 1;
    } catch (error) {
      result.failures.push({ filename, error: error.message });
    }
  }
}

async function main() {
  if (!fs.existsSync(SOURCE_DIR)) throw new Error(`Missing source directory: ${SOURCE_DIR}`);
  for (const format of ["png", "webp", "ico"]) {
    fs.mkdirSync(path.join(DIST_DIR, format), { recursive: true });
  }
  const queue = fs.readdirSync(SOURCE_DIR).filter(filename => !filename.startsWith("."));
  const result = { processed: 0, failures: [] };
  await Promise.all(Array.from({ length: CONCURRENCY }, () => worker(queue, result)));
  console.log(`Processed ${result.processed} logo(s); ${result.failures.length} failed.`);
  for (const failure of result.failures) console.error(`[failed] ${failure.filename}: ${failure.error}`);
  if (result.failures.length) process.exitCode = 1;
}

main().catch(error => {
  console.error(error.message);
  process.exit(1);
});

