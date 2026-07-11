import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { validateAsides } from '../../scripts/check-asides.mjs';

const VALID = ['tip', 'caution', 'danger'];
const INVALID = ['note', 'warning', 'info', 'details', 'success'];

describe('Property 4: Aside Type Validation', () => {
  it('accepts tip/caution/danger and rejects other types', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...VALID, ...INVALID),
        fc.integer({ min: 0, max: 3 }),
        (type, pad) => {
          const prefix = Array(pad).fill('# Title').join('\n') + '\n';
          const content = `${prefix}:::${type}\nBody\n:::\n`;
          const violations = validateAsides(content, 't.mdx');
          if (VALID.includes(type)) {
            expect(violations).toHaveLength(0);
          } else {
            expect(violations.some((v) => v.type === type)).toBe(true);
            expect(violations[0].file).toBe('t.mdx');
            expect(violations[0].line).toBeGreaterThan(0);
          }
        },
      ),
      { numRuns: 100 },
    );
  });
});
