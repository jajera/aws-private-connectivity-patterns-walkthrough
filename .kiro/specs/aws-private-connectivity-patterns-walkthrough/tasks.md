# Implementation Plan: AWS Private Connectivity Patterns Walkthrough

## Overview

This plan implements a static documentation site (Astro + Starlight) that teaches platform engineers how to deploy and compare five independent AWS private cross-account connectivity patterns. The implementation is organized into seven phases: inventory audit, project scaffolding, architecture content, walkthrough content, reference content, CI/Pages automation, and hardening with property-based tests.

## Tasks

- [x] 1. Phase 0 — Inventory (Audit Upstream Content to Port)
  - [x] 1.1 Create an inventory manifest file documenting all upstream content to port
    - Create `docs/inventory.md` mapping upstream demo repo files (`README.md`, `docs/architecture.md`, `docs/walkthrough.md`, `docs/diagrams/*.svg`, `local.env.example`) to their target site pages
    - List each upstream file, its target content domain, target file path, and requirements it satisfies
    - Identify which upstream diagrams exist in `docs/diagrams/` for each pattern (vpc-peering, privatelink, lattice, tgw, cloudwan)
    - Document the Source_Version_Declaration (pinned commit/tag) to use for all upstream links
    - _Requirements: 1.2, 4.3, 4.4, 17.1, 17.3, 25.1, 25.2_

  - [x] 1.2 Copy static diagram assets from upstream into `public/diagrams/`
    - Create `public/diagrams/` directory
    - Copy all `.svg` files from the upstream `docs/diagrams/` directory
    - Only include diagrams that exist; do not create placeholders for missing patterns
    - _Requirements: 4.3, 4.4, AD-10_

- [x] 2. Phase 1 — Scaffold (Astro + Starlight Project Setup)
  - [x] 2.1 Initialize `package.json` with project metadata and dependencies
    - Create `package.json` with name `aws-private-connectivity-patterns-walkthrough`
    - Add dependencies: `astro`, `@astrojs/starlight`, `sharp`
    - Add devDependencies: `fast-check`, `vitest`
    - Add scripts: `dev`, `build` (runs validators then `astro build`), `preview`, `test`, `test:integration`
    - Define `build` script as: `node scripts/check-placeholders.mjs && node scripts/check-asides.mjs && node scripts/check-links.mjs && astro build`
    - _Requirements: 21.2, 27.1, AD-1_

  - [x] 2.2 Create `astro.config.mjs` with Starlight integration, base path, and sidebar groups
    - Set `site` to the GitHub Pages URL
    - Set `base` to `/aws-private-connectivity-patterns-walkthrough/`
    - Configure Starlight with title, sidebar groups for all four content domains
    - Sidebar order: Architecture (topology → comparison → diagram pages → cloudwan), Walkthrough (prerequisites → execution-model → pattern pages → verification → teardown → troubleshooting), Reference (faq → adrs → glossary → links → sensitive-data)
    - Enable Mermaid integration via `@astrojs/starlight-mermaid` or equivalent remark plugin
    - _Requirements: 21.1, 26.1, 26.2, 26.3, 26.4, AD-6, AD-8_

  - [x] 2.3 Create `tsconfig.json` for Astro TypeScript support
    - Extend Astro's recommended TypeScript config
    - _Requirements: AD-1_

  - [x] 2.4 Create stub content directory structure
    - Create `src/content/docs/index.mdx` (landing page stub)
    - Create `src/content/docs/architecture/` directory with empty stub files for: `topology.mdx`, `comparison.mdx`, `diagram-vpc-peering.mdx`, `diagram-privatelink.mdx`, `diagram-lattice.mdx`, `diagram-tgw.mdx`, `diagram-cloudwan.mdx`
    - Create `src/content/docs/walkthrough/` directory with stubs for: `prerequisites.mdx`, `execution-model.mdx`, `privatelink.mdx`, `lattice.mdx`, `vpc-peering.mdx`, `tgw.mdx`, `cloudwan.mdx`, `verification.mdx`, `teardown.mdx`, `troubleshooting.mdx`
    - Create `src/content/docs/reference/` directory with stubs for: `faq.mdx`, `adrs.mdx`, `glossary.mdx`, `links.mdx`, `sensitive-data.mdx`
    - Each stub should have valid frontmatter with title so the build succeeds
    - _Requirements: 26.1, 26.4_

  - [x] 2.5 Create stub validation scripts so `npm run build` passes
    - Create `scripts/check-placeholders.mjs` with exit code 0 (placeholder implementation)
    - Create `scripts/check-asides.mjs` with exit code 0 (placeholder implementation)
    - Create `scripts/check-links.mjs` with exit code 0 (placeholder implementation)
    - _Requirements: 22.1, 23.5, 27.1_

