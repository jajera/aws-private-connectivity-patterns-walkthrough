#!/usr/bin/env node
/**
 * Placeholder ID scanner — flags real-looking AWS identifiers in fenced code blocks.
 * Requirements: 22.1, 22.2, 22.3, 22.4
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ALLOWED_ACCOUNTS = new Set(['123456789012', '987654321098']);

export function extractFencedBlocks(content) {
  const blocks = [];
  const re = /```[\w-]*\n([\s\S]*?)```/g;
  let m;
  while ((m = re.exec(content)) !== null) {
    const start = m.index;
    const before = content.slice(0, start);
    const startLine = before.split('\n').length;
    blocks.push({ text: m[1], startLine });
  }
  return blocks;
}

export function scanContent(content, fileLabel = 'input') {
  const ACCOUNT_RE = /\b(\d{12})\b/g;
  const ARN_RE = /arn:aws:[a-z0-9-]+:[a-z0-9-]*:(\d{12}):[^\s`'"]+/gi;
  const DNS_RE =
    /\b(?:[a-z0-9](?:[a-z0-9.-]*[a-z0-9])?\.)?(?:amazonaws\.com|awsglobalaccelerator\.com|elb\.amazonaws\.com|on\.aws)\b/gi;

  const violations = [];
  for (const block of extractFencedBlocks(content)) {
    const lines = block.text.split('\n');
    lines.forEach((line, i) => {
      const lineNo = block.startLine + i;
      for (const m of line.matchAll(ACCOUNT_RE)) {
        if (!ALLOWED_ACCOUNTS.has(m[1])) {
          violations.push({ file: fileLabel, line: lineNo, pattern: m[1] });
        }
      }
      for (const m of line.matchAll(ARN_RE)) {
        if (!ALLOWED_ACCOUNTS.has(m[1])) {
          violations.push({ file: fileLabel, line: lineNo, pattern: m[0] });
        }
      }
      for (const m of line.matchAll(DNS_RE)) {
        if (!m[0].toLowerCase().includes('example')) {
          violations.push({ file: fileLabel, line: lineNo, pattern: m[0] });
        }
      }
    });
  }
  return violations;
}

export function scanFiles(docsRoot, projectRoot) {
  const violations = [];
  function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (/\.mdx?$/.test(entry.name)) {
        const content = fs.readFileSync(full, 'utf8');
        violations.push(...scanContent(content, path.relative(projectRoot, full)));
      }
    }
  }
  walk(docsRoot);
  return violations;
}

function main() {
  const ROOT = path.resolve(import.meta.dirname, '..');
  const DOCS = path.join(ROOT, 'src/content/docs');
  const violations = scanFiles(DOCS, ROOT);
  if (violations.length) {
    for (const v of violations) {
      console.error(`Placeholder violation: ${v.file}:${v.line} matched ${v.pattern}`);
    }
    process.exit(1);
  }
  console.log('check-placeholders: OK');
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main();
}
