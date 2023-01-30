const { IntermineAPI } = require('./intermine/intermine.api.js');

const dataSources = () => {
    return {
        // use MiniMine for development, it has genomic and genetic data
        // lisMiniMineAPI: new IntermineAPI('https://mines.legumeinfo.org/minimine/service'),

        // genus mines with only genomic data
        // lisAeschynomeneMineAPI: new IntermineAPI('https://mines.legumeinfo.org/aeschynomenemine/service'),
        // lisCajanusMineAPI: new IntermineAPI('https://mines.legumeinfo.org/cajanusmine/service'),
        // lisCicerMineAPI: new IntermineAPI('https://mines.legumeinfo.org/cicermine/service'),
        // lisLensMineAPI: new IntermineAPI('https://mines.legumeinfo.org/lensmine/service'),
        // lisLupinusMineAPI: new IntermineAPI('https://mines.legumeinfo.org/lupinusmine/service'),
        // lisMedicagoMineAPI: new IntermineAPI('https://mines.legumeinfo.org/medicagomine/service'),

        // genus mines with genetic data as well
        lisArachisMineAPI: new IntermineAPI('https://mines.legumeinfo.org/arachismine/service'),
        // lisGlycineMineAPI: new IntermineAPI('https://mines.legumeinfo.org/glycinemine/service'),
        lisPhaseolusMineAPI: new IntermineAPI('https://mines.legumeinfo.org/phaseolusmine/service'),
        // lisVignaMineAPI: new IntermineAPI('https://mines.legumeinfo.org/vignamine/service'),

        // use LegumeMine for across-the-board genomic queries
        lisLegumeMineAPI: new IntermineAPI('https://mines.legumeinfo.org/legumemine/service'),
    };
};

module.exports = { dataSources };

