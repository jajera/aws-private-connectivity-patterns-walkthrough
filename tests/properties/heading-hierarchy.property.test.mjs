import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';

function findSkippedLevels(levels) {
  const skips = [];
  for (let i = 1; i < levels.length; i++) {
    if (levels[i] > levels[i - 1] + 1) {
      skips.push({ from: levels[i - 1], to: levels[i], index: i });
    }
  }
  return skips;
}

describe('Property 6: Heading Hierarchy Validity', () => {
  it('detects skipped heading levels', () => {
    fc.assert(
      fc.property(
        fc.array(fc.integer({ min: 1, max: 6 }), { minLength: 2, maxLength: 12 }),
        (levels) => {
          const skips = findSkippedLevels(levels);
          const hasSkip = levels.some((lvl, i) => i > 0 && lvl > levels[i - 1] + 1);
          expect(skips.length > 0).toBe(hasSkip);
        },
      ),
      { numRuns: 100 },
    );
  });
});
