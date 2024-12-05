import { DataSources, IntermineAPI } from '../../data-sources/index.js';
import { inputError, KeyOfType } from '../../utils/index.js';
import { ResolverMap, SubfieldResolverMap } from '../resolver.js';
import { hasGeneFamilyFactory } from './gene-family.js';
import { hasProteinFactory } from './protein.js';


export const geneFamilyAssignmentFactory = (sourceName: KeyOfType<DataSources, IntermineAPI>):
ResolverMap => ({
    Query: {
        geneFamilyAssignment: async (_, { id }, { dataSources }) => {
            const {data: family} = await dataSources[sourceName].getGeneFamilyAssignment(id);
            if (family == null) {
                const msg = `GeneFamilyAssignment with ID '${id}' not found`;
                inputError(msg);
            }
            return {results: family};
        },
    },
    GeneFamilyAssignment: {
        ...hasGeneFamilyFactory(sourceName),
        ...hasProteinFactory(sourceName),
    },
});


export const hasGeneFamilyAssignmentsFactory = (sourceName: KeyOfType<DataSources, IntermineAPI>):
SubfieldResolverMap => ({
    geneFamilyAssignments: async (parent, { page, pageSize }, { dataSources }, info) => {
        let request: Promise<any>|null = null;

        const args = {page, pageSize};
        const typeName = info.parentType.name;
        switch (typeName) {
            case 'Gene':
            // @ts-ignore: fallthrough case error
            case 'Protein':
                const {id} = parent;
            case 'Gene':
                request = dataSources[sourceName].getGeneFamilyAssignmentsForGene(id, args);
                break;
            case 'Protein':
                request = dataSources[sourceName].getGeneFamilyAssignmentsForProtein(id, args);
                break;
        }

        if (request == null) {
            return null;
        }

        // @ts-ignore: implicit type any error
        return request.then(({data: results}) => results);
    },
});
