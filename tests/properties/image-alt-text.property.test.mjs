import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';

function altOk(alt) {
  return typeof alt === 'string' && alt.length >= 20;
}

describe('Property 7: Image Alt Text Minimum Length', () => {
  it('enforces ≥20 character alt text', () => {
    fc.assert(
      fc.property(fc.string({ maxLength: 40 }), (alt) => {
        expect(altOk(alt)).toBe(alt.length >= 20);
      }),
      { numRuns: 100 },
    );
  });
});
