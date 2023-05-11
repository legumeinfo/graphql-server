import type { KeyValueCache } from '@apollo/utils.keyvaluecache';

import { IntermineAPI } from './intermine/index.js';
import { MicroservicesAPI } from './microservices/index.js';


export { IntermineAPI } from './intermine/index.js';
export { MicroservicesAPI } from './microservices/index.js';


export type DataSources = {
  lisIntermineAPI: IntermineAPI;
  lisMicroservicesAPI: MicroservicesAPI;
};


export const dataSources = (cache: KeyValueCache): DataSources => {
  const config = {cache};
  return {
    lisIntermineAPI: new IntermineAPI('https://mines.legumeinfo.org/minimine/service', config),
    lisMicroservicesAPI: new MicroservicesAPI('https://linkouts.services.legumeinfo.org', config),
  };
};
