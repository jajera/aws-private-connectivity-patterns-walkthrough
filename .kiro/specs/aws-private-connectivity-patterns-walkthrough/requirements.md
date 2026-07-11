# Requirements Document

## Introduction

This document defines the requirements for a static documentation site that teaches platform engineers how to deploy and compare five independent AWS private cross-account connectivity patterns. The site is built with Astro + Starlight, deployed to GitHub Pages, and serves as an operational reference companion to the upstream Terraform demo repository. The site contains no infrastructure-as-code itself; all Terraform lives in the upstream demo repo.

## Glossary

- **Site**: The Astro + Starlight static documentation site deployed to GitHub Pages at the repository base path `/aws-private-connectivity-patterns-walkthrough/`
- **Upstream_Demo_Repo**: The GitHub repository `jajera/aws-private-connectivity-patterns-demo` containing all Terraform code for the five connectivity patterns
- **Pattern**: One of five independent AWS private cross-account connectivity solutions: vpc-peering, privatelink, lattice, tgw, or cloudwan
- **Shared_Services_Account**: The AWS account acting as the provider/hub, accessed via the `shared-services` AWS CLI profile
- **Dev_Account**: The AWS account acting as the consumer/spoke, accessed via the `dev` AWS CLI profile
- **Primary_Region**: `ap-southeast-2`, the default deployment region for all patterns
- **Cloud_WAN_Regions**: `ap-southeast-2`, `ap-southeast-6`, and `ap-southeast-1`, the three regions used by the Cloud WAN pattern
- **RAM_Region**: `us-east-1`, the region required for Resource Access Manager sharing of the Cloud WAN core network because a Cloud WAN core network is a global resource and AWS RAM shares of global resources must be created and accepted in `us-east-1`
- **Source_Version_Declaration**: A pinned commit hash or tag reference to the Upstream_Demo_Repo, displayed on the landing page to declare the exact version of upstream code the walkthrough documents
- **Starlight**: The Astro-based documentation theme used to build the Site
- **Aside**: A Starlight callout component supporting tip, caution, and danger variants
- **Mermaid**: A JavaScript-based diagramming tool used for topology diagrams rendered in Starlight
- **Placeholder_ID**: A synthetic identifier (e.g., `123456789012`, `arn:aws:...:EXAMPLE`) used in documentation instead of real AWS account IDs, ARNs, or DNS names
- **Quality_Gate**: The `npm run build` command that must pass without errors before merge or deploy
- **Content_Domain**: One of the four top-level site sections: Landing, Architecture, Walkthrough, or Reference

## Requirements

### Requirement 1: Landing Page Content

**User Story:** As a platform engineer, I want a landing page that clearly states the purpose, audience, and scope of this walkthrough site, so that I can quickly determine whether the content is relevant to my needs.

#### Acceptance Criteria

1. THE Site SHALL display a landing index page containing the following sections in order: purpose statement, target audience, success criteria, non-goals, "What this is / What this is not" comparison, and a pattern comparison summary table
2. THE Site SHALL display a Source_Version_Declaration on the landing page that pins the walkthrough content to a specific commit hash or tag of the Upstream_Demo_Repo
3. THE Site SHALL display a "What this is / What this is not" comparison clarifying that the Site is a documentation companion and the Upstream_Demo_Repo contains the Terraform code
4. THE Site SHALL present the pattern comparison summary table with one row per Pattern and columns for: pattern name, scope (single-region or multi-region), relative complexity (low, medium, or high), and primary use case (one sentence of no more than 30 words)
5. IF the Source_Version_Declaration references a commit hash or tag that does not exist in the Upstream_Demo_Repo, THEN THE Quality_Gate SHALL fail with an error message indicating an invalid upstream reference

### Requirement 2: Architecture — Account Topology

**User Story:** As a platform engineer, I want to understand the account topology used across all patterns, so that I can map the documentation to my own multi-account environment.

#### Acceptance Criteria

