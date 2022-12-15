const { IntermineAPI } = require('./intermine/intermine.api.js');


const dataSources = () => {
  return {
    lisIntermineAPI: new IntermineAPI('https://lis.ncgr.org/minimine/service'),
  };
};


module.exports = { dataSources };
