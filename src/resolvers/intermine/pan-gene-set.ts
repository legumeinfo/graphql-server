import { DataSources, IntermineAPI, MicroservicesAPI } from '../../data-sources/index.js';
import { inputError, KeyOfType } from '../../utils/index.js';
import { ResolverMap, SubfieldResolverMap } from '../resolver.js';
import { annotatableFactory } from './annotatable.js';
import { hasGenesFactory } from './gene.js';
import { hasProteinsFactory } from './protein.js';
import { hasTranscriptsFactory } from './transcript.js';


export const panGeneSetFactory = 
    (
        sourceName: KeyOfType<DataSources, IntermineAPI>,
        microservicesSource: KeyOfType<DataSources, MicroservicesAPI>,
    ): ResolverMap => ({
    Query: {
        panGeneSet: async (_, { identifier }, { dataSources }) => {
            const {data: panGeneSet} = await dataSources[sourceName].getPanGeneSet(identifier);
            if (panGeneSet == null) {
                const msg = `PanGeneSet with primaryIdentifier '${identifier}' not found`;
                inputError(msg);
            }
            return {results: panGeneSet};
        },
    },
    PanGeneSet: {
        ...annotatableFactory(sourceName),
        ...hasGenesFactory(sourceName),
        ...hasProteinsFactory(sourceName),
        ...hasTranscriptsFactory(sourceName),
        linkouts: async (panGeneSet, _, { dataSources }) => {
            const {identifier} = panGeneSet;
            return dataSources[microservicesSource].getLinkoutsForPanGeneSet(identifier);
        },
    },
});


export const hasPanGeneSetsFactory = (sourceName: KeyOfType<DataSources, IntermineAPI>):
SubfieldResolverMap => ({
    panGeneSets: async (parent, { page, pageSize }, { dataSources }, info) => {
        let request: Promise<any>|null = null;

        const args = {page, pageSize};

        const interfaces = info.parentType.getInterfaces().map(({name}) => name);
        if (interfaces.includes('Transcript')) {
            const {id} = parent;
            request = dataSources[sourceName].getPanGeneSetsForTranscript(id, args);
        }

        const typeName = info.parentType.name;
        switch (typeName) {
            case 'Gene':
            // @ts-ignore: fallthrough case error
            case 'Protein':
                const {id} = parent;
            case 'Gene':
                request = dataSources[sourceName].getPanGeneSetsForGene(id, args);
                break;
            case 'Protein':
                request = dataSources[sourceName].getPanGeneSetsForProtein(id, args);
                break;
        }

        if (request == null) {
            return null;
        }

        // @ts-ignore: implicit type any error
        return request.then(({data: results}) => results);
    },
});
