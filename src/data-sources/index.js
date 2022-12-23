const { IntermineAPI } = require('./intermine/intermine.api.js');

const dataSources = () => {
  return {
    lisIntermineAPI: new IntermineAPI('https://dev.lis.ncgr.org/minimine/service'),
  };
};

module.exports = { dataSources };
