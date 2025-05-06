import {DataSources, IntermineAPI} from '../../data-sources/index.js';
import {inputError, KeyOfType} from '../../utils/index.js';
import {ResolverMap, SubfieldResolverMap} from '../resolver.js';
import {isBioEntityFactory} from './bio-entity.js';
import {hasGenesFactory} from './gene.js';
import {hasGeneFamilyAssignmentsFactory} from './gene-family-assignment.js';
import {hasPanGeneSetsFactory} from './pan-gene-set.js';
import {hasSequenceFactory} from './sequence.js';
import {hasTranscriptFactory} from './transcript.js';

export const proteinFactory = (
  sourceName: KeyOfType<DataSources, IntermineAPI>,
): ResolverMap => ({
  Query: {
    protein: async (_, {identifier}, {dataSources}) => {
      const {data: protein} =
        await dataSources[sourceName].getProtein(identifier);
      if (protein == null) {
        const msg = `Protein with identifier '${identifier}' not found`;
        inputError(msg);
      }
      return {results: protein};
    },
    proteins: async (_, {description, page, pageSize}, {dataSources}) => {
      const args = {description, page, pageSize};
      return (
        dataSources[sourceName]
          .searchProteins(args)
          // @ts-expect-error: implicit type any error
          .then(({data: results, metadata: {pageInfo}}) => ({
            results,
            pageInfo,
          }))
      );
    },
  },
  Protein: {
    ...isBioEntityFactory(sourceName),
    ...hasGeneFamilyAssignmentsFactory(sourceName),
    ...hasGenesFactory(sourceName),
    ...hasPanGeneSetsFactory(sourceName),
    ...hasSequenceFactory(sourceName),
    ...hasTranscriptFactory(sourceName),
    phylonode: async (protein, _, {dataSources}) => {
      const {phylonodeIdentifier} = protein;
      if (phylonodeIdentifier != null) {
        return (
          dataSources[sourceName]
            .getPhylonode(phylonodeIdentifier)
            // @ts-expect-error: implicit type any error
            .then(({data: results}) => results)
        );
      }
      return null;
    },
    proteinMatches: async (protein, {page, pageSize}, {dataSources}) => {
      const {id} = protein;
      return (
        dataSources[sourceName]
          .getProteinMatchesForProtein(id, {page, pageSize})
          // @ts-expect-error: implicit type any error
          .then(({data: results}) => results)
      );
    },
  },
});

export const hasProteinFactory = (
  sourceName: KeyOfType<DataSources, IntermineAPI>,
): SubfieldResolverMap => ({
  protein: async (parent, _, {dataSources}, info) => {
    let request: Promise<any> | null = null;

    const interfaces = info.parentType.getInterfaces().map(({name}) => name);
    if (interfaces.includes('Transcript')) {
      const {proteinIdentifier} = parent;
      request = dataSources[sourceName].getProtein(proteinIdentifier);
    }

    const typeName = info.parentType.name;
    switch (typeName) {
      case 'GeneFamilyAssignment':
      case 'Phylonode':
      case 'ProteinMatch': {
        const {proteinIdentifier} = parent;
        request = dataSources[sourceName].getProtein(proteinIdentifier);
        break;
      }
    }

    if (request == null) {
      return null;
    }

    return request.then(({data: results}) => results);
  },
});

export const hasProteinsFactory = (
  sourceName: KeyOfType<DataSources, IntermineAPI>,
): SubfieldResolverMap => ({
  proteins: async (parent, {page, pageSize}, {dataSources}, info) => {
    let request: Promise<any> | null = null;
    const args = {page, pageSize};

    const {id} = parent;
    const typeName = info.parentType.name;
    switch (typeName) {
      case 'Gene':
        request = dataSources[sourceName].getProteinsForGene(id, args);
        break;
      case 'GeneFamily':
        request = dataSources[sourceName].getProteinsForGeneFamily(id, args);
        break;
      case 'PanGeneSet':
        request = dataSources[sourceName].getProteinsForPanGeneSet(id, args);
        break;
    }

    if (request == null) {
      return null;
    }

    return request.then(({data: results}) => results);
  },
});
