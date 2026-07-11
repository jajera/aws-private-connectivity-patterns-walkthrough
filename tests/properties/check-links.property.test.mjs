import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { buildUpstreamPatternLink } from '../../scripts/check-links.mjs';

const PATTERNS = ['peering', 'privatelink', 'lattice', 'tgw', 'cloudwan'];
const ROLES = ['shared-services', 'consumer'];

describe('Property 3: Upstream Link Format Pinning', () => {
  it('builds pinned upstream Terraform directory URLs', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...PATTERNS),
        fc.constantFrom(...ROLES),
        fc.stringMatching(/^[0-9a-f]{7,40}$/),
        (pattern, role, ref) => {
          const url = buildUpstreamPatternLink(ref, pattern, role);
          expect(url).toBe(
            `https://github.com/jajera/aws-private-connectivity-patterns-demo/tree/${ref}/terraform/patterns/${pattern}/${role}/`,
          );
        },
      ),
      { numRuns: 100 },
    );
  });
});
