const { IntermineAPI } = require('./intermine/intermine.api.js');

const dataSources = () => {
  return {
    lisIntermineAPI: new IntermineAPI('https://mines.legumeinfo.org/minimine/service'),
  };
};

module.exports = { dataSources };
