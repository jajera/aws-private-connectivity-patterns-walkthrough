# Editor Tooling — Content Authoring Conventions

Conventions for MDX content in this walkthrough site. Mirror these when adding or editing pages under `src/content/docs/`.

## Placeholder IDs

Use only approved Placeholder_IDs in fenced code blocks, command examples, and output samples:

| Kind | Allowed values |
|------|----------------|
| Account IDs | `123456789012` (shared-services), `987654321098` (dev) |
| ARNs | Must use an allowed account ID and suffix resource names with `EXAMPLE` |
| DNS | Hostnames must include `EXAMPLE` (e.g. `vpce-EXAMPLE.vpce-svc-EXAMPLE.ap-southeast-2.vpce.amazonaws.com`) |

The quality gate (`scripts/check-placeholders.mjs`) rejects other 12-digit IDs and non-placeholder AWS DNS inside fenced code blocks. Prose outside code blocks is not scanned for account IDs.

## Aside types

Allowed Starlight asides only:

- `:::tip` — suggestions and recommended practices
- `:::caution` — careful steps / misconfiguration risk
- `:::danger` — cost, data loss, or security exposure

Do not use `:::note`, `:::warning`, or `:::info`. Enforced by `scripts/check-asides.mjs`.

## Mermaid diagrams

- Use `graph TD` (top-down) for all topology diagrams
- Include a legend subgraph with consistent shapes:
  - VPC: rectangle `[VPC]`
  - Endpoint: stadium `([Endpoint])`
  - Gateway: hexagon `{{Gateway}}`
  - Attachment: cylinder `[(Attachment)]`
  - Account: stadium `([Account])`

## Upstream links

Pin every upstream link to the Source_Version_Declaration on the landing page.

Format:

```text
https://github.com/jajera/aws-private-connectivity-patterns-demo/tree/<pinned-ref>/terraform/patterns/<dir>/<role>/
```

Pattern directory mapping:

| Site slug | Upstream dir |
|-----------|--------------|
| vpc-peering | `peering` |
| privatelink | `privatelink` |
| lattice | `lattice` |
| tgw | `tgw` |
| cloudwan | `cloudwan` |

## Cloud WAN / RAM framing

When documenting Cloud WAN RAM sharing in `us-east-1`, state that the **core network is a global resource** and AWS RAM requires global resource shares to be created and accepted in `us-east-1`. Do not imply workloads are deployed in `us-east-1`.
