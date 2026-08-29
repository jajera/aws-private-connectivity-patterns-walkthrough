import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightThemeVintage from 'starlight-theme-vintage';
import { starlightBasePath } from 'starlight-base-path';
import starlightImageZoom from 'starlight-image-zoom';
import mermaid from 'astro-mermaid';

export default defineConfig({
  site: "https://aws-private-connectivity-patterns-walkthrough.johna.kiwi",
  base: "/",
  integrations: [
    mermaid(),
    starlight({
      title: 'AWS Private Connectivity Patterns Walkthrough',
      favicon: '/favicon.svg',
      description:
        'Walkthrough companion for deploying and comparing five AWS private cross-account connectivity patterns.',
      head: [
        {
          tag: 'meta',
          attrs: {
            property: 'og:image',
            content:
              'https://jajera.github.io/aws-private-connectivity-patterns-walkthrough/og-image.png',
          },
        },
        {
          tag: 'meta',
          attrs: {
            name: 'twitter:image',
            content:
              'https://jajera.github.io/aws-private-connectivity-patterns-walkthrough/og-image.png',
          },
        },
      ],
      plugins: [starlightThemeVintage(), starlightBasePath(), starlightImageZoom()],
      social: [
        {
          icon: 'github',
          label: 'Source Repository',
          href: 'https://github.com/jajera/aws-private-connectivity-patterns-walkthrough',
        },
      ],
      editLink: {
        baseUrl:
          'https://github.com/jajera/aws-private-connectivity-patterns-walkthrough/edit/main/',
      },
      sidebar: [
        { label: 'Home', link: '/' },
        {
          label: 'Introduction',
          items: [
            { label: 'Overview', slug: 'walkthrough/overview' },
            { label: 'Pattern Comparison', slug: 'architecture/comparison' },
          ],
        },
        {
          label: 'Prerequisites',
          items: [
            { label: 'Tools and Accounts', slug: 'walkthrough/tools-and-accounts' },
            { label: 'Pre-flight', slug: 'walkthrough/preflight' },
          ],
        },
        {
          label: 'Architecture',
          items: [
            { label: 'Account Topology', slug: 'architecture/topology' },
          ],
        },
        {
          label: 'Deploy',
          items: [
            { label: 'Execution Model', slug: 'walkthrough/execution-model' },
            { label: 'PrivateLink', slug: 'walkthrough/privatelink' },
            { label: 'Lattice', slug: 'walkthrough/lattice' },
            { label: 'VPC Peering', slug: 'walkthrough/vpc-peering' },
            { label: 'Transit Gateway', slug: 'walkthrough/tgw' },
            { label: 'Cloud WAN', slug: 'walkthrough/cloudwan' },
          ],
        },
        {
          label: 'Verification',
          items: [
            { label: 'Connectivity Checks', slug: 'walkthrough/verification' },
          ],
        },
        {
          label: 'Troubleshooting',
          items: [
            { label: 'Common Issues', slug: 'walkthrough/troubleshooting' },
          ],
        },
        {
          label: 'Reference',
          items: [
            { label: 'FAQ', slug: 'reference/faq' },
            { label: 'Decision Log & ADRs', slug: 'reference/adrs' },
            { label: 'AWS Documentation Links', slug: 'reference/links' },
            { label: 'Sensitive Data', slug: 'reference/sensitive-data' },
            { label: 'Teardown', slug: 'walkthrough/teardown' },
          ],
        },
      ],
    }),
  ],
});
