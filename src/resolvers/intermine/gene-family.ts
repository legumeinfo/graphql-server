import {
  DataSources,
  IntermineAPI,
  MicroservicesAPI,
} from '../../data-sources/index.js';
import {inputError, KeyOfType} from '../../utils/index.js';
import {hasLinkoutsFactory} from '../microservices/linkouts.js';
import {ResolverMap, SubfieldResolverMap} from '../resolver.js';
import {isAnnotatableFactory} from './annotatable.js';
import {hasGenesFactory} from './gene.js';
import {hasPhylotreeFactory} from './phylotree.js';
import {hasProteinDomainsFactory} from './protein-domain.js';
import {hasProteinsFactory} from './protein.js';

export const geneFamilyFactory = (
  sourceName: KeyOfType<DataSources, IntermineAPI>,
  microservicesSource: KeyOfType<DataSources, MicroservicesAPI>,
): ResolverMap => ({
  Query: {
    geneFamily: async (_, {identifier}, {dataSources}) => {
      const {data: family} =
        await dataSources[sourceName].getGeneFamily(identifier);
      if (family == null) {
        const msg = `GeneFamily with identifier '${identifier}' not found`;
        inputError(msg);
      }
      return {results: family};
    },
    geneFamilies: async (_, {description, page, pageSize}, {dataSources}) => {
      const args = {description, page, pageSize};
      return (
        dataSources[sourceName]
          .searchGeneFamilies(args)
          // @ts-expect-error: implicit type any error
          .then(({data: results, metadata: {pageInfo}}) => ({
            results,
            pageInfo,
          }))
      );
    },
  },
  GeneFamily: {
    ...isAnnotatableFactory(sourceName),
    ...hasGenesFactory(sourceName),
    ...hasLinkoutsFactory(microservicesSource),
    ...hasPhylotreeFactory(sourceName),
    ...hasProteinDomainsFactory(sourceName),
    ...hasProteinsFactory(sourceName),
    tallies: async (geneFamily, {page, pageSize}, {dataSources}) => {
      const {id} = geneFamily;
      const args = {page, pageSize};
      return (
        dataSources[sourceName]
          .getGeneFamilyTalliesForGeneFamily(id, args)
          // @ts-expect-error: implicit type any error
          .then(({data: results}) => results)
      );
    },
  },
});

export const hasGeneFamilyFactory = (
  sourceName: KeyOfType<DataSources, IntermineAPI>,
): SubfieldResolverMap => ({
  geneFamily: async (parent, _, {dataSources}, info) => {
    let request: Promise<any> | null = null;

    const typeName = info.parentType.name;
    switch (typeName) {
      case 'GeneFamilyAssignment':
      case 'GeneFamilyTally':
      case 'Phylotree': {
        const {geneFamilyIdentifier} = parent;
        request = dataSources[sourceName].getGeneFamily(geneFamilyIdentifier);
        break;
      }
    }

    if (request == null) {
      return null;
    }

    return request.then(({data: results}) => results);
  },
});