1. THE Site SHALL include an architecture page describing the two-account topology: Shared_Services_Account as provider/hub and Dev_Account as consumer/spoke, including the account purpose, hub-spoke relationship, and the Primary_Region (`ap-southeast-2`) as the default deployment region
2. THE Site SHALL render a Mermaid diagram showing: the two accounts, their associated AWS CLI profiles (`shared-services`, `dev`), the Primary_Region (`ap-southeast-2`), Cloud_WAN_Regions (`ap-southeast-2`, `ap-southeast-6`, `ap-southeast-1`), and RAM_Region (`us-east-1`), with directional arrows indicating provider-to-consumer connectivity
3. THE Site SHALL list the AWS CLI profiles (`shared-services`, `dev`) in a table specifying for each profile: the target account (Shared_Services_Account or Dev_Account), the account role (provider or consumer), and the assumed IAM role type (e.g., AdministratorAccess)
4. THE Site SHALL use Placeholder_IDs for all AWS account numbers and ARNs displayed on the architecture page

### Requirement 3: Architecture — Pattern Comparison

**User Story:** As a platform engineer, I want a structured comparison of all five patterns, so that I can select the appropriate connectivity approach for a given use case.

#### Acceptance Criteria

1. THE Site SHALL include a pattern comparison page with columns for: Pattern name, OSI layer of operation, CIDR overlap support (yes/no), primary cost driver (one sentence per Pattern), and at least one recommended use case per Pattern
2. THE Site SHALL present the comparison in a tabular format with exactly five rows, one for each Pattern (vpc-peering, privatelink, lattice, tgw, cloudwan), and every cell populated
3. THE Site SHALL include one Starlight Aside of type "tip" per Pattern (five total), each stating the specific use-case conditions under which that Pattern is the recommended choice based on the criteria listed in the comparison table

### Requirement 4: Architecture — Per-Pattern Topology Diagrams

**User Story:** As a platform engineer, I want per-pattern topology diagrams, so that I can visualize the network path and components for each connectivity approach.

#### Acceptance Criteria

1. THE Site SHALL include a dedicated architecture diagram page within the Architecture Content_Domain for each of the five Patterns: vpc-peering, privatelink, lattice, tgw, and cloudwan
2. WHEN a pattern diagram page is rendered, THE Site SHALL display a Mermaid topology diagram showing the pattern-relevant components (VPCs, subnets, endpoints, gateways, attachments, or service networks as applicable to that Pattern) with labeled arrows indicating data flow direction between producer and consumer
3. WHERE the Upstream_Demo_Repo provides an official AWS icon diagram for a Pattern in `docs/diagrams/`, THE Site SHALL include that diagram as a static image with descriptive alt text on the same page as the corresponding Mermaid diagram
4. IF the Upstream_Demo_Repo does not provide an official AWS icon diagram in `docs/diagrams/` for a given Pattern, THEN THE Site SHALL display only the Mermaid topology diagram without a static image placeholder

### Requirement 5: Architecture — Cloud WAN Segments and RAM

**User Story:** As a platform engineer, I want to understand Cloud WAN segment design and why the Cloud WAN core network must be shared via RAM in `us-east-1`, so that I can correctly deploy and verify the cloudwan pattern.

#### Acceptance Criteria

1. THE Site SHALL document the three Cloud WAN segments (shared, workloads, and sandbox) including each segment's purpose and its inter-segment routing policy: shared and workloads segments allow mutual traffic, and the sandbox segment is isolated from all other segments
2. THE Site SHALL explain that the Cloud WAN core network is a global resource shared via RAM, and that because AWS RAM requires global resource shares to be created and accepted in RAM_Region (`us-east-1`), the share must use `us-east-1` regardless of which Cloud_WAN_Regions host the workload VPCs
3. THE Site SHALL describe the multi-region topology spanning Cloud_WAN_Regions (`ap-southeast-2`, `ap-southeast-6`, `ap-southeast-1`), identifying which segments are attached in each region and the role of each region in the overall network
4. THE Site SHALL include a Mermaid diagram showing segment-to-region mapping and RAM sharing flow, depicting all three segments, all three Cloud_WAN_Regions, and the RAM share of the global core network originating from RAM_Region (`us-east-1`)
5. THE Site SHALL include a Starlight Aside of type "tip" clarifying that RAM sharing of the Cloud WAN core network must be performed in `us-east-1` because the core network is a global resource (not because workloads run in `us-east-1`), even when all workload VPCs reside in other regions

### Requirement 6: Walkthrough — Prerequisites and Preflight

**User Story:** As a platform engineer, I want clear prerequisite and preflight validation steps, so that I can confirm my environment is ready before running any Terraform.

