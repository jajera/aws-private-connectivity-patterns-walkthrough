# aws-private-connectivity-patterns-walkthrough

Documentation companion site (Astro + Starlight) for deploying and comparing five AWS private cross-account connectivity patterns.

| What this is | What this is not |
|--------------|------------------|
| A static walkthrough and architecture reference site | Terraform / infrastructure-as-code |
| Operational guidance for the five connectivity patterns | A live AWS lab environment |
| Companion docs pinned to a specific upstream commit | The source of truth for Terraform modules |

**Upstream Terraform:** [jajera/aws-private-connectivity-patterns-demo](https://github.com/jajera/aws-private-connectivity-patterns-demo)

**Deployed site:** https://jajera.github.io/aws-private-connectivity-patterns-walkthrough/

## Quick start

```bash
npm install
npm run dev
npm run build
```

## Patterns covered

- VPC Peering
- PrivateLink
- VPC Lattice
- Transit Gateway
- Cloud WAN (multi-region + segment isolation; core network shared via RAM in `us-east-1` because it is a global resource)
