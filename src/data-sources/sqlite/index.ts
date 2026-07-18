import {ApiMixin} from './api/index.js';
import {SqliteServer} from './sqlite.server.js';

// SQLite-backed data source. Exposes the same method surface (as ported) as
// IntermineAPI, so resolvers can target it via their `sourceName` argument.
export class SqliteAPI extends ApiMixin(SqliteServer) {}