#### Acceptance Criteria

1. THE Site SHALL include a prerequisites page listing required tools (AWS CLI, Terraform, Session Manager plugin) and required AWS CLI named profiles (`shared-services` and `dev`) configured for SSO access
2. THE Site SHALL document preflight checks in sequential order: (a) AWS SSO login, (b) profile validation by running `aws sts get-caller-identity` for each profile and confirming the command returns an Account and Arn field without error, and (c) Session Manager connectivity test by initiating an SSM session to a target instance and confirming a shell prompt is returned
3. THE Site SHALL use Placeholder_IDs in all example command outputs instead of real account IDs or ARNs
4. THE Site SHALL include a Starlight Aside of type "caution" warning that running patterns incurs AWS costs

### Requirement 7: Walkthrough — Pattern Execution Model

**User Story:** As a platform engineer, I want to understand how to run one pattern at a time, so that I can control costs and isolate testing.

#### Acceptance Criteria

1. THE Site SHALL document that each of the five Patterns (vpc-peering, privatelink, lattice, tgw, cloudwan) is independent and intended to be deployed one at a time, with the recommended workflow being: deploy, verify, then teardown before deploying the next pattern
2. THE Site SHALL include a Starlight Aside of type "danger" warning that running multiple patterns simultaneously multiplies infrastructure costs across all deployed patterns and may cause resource conflicts between consumer accounts
3. WHEN describing pattern execution order, THE Site SHALL specify that `shared-services` resources are applied before `consumer` resources because consumer resources depend on infrastructure outputs created by the shared-services root
4. THE Site SHALL document that each Pattern contains exactly two Terraform roots (`shared-services` and `consumer`) and that the apply sequence within a pattern is: `shared-services` first, then `consumer`

### Requirement 8: Walkthrough — PrivateLink Pattern

**User Story:** As a platform engineer, I want step-by-step instructions for the PrivateLink pattern, so that I can deploy the simplest connectivity option first.

#### Acceptance Criteria

1. THE Site SHALL include a walkthrough page for the privatelink Pattern listing the two-step apply process: first applying `shared-services` using the `shared-services` AWS CLI profile, then applying `consumer` using the `dev` AWS CLI profile
2. THE Site SHALL link to the upstream Terraform paths `terraform/patterns/privatelink/shared-services/` and `terraform/patterns/privatelink/consumer/` in the Upstream_Demo_Repo, with links pinned to the commit or tag declared in the Source_Version_Declaration
3. THE Site SHALL use Placeholder_IDs in all example Terraform outputs
4. THE Site SHALL document that the shared-services apply creates the VPC endpoint service and the consumer apply creates the VPC endpoint that connects to it
5. THE Site SHALL include a Starlight Aside of type "tip" indicating that PrivateLink is the simplest pattern and recommended as the first deployment to validate cross-account connectivity

### Requirement 9: Walkthrough — Lattice Pattern

**User Story:** As a platform engineer, I want step-by-step instructions for the Lattice pattern, so that I can deploy VPC Lattice with RAM acceptance.

#### Acceptance Criteria

1. THE Site SHALL include a walkthrough page for the lattice Pattern documenting a three-step sequence: apply shared-services resources using the `shared-services` profile, accept the RAM resource share in the Dev_Account, then apply consumer resources using the `dev` profile
2. THE Site SHALL link to the upstream Terraform path `terraform/patterns/lattice/{shared-services,consumer}/` in the Upstream_Demo_Repo
3. THE Site SHALL include a Starlight Aside of type "tip" explaining that the consumer must accept the RAM resource share before VPC association can proceed, and that the share is initiated by the shared-services apply step
4. THE Site SHALL use Placeholder_IDs in all example Terraform outputs and RAM share acceptance command examples

### Requirement 10: Walkthrough — VPC Peering Pattern

**User Story:** As a platform engineer, I want step-by-step instructions for the VPC Peering pattern, so that I can deploy peering with acceptance and DNS configuration.

#### Acceptance Criteria

