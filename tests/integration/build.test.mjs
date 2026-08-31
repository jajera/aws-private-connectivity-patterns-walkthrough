import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

const EXPECTED_PAGES = [
  'src/content/docs/index.mdx',
  'src/content/docs/architecture/topology.mdx',
  'src/content/docs/architecture/comparison.mdx',
  'src/content/docs/walkthrough/overview.mdx',
  'src/content/docs/walkthrough/tools-and-accounts.mdx',
  'src/content/docs/walkthrough/preflight.mdx',
  'src/content/docs/walkthrough/execution-model.mdx',
  'src/content/docs/walkthrough/privatelink.mdx',
  'src/content/docs/walkthrough/lattice.mdx',
  'src/content/docs/walkthrough/vpc-peering.mdx',
  'src/content/docs/walkthrough/tgw.mdx',
  'src/content/docs/walkthrough/cloudwan.mdx',
  'src/content/docs/walkthrough/verification.mdx',
  'src/content/docs/walkthrough/teardown.mdx',
  'src/content/docs/walkthrough/troubleshooting.mdx',
  'src/content/docs/reference/faq.mdx',
  'src/content/docs/reference/adrs.mdx',
  'src/content/docs/reference/links.mdx',
  'src/content/docs/reference/sensitive-data.mdx',
];

describe('Integration: build and structure', () => {
  it('all content pages exist', () => {
    expect(EXPECTED_PAGES).toHaveLength(19);
    for (const p of EXPECTED_PAGES) {
      expect(fs.existsSync(path.join(ROOT, p)), p).toBe(true);
    }
  });

  it('base path is configured correctly', () => {
    const cfg = fs.readFileSync(path.join(ROOT, 'astro.config.mjs'), 'utf8');
    expect(cfg).toContain('base: "/"');
  });

  it('sidebar follows progressive walkthrough sections', () => {
    const cfg = fs.readFileSync(path.join(ROOT, 'astro.config.mjs'), 'utf8');
    expect(cfg).toMatch(/label:\s*["']Home["']/);
    const intro = cfg.search(/label:\s*["']Introduction["']/);
    const prereq = cfg.search(/label:\s*["']Prerequisites["']/);
    const arch = cfg.search(/label:\s*["']Architecture["']/);
    const deploy = cfg.search(/label:\s*["']Deploy["']/);
    const verify = cfg.search(/label:\s*["']Verification["']/);
    const trouble = cfg.search(/label:\s*["']Troubleshooting["']/);
    const ref = cfg.search(/label:\s*["']Reference["']/);
    expect(intro).toBeGreaterThan(-1);
    expect(prereq).toBeGreaterThan(intro);
    expect(arch).toBeGreaterThan(prereq);
    expect(deploy).toBeGreaterThan(arch);
    expect(verify).toBeGreaterThan(deploy);
    expect(trouble).toBeGreaterThan(verify);
    expect(ref).toBeGreaterThan(trouble);
    expect(cfg).not.toContain('diagram-vpc-peering');
    expect(cfg).toContain('patina-tokens.css');
    expect(cfg).toContain('ThemeSelect');
    expect(cfg).not.toContain('starlight-base-path');
    expect(cfg).not.toContain("slug: 'reference/glossary'");
  });

  it('npm run build exits 0', () => {
    execSync('npm run build', { cwd: ROOT, stdio: 'pipe', env: { ...process.env } });
  }, 180_000);

  it('built pages use root-relative diagram paths', () => {
    const html = fs.readFileSync(
      path.join(ROOT, 'dist/walkthrough/privatelink/index.html'),
      'utf8',
    );
    expect(html).toContain('src="/diagrams/privatelink.svg"');
    expect(html).not.toContain('/aws-private-connectivity-patterns-walkthrough/diagrams/');
  });

  it('Cloud WAN tip frames us-east-1 as global resource requirement', () => {
    const page = fs.readFileSync(
      path.join(ROOT, 'src/content/docs/walkthrough/cloudwan.mdx'),
      'utf8',
    );
    expect(page).toMatch(/:::tip/);
    expect(page.toLowerCase()).toMatch(/global resource/);
    expect(page).toMatch(/us-east-1/);
    expect(page).toMatch(/\/diagrams\/cloudwan\.svg/);
  });
});
