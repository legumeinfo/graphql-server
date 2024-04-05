import { DataSources, IntermineAPI } from '../../data-sources/index.js';
import { inputError, KeyOfType } from '../../utils/index.js';
import { ResolverMap, SubfieldResolverMap } from '../resolver.js';
import { annotatableFactory } from './annotatable.js';
import { hasGeneticMarkersFactory } from './genetic-marker.js';
import { hasGWASFactory } from './gwas.js';


export const gwasResultFactory = (sourceName: KeyOfType<DataSources, IntermineAPI>):
ResolverMap => ({
    Query: {
        gwasResult: async (_, { id }, { dataSources }) => {
            const {data: result} = await dataSources[sourceName].getGWASResult(id);
            if (result == null) {
                const msg = `GWASResult with ID '${id}' not found`;
                inputError(msg);
            }
            return {results: result};
        },
    },
    GWASResult: {
        ...annotatableFactory(sourceName),
        ...hasGeneticMarkersFactory(sourceName),
        ...hasGWASFactory(sourceName),
        trait: async(gwasResult, _, { dataSources }) => {
            return dataSources[sourceName].getTrait(gwasResult.traitIdentifier)
                // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
    },
});


export const hasGWASResultsFactory = (sourceName: KeyOfType<DataSources, IntermineAPI>):
SubfieldResolverMap => ({
    gwasResults: async (parent, { page, pageSize }, { dataSources }, info) => {
        let request: Promise<any>|null = null;

        const args = {page, pageSize};
        const typeName = info.parentType.name;
        switch (typeName) {
            case 'GeneticMarker':
            case 'GWAS':
            // @ts-ignore: fallthrough case error
            case 'Trait':
                const {id} = parent;
            case 'GeneticMarker':
                request = dataSources[sourceName].getGWASResultsForGeneticMarker(id, args);
                break;
            case 'GWAS':
                request = dataSources[sourceName].getGWASResultsForGWAS(id, args);
                break;
            case 'Trait':
                request = dataSources[sourceName].getGWASResultsForTrait(id, args);
                break;
        }

        if (request == null) {
            return null;
        }

        // @ts-ignore: implicit type any error
        return request.then(({data: results}) => results);
    },
});