- [x] 3. Checkpoint — Verify scaffold builds successfully
  - Ensure `npm install && npm run build` exits 0 with stub content and stub validators. Ask the user if questions arise.

- [x] 4. Phase 2 — Architecture Content
  - [x] 4.1 Write `src/content/docs/architecture/topology.mdx` — Account Topology
    - Document two-account topology: Shared_Services_Account (provider/hub) and Dev_Account (consumer/spoke)
    - Create Mermaid TD diagram showing: two accounts, AWS CLI profiles (`shared-services`, `dev`), Primary_Region (`ap-southeast-2`), Cloud_WAN_Regions, RAM_Region (`us-east-1`), directional arrows for provider→consumer connectivity
    - Label RAM_Region as the global Cloud WAN core-network share region (not a workload region)
    - Include legend subgraph identifying node types with consistent shapes
    - Add table of AWS CLI profiles: profile name, target account, role (provider/consumer), assumed IAM role
    - Use Placeholder_IDs for all account numbers and ARNs
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 24.1, 24.2, 24.4_

  - [x] 4.2 Write `src/content/docs/architecture/comparison.mdx` — Pattern Comparison
    - Create tabular comparison with columns: Pattern name, OSI layer, CIDR overlap (yes/no), primary cost driver, recommended use case
    - Exactly five rows: vpc-peering, privatelink, lattice, tgw, cloudwan
    - Add one `:::tip` aside per pattern (five total) stating when each pattern is the recommended choice
    - _Requirements: 3.1, 3.2, 3.3, 23.1_

  - [x] 4.3 Write per-pattern diagram pages (5 files)
    - Create `architecture/diagram-vpc-peering.mdx`: Mermaid TD diagram with VPCs, subnets, peering connection, route tables; include static image from `public/diagrams/` if available; alt text ≥20 characters
    - Create `architecture/diagram-privatelink.mdx`: Mermaid TD diagram with VPC endpoint service, interface endpoint, ENI, NLB; include static image if available
    - Create `architecture/diagram-lattice.mdx`: Mermaid TD diagram with service network, service, VPC association, RAM share; include static image if available
    - Create `architecture/diagram-tgw.mdx`: Mermaid TD diagram with TGW, attachments, route tables, VPCs; include static image if available
    - All diagrams use consistent TD direction, legend subgraph, and shape-to-type mapping
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 24.1, 24.2, 24.3, 24.4, 27.3_

  - [x] 4.4 Write `src/content/docs/architecture/diagram-cloudwan.mdx` — Cloud WAN Segments and RAM
    - Document three segments (shared, workloads, sandbox) with inter-segment routing: shared ↔ workloads allow, sandbox isolated
    - Explain Cloud WAN core network as global resource; RAM share MUST use `us-east-1` because global resources require it, NOT because workloads run there
    - Describe multi-region topology across Cloud_WAN_Regions, segment-to-region mapping
    - Create Mermaid TD diagram showing: three segments, three Cloud_WAN_Regions, RAM share from `us-east-1`
    - Add `:::tip` aside clarifying RAM_Region rationale (global resource, not workload placement)
    - Include static image from upstream if available; alt text ≥20 characters
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 4.1, 4.2, 24.1, 24.2, 24.4, 27.3_

- [x] 5. Checkpoint — Verify architecture content builds
  - Ensure `npm run build` exits 0 with all architecture pages populated. Ask the user if questions arise.

