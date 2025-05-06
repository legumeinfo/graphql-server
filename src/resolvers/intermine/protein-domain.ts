import {DataSources, IntermineAPI} from '../../data-sources/index.js';
import {inputError, KeyOfType} from '../../utils/index.js';
import {ResolverMap, SubfieldResolverMap} from '../resolver.js';
import {isAnnotatableFactory} from './annotatable.js';
import {hasGenesFactory} from './gene.js';

export const proteinDomainFactory = (
  sourceName: KeyOfType<DataSources, IntermineAPI>,
): ResolverMap => ({
  Query: {
    proteinDomain: async (_, {identifier}, {dataSources}) => {
      const {data: domain} =
        await dataSources[sourceName].getProteinDomain(identifier);
      if (domain == null) {
        const msg = `ProteinDomain with identifier '${identifier}' not found`;
        inputError(msg);
      }
      return {results: domain};
    },
    proteinDomains: async (_, {description, page, pageSize}, {dataSources}) => {
      const args = {description, page, pageSize};
      return (
        dataSources[sourceName]
          .searchProteinDomains(args)
          // @ts-expect-error: implicit type any error
          .then(({data: results, metadata: {pageInfo}}) => ({
            results,
            pageInfo,
          }))
      );
    },
  },
  ProteinDomain: {
    ...isAnnotatableFactory(sourceName),
    ...hasGenesFactory(sourceName),
    geneFamilies: async (proteinDomain, {page, pageSize}, {dataSources}) => {
      const args = {proteinDomain: proteinDomain.id, page, pageSize};
      return (
        dataSources[sourceName]
          .getGeneFamilies(args)
          // @ts-expect-error: implicit type any error
          .then(({data: results}) => results)
      );
    },
  },
});

export const hasProteinDomainsFactory = (
  sourceName: KeyOfType<DataSources, IntermineAPI>,
): SubfieldResolverMap => ({
  proteinDomains: async (parent, {page, pageSize}, {dataSources}, info) => {
    let request: Promise<any> | null = null;

    const args = {page, pageSize};

    const {id} = parent;
    const typeName = info.parentType.name;
    switch (typeName) {
      case 'Gene':
        request = dataSources[sourceName].getProteinDomainsForGene(id, args);
        break;
      case 'GeneFamily':
        request = dataSources[sourceName].getProteinDomainsForGeneFamily(
          id,
          args,
        );
        break;
    }

    if (request == null) {
      return null;
    }

    return request.then(({data: results}) => results);
  },
});
