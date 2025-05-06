import {DataSources, IntermineAPI} from '../../data-sources/index.js';
import {inputError, KeyOfType} from '../../utils/index.js';
import {ResolverMap, SubfieldResolverMap} from '../resolver.js';
import {hasDataSetsFactory} from './data-set.js';
import {hasOrganismFactory} from './organism.js';

export const strainFactory = (
  sourceName: KeyOfType<DataSources, IntermineAPI>,
): ResolverMap => ({
  Query: {
    strain: async (_, {identifier}, {dataSources}) => {
      const {data: strain} =
        await dataSources[sourceName].getStrain(identifier);
      if (strain == null) {
        const msg = `Strain with identifier '${identifier}' not found`;
        inputError(msg);
      }
      return {results: strain};
    },
    strains: async (
      _,
      {description, origin, species, page, pageSize},
      {dataSources},
    ) => {
      const args = {description, origin, species, page, pageSize};
      return (
        dataSources[sourceName]
          .searchStrains(args)
          // @ts-expect-error: implicit type any error
          .then(({data: results, metadata: {pageInfo}}) => ({
            results,
            pageInfo,
          }))
      );
    },
  },
  Strain: {
    ...hasDataSetsFactory(sourceName),
    ...hasOrganismFactory(sourceName),
  },
});

export const hasStrainFactory = (
  sourceName: KeyOfType<DataSources, IntermineAPI>,
): SubfieldResolverMap => ({
  strain: async (parent, _, {dataSources}, info) => {
    let request: Promise<any> | null = null;

    const interfaces = info.parentType.getInterfaces().map(({name}) => name);
    if (interfaces.includes('BioEntity')) {
      const {strainIdentifier} = parent;
      request = dataSources[sourceName].getStrain(strainIdentifier);
    }

    const typeName = info.parentType.name;
    switch (typeName) {
      case 'ExpressionSource': {
        const {strainIdentifier} = parent;
        request = dataSources[sourceName].getStrain(strainIdentifier);
        break;
      }
    }

    if (request == null) {
      return null;
    }

    return request.then(({data: results}) => results);
  },
});