- [x] 6. Phase 3 — Walkthrough Content
  - [x] 6.1 Write `src/content/docs/walkthrough/prerequisites.mdx`
    - List required tools: AWS CLI, Terraform, Session Manager plugin
    - Document required AWS CLI profiles: `shared-services` and `dev` configured for SSO
    - Document sequential preflight checks: (a) SSO login, (b) `aws sts get-caller-identity` per profile, (c) SSM session test
    - Use Placeholder_IDs in all example outputs
    - Add `:::caution` aside warning about AWS costs
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 23.2_

  - [x] 6.2 Write `src/content/docs/walkthrough/execution-model.mdx`
    - Document one-pattern-at-a-time workflow: deploy → verify → teardown
    - Add `:::danger` aside warning about cost multiplication from simultaneous patterns
    - Explain shared-services before consumer apply order (dependency on shared-services outputs)
    - Document two Terraform roots per pattern: `shared-services` and `consumer`
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 23.3_

  - [x] 6.3 Write `src/content/docs/walkthrough/privatelink.mdx`
    - Two-step apply: shared-services (endpoint service), then consumer (VPC endpoint)
    - Link to upstream paths pinned to Source_Version_Declaration
    - Use Placeholder_IDs in Terraform outputs
    - Document what each apply creates
    - Add `:::tip` aside: simplest pattern, recommended first
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 25.1, 25.2, 25.3_

  - [x] 6.4 Write `src/content/docs/walkthrough/lattice.mdx`
    - Three-step: apply shared-services, accept RAM share in Dev_Account, apply consumer
    - Link to upstream paths pinned to Source_Version_Declaration
    - Add `:::tip` aside: RAM share must be accepted before VPC association
    - Use Placeholder_IDs
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 25.1, 25.2, 25.3_

  - [x] 6.5 Write `src/content/docs/walkthrough/vpc-peering.mdx`
    - Three steps: apply shared-services + consumer, accept peering, enable DNS resolution
    - Link to upstream paths pinned to Source_Version_Declaration
    - Add `:::caution` aside: DNS resolution is a separate post-acceptance step
    - Use Placeholder_IDs
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 25.1, 25.2, 25.3_

  - [x] 6.6 Write `src/content/docs/walkthrough/tgw.mdx`
    - Sequential: apply shared-services, apply consumer, accept TGW attachment, configure routes
    - Link to upstream paths pinned to Source_Version_Declaration
    - Add `:::caution` aside: route propagation/static routes required after attachment acceptance
    - Use Placeholder_IDs
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 25.1, 25.2, 25.3_

  - [x] 6.7 Write `src/content/docs/walkthrough/cloudwan.mdx`
    - Multi-region apply across Cloud_WAN_Regions; accept the global Cloud WAN core-network RAM share from RAM_Region (`us-east-1`) because the core network is a global resource
    - Link to upstream paths pinned to Source_Version_Declaration
    - Document segment verification: shared ↔ workloads allow, sandbox deny
    - Add `:::danger` aside: highest cost/complexity pattern
    - Use Placeholder_IDs
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5, 25.1, 25.2, 25.3_

  - [x] 6.8 Write `src/content/docs/walkthrough/verification.mdx`
    - Document per-pattern connectivity test using `curl` via SSM Session Manager
    - Cloud WAN-specific: route-policy checks for segment allow/deny
    - Include example command AND expected output per pattern
    - Add `:::tip` aside: interpreting success (HTTP response) vs failure (timeout/refused)
    - Use Placeholder_IDs
    - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5_

  - [x] 6.9 Write `src/content/docs/walkthrough/teardown.mdx`
    - Document consumer-before-shared-services destroy order for every pattern
    - Explicit `terraform destroy` commands per pattern (consumer first, shared-services second)
    - Cloud WAN: additional region-specific teardown steps if applicable
    - Add `:::caution` aside: dependency errors if shared-services destroyed first
    - Use Placeholder_IDs
    - _Requirements: 14.1, 14.2, 14.3, 14.4, 14.5_

  - [x] 6.10 Write `src/content/docs/walkthrough/troubleshooting.mdx`
    - Separate subsections for: SSO token expiry, profile misconfiguration, RAM share pending, peering not accepted, route missing, SSM connectivity failure
    - Each subsection: affected pattern(s), symptom, cause, resolution command, verification action
    - Use Placeholder_IDs in all examples
    - _Requirements: 15.1, 15.2, 15.3_

