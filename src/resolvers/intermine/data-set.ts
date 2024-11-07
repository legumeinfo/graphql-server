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
        publication: async (dataSet, _, { dataSources }) => {
            return dataSources[sourceName].getPublication(dataSet.publicationDOI)
                // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
    },
});


export const hasDataSetFactory = (sourceName: KeyOfType<DataSources, IntermineAPI>):
SubfieldResolverMap => ({
    dataSet: async (parent, _, { dataSources }, info) => {
        const typeName = info.parentType.name;
        switch (typeName) {
            case 'GWAS':
            case 'QTL':
            // @ts-ignore: fallthrough case error
            case 'Trait':
                const {dataSetName} = parent;
                return dataSources[sourceName].getDataSet(dataSetName)
                    // @ts-ignore: implicit type any error
                    .then(({data: results}) => results);
        }

        return null;
    },
});


export const hasDataSetsFactory = (sourceName: KeyOfType<DataSources, IntermineAPI>):
SubfieldResolverMap => ({
    dataSets: async (parent, { page, pageSize }, { dataSources }, info) => {
        let request: Promise<any>|null = null;

        const args = {page, pageSize};

        const interfaces = info.parentType.getInterfaces().map(({name}) => name);
        if (interfaces.includes('Annotatable')) {
            const {id} = parent;
            request = dataSources[sourceName].getDataSetsForAnnotatable(id, args);
        } else if (interfaces.includes('OntologyTermInterface')) {
            const {id} = parent;
            request = dataSources[sourceName].getDataSetsForOntologyTerm(id, args);
        }

        const typeName = info.parentType.name;
        switch (typeName) {
            case 'DataSource':
            case 'Location':
            case 'Ontology':
            case 'OntologyAnnotation':
            case 'Organism':
            // @ts-ignore: fallthrough case error
            case 'Strain':
                const {id} = parent;
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
            case 'Organism':
                request = dataSources[sourceName].getDataSetsForOrganism(id, args);
                break;
            case 'Strain':
                request = dataSources[sourceName].getDataSetsForStrain(id, args);
                break;
        }

        if (request == null) {
            return null;
        }

        // @ts-ignore: implicit type any error
        return request.then(({data: results}) => results);
    },
});
