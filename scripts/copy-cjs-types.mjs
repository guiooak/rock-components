#!/usr/bin/env node
import { readdir, copyFile, stat } from 'node:fs/promises';
import { join } from 'node:path';

const DIST = new URL('../dist/', import.meta.url).pathname;

const walk = async (dir) => {
  const out = [];
  for (const name of await readdir(dir)) {
    const path = join(dir, name);
    const s = await stat(path);
    if (s.isDirectory()) out.push(...(await walk(path)));
    else out.push(path);
  }
  return out;
};

const files = await walk(DIST);
const dts = files.filter(
  (f) => f.endsWith('.d.ts') && !f.endsWith('.d.ts.map'),
);

await Promise.all(
  dts.map(async (file) => {
    const target = file.replace(/\.d\.ts$/, '.d.cts');
    await copyFile(file, target);
  }),
);

console.log(`Copied ${dts.length} .d.ts → .d.cts`);
