// backends.ts — construct each backend from env. Either may be absent; tests
// skip gracefully when a required backend/golden isn't configured.
//   INTERMINE_URI   e.g. https://mines.dev.lis.ncgr.org/glycinemine/service
//   SQLITE_DB_PATH  e.g. ./glycinemine.sqlite
import {InMemoryLRUCache} from '@apollo/utils.keyvaluecache';
import {IntermineAPI} from '../../src/data-sources/intermine/index.js';
import {SqliteAPI} from '../../src/data-sources/sqlite/index.js';

export type Backend = IntermineAPI | SqliteAPI;

export function makeIntermine(): IntermineAPI | null {
  const uri = process.env.INTERMINE_URI;
  if (!uri) return null;
  return new IntermineAPI(uri, {cache: new InMemoryLRUCache()});
}

export function makeSqlite(): SqliteAPI | null {
  const path = process.env.SQLITE_DB_PATH;
  if (!path) return null;
  return new SqliteAPI(path);
}

// Call a method by name on a backend (both expose the same ported surface). Args
// are POSITIONAL (an array), matching the real signatures — getGene(id),
// getAuthor(first, last), searchGenes({...}) — so a case's args line up 1-to-1.
export async function call(backend: Backend, method: string, args: unknown[]) {
  const fn = (
    backend as unknown as Record<string, (...a: unknown[]) => Promise<unknown>>
  )[method];
  if (typeof fn !== 'function')
    throw new Error(`backend has no method "${method}"`);
  return fn.apply(backend, args);
}
