import {
  ApiResponse,
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

// get a Transcript by identifier
export async function getTranscript(
  identifier: string,
): Promise<ApiResponse<GraphQLTranscript>> {
  const constraints = [
    intermineConstraint('Transcript.primaryIdentifier', '=', identifier),
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
  return this.pathQuery(query)
    .then((response: IntermineTranscriptResponse) =>
      response2transcripts(response),
    )
    .then((transcripts: Array<GraphQLTranscript>) => {
      if (!transcripts.length) return null;
      return transcripts[0];
    })
    .then((transcript: GraphQLTranscript) => ({data: transcript}));
}
