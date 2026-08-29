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
    expect(cfg).toContain("label: 'Home'");
    const intro = cfg.indexOf("label: 'Introduction'");
    const prereq = cfg.indexOf("label: 'Prerequisites'");
    const arch = cfg.indexOf("label: 'Architecture'");
    const deploy = cfg.indexOf("label: 'Deploy'");
    const verify = cfg.indexOf("label: 'Verification'");
    const trouble = cfg.indexOf("label: 'Troubleshooting'");
    const ref = cfg.indexOf("label: 'Reference'");
    expect(intro).toBeGreaterThan(-1);
    expect(prereq).toBeGreaterThan(intro);
    expect(arch).toBeGreaterThan(prereq);
    expect(deploy).toBeGreaterThan(arch);
    expect(verify).toBeGreaterThan(deploy);
    expect(trouble).toBeGreaterThan(verify);
    expect(ref).toBeGreaterThan(trouble);
    expect(cfg).not.toContain('diagram-vpc-peering');
    expect(cfg).toContain('starlight-theme-vintage');
    expect(cfg).toContain('starlight-base-path');
    expect(cfg).not.toContain("slug: 'reference/glossary'");
  });

  it('npm run build exits 0', () => {
    execSync('npm run build', { cwd: ROOT, stdio: 'pipe', env: { ...process.env } });
  }, 180_000);

  it('Cloud WAN tip frames us-east-1 as global resource requirement', () => {
    const page = fs.readFileSync(
      path.join(ROOT, 'src/content/docs/walkthrough/cloudwan.mdx'),
      'utf8',
    );
    expect(page).toMatch(/:::tip/);
    expect(page.toLowerCase()).toMatch(/global resource/);
    expect(page).toMatch(/us-east-1/);
    expect(page).toMatch(/\/aws-private-connectivity-patterns-walkthrough\/diagrams\/cloudwan\.svg/);
  });
});
