import { DataSources, IntermineAPI, MicroservicesAPI } from '../../data-sources/index.js';
import { inputError, KeyOfType } from '../../utils/index.js';
import { ResolverMap, SubfieldResolverMap } from '../resolver.js';
import { hasGeneFamilyAssignmentsFactory } from './gene-family-assignment.js';
import { hasIntronsFactory } from './intron.js';
import { hasLinkoutsFactory } from '../microservices/linkouts.js';
import { hasPanGeneSetsFactory } from './pan-gene-set.js';
import { hasProteinsFactory } from './protein.js';
import { hasProteinDomainsFactory } from './protein-domain.js';
import { sequenceFeatureFactory } from './sequence-feature.js';
import { hasTranscriptsFactory } from './transcript.js';

export const geneFactory =
(
    sourceName: KeyOfType<DataSources, IntermineAPI>,
    microservicesSource: KeyOfType<DataSources, MicroservicesAPI>,
): ResolverMap => ({
    Query: {
        gene: async (_, { identifier }, { dataSources }) => {
            const {data: gene} = await dataSources[sourceName].getGene(identifier);
            if (gene == null) {
                const msg = `Gene with primaryIdentifier '${identifier}' not found`;
                inputError(msg);
            }
            return {results: gene};
        },
        genes: async (_, { description, genus, species, strain, identifier, name, geneFamilyIdentifier, panGeneSetIdentifier, page, pageSize }, { dataSources }) => {
            const args = {description, genus, species, strain, identifier, name, geneFamilyIdentifier, panGeneSetIdentifier, page, pageSize};
            return dataSources[sourceName].searchGenes(args)
            // @ts-ignore: implicit type any error
                .then(({data: results, metadata: {pageInfo}}) => ({results, pageInfo}));
        },
    },
    Gene: {
        ...sequenceFeatureFactory(sourceName),
        ...hasGeneFamilyAssignmentsFactory(sourceName),
        ...hasIntronsFactory(sourceName),
        ...hasLinkoutsFactory(microservicesSource),
        ...hasPanGeneSetsFactory(sourceName),
        ...hasProteinsFactory(sourceName),
        ...hasProteinDomainsFactory(sourceName),
        ...hasTranscriptsFactory(sourceName),
 
        flankingRegions: async (gene, { page, pageSize }, { dataSources }) => {
            const {id} = gene;
            const args = {page, pageSize};
            return dataSources[sourceName].getGeneFlankingRegionsForGene(id, args)
            // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
        pathways: async (gene, { page, pageSize }, { dataSources }) => {
            const {id} = gene;
            const args = {page, pageSize};
            return dataSources[sourceName].getPathwaysForGene(id, args)
            // @ts-ignore: implicit type any error
                .then(({data: results}) => results);
        },
    },
});


export const hasGeneFactory = (sourceName: KeyOfType<DataSources, IntermineAPI>):
SubfieldResolverMap => ({
    gene: async (parent, _, { dataSources }, info) => {
        let request: Promise<any>|null = null;

        const interfaces = info.parentType.getInterfaces().map(({name}) => name);
        if (interfaces.includes('Transcript')) {
            const { geneIdentifier } = parent;
            request = dataSources[sourceName].getGene(geneIdentifier);
        }

        const typeName = info.parentType.name;
        switch (typeName) {
            case 'GeneFlankingRegion':
                const { geneIdentifier } = parent;
                request = dataSources[sourceName].getGene(geneIdentifier);
                break;
        }

        if (request == null) {
            return null;
        }

        // @ts-ignore: implicit type any error
        return request.then(({data: results}) => results);
    },
});


export const hasGenesFactory = (sourceName: KeyOfType<DataSources, IntermineAPI>):
SubfieldResolverMap => ({
    genes: async (parent, _, { dataSources }, info) => {
        let request: Promise<any>|null = null;

        const typeName = info.parentType.name;
        switch (typeName) {
            case 'GeneFamily':
            case 'Intron':
            case 'PanGeneSet':
            case 'Pathway':
            case 'Protein':
            case 'ProteinDomain':
            // @ts-ignore: fallthrough case error
            case 'QTL':
                const {id} = parent;
            case 'GeneFamily':
                request = dataSources[sourceName].getGenesForGeneFamily(id);
                break;
            case 'Intron':
                request = dataSources[sourceName].getGenesForIntron(id);
                break;
            case 'PanGeneSet':
                request = dataSources[sourceName].getGenesForPanGeneSet(id);
                break;
            case 'Pathway':
                request = dataSources[sourceName].getGenesForPathway(id);
                break;
            case 'Protein':
                request = dataSources[sourceName].getGenesForProtein(id);
                break;
            case 'ProteinDomain':
                request = dataSources[sourceName].getGenesForProteinDomain(id);
                break;
            case 'QTL':
                request = dataSources[sourceName].getGeneForQTL(id);
                break;
        }

        if (request == null) {
            return null;
        }

        // @ts-ignore: implicit type any error
        return request.then(({data: results}) => results);
    },
});
