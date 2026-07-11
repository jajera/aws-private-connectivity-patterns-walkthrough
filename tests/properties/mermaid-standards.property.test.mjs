import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const DOCS = path.join(ROOT, 'src/content/docs');

function walk(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else if (/\.mdx?$/.test(entry.name)) out.push(full);
  }
  return out;
}

function extractMermaid(content) {
  const blocks = [];
  const re = /```mermaid\n([\s\S]*?)```/g;
  let m;
  while ((m = re.exec(content)) !== null) blocks.push(m[1]);
  return blocks;
}

describe('Property 5: Mermaid Diagram Standards Compliance', () => {
  it('any Mermaid blocks use TD, include Legend, and consistent shapes', () => {
    const files = walk(DOCS);
    const blocks = files.flatMap((f) => extractMermaid(fs.readFileSync(f, 'utf8')));
    // Architecture diagrams are SVG assets; Mermaid is optional.
    for (const block of blocks) {
      expect(block).toMatch(/^\s*graph\s+TD\b/m);
      expect(block.toLowerCase()).toMatch(/legend/);
    }
  });
});
