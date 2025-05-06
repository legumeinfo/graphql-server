import {DataSources, IntermineAPI} from '../../data-sources/index.js';
import {inputError, KeyOfType} from '../../utils/index.js';
import {ResolverMap, SubfieldResolverMap} from '../resolver.js';
import {isAnnotatableFactory} from './annotatable.js';
import {hasGenesFactory} from './gene.js';
import {hasGeneticMarkersFactory} from './genetic-marker.js';
import {hasLinkageGroupFactory} from './linkage-group.js';
import {hasQTLStudyFactory} from './qtl-study.js';
import {hasTraitFactory} from './trait.js';

export const qtlFactory = (
  sourceName: KeyOfType<DataSources, IntermineAPI>,
): ResolverMap => ({
  Query: {
    qtl: async (_, {identifier}, {dataSources}) => {
      const {data: qtl} = await dataSources[sourceName].getQTL(identifier);
      if (qtl == null) {
        const msg = `QTL with identifier '${identifier}' not found`;
        inputError(msg);
      }
      return {results: qtl};
    },
    qtls: async (_, {traitName, page, pageSize}, {dataSources}) => {
      const args = {traitName, page, pageSize};
      return (
        dataSources[sourceName]
          .searchQTLs(args)
          // @ts-expect-error: implicit type any error
          .then(({data: results, metadata: {pageInfo}}) => ({
            results,
            pageInfo,
          }))
      );
    },
  },
  QTL: {
    ...isAnnotatableFactory(sourceName),
    ...hasGenesFactory(sourceName),
    ...hasGeneticMarkersFactory(sourceName),
    ...hasLinkageGroupFactory(sourceName),
    ...hasQTLStudyFactory(sourceName),
    ...hasTraitFactory(sourceName),
  },
});

export const hasQTLsFactory = (
  sourceName: KeyOfType<DataSources, IntermineAPI>,
): SubfieldResolverMap => ({
  qtls: async (parent, {page, pageSize}, {dataSources}, info) => {
    let request: Promise<any> | null = null;

    const {id} = parent;
    const args = {page, pageSize};
    const typeName = info.parentType.name;
    switch (typeName) {
      case 'GeneticMarker':
        request = dataSources[sourceName].getQTLsForGeneticMarker(id, args);
        break;
      case 'LinkageGroup':
        request = dataSources[sourceName].getQTLsForLinkageGroup(id, args);
        break;
      case 'QTLStudy':
        request = dataSources[sourceName].getQTLsForQTLStudy(id, args);
        break;
      case 'Trait':
        request = dataSources[sourceName].getQTLsForTrait(id, args);
        break;
    }

    if (request == null) {
      return null;
    }

    return request.then(({data: results}) => results);
  },
});
