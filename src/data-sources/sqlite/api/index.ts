// api/index.ts — mixes the ported API functions onto SqliteServer, mirroring the
// intermine ApiMixin pattern. Add ported functions here as you migrate them.
import {SqliteServer} from '../sqlite.server.js';
import {searchGenes} from './search-genes.js';
import {searchGeneFunctions} from './search-gene-functions.js';
import {
  getOrganism,
  getStrain,
  getDataSource,
  getPublication,
  getChromosome,
  getAuthor,
} from './get-one.js';

type Ctor<T = object> = new (...args: any[]) => T;

export function ApiMixin<T extends Ctor<SqliteServer>>(Base: T) {
  class ApiMixinClass extends Base {
    searchGenes = searchGenes;
    searchGeneFunctions = searchGeneFunctions;

    // get-one
    getOrganism = getOrganism;
    getStrain = getStrain;
    getDataSource = getDataSource;
    getPublication = getPublication;
    getChromosome = getChromosome;
    getAuthor = getAuthor;
    // ...port the remaining intermine api/*.ts functions here, one at a time.
  }
  return ApiMixinClass;
}
