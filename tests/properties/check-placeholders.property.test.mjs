import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { scanContent } from '../../scripts/check-placeholders.mjs';

const ALLOWED = ['123456789012', '987654321098'];

describe('Property 1: Placeholder Scanner Detection Correctness', () => {
  it('flags non-allowlisted 12-digit IDs in code blocks and ignores prose', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 999999999999 }),
        fc.boolean(),
        (n, inCode) => {
          const id = String(n).padStart(12, '0');
          const body = inCode ? `\`\`\`text\nAccount: ${id}\n\`\`\`\n` : `Account ${id} in prose.\n`;
          const violations = scanContent(body);
          const shouldFlag = inCode && !ALLOWED.includes(id);
          if (shouldFlag) {
            expect(violations.some((v) => v.pattern === id)).toBe(true);
          } else {
            expect(violations.some((v) => v.pattern === id)).toBe(false);
          }
        },
      ),
      { numRuns: 100 },
    );
  });
});

describe('Property 2: Placeholder Scanner Error Reporting', () => {
  it('reports file, line, and matched pattern for violations', () => {
    fc.assert(
      fc.property(fc.integer({ min: 0, max: 5 }), (padLines) => {
        const bad = '555555555555';
        const prefix = Array(padLines).fill('intro').join('\n') + '\n';
        const content = `${prefix}\`\`\`text\nID ${bad}\n\`\`\`\n`;
        const violations = scanContent(content, 'sample.mdx');
        expect(violations.length).toBeGreaterThan(0);
        const v = violations[0];
        expect(v.file).toBe('sample.mdx');
        expect(typeof v.line).toBe('number');
        expect(v.line).toBeGreaterThan(0);
        expect(v.pattern).toBe(bad);
      }),
      { numRuns: 100 },
    );
  });
});
