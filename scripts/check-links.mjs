#!/usr/bin/env node
/**
 * Upstream / AWS docs link checker.
 * Requirements: 1.5, 19.4, 25.2, 27.4
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const UPSTREAM = 'jajera/aws-private-connectivity-patterns-demo';

export function extractPinnedRef(landing) {
  const decl = landing.match(
    /Source_Version_Declaration[\s\S]{0,800}?`([0-9a-f]{7,40}|main|[\w.-]+)`/i,
  );
  if (decl) return decl[1];
  const code = landing.match(/`([0-9a-f]{40})`/);
  if (code) return code[1];
  const short = landing.match(/`([0-9a-f]{7,40})`/);
  if (short) return short[1];
  return 'main';
}

export function buildUpstreamPatternLink(ref, patternDir, role) {
  return `https://github.com/${UPSTREAM}/tree/${ref}/terraform/patterns/${patternDir}/${role}/`;
}

export function extractUrls(content) {
  const urls = new Set();
  const md = /\[([^\]]*)\]\((https?:\/\/[^)\s]+)\)/g;
  let m;
  while ((m = md.exec(content)) !== null) urls.add(m[2]);
  const bare = /https?:\/\/[^\s)`"'<>]+/g;
  while ((m = bare.exec(content)) !== null) {
    urls.add(m[0].replace(/[.,;:]+$/, ''));
  }
  return [...urls];
}

export function findWrongUpstreamRefs(content, pinnedRef, fileLabel = 'input') {
  const errors = [];
  for (const url of extractUrls(content)) {
    if (!url.includes(`github.com/${UPSTREAM}/`)) continue;
    const treeMatch = url.match(
      new RegExp(`github\\.com/${UPSTREAM}/(?:tree|blob)/([^/]+)/`),
    );
    if (treeMatch && treeMatch[1] !== pinnedRef) {
      errors.push(
        `Wrong upstream ref in ${fileLabel}: expected ${pinnedRef}, found ${treeMatch[1]} in ${url}`,
      );
    }
  }
  return errors;
}

async function headOk(url) {
  try {
    const res = await fetch(url, { method: 'HEAD', redirect: 'follow' });
    if (res.ok) return { ok: true, status: res.status };
    const get = await fetch(url, { method: 'GET', redirect: 'follow' });
    return { ok: get.ok, status: get.status };
  } catch (err) {
    return { ok: false, status: 0, error: String(err.message || err) };
  }
}

async function main() {
  const ROOT = path.resolve(import.meta.dirname, '..');
  const DOCS = path.join(ROOT, 'src/content/docs');
  const SKIP_NETWORK = process.env.SKIP_LINK_CHECK === '1';

  const landing = fs.readFileSync(path.join(DOCS, 'index.mdx'), 'utf8');
  const overviewPath = path.join(DOCS, 'walkthrough/overview.mdx');
  const overview = fs.existsSync(overviewPath)
    ? fs.readFileSync(overviewPath, 'utf8')
    : '';
  const pinnedRef = extractPinnedRef(overview) || extractPinnedRef(landing) || 'main';
  if (!pinnedRef) {
    console.error('Invalid upstream ref: could not determine expected branch or commit');
    process.exit(1);
  }

  const errors = [];
  const allUrls = new Set();

  function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (/\.mdx?$/.test(entry.name)) {
        const content = fs.readFileSync(full, 'utf8');
        const rel = path.relative(ROOT, full);
        for (const url of extractUrls(content)) allUrls.add(url);
        errors.push(...findWrongUpstreamRefs(content, pinnedRef, rel));
      }
    }
  }
  walk(DOCS);

  if (!SKIP_NETWORK) {
    const toCheck = [...allUrls].filter(
      (u) => u.includes(`github.com/${UPSTREAM}/`) || u.includes('docs.aws.amazon.com'),
    );
    for (const url of toCheck) {
      const result = await headOk(url);
      if (!result.ok) {
        errors.push(
          `Broken link: ${url} (HTTP ${result.status}${result.error ? `, ${result.error}` : ''})`,
        );
      }
    }
  } else {
    console.log('check-links: SKIP_NETWORK=1 — skipping HTTP checks');
  }

  if (errors.length) {
    for (const e of errors) console.error(e);
    process.exit(1);
  }
  console.log(`check-links: OK (pinned ref ${pinnedRef})`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await main();
}
