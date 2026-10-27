// Fails if app/lib/destination-slugs.ts and the DESTINATIONS keys in api/plan.js drift apart.
import { readFileSync } from 'node:fs';

const plan = readFileSync(new URL('../api/plan.js', import.meta.url), 'utf8');
const body = plan.slice(plan.indexOf('const DESTINATIONS = {'), plan.indexOf('function buildPage'));
const keys = [...body.matchAll(/^  ([a-z0-9-]+): \{$/gm)].map((m) => m[1]);
const list = readFileSync(new URL('../app/lib/destination-slugs.ts', import.meta.url), 'utf8');
const slugs = [...list.matchAll(/'([a-z0-9-]+)'/g)].map((m) => m[1]);
const missing = keys.filter((k) => !slugs.includes(k));
const extra = slugs.filter((k) => !keys.includes(k));
if (missing.length || extra.length) {
  console.error('Mismatch. Missing from list:', missing, 'Not in plan.js:', extra);
  process.exit(1);
}
console.log(`OK: ${keys.length} destination slugs match`);
