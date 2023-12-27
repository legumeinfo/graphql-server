import type { KeyValueCache } from '@apollo/utils.keyvaluecache';

import { IntermineAPI } from './intermine/index.js';
import { MicroservicesAPI } from './microservices/index.js';


export { IntermineAPI } from './intermine/index.js';
export { MicroservicesAPI } from './microservices/index.js';


export type DataSources = {
  lisIntermineAPI: IntermineAPI;
  lisMicroservicesAPI: MicroservicesAPI;
};


export const dataSources =
async (intermineURI: string, microservicesURI: string, cache: KeyValueCache):
Promise<DataSources> => {
  const config = {cache};
  const lisIntermineAPI = new IntermineAPI(intermineURI, config);
  // TODO: this crashes the server rather than throwing a GraphQL error
  //lisIntermineAPI.verifyIntermineVersion();
  return {
    lisIntermineAPI,
    lisMicroservicesAPI: new MicroservicesAPI(microservicesURI, config),
  };
};