- [x] 7. Checkpoint — Verify walkthrough content builds
  - Ensure `npm run build` exits 0 with all walkthrough pages. Ask the user if questions arise.

- [x] 8. Phase 4 — Reference Content
  - [x] 8.1 Write `src/content/docs/reference/faq.mdx`
    - At least 5 Q&A pairs covering: pattern selection, cost comparison, why ap-southeast-2, site vs upstream repo relationship, combining patterns
    - Format questions as visible headings/bold text, scannable without reading answers
    - Use Placeholder_IDs in any example outputs
    - _Requirements: 16.1, 16.2, 16.3_

  - [x] 8.2 Write `src/content/docs/reference/adrs.mdx`
    - List all ADRs from upstream `docs/architecture.md`
    - Each entry: context, decision statement, consequences (labeled sections)
    - Links to upstream pinned to Source_Version_Declaration
    - Preserve upstream ordering
    - _Requirements: 17.1, 17.2, 17.3, 17.4_

  - [x] 8.3 Write `src/content/docs/reference/glossary.mdx`
    - Define all required terms: VPC Peering, PrivateLink, VPC Lattice, Transit Gateway, Cloud WAN, RAM, SSO, Session Manager, CIDR, ENI, core network, segment, attachment, service network, endpoint service, plus all document-level glossary terms
    - For core network / RAM / RAM_Region: note that Cloud WAN core networks are global resources and RAM shares of them must use `us-east-1`
    - Alphabetical order (case-insensitive), definitions ≤150 words, acronyms expanded first
    - _Requirements: 18.1, 18.2, 18.3, 18.4_

  - [x] 8.4 Write `src/content/docs/reference/links.mdx`
    - At least one `docs.aws.amazon.com` link per pattern and per supporting service (RAM, Session Manager, Organizations, VPC networking)
    - Organize into topic groups with headings
    - Descriptive label text (no raw URLs)
    - _Requirements: 19.1, 19.2, 19.3, 19.4_

  - [x] 8.5 Write `src/content/docs/reference/sensitive-data.mdx`
    - Document `local.env` purpose and expected variables (account IDs, profile names)
    - Document `.gitignore` entry for `local.env`
    - Add `:::danger` aside: never commit real account IDs, ARNs, keys, or credentials
    - Provide placeholder vs real value contrast example
    - Document remediation: rotate credentials, remove commit from history
    - _Requirements: 20.1, 20.2, 20.3, 20.4_

  - [x] 8.6 Write `src/content/docs/index.mdx` — Landing Page
    - Sections in order: purpose statement, target audience, success criteria, non-goals, "What this is / What this is not" comparison, pattern comparison summary table
    - Source_Version_Declaration pinning walkthrough to specific upstream commit/tag
    - Pattern summary table: one row per pattern, columns for name, scope, complexity, primary use case (≤30 words)
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

- [x] 9. Checkpoint — Verify reference content and landing page build
  - Ensure `npm run build` exits 0 with all content pages populated. Ask the user if questions arise.

