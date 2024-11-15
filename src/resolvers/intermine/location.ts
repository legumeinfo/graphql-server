import { DataSources, IntermineAPI, MicroservicesAPI } from '../../data-sources/index.js';
import { inputError, KeyOfType } from '../../utils/index.js';
import { ResolverMap } from '../resolver.js';
import { hasDataSetsFactory } from './data-set.js';


export const locationFactory =
(
    sourceName: KeyOfType<DataSources, IntermineAPI>,
    microservicesSource: KeyOfType<DataSources, MicroservicesAPI>,
): ResolverMap => ({
    Query: {
        location: async (_, { id }, { dataSources }) => {
            const {data: location} = await dataSources[sourceName].getLocation(id);
            if (location == null) {
                const msg = `Location with ID '${id}' not found`;
                inputError(msg);
            }
            return {results: location};
        },
    },
    Location: {
        ...hasDataSetsFactory(sourceName),
        feature: async (location, _, { dataSources }) => {
            let request: Promise<any>|null = null;
            const {featureClass, featureIdentifier} = location;
            switch (featureClass) {
                case "CDS":
                    request = dataSources[sourceName].getCDS(featureIdentifier);
                    break;
                case "Chromosome":
                    request = dataSources[sourceName].getChromosome(featureIdentifier);
                    break;
                case "Exon":
                    request = dataSources[sourceName].getExcon(featureIdentifier);
                    break;
                case "Gene":
                    request = dataSources[sourceName].getGene(featureIdentifier);
                    break;
                case "GeneFlankingRegion":
                    request = dataSources[sourceName].getGeneFlankingRegion(featureIdentifier);
                    break;
                case "GeneticMarker":
                    request = dataSources[sourceName].getGeneticMarker(featureIdentifier);
                    break;
                case "IntergenicRegion":
                    request = dataSources[sourceName].getIntergenicRegion(featureIdentifier);
                    break;
                case "Intron":
                    request = dataSources[sourceName].getIntron(featureIdentifier);
                    break;
                case "MRNA":
                    request = dataSources[sourceName].getMRNA(featureIdentifier);
                    break;
                case "Supercontig":
                    request = dataSources[sourceName].getSupercontig(featureIdentifier);
                    break;
                case "SyntenicRegion":
                    request = dataSources[sourceName].getSyntenicRegion(featureIdentifier);
                    break;
                case "Transcript":
                    request = dataSources[sourceName].getTranscript(featureIdentifier);
                    break;
                case "UTR":
                    request = dataSources[sourceName].getUTR(featureIdentifier);
                    break;
            }
            if (request == null) return null;
            // @ts-ignore: implicit type any error
            return request.then(({data: results}) => ({__typename: featureClass, ...results}));
        },
        locatedOn: async (location, _, { dataSources }) => {
            let request: Promise<any>|null = null;
            const {locatedOnClass, locatedOnIdentifier} = location;
            switch (locatedOnClass) {
                case "Chromosome":
                    request = dataSources[sourceName].getChromosome(locatedOnIdentifier);
                    break;
                case "Supercontig":
                    request = dataSources[sourceName].getSupercontig(locatedOnIdentifier);
                    break;
            }
            if (request == null) return null;
            // @ts-ignore: implicit type any error
            return request.then(({data: results}) => ({__typename: locatedOnClass, ...results}));
        },
        linkouts: async (location, _, { dataSources }) => {
          const {locatedOnIdentifier, start, end} = location;
          return dataSources[microservicesSource].getLinkoutsForLocation(locatedOnIdentifier, start, end);
        },
    },
});
