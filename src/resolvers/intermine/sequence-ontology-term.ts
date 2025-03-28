import { DataSources, IntermineAPI } from '../../data-sources/index.js';
import { inputError, KeyOfType } from '../../utils/index.js';
import { ResolverMap } from '../resolver.js';
import { isOntologyTermFactory } from './ontology-term-interface.js';

export const sequenceOntologyTermFactory = (sourceName: KeyOfType<DataSources, IntermineAPI>):
ResolverMap => ({
    Query: {
        sequenceOntologyTerm: async (_, { identifier }, { dataSources }) => {
            console.log(identifier);
            const {data: term} = await dataSources[sourceName].getSequenceOntologyTerm(identifier);
            if (term == null) {
                const msg = `Sequence Ontology Term with identifier '${identifier}' not found`;
                inputError(msg);
            }
            return {results: term};
        },
    },
    SequenceOntologyTerm: {
        ...isOntologyTermFactory(sourceName),
    },
});
