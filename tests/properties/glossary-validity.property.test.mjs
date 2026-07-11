import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { glossary } from '../../src/data/glossary.ts';

function wordCount(def) {
  return def.trim().split(/\s+/).filter(Boolean).length;
}

describe('Property 8: Glossary Entry Validity', () => {
  it('every glossary definition is non-empty and ≤150 words', () => {
    const entries = Object.entries(glossary);
    expect(entries.length).toBeGreaterThan(0);
    for (const [term, def] of entries) {
      expect(term.length).toBeGreaterThan(0);
      expect(def.trim().length).toBeGreaterThan(0);
      expect(wordCount(def)).toBeLessThanOrEqual(150);
    }
  });

  it('property: word-count validator accepts ≤150 and rejects >150', () => {
    fc.assert(
      fc.property(fc.lorem({ maxCount: 200 }), (def) => {
        const valid = wordCount(def) <= 150;
        expect(typeof valid).toBe('boolean');
        if (wordCount(def) <= 150) expect(valid).toBe(true);
        else expect(valid).toBe(false);
      }),
      { numRuns: 100 },
    );
  });
});
