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


export const hasDataSetsFactory = (sourceName: KeyOfType<DataSources, IntermineAPI>):
SubfieldResolverMap => ({
    dataSets: async (parent, { page, pageSize }, { dataSources }, info) => {
        let request: Promise<any>|null = null;

        const interfaces = info.parentType.getInterfaces().map(({name}) => name);
        if (interfaces.includes('BioEntity')) {
            const args = {page, pageSize};
            request = dataSources[sourceName].getDataSetsForBioEntity(parent, args);
        }

        const typeName = info.parentType.name;
        switch (typeName) {
            case 'GeneticMap':
            case 'LinkageGroup':
            case 'Location':
            case 'Ontology':
            case 'OntologyAnnotation':
            case 'OntologyTerm':
            case 'PanGeneSet':
            case 'Pathway':
            case 'Phylotree':
            // @ts-ignore: fallthrough case error
            case 'SyntenyBlock':
                const args = {page, pageSize};
            case 'GeneticMap':
                request = dataSources[sourceName].getDataSetsForGeneticMap(parent, args);
                break;
            case 'LinkageGroup':
                request = dataSources[sourceName].getDataSetsForLinkageGroup(parent, args);
                break;
            case 'Location':
                request = dataSources[sourceName].getDataSetsForLocation(parent, args);
                break;
            case 'Ontology':
                request = dataSources[sourceName].getDataSetsForOntology(parent, args);
                break;
            case 'OntologyTerm':
                request = dataSources[sourceName].getDataSetsForOntologyTerm(parent, args);
                break;
            case 'OntologyAnnotation':
                request = dataSources[sourceName].getDataSetsForOntologyAnnotation(parent, args);
                break;
            case 'PanGeneSet':
                request = dataSources[sourceName].getDataSetsForPanGeneSet(parent, args);
                break;
            case 'Pathway':
                request = dataSources[sourceName].getDataSetsForPathway(parent, args);
                break;
            case 'Phylotree':
                request = dataSources[sourceName].getDataSetsForPhylotree(parent, args)
                break;
            case 'SyntenyBlock':
                request = dataSources[sourceName].getDataSetsForSyntenyBlock(parent, args);
                break;
        }

        if (request == null) {
            return null;
        }

        // @ts-ignore: implicit type any error
        return rquest.then(({data: results}) => results);
    },
});
