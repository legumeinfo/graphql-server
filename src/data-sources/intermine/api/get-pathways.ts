import { intermineConstraint, interminePathQuery } from '../intermine.server.js';
import {
  GraphQLGene,
  GraphQLPathway,
  InterminePathwayResponse,
  interminePathwayAttributes,
  interminePathwaySort,
  response2pathways,
} from '../models/index.js';
import { PaginationOptions, defaultPaginationOptions } from './pagination.js';


export type GetPathwaysOptions = {
  gene?: GraphQLGene;
} & PaginationOptions;


// get Pathways associated with a Gene
export async function getPathways(
  {
    gene,
    start=defaultPaginationOptions.start,
    size=defaultPaginationOptions.size,
  }: GetPathwaysOptions,
): Promise<GraphQLPathway[]> {
    const constraints = [];
    if (gene) {
        const constraint = intermineConstraint('Pathway.genes.id', '=', gene.id);
        constraints.push(constraint);
    }
    const query = interminePathQuery(
        interminePathwayAttributes,
        interminePathwaySort,
        constraints,
    );
    const options = {start, size};
    return this.pathQuery(query, options)
        .then((response: InterminePathwayResponse) => response2pathways(response));
}
