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
(intermineURI: string, microservicesURI: string, cache: KeyValueCache): DataSources => {
  const config = {cache};
  return {
    lisIntermineAPI: new IntermineAPI(intermineURI, config),
    lisMicroservicesAPI: new MicroservicesAPI(microservicesURI, config),
  };
};
