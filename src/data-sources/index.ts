import type { KeyValueCache } from '@apollo/utils.keyvaluecache';

import { IntermineAPI } from './intermine/index.js';


export type DataSources = {
  lisIntermineAPI: IntermineAPI;
};


export const dataSources = (cache: KeyValueCache): DataSources => {
  const config = {cache};
  return {
    lisIntermineAPI: new IntermineAPI('https://mines.legumeinfo.org/minimine/service', config),
  };
};
