import { DataSources, IntermineAPI } from '../../data-sources/index.js';
import { KeyOfType } from '../../utils/index.js';
import { ResolverMap, SubfieldResolverMap } from '../resolver.js';

export const sequenceFactory = (_: KeyOfType<DataSources, IntermineAPI>):
ResolverMap => ({
    Query: {
        //sequence: async (_, { id }, { dataSources }) => {
        //    const {data: sequence} = await dataSources[sourceName].getSequence(id);
        //    if (sequence == null) {
        //        const msg = `Sequence with ID '${id}' not found`;
        //        inputError(msg);
        //    }
        //    return {results: sequence};
        //},
    },
});


export const hasSequenceFactory = (sourceName: KeyOfType<DataSources, IntermineAPI>):
SubfieldResolverMap => ({
    sequence: async (parent, _, { dataSources }, info) => {
        let request: Promise<any>|null = null;

        const interfaces = info.parentType.getInterfaces().map(({name}) => name);
        if (interfaces.includes('SequenceFeature')) {
            const { sequenceId } = parent;
            request = dataSources[sourceName].getSequence(sequenceId);
        }

        const typeName = info.parentType.name;
        switch (typeName) {
            case 'Protein':
                const { sequenceId } = parent;
                request = dataSources[sourceName].getSequence(sequenceId);
                break;
        }

        if (request == null) {
            return null;
        }

        // @ts-ignore: implicit type any error
        return request.then(({data: results}) => results);
    },
});
