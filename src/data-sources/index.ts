import type {KeyValueCache} from '@apollo/utils.keyvaluecache';

import {IntermineAPI} from './intermine/index.js';
import {MicroservicesAPI} from './microservices/index.js';
// Type-only: a value import (or value re-export) here would pull in bun:sqlite at
// module load, defeating the dynamic import in getSqliteAPI below.
import type {SqliteAPI} from './sqlite/index.js';

export {IntermineAPI} from './intermine/index.js';
export {MicroservicesAPI} from './microservices/index.js';
export type {SqliteAPI} from './sqlite/index.js';

export type DataSources = {
  lisIntermineAPI: IntermineAPI;
  lisMicroservicesAPI: MicroservicesAPI;
  // Optional: present only when SQLITE_DB_PATH is set. Point resolvers here to
  // serve (ported) queries from a local SQLite mirror instead of InterMine.
  lisSqliteAPI?: SqliteAPI;
};

// Unlike the InterMine/microservices sources, SqliteAPI is shared by every request
// instead of rebuilt per request. It is stateless, and the mirror it reads is
// opened immutable, so there is nothing per-request about it. Rebuilding it cost
// ~0.7ms of pure overhead (re-parsing the ~429KB model.json, rebuilding the class
// keys and QueryBuilder) against ~0.02ms for a query on a warm connection, and it
// discarded bun:sqlite's prepared-statement cache, which is per-connection.
//
// Keyed by path so a different SQLITE_DB_PATH still gets its own instance. The
// *promise* is cached, not the resolved value, so concurrent first requests share
// one construction rather than racing to build several.
const sqliteAPIs = new Map<string, Promise<SqliteAPI>>();

function getSqliteAPI(dbPath: string): Promise<SqliteAPI> {
  let api = sqliteAPIs.get(dbPath);
  if (!api) {
    // Imported here, not statically, so bun:sqlite is only loaded when a DB path
    // is configured and Node-only tooling is unaffected.
    api = import('./sqlite/index.js')
      .then(({SqliteAPI}) => new SqliteAPI(dbPath))
      .catch((e) => {
        // Don't cache the failure: an operator who fixes the cause (e.g.
        // checkpoints a -wal sidecar) shouldn't have to restart the server.
        sqliteAPIs.delete(dbPath);
        throw e;
      });
    sqliteAPIs.set(dbPath, api);
  }
  return api;
}

export const dataSources = async (
  intermineURI: string,
  microservicesURI: string,
  cache: KeyValueCache,
): Promise<DataSources> => {
  const config = {cache};
  const lisIntermineAPI = new IntermineAPI(intermineURI, config);
  // TODO: this crashes the server rather than throwing a GraphQL error
  //lisIntermineAPI.verifyIntermineVersion();
  const sources: DataSources = {
    lisIntermineAPI,
    lisMicroservicesAPI: new MicroservicesAPI(microservicesURI, config),
  };
  const sqlitePath = process.env.SQLITE_DB_PATH;
  if (sqlitePath) {
    sources.lisSqliteAPI = await getSqliteAPI(sqlitePath);
  }
  return sources;
};