1. THE Site SHALL include a walkthrough page for the vpc-peering Pattern documenting three distinct steps in order: (a) Terraform apply for shared-services then consumer, (b) peering connection acceptance from the Dev_Account, and (c) DNS resolution enablement as a post-acceptance configuration step
2. THE Site SHALL link to the upstream Terraform path `terraform/patterns/vpc-peering/{shared-services,consumer}/` in the Upstream_Demo_Repo
3. THE Site SHALL include a Starlight Aside of type "caution" noting that DNS resolution configuration is a separate step required after peering acceptance and that connectivity will not resolve private DNS names until this step is complete
4. THE Site SHALL use Placeholder_IDs in all example Terraform outputs and CLI command examples on the vpc-peering walkthrough page

### Requirement 11: Walkthrough — Transit Gateway Pattern

**User Story:** As a platform engineer, I want step-by-step instructions for the Transit Gateway pattern, so that I can deploy TGW with attachment and route configuration.

#### Acceptance Criteria

1. THE Site SHALL include a walkthrough page for the tgw Pattern documenting the sequential workflow: apply shared-services, apply consumer, accept the TGW attachment, and configure route tables (propagation enablement and static route addition)
2. THE Site SHALL link to the upstream Terraform path `terraform/patterns/tgw/{shared-services,consumer}/` in the Upstream_Demo_Repo
3. THE Site SHALL include a Starlight Aside of type "caution" stating that after TGW attachment acceptance, route propagation must be enabled or static routes must be added before cross-account traffic will flow
4. THE Site SHALL use Placeholder_IDs in all example Terraform outputs and command examples on the tgw walkthrough page

### Requirement 12: Walkthrough — Cloud WAN Pattern

**User Story:** As a platform engineer, I want step-by-step instructions for the Cloud WAN pattern, so that I can deploy across three regions with segment verification.

#### Acceptance Criteria

1. THE Site SHALL include a walkthrough page for the cloudwan Pattern documenting: the apply order (shared-services resources before consumer resources), multi-region deployment across Cloud_WAN_Regions (`ap-southeast-2`, `ap-southeast-6`, `ap-southeast-1`), RAM resource share acceptance of the global Cloud WAN core network from RAM_Region (`us-east-1`), and segment connectivity verification
2. THE Site SHALL link to the upstream Terraform path `terraform/patterns/cloudwan/{shared-services,consumer}/` in the Upstream_Demo_Repo
3. THE Site SHALL document segment connectivity verification specifying: shared ↔ workloads segments allow traffic (verified by successful connectivity test between instances in those segments), and sandbox segment denies traffic to other segments (verified by failed connectivity test demonstrating isolation)
4. THE Site SHALL include a Starlight Aside of type "danger" noting the higher cost and complexity of the Cloud WAN pattern compared to other patterns, identifying it as the most resource-intensive of the five Patterns
5. THE Site SHALL use Placeholder_IDs in all example Terraform outputs and verification command examples

### Requirement 13: Walkthrough — Verification

**User Story:** As a platform engineer, I want verification procedures for each pattern, so that I can confirm connectivity is working as expected.

#### Acceptance Criteria

1. THE Site SHALL include a verification page documenting how to test connectivity for each of the five Patterns (vpc-peering, privatelink, lattice, tgw, cloudwan) using `curl` commands executed via AWS Systems Manager Session Manager against the provider-side service endpoint
2. THE Site SHALL document Cloud WAN-specific verification: route-policy checks confirming segment allow/deny behavior, specifying that shared-to-workloads connectivity is expected to succeed and sandbox segment connectivity is expected to be denied
3. THE Site SHALL use Placeholder_IDs in all verification command examples and expected outputs
4. THE Site SHALL include a Starlight Aside of type "tip" explaining how to interpret successful versus failed connectivity results, identifying a successful HTTP response as the pass indicator and a connection timeout or connection-refused response as the fail indicator
5. WHEN documenting a verification step, THE Site SHALL include both the example command and the expected output demonstrating the success case for that Pattern

### Requirement 14: Walkthrough — Teardown

**User Story:** As a platform engineer, I want teardown instructions with correct ordering, so that I can cleanly remove all resources without orphaned dependencies.

#### Acceptance Criteria

