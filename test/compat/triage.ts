// triage.ts — run every case against the reference (InterMine) backend alone and
// report how many rows it returns. This is the tool for answering "are my cases
// actually testing anything?" after pointing the suite at a different mine.
//
//   INTERMINE_URI=… bun run test/compat/triage.ts
//
// A case whose reference is empty passes the compat suite for the wrong reason:
// both backends agree on nothing. compat.test.ts fails those at test time; this
// script finds them without waiting on a SQLite mirror, and exits non-zero if any
// case (other than an `allowEmpty`/`skip` row) comes back hollow.
import {makeIntermine, call} from './backends.js';
import {cases} from './cases.js';

const intermine = makeIntermine();
if (!intermine) {
  console.error('INTERMINE_URI not set — nothing to triage.');
  process.exit(1);
}

let hollow = 0;
let failed = 0;

for (const c of cases) {
  if (c.skip) {
    console.log(`skip  ${c.name.padEnd(30)} ${c.skip}`);
    continue;
  }
  try {
    const resp = (await call(intermine, c.method, c.args)) as {
      data?: unknown[];
      metadata?: {pageInfo?: {numResults?: number}};
    };
    const rows = resp.data?.length ?? 0;
    const total = resp.metadata?.pageInfo?.numResults ?? 0;
    const stats = `rows=${String(rows).padStart(3)} total=${String(total).padStart(7)}`;
    if (rows === 0 && !c.allowEmpty) {
      hollow++;
      console.log(
        `HOLLOW ${c.name.padEnd(30)} ${stats}  <-- proves nothing; retarget or set allowEmpty`,
      );
    } else if (rows === 0) {
      console.log(
        `empty ${c.name.padEnd(30)} ${stats}  (allowEmpty: asserting no match)`,
      );
    } else {
      console.log(`ok    ${c.name.padEnd(30)} ${stats}`);
    }
  } catch (e) {
    failed++;
    console.log(
      `ERROR ${c.name.padEnd(30)} ${(e as Error).message.slice(0, 140)}`,
    );
  }
}

console.log(`\n${cases.length} cases: ${hollow} hollow, ${failed} errored.`);
if (hollow || failed) process.exit(1);
