import { DataSources, IntermineAPI } from '../../data-sources/index.js';
import { inputError, KeyOfType } from '../../utils/index.js';
import { ResolverMap, SubfieldResolverMap } from '../resolver.js';
import { hasGenesFactory } from './gene.js';
import { sequenceFeatureFactory } from './sequence-feature.js';
import { hasTranscriptsFactory } from './transcript.js';

export const intronFactory = (sourceName: KeyOfType<DataSources, IntermineAPI>):
ResolverMap => ({
    Query: {
        intron: async (_, { identifier }, { dataSources }) => {
            const {data: intron} = await dataSources[sourceName].getIntron(identifier);
            if (intron == null) {
                const msg = `Intron with primaryIdentifier '${identifier}' not found`;
                inputError(msg);
            }
            return {results: intron};
        },
    },
    Intron: {
        ...sequenceFeatureFactory(sourceName),
        ...hasGenesFactory(sourceName),
        ...hasTranscriptsFactory(sourceName),
    },
});


export const hasIntronsFactory = (sourceName: KeyOfType<DataSources, IntermineAPI>):
SubfieldResolverMap => ({
    introns: async (parent, { page, pageSize }, { dataSources }, info) => {
        let request: Promise<any>|null = null;

        const args = {page, pageSize};

        const interfaces = info.parentType.getInterfaces().map(({name}) => name);
        if (interfaces.includes('Transcript')) {
            const { id } = parent;
            request = dataSources[sourceName].getIntronsForTranscript(id, args);
        }

        const typeName = info.parentType.name;
        switch (typeName) {
            case 'Gene':
                const {id} = parent;
                request = dataSources[sourceName].getIntronsForGene(id, args);
                break;
        }

        if (request == null) {
            return null;
        }

        // @ts-ignore: implicit type any error
        return request.then(({data: results}) => results);
    },
});