1. THE Site SHALL include a teardown page specifying that consumer resources must be destroyed before shared-services resources for every Pattern
2. THE Site SHALL document the teardown sequence for each of the five Patterns (vpc-peering, privatelink, lattice, tgw, cloudwan) with explicit `terraform destroy` commands targeting the consumer directory first and the shared-services directory second
3. WHERE the cloudwan Pattern spans multiple regions in Cloud_WAN_Regions, THE Site SHALL document any additional region-specific teardown steps required beyond the standard two-step consumer-then-shared-services sequence
4. THE Site SHALL use Placeholder_IDs in all teardown command examples and sample outputs
5. THE Site SHALL include a Starlight Aside of type "caution" warning that destroying shared-services resources before consumer resources causes dependency errors such as attempting to delete an endpoint service while endpoints still exist

### Requirement 15: Walkthrough — Troubleshooting

**User Story:** As a platform engineer, I want a troubleshooting guide, so that I can diagnose and resolve common deployment and connectivity issues.

#### Acceptance Criteria

1. THE Site SHALL include a troubleshooting page listing common issues: SSO token expiry, profile misconfiguration, RAM share pending, peering not accepted, route missing, and Session Manager connectivity failure, with each issue presented as a separate subsection
2. WHEN describing a troubleshooting scenario, THE Site SHALL provide: the affected Pattern(s), the observable symptom, the likely cause, at least one resolution step containing a specific command or action, and a verification action the engineer can run to confirm the issue is resolved
3. THE Site SHALL use Placeholder_IDs in all troubleshooting examples including symptom outputs, resolution commands, and verification command outputs

### Requirement 16: Reference — FAQ

**User Story:** As a platform engineer, I want a FAQ page, so that I can find quick answers to common questions about the patterns and the walkthrough site.

#### Acceptance Criteria

1. THE Site SHALL include a FAQ page containing at least 5 question-answer pairs covering, at minimum, the following topics: which Pattern to choose for a given use case, cost comparison across Patterns, why Primary_Region (`ap-southeast-2`) is the default, the relationship between the Site and the Upstream_Demo_Repo, and whether Patterns can be combined
2. THE Site SHALL format the FAQ as a list of question-answer pairs where each question is rendered as a visible heading or bold text distinguishable from the answer text, enabling readers to scan questions without reading answers
3. IF a FAQ answer includes example commands, identifiers, or outputs, THEN THE Site SHALL use Placeholder_IDs in place of real AWS account IDs, ARNs, or DNS hostnames

### Requirement 17: Reference — Decision Log and ADRs

**User Story:** As a platform engineer, I want access to architectural decision records, so that I can understand why specific design choices were made in the upstream demo.

#### Acceptance Criteria

1. THE Site SHALL include a decision log page listing all ADRs documented in the Upstream_Demo_Repo `docs/architecture.md` file
2. THE Site SHALL present each ADR entry with three labeled sections: context (the problem or background), decision statement (what was decided), and consequences (trade-offs and outcomes)
3. THE Site SHALL construct the upstream link for each referenced ADR using the commit or tag specified in the Source_Version_Declaration, ensuring links point to the pinned version of `docs/architecture.md` rather than the default branch head
4. THE Site SHALL order ADR entries on the decision log page in the same sequence they appear in the upstream `docs/architecture.md` file

### Requirement 18: Reference — Glossary

**User Story:** As a platform engineer, I want a glossary page, so that I can look up unfamiliar terms used throughout the walkthrough.

#### Acceptance Criteria

1. THE Site SHALL include a glossary page defining at minimum the following terms: VPC Peering, PrivateLink, VPC Lattice, Transit Gateway, Cloud WAN, RAM, SSO, Session Manager, CIDR, ENI, core network, segment, attachment, service network, endpoint service, and all terms listed in the document-level Glossary section
2. THE Site SHALL sort glossary entries alphabetically by term name using case-insensitive ordering
3. THE Site SHALL present each glossary entry as a term heading followed by a definition of no more than 150 words that describes the concept in the context of AWS private connectivity
4. WHEN a term defined in the glossary is an acronym, THE Site SHALL expand the acronym in its definition before providing the contextual explanation

### Requirement 19: Reference — AWS Documentation Links

**User Story:** As a platform engineer, I want links to official AWS documentation, so that I can access authoritative sources for deeper technical detail.

#### Acceptance Criteria

