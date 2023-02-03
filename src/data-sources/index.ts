import { IntermineAPI } from './intermine/intermine.api.js';


export type DataSources = {
  lisIntermineAPI: IntermineAPI;
};


export const dataSources = (): DataSources => {
  return {
    lisIntermineAPI: new IntermineAPI('https://mines.legumeinfo.org/minimine/service'),
  };
};
