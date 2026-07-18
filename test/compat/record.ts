// record.ts — capture InterMine responses as golden files, so CI can regression-
// test SQLite against a frozen InterMine snapshot WITHOUT a live InterMine.
//   INTERMINE_URI=… bun run test/compat/record.ts
// Writes test/compat/golden/<case>.json (canonicalization is applied at compare
// time, not here — goldens store the raw ApiResponse).
import {mkdirSync, writeFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {dirname, join} from 'node:path';
import {makeIntermine, call} from './backends.js';
import {cases} from './cases.js';

const HERE = dirname(fileURLToPath(import.meta.url));
const GOLDEN = join(HERE, 'golden');

const intermine = makeIntermine();
if (!intermine) {
  console.error('INTERMINE_URI not set — nothing to record.');
  process.exit(1);
}
mkdirSync(GOLDEN, {recursive: true});

let hollow = 0;

for (const c of cases) {
  try {
    const resp = (await call(intermine, c.method, c.args)) as {
      data?: unknown[];
    };
    writeFileSync(
      join(GOLDEN, `${c.name.replace(/\//g, '__')}.json`),
      JSON.stringify(resp, null, 2),
    );
    // Freezing an empty golden for a case that means to match rows bakes a
    // vacuous pass into CI: SQLite would only have to agree on nothing. Record
    // it (so the file is inspectable) but make the problem loud. `skip` cases are
    // exempt — they're recorded for reference but never asserted on.
    if (!c.allowEmpty && !c.skip && !resp.data?.length) {
      hollow++;
      console.warn(
        `  ^ HOLLOW: ${c.name} recorded 0 rows — that golden proves nothing.`,
      );
    }
    console.log(`recorded ${c.name}`);
  } catch (e) {
    console.error(`FAILED ${c.name}:`, (e as Error).message);
  }
}
if (hollow) {
  console.error(
    `\n${hollow} golden(s) recorded with 0 rows. Retarget those cases (see ` +
      `test:compat:triage) or set allowEmpty if the emptiness is the assertion.`,
  );
  process.exit(1);
}
console.log('done.');