1. THE Site SHALL include a references page listing at least one official AWS documentation link (hosted on `docs.aws.amazon.com`) for each of the five Patterns (vpc-peering, privatelink, lattice, tgw, cloudwan) and for each supporting service (RAM, Session Manager, AWS Organizations, VPC networking)
2. THE Site SHALL organize links into topic groups: one group per Pattern and one group for supporting services, with each group identified by a heading matching the topic name
3. THE Site SHALL display each link with descriptive label text that identifies the target documentation page, rather than displaying raw URLs
4. IF a link on the references page does not resolve to a valid `docs.aws.amazon.com` URL, THEN THE Quality_Gate SHALL fail with an error indicating the broken link

### Requirement 20: Reference — Sensitive Data and local.env Guidance

**User Story:** As a platform engineer, I want guidance on managing sensitive data and local environment files, so that I can avoid committing secrets to version control.

#### Acceptance Criteria

1. THE Site SHALL include a page documenting sensitive data handling that covers: the purpose and expected variables in `local.env` (AWS account IDs and AWS CLI profile names), the `.gitignore` entry pattern that excludes `local.env` from version control, and the principle that all committed documentation uses Placeholder_IDs instead of real values
2. THE Site SHALL include a Starlight Aside of type "danger" warning against committing real 12-digit AWS account IDs, real ARN strings, AWS access keys, or session credentials to any repository
3. THE Site SHALL include at least one example contrasting a Placeholder_ID (e.g., `123456789012`) with a description of what a real value looks like, so that contributors can distinguish safe placeholders from real identifiers
4. THE Site SHALL document remediation guidance (rotating exposed credentials and removing the commit from history) to follow if sensitive values are accidentally committed

### Requirement 21: CI/CD Pipeline and Deployment

**User Story:** As a site maintainer, I want automated CI/CD that validates and deploys the Site, so that content changes are published reliably without manual intervention.

#### Acceptance Criteria

1. THE Site SHALL be deployed to GitHub Pages with the base path set to `/aws-private-connectivity-patterns-walkthrough/`
2. WHEN a pull request targeting the `main` branch is opened or updated, THE Site SHALL run a GitHub Actions workflow that executes `npm run build` as the Quality_Gate
3. WHEN a push to the `main` branch occurs and the Quality_Gate passes, THE Site SHALL be automatically deployed to GitHub Pages
4. IF the Quality_Gate fails on a pull request, THEN THE Site SHALL prevent the pull request from merging by reporting the workflow as a required status check and displaying build errors in the GitHub Actions log
5. THE Site SHALL configure the Quality_Gate workflow as a required status check on the `main` branch so that pull requests cannot be merged unless the check passes

### Requirement 22: Placeholder ID Enforcement

**User Story:** As a site maintainer, I want assurance that no real AWS identifiers appear in documentation, so that the site remains safe to publish publicly.

#### Acceptance Criteria

1. THE Site SHALL use Placeholder_IDs exclusively in all code blocks, command examples, and output samples, where Placeholder_IDs are limited to the known safe values defined in the Glossary (e.g., `123456789012`, `987654321098`, and ARNs containing these account IDs with resource names suffixed by `EXAMPLE`)
2. THE Quality_Gate SHALL detect the following patterns as violations in all Markdown and MDX content files: (a) any 12-digit numeric sequence that is not in the approved placeholder allow-list, (b) ARN strings (`arn:aws:...`) containing account IDs not in the allow-list, and (c) DNS hostnames matching AWS service patterns (e.g., `*.amazonaws.com`, `*.awsglobalaccelerator.com`, `*.elb.amazonaws.com`) that are not documented placeholder examples
3. WHEN a contributor adds content containing a pattern matching a prohibited AWS identifier, THE Quality_Gate SHALL fail and output an error message identifying the violating file, line number, and the matched pattern
4. IF content contains 12-digit numbers used as non-AWS values (e.g., phone numbers in prose outside code blocks, or version identifiers), THEN THE Quality_Gate SHALL not flag these as violations when they appear outside fenced code blocks, command examples, and output samples

### Requirement 23: Starlight Aside Usage Standards

**User Story:** As a reader, I want consistent use of callout components, so that I can quickly identify tips, cautions, and dangers throughout the documentation.

#### Acceptance Criteria

