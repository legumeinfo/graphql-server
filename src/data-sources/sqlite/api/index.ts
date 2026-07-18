// api/index.ts — mixes the ported API functions onto SqliteServer, mirroring the
// intermine ApiMixin pattern. Add ported functions here as you migrate them.
import {SqliteServer} from '../sqlite.server.js';
import {searchGenes} from './search-genes.js';
import {searchGeneFunctions} from './search-gene-functions.js';

type Ctor<T = object> = new (...args: any[]) => T;

export function ApiMixin<T extends Ctor<SqliteServer>>(Base: T) {
  class ApiMixinClass extends Base {
    searchGenes = searchGenes;
    searchGeneFunctions = searchGeneFunctions;
    // ...port the remaining intermine api/*.ts functions here, one at a time.
  }
  return ApiMixinClass;
}
