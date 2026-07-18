// get-one.ts — the getX(identifier) methods: a single '=' lookup returning the
// first match or null. Each is one line via getOne(); multi-field lookups (getAuthor)
// are written out. Reuses the InterMine model modules verbatim — only the query
// path differs. Mirrors intermine/api/get-*.ts one-for-one.
import {SqliteServer, ApiResponse} from '../sqlite.server.js';
import {getOne, firstOrNull} from './helpers.js';
import {
  GraphQLOrganism,
  intermineOrganismAttributes,
  intermineOrganismSort,
  response2organisms,
  GraphQLStrain,
  intermineStrainAttributes,
  intermineStrainSort,
  response2strains,
  GraphQLDataSource,
  intermineDataSourceAttributes,
  intermineDataSourceSort,
  response2dataSources,
  GraphQLPublication,
  interminePublicationAttributes,
  interminePublicationSort,
  response2publications,
  GraphQLChromosome,
  intermineChromosomeAttributes,
  intermineChromosomeSort,
  response2chromosomes,
  GraphQLAuthor,
  intermineAuthorAttributes,
  intermineAuthorSort,
  response2authors,
} from '../../intermine/models/index.js';

export const getOrganism = getOne<GraphQLOrganism>(
  'Organism',
  'taxonId',
  intermineOrganismAttributes,
  intermineOrganismSort,
  response2organisms as (r: unknown) => GraphQLOrganism[],
);

export const getStrain = getOne<GraphQLStrain>(
  'Strain',
  'identifier',
  intermineStrainAttributes,
  intermineStrainSort,
  response2strains as (r: unknown) => GraphQLStrain[],
);

export const getDataSource = getOne<GraphQLDataSource>(
  'DataSource',
  'name',
  intermineDataSourceAttributes,
  intermineDataSourceSort,
  response2dataSources as (r: unknown) => GraphQLDataSource[],
);

export const getPublication = getOne<GraphQLPublication>(
  'Publication',
  'doi',
  interminePublicationAttributes,
  interminePublicationSort,
  response2publications as (r: unknown) => GraphQLPublication[],
);

export const getChromosome = getOne<GraphQLChromosome>(
  'Chromosome',
  'primaryIdentifier',
  intermineChromosomeAttributes,
  intermineChromosomeSort,
  response2chromosomes as (r: unknown) => GraphQLChromosome[],
);

// Two-field lookup — written out rather than via getOne().
export async function getAuthor(
  this: SqliteServer,
  firstName: string,
  lastName: string,
): Promise<ApiResponse<GraphQLAuthor>> {
  const response = this.pathQuery(
    'Author',
    intermineAuthorAttributes,
    intermineAuthorSort,
    [
      {path: 'Author.firstName', op: '=', value: firstName},
      {path: 'Author.lastName', op: '=', value: lastName},
    ],
  );
  return {
    data: firstOrNull(
      (response2authors as (r: unknown) => GraphQLAuthor[])(response),
    ) as GraphQLAuthor,
  };
}
