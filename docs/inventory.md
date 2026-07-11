# Upstream Content Inventory

**Upstream repo:** `jajera/aws-private-connectivity-patterns-demo`  
**Source_Version_Declaration:** `f3e874db419dad810a8ce4d693179a4932c15d4b`  
**Pinned tree URL:** https://github.com/jajera/aws-private-connectivity-patterns-demo/tree/f3e874db419dad810a8ce4d693179a4932c15d4b

> Note: The walkthrough site pattern slug is `vpc-peering`, but the upstream Terraform directory is `peering`. All upstream links use the real path `terraform/patterns/peering/`.

## File Mapping

| Upstream Source | Target Domain | Target Path | Requirements |
|-----------------|---------------|-------------|--------------|
| `README.md` | Landing | `src/content/docs/index.mdx` | 1.1–1.5 |
| `docs/architecture.md` | Architecture | `src/content/docs/architecture/topology.mdx` | 2.1–2.4 |
| `docs/architecture.md` | Architecture | `src/content/docs/architecture/comparison.mdx` | 3.1–3.3 |
| `docs/architecture.md` (ADRs) | Reference | `src/content/docs/reference/adrs.mdx` | 17.1–17.4 |
| `docs/walkthrough.md` | Walkthrough | `src/content/docs/walkthrough/*.mdx` | 6–15 |
| `docs/diagrams/*.svg` | Architecture (static) | `public/diagrams/` | 4.3, 4.4, AD-10 |
| `docs/local.env.example` | Reference | `src/content/docs/reference/sensitive-data.mdx` | 20.1–20.4 |

## Upstream Diagrams Present

| Pattern (site slug) | Upstream file | Copied to | Usage |
|---------------------|---------------|-----------|-------|
| vpc-peering | `docs/diagrams/peering.svg` | `public/diagrams/peering.svg` | Embedded on Deploy → VPC Peering |
| privatelink | `docs/diagrams/privatelink.svg` | `public/diagrams/privatelink.svg` | Embedded on Deploy → PrivateLink |
| lattice | `docs/diagrams/lattice.svg` | `public/diagrams/lattice.svg` | Embedded on Deploy → Lattice |
| tgw | `docs/diagrams/tgw.svg` | `public/diagrams/tgw.svg` | Embedded on Deploy → Transit Gateway |
| cloudwan | `docs/diagrams/cloudwan.svg` | `public/diagrams/cloudwan.svg` | Embedded on Deploy → Cloud WAN |

Dedicated diagram sidebar pages are not used; diagrams appear inline on each Deploy pattern page.

## Upstream Terraform Paths (pinned)

| Pattern | Shared-services | Consumer |
|---------|-----------------|----------|
| vpc-peering | `terraform/patterns/peering/shared-services/` | `terraform/patterns/peering/consumer/` |
| privatelink | `terraform/patterns/privatelink/shared-services/` | `terraform/patterns/privatelink/consumer/` |
| lattice | `terraform/patterns/lattice/shared-services/` | `terraform/patterns/lattice/consumer/` |
| tgw | `terraform/patterns/tgw/shared-services/` | `terraform/patterns/tgw/consumer/` |
| cloudwan | `terraform/patterns/cloudwan/shared-services/` | `terraform/patterns/cloudwan/consumer/` |

Link format:

```text
https://github.com/jajera/aws-private-connectivity-patterns-demo/tree/f3e874db419dad810a8ce4d693179a4932c15d4b/terraform/patterns/<dir>/<role>/
```
