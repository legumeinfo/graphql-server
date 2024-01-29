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
            const args = {dataSet: dataSet, page, pageSize};
            return dataSources[sourceName].getBioEntities(args)
            // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
    },
});

export const hasDataSetsFactory = (sourceName: KeyOfType<DataSources, IntermineAPI>):
SubfieldResolverMap => ({
    dataSets: async (parent, { page, pageSize }, { dataSources }, info) => {
        let request: Promise<any>|null = null;

        const typeName = info.parentType.name;
        const args = {page, pageSize};
        const { id, identifier, name } = parent;
        const interfaces = info.parentType.getInterfaces().map(({name}) => name);

        // handle any Annotatable
        if (interfaces.includes('Annotatable')) {
            const args = {page, pageSize};
            const { identifier } = parent;
            request = dataSources[sourceName].getDataSetsForAnnotatable(identifier, args);
        }

        // handle non-Annotatable objects which have dataSets
        switch (typeName) {
            case 'DataSource':
                request = dataSources[sourceName].getDataSetsForDataSource(name, args);
                break;
            case 'GWASResult':
                request = dataSources[sourceName].getDataSetsForGWASResult(id, args);
                break;
            case 'Location':
                request = dataSources[sourceName].getDataSetsForLocation(identifier, args);
                break;
            case 'Ontology':
                request = dataSources[sourceName].getDataSetsForOntology(name, args);
                break;
            case 'OntologyAnnotation':
                request = dataSources[sourceName].getDataSetsForOntologyAnnotation(id, args);
                break;
            case 'OntologyTerm':
                request = dataSources[sourceName].getDataSetsForOntologyTerm(identifier, args);
                break;
            case 'SOTerm':
                request = dataSources[sourceName].getDataSetsForSOTerm(identifier, args);
                break;
            case 'SyntenyBlock':
                request = dataSources[sourceName].getDataSetsForSyntenyBlock(identifier, args);
                break;
        }

        if (request == null) {
            return null;
        }

        // @ts-ignore: implicit type any error
        return request.then(({data: results}) => results);
    },
});
