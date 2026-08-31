# Agent notes

## Repos

| Repo | Role |
|------|------|
| `jajera/aws-private-connectivity-patterns-walkthrough` | This docs site (GitHub Pages) |
| `jajera/aws-private-connectivity-patterns-demo` | Source demo this walkthrough documents |

Do not invent AWS account IDs, endpoint service names, or custom domains for the lab. Use placeholder values from the demo only.

## Docs source of truth

Walkthrough steps live in `src/content/docs/**/*.mdx`. Keep sidebar slugs in `astro.config.mjs` aligned with those files.

## Site URL

Production docs: `https://aws-private-connectivity-patterns-walkthrough.johna.kiwi` (Pages + Route 53 CNAME via johna-kiwi-infra `sites.yaml`).