1. THE Site SHALL use Starlight Aside components of type "tip" (syntax `:::tip`) for non-critical suggestions, recommended practices, and time-saving shortcuts that supplement but are not required for completing a procedure
2. THE Site SHALL use Starlight Aside components of type "caution" (syntax `:::caution`) for steps requiring careful attention where incorrect execution may cause misconfiguration, dependency errors, or deployment failure
3. THE Site SHALL use Starlight Aside components of type "danger" (syntax `:::danger`) for actions that may cause cost overruns, data loss, or security exposure
4. THE Site SHALL use only the aside types "tip", "caution", and "danger"; all other Starlight aside types including "note" SHALL NOT appear in any documentation page
5. IF a documentation source file contains an aside type other than "tip", "caution", or "danger", THEN THE Quality_Gate SHALL fail with an error indicating the file and the disallowed aside type

### Requirement 24: Mermaid Diagram Standards

**User Story:** As a reader, I want topology diagrams rendered consistently, so that I can understand network relationships at a glance.

#### Acceptance Criteria

1. THE Site SHALL render all topology diagrams using Mermaid flowchart syntax within Starlight code blocks, with a consistent top-down (TD) graph direction across all diagrams
2. THE Site SHALL include a legend within each Mermaid diagram (using a subgraph or comment block) that identifies node types using consistent shape-to-type mapping, covering at minimum: VPC, endpoint, gateway, and attachment
3. WHERE the Upstream_Demo_Repo provides official AWS icon diagrams in `docs/diagrams/`, THE Site SHALL include those diagrams as static images on the same page as the corresponding Mermaid representation
4. THE Site SHALL use a consistent node shape convention across all Mermaid diagrams, where each node type defined in the legend uses the same Mermaid shape in every diagram it appears in

### Requirement 25: Upstream Pattern Path Linking

**User Story:** As a platform engineer, I want every apply instruction to link directly to the relevant upstream Terraform directory, so that I can navigate to the source code without searching.

#### Acceptance Criteria

1. WHEN a walkthrough page describes a Terraform apply step for a specific role (`shared-services` or `consumer`), THE Site SHALL include a hyperlink to the corresponding role directory in the Upstream_Demo_Repo using the URL format `https://github.com/jajera/aws-private-connectivity-patterns-demo/tree/<commit-or-tag>/terraform/patterns/<pattern-name>/<role>/`
2. THE Site SHALL construct upstream links using the commit or tag referenced in the Source_Version_Declaration, ensuring links point to the pinned version rather than the default branch head
3. THE Site SHALL include upstream directory links on each of the five Pattern walkthrough pages (privatelink, lattice, vpc-peering, tgw, cloudwan), with a separate link for each role directory referenced in that page's apply instructions

### Requirement 26: Content Domain Organization

**User Story:** As a reader, I want content organized into clear domains with consistent navigation, so that I can find information by its category.

#### Acceptance Criteria

1. THE Site SHALL organize content into four Content_Domains: Landing (index), Architecture, Walkthrough, and Reference
2. THE Site SHALL render a sidebar navigation with a labeled section header for each Content_Domain, using Starlight's sidebar group configuration in astro.config.mjs
3. THE Site SHALL order pages within each Content_Domain sidebar group as follows: Architecture (topology → comparison → diagrams → cloudwan), Walkthrough (prereqs → execution → patterns → verification → teardown → troubleshooting), Reference (FAQ → ADRs → glossary → links → sensitive data)
4. THE Site SHALL map each Content_Domain to a dedicated directory under src/content/docs/: Landing at the root index, Architecture in architecture/, Walkthrough in walkthrough/, and Reference in reference/

### Requirement 27: Build Quality and Accessibility

**User Story:** As a site maintainer, I want the build process to enforce quality standards, so that published content is always valid and accessible.

#### Acceptance Criteria

1. THE Site SHALL pass `npm run build` with zero errors and zero warnings emitted by the Astro compiler or Starlight integration as the Quality_Gate before deployment
2. THE Site SHALL produce valid HTML5 output with semantic heading hierarchy (no skipped heading levels, e.g., an h2 must not be followed by an h4 without an intervening h3)
3. THE Site SHALL include alt text of at least 20 characters for all static image diagrams, where the alt text identifies the diagram subject and its purpose in context
4. IF a hyperlink to the Upstream_Demo_Repo does not resolve to an HTTP 200 response at the pinned Source_Version_Declaration path, THEN THE Quality_Gate SHALL fail with an error message indicating the broken link URL and expected target
