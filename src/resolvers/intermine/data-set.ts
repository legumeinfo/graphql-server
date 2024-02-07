import { DataSources, IntermineAPI } from '../../data-sources/index.js';
import { inputError, KeyOfType } from '../../utils/index.js';
import { ResolverMap, SubfieldResolverMap } from '../resolver.js';

export const dataSetFactory = (sourceName: KeyOfType<DataSources, IntermineAPI>):
ResolverMap => ({
    Query: {
        dataSet: async (_, { name }, { dataSources }) => {
            const {data: dataset} = await dataSources[sourceName].getDataSet(name);
            if (dataset == null) {
                const msg = `DataSet with name '${name}' not found`;
                inputError(msg);
            }
            return {results: dataset};
        },
    },
    DataSet: {
        dataSource: async (dataSet, _, { dataSources }) => {
            return dataSources[sourceName].getDataSource(dataSet.dataSourceName)
            // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
        publication: async (dataSet, _, { dataSources }) => {
            return dataSources[sourceName].getPublication(dataSet.publicationDOI)
            // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
        bioEntities: async (dataSet, { page, pageSize }, { dataSources }) => {
            const { id } = dataSet;
            return dataSources[sourceName].getBioEntitiesForDataSet(id, {page, pageSize})
            // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
    },
});

export const hasDataSetsFactory = (sourceName: KeyOfType<DataSources, IntermineAPI>):
SubfieldResolverMap => ({
    dataSets: async (parent, { page, pageSize }, { dataSources }, info) => {
        let request: Promise<any>|null = null;

        // we query dataSets by parent id
        const { id } = parent;

        const args = {page, pageSize};
        const interfaces = info.parentType.getInterfaces().map(({name}) => name);

        if (interfaces.includes('Annotatable')) {
            // most types
            request = dataSources[sourceName].getDataSetsForAnnotatable(id, args);
        } else if (interfaces.includes('OntologyTerm')) {
            // e.g. SOTerm
            request = dataSources[sourceName].getDataSetsForOntologyTerm(id, args);
        } else {
            // handle non-Annotatable objects which have dataSets
            const typeName = info.parentType.name;
            switch (typeName) {
                case 'DataSource':
                    request = dataSources[sourceName].getDataSetsForDataSource(id, args);
                    break;
                case 'Location':
                    request = dataSources[sourceName].getDataSetsForLocation(id, args);
                    break;
                case 'Ontology':
                    request = dataSources[sourceName].getDataSetsForOntology(id, args);
                    break;
                case 'OntologyAnnotation':
                    request = dataSources[sourceName].getDataSetsForOntologyAnnotation(id, args);
                    break;
                case 'OntologyTerm':
                    request = dataSources[sourceName].getDataSetsForOntologyTerm(id, args);
                    break;
                case 'Organism':
                    request = dataSources[sourceName].getDataSetsForOrganism(id, args);
                    break;
                case 'Strain':
                    request = dataSources[sourceName].getDataSetsForStrain(id, args);
                    break;
            }
        }

        if (request == null) {
            return null;
        }

        // @ts-ignore: implicit type any error
        return request.then(({data: results}) => results);
    },
});
