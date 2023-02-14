import type { KeyValueCache } from '@apollo/utils.keyvaluecache';

import { DataSources, dataSources } from './data-sources/index.js';


export interface ContextValue {
  dataSources: DataSources;
}


export const contextFactory = (cache: KeyValueCache) => {
  return async () => {
    return {
      // We create new instances of our data sources with each request.
      // We can pass in our server's cache, contextValue, or any other
      // info our data sources require.
      dataSources: dataSources(cache),
    };
  };
};
