import {DataSources, IntermineAPI} from '../../data-sources/index.js';
import {inputError, KeyOfType} from '../../utils/index.js';
import {ResolverMap, SubfieldResolverMap} from '../resolver.js';
import {hasDataSetsFactory} from './data-set.js';

export const organismFactory = (
  sourceName: KeyOfType<DataSources, IntermineAPI>,
): ResolverMap => ({
  Query: {
    organism: async (_, {taxonId}, {dataSources}) => {
      const {data: organism} =
        await dataSources[sourceName].getOrganism(taxonId);
      if (organism == null) {
        const msg = `Organism with taxon ID '${taxonId}' not found`;
        inputError(msg);
      }
      return {results: organism};
    },
    organisms: async (
      _,
      {taxonId, abbreviation, name, genus, species, page, pageSize},
      {dataSources},
    ) => {
      const args = {
        taxonId,
        abbreviation,
        name,
        genus,
        species,
        page,
        pageSize,
      };
      return (
        dataSources[sourceName]
          .searchOrganisms(args)
          // @ts-expect-error: implicit type any error
          .then(({data: results, metadata: {pageInfo}}) => ({
            results,
            pageInfo,
          }))
      );
    },
  },
  Organism: {
    ...hasDataSetsFactory(sourceName),
    strains: async (organism, {page, pageSize}, {dataSources}) => {
      const {id} = organism;
      const args = {page, pageSize};
      return (
        dataSources[sourceName]
          .getStrainsForOrganism(id, args)
          // @ts-expect-error: implicit type any error
          .then(({data: results}) => results)
      );
    },
  },
});

export const hasOrganismFactory = (
  sourceName: KeyOfType<DataSources, IntermineAPI>,
): SubfieldResolverMap => ({
  organism: async (parent, _, {dataSources}, info) => {
    let taxonId: number | null = null;

    const interfaces = info.parentType.getInterfaces().map(({name}) => name);
    if (interfaces.includes('BioEntity')) {
      taxonId = parent.organismTaxonId;
    }

    const typeName = info.parentType.name;
    switch (typeName) {
      case 'ExpressionSource':
      case 'GeneFamilyTally':
      case 'GeneticMap':
      case 'GWAS':
      case 'QTLStudy':
      case 'Strain':
      case 'Trait':
        taxonId = parent.orgniamsTaxonId;
        break;
    }

    if (taxonId == null) {
      return null;
    }

    return (
      dataSources[sourceName]
        .getOrganism(taxonId)
        // @ts-expect-error: implicit type any error
        .then(({data: results}) => results)
    );
  },
});
