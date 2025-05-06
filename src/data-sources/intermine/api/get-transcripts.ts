import {
  ApiResponse,
  IntermineCountResponse,
  countResponse2graphqlPageInfo,
  intermineConstraint,
  intermineJoin,
  interminePathQuery,
} from '../intermine.server.js';
import {
  GraphQLTranscript,
  IntermineTranscriptResponse,
  intermineTranscriptAttributes,
  intermineTranscriptSort,
  response2transcripts,
} from '../models/index.js';
import {PaginationOptions} from './pagination.js';

// get Transcripts using the given query and returns the expected GraphQL types
async function getTranscripts(
  pathQuery: string,
  {page, pageSize}: PaginationOptions,
): Promise<ApiResponse<GraphQLTranscript>> {
  // get the data
  const dataPromise = this.pathQuery(pathQuery, {page, pageSize}).then(
    (response: IntermineTranscriptResponse) => response2transcripts(response),
  );
  // get a summary of the data and convert it to page info
  const pageInfoPromise = this.pathQueryCount(pathQuery).then(
    (response: IntermineCountResponse) =>
      countResponse2graphqlPageInfo(response, page, pageSize),
  );
  // return the expected GraphQL type
  return Promise.all([dataPromise, pageInfoPromise]).then(
    ([data, pageInfo]) => ({data, metadata: {pageInfo}}),
  );
}

// Get Transcripts associated with an Exon
export async function getTranscriptsForExon(
  id: number,
  {page, pageSize}: PaginationOptions,
): Promise<ApiResponse<GraphQLTranscript>> {
  const constraints = [intermineConstraint('Transcript.exons.id', '=', id)];
  // all SequenceFeature-extending object queries must include these joins
  const joins = [
    intermineJoin('Transcript.chromosome', 'OUTER'),
    intermineJoin('Transcript.supercontig', 'OUTER'),
    intermineJoin('Transcript.chromosomeLocation', 'OUTER'),
    intermineJoin('Transcript.supercontigLocation', 'OUTER'),
    intermineJoin('Transcript.sequenceOntologyTerm', 'OUTER'),
  ];
  const query = interminePathQuery(
    intermineTranscriptAttributes,
    intermineTranscriptSort,
    constraints,
    joins,
  );
  // get the data
  return getTranscripts.call(this, query, {page, pageSize});
}

// Get Transcripts associated with a Gene
export async function getTranscriptsForGene(
  id: number,
  {page, pageSize}: PaginationOptions,
): Promise<ApiResponse<GraphQLTranscript>> {
  const constraints = [intermineConstraint('Transcript.gene.id', '=', id)];
  // all SequenceFeature-extending object queries must include these joins
  const joins = [
    intermineJoin('Transcript.chromosome', 'OUTER'),
    intermineJoin('Transcript.supercontig', 'OUTER'),
    intermineJoin('Transcript.chromosomeLocation', 'OUTER'),
    intermineJoin('Transcript.supercontigLocation', 'OUTER'),
    intermineJoin('Transcript.sequenceOntologyTerm', 'OUTER'),
  ];
  const query = interminePathQuery(
    intermineTranscriptAttributes,
    intermineTranscriptSort,
    constraints,
    joins,
  );
  // get the data
  return getTranscripts.call(this, query, {page, pageSize});
}

// Get Transcripts associated with an Intron
export async function getTranscriptsForIntron(
  id: number,
  {page, pageSize}: PaginationOptions,
): Promise<ApiResponse<GraphQLTranscript>> {
  const constraints = [intermineConstraint('Transcript.introns.id', '=', id)];
  // all SequenceFeature-extending object queries must include these joins
  const joins = [
    intermineJoin('Transcript.chromosome', 'OUTER'),
    intermineJoin('Transcript.supercontig', 'OUTER'),
    intermineJoin('Transcript.chromosomeLocation', 'OUTER'),
    intermineJoin('Transcript.supercontigLocation', 'OUTER'),
    intermineJoin('Transcript.sequenceOntologyTerm', 'OUTER'),
  ];
  const query = interminePathQuery(
    intermineTranscriptAttributes,
    intermineTranscriptSort,
    constraints,
    joins,
  );
  // get the data
  return getTranscripts.call(this, query, {page, pageSize});
}

// Get Transcripts associated with a PanGeneSet
export async function getTranscriptsForPanGeneSet(
  id: number,
  {page, pageSize}: PaginationOptions,
): Promise<ApiResponse<GraphQLTranscript>> {
  const constraints = [
    intermineConstraint('Transcript.panGeneSets.id', '=', id),
  ];
  // all SequenceFeature-extending object queries must include these joins
  const joins = [
    intermineJoin('Transcript.chromosome', 'OUTER'),
    intermineJoin('Transcript.supercontig', 'OUTER'),
    intermineJoin('Transcript.chromosomeLocation', 'OUTER'),
    intermineJoin('Transcript.supercontigLocation', 'OUTER'),
    intermineJoin('Transcript.sequenceOntologyTerm', 'OUTER'),
  ];
  const query = interminePathQuery(
    intermineTranscriptAttributes,
    intermineTranscriptSort,
    constraints,
    joins,
  );
  // get the data
  return getTranscripts.call(this, query, {page, pageSize});
}

// Get Transcripts associated with a UTR
export async function getTranscriptsForUTR(
  id: number,
  {page, pageSize}: PaginationOptions,
): Promise<ApiResponse<GraphQLTranscript>> {
  const constraints = [intermineConstraint('Transcript.UTRs.id', '=', id)];
  // all SequenceFeature-extending object queries must include these joins
  const joins = [
    intermineJoin('Transcript.chromosome', 'OUTER'),
    intermineJoin('Transcript.supercontig', 'OUTER'),
    intermineJoin('Transcript.chromosomeLocation', 'OUTER'),
    intermineJoin('Transcript.supercontigLocation', 'OUTER'),
    intermineJoin('Transcript.sequenceOntologyTerm', 'OUTER'),
  ];
  const query = interminePathQuery(
    intermineTranscriptAttributes,
    intermineTranscriptSort,
    constraints,
    joins,
  );
  // get the data
  return getTranscripts.call(this, query, {page, pageSize});
}