- [x] 10. Phase 5 — CI/Pages (GitHub Actions and Quality Gate Scripts)
  - [x] 10.1 Implement `scripts/check-placeholders.mjs` — Placeholder ID Scanner
    - Scan all `.md` and `.mdx` files under `src/content/docs/`
    - Inside fenced code blocks, command examples, and output samples: flag 12-digit numbers not in allow-list (`123456789012`, `987654321098`)
    - Flag non-allowlisted ARNs (`arn:aws:...:` with disallowed account IDs)
    - Flag AWS DNS patterns (`*.amazonaws.com`, `*.awsglobalaccelerator.com`, `*.elb.amazonaws.com`) that are not documented placeholders
    - Ignore 12-digit numbers outside fenced code blocks
    - On violation: output file path, line number, matched pattern; exit 1
    - On no violations: exit 0
    - _Requirements: 22.1, 22.2, 22.3, 22.4_

  - [x] 10.2 Implement `scripts/check-asides.mjs` — Aside Type Validator
    - Scan all `.md` and `.mdx` files under `src/content/docs/`
    - Accept `:::tip`, `:::caution`, `:::danger`
    - Reject any other aside type (e.g., `:::note`, `:::warning`, `:::info`)
    - On violation: output file path, line number, disallowed type; exit 1
    - On no violations: exit 0
    - _Requirements: 23.4, 23.5_

  - [x] 10.3 Implement `scripts/check-links.mjs` — Upstream Link Checker
    - Extract Source_Version_Declaration ref from landing page
    - Validate all upstream repo links use the pinned ref format
    - Validate links to `docs.aws.amazon.com` resolve (HTTP HEAD request)
    - Validate upstream repo links resolve (HTTP HEAD request)
    - On broken link or wrong ref: output URL, expected ref, HTTP status; exit 1
    - On all links valid: exit 0
    - _Requirements: 1.5, 19.4, 25.2, 27.4_

  - [x] 10.4 Create `.github/workflows/ci.yml` — PR Validation Workflow
    - Trigger on pull_request targeting `main`
    - Steps: checkout, setup Node.js, `npm ci`, `npm run build`
    - Report as required status check
    - _Requirements: 21.2, 21.4, 21.5_

  - [x] 10.5 Create `.github/workflows/deploy.yml` — Deploy to GitHub Pages
    - Trigger on push to `main`
    - Steps: checkout, setup Node.js, `npm ci`, `npm run build`, deploy to GitHub Pages
    - Set base path to `/aws-private-connectivity-patterns-walkthrough/`
    - _Requirements: 21.1, 21.3_

- [x] 11. Checkpoint — Verify CI workflows and validation scripts
  - Ensure `npm run build` runs all three validators and exits 0. Verify workflow YAML is valid. Ask the user if questions arise.

