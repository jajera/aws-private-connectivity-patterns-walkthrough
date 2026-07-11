#!/usr/bin/env node
/**
 * Aside type validator — only tip, caution, danger allowed.
 * Requirements: 23.4, 23.5
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ALLOWED = new Set(['tip', 'caution', 'danger']);

export function validateAsides(content, fileLabel = 'input') {
  const violations = [];
  const lines = content.split('\n');
  lines.forEach((line, idx) => {
    const m = line.match(/^:::([a-z]+)\b/);
    if (m && !ALLOWED.has(m[1])) {
      violations.push({ file: fileLabel, line: idx + 1, type: m[1] });
    }
  });
  return violations;
}

export function scanAsideFiles(docsRoot, projectRoot) {
  const violations = [];
  function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (/\.mdx?$/.test(entry.name)) {
        const content = fs.readFileSync(full, 'utf8');
        violations.push(...validateAsides(content, path.relative(projectRoot, full)));
      }
    }
  }
  walk(docsRoot);
  return violations;
}

function main() {
  const ROOT = path.resolve(import.meta.dirname, '..');
  const DOCS = path.join(ROOT, 'src/content/docs');
  const violations = scanAsideFiles(DOCS, ROOT);
  if (violations.length) {
    for (const v of violations) {
      console.error(`Disallowed aside type "${v.type}" in ${v.file}:${v.line}`);
    }
    process.exit(1);
  }
  console.log('check-asides: OK');
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main();
}
