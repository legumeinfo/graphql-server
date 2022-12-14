const { IntermineAPI } = require('./intermine/intermine.api.js');


const dataSources = () => {
  return {
    lisMiniMineAPI: new IntermineAPI('https://lis.ncgr.org/minimine/service'),
  };
};


module.exports = { dataSources };