- [x] 12. Phase 6 — Hardening (Property-Based Tests, Integration Tests, README, Steering)
  - [x]* 12.1 Write property test: Placeholder Scanner Detection Correctness
    - **Property 1: Placeholder Scanner Detection Correctness**
    - **Validates: Requirements 22.1, 22.2, 22.4**
    - Use fast-check to generate Markdown with code blocks containing: allowlisted IDs, random 12-digit numbers, IDs in prose outside blocks
    - Verify scanner flags only violations in code blocks and ignores prose
    - File: `tests/properties/check-placeholders.property.test.mjs`

  - [x]* 12.2 Write property test: Placeholder Scanner Error Reporting
    - **Property 2: Placeholder Scanner Error Reporting**
    - **Validates: Requirements 22.3**
    - Use fast-check to generate files with known violations at random positions
    - Verify error output contains file path, line number, and matched pattern
    - File: `tests/properties/check-placeholders.property.test.mjs`

  - [x]* 12.3 Write property test: Upstream Link Format Pinning
    - **Property 3: Upstream Link Format Pinning**
    - **Validates: Requirements 8.2, 9.2, 10.2, 11.2, 12.2, 17.3, 25.1, 25.2**
    - Use fast-check to generate from enum of pattern names × roles × random ref strings
    - Verify link format matches `https://github.com/jajera/aws-private-connectivity-patterns-demo/tree/<ref>/terraform/patterns/<pattern>/<role>/`
    - File: `tests/properties/check-links.property.test.mjs`

  - [x]* 12.4 Write property test: Aside Type Validation
    - **Property 4: Aside Type Validation**
    - **Validates: Requirements 23.4, 23.5**
    - Use fast-check to generate Markdown with random `:::` directives (valid and invalid types)
    - Verify validator accepts tip/caution/danger and rejects all others
    - File: `tests/properties/check-asides.property.test.mjs`

  - [x]* 12.5 Write property test: Mermaid Diagram Standards Compliance
    - **Property 5: Mermaid Diagram Standards Compliance**
    - **Validates: Requirements 24.1, 24.2, 24.4**
    - Extract all Mermaid blocks from built site content
    - Verify TD direction, legend subgraph presence, consistent shape mapping
    - File: `tests/properties/mermaid-standards.property.test.mjs`

  - [x]* 12.6 Write property test: Heading Hierarchy Validity
    - **Property 6: Heading Hierarchy Validity**
    - **Validates: Requirements 27.2**
    - Use fast-check to generate random heading sequences
    - Verify hierarchy checker correctly identifies skipped levels
    - File: `tests/properties/heading-hierarchy.property.test.mjs`

  - [x]* 12.7 Write property test: Image Alt Text Minimum Length
    - **Property 7: Image Alt Text Minimum Length**
    - **Validates: Requirements 27.3**
    - Use fast-check to generate `<img>` elements with random alt text lengths
    - Verify enforcement of ≥20 character threshold
    - File: `tests/properties/image-alt-text.property.test.mjs`

  - [x]* 12.8 Write property test: Glossary Entry Validity
    - **Property 8: Glossary Entry Validity**
    - **Validates: Requirements 18.2, 18.3**
    - Use fast-check to generate random term lists and definitions
    - Verify alphabetical sort (case-insensitive) and ≤150 word definitions
    - File: `tests/properties/glossary-validity.property.test.mjs`

  - [x]* 12.9 Write integration tests
    - Test full `npm run build` exits 0 (build integrity)
    - Test page existence: all 23 content pages exist at expected paths
    - Test sidebar configuration: four domain groups with correct page order
    - Test base path equals `/aws-private-connectivity-patterns-walkthrough/`
    - File: `tests/integration/build.test.mjs`
    - _Requirements: 21.2, 26.1, 26.2, 27.1_

  - [x] 12.10 Create `README.md` skeleton with "What this is / What this is not" table
    - Include: project title, one-line description, "What this is / What this is not" table (documentation site vs Terraform repo), quick start commands (`npm install`, `npm run dev`, `npm run build`), link to deployed site, link to upstream demo repo
    - _Requirements: 1.3_

  - [x] 12.11 Create `.kiro/steering/editor-tooling.md` steering file
    - Mirror IPAM documentation conventions: Placeholder_ID usage, aside type restrictions, Mermaid diagram standards (TD direction, legend, consistent shapes)
    - Document coding conventions for MDX content authoring
    - Include upstream link format with Source_Version_Declaration pinning
    - List approved Placeholder_IDs and explain when/where they are required

- [x] 13. Final Checkpoint — Full validation
  - Ensure all tests pass (`npm test`), build succeeds (`npm run build`), all 23 pages render, CI workflows are valid. Ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation after each phase
- Property tests validate universal correctness properties from the design document using fast-check
- Unit/integration tests validate specific examples and edge cases
- The build command (`npm run build`) is the quality gate: validators run first, then Astro compiles
- All content uses Placeholder_IDs — no real AWS identifiers anywhere in committed files
- Static images come from upstream `docs/diagrams/` only if they exist; missing images are not placeholders

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1", "1.2"] },
    { "id": 1, "tasks": ["2.1", "2.2", "2.3"] },
    { "id": 2, "tasks": ["2.4", "2.5"] },
    { "id": 3, "tasks": ["4.1", "4.2"] },
    { "id": 4, "tasks": ["4.3", "4.4"] },
    { "id": 5, "tasks": ["6.1", "6.2"] },
    { "id": 6, "tasks": ["6.3", "6.4", "6.5", "6.6", "6.7"] },
    { "id": 7, "tasks": ["6.8", "6.9", "6.10"] },
    { "id": 8, "tasks": ["8.1", "8.2", "8.3", "8.4", "8.5", "8.6"] },
    { "id": 9, "tasks": ["10.1", "10.2", "10.3"] },
    { "id": 10, "tasks": ["10.4", "10.5"] },
    { "id": 11, "tasks": ["12.1", "12.2", "12.3", "12.4", "12.5", "12.6", "12.7", "12.8"] },
    { "id": 12, "tasks": ["12.9", "12.10", "12.11"] }
  ]
}
```
