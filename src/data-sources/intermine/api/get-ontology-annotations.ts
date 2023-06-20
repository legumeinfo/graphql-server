import {
    ApiResponse,
    IntermineSummaryResponse,
    intermineConstraint,
    interminePathQuery,
    response2graphqlPageInfo,
} from '../intermine.server.js';
import {
    GraphQLAnnotatable,
    GraphQLOntologyAnnotation,
    IntermineOntologyAnnotationResponse,
    intermineOntologyAnnotationAttributes,
    intermineOntologyAnnotationSort,
    response2ontologyAnnotations,
} from '../models/index.js';
import { PaginationOptions } from './pagination.js';


export type GetOntologyAnnotationsOptions = {
    annotatable?: GraphQLAnnotatable;
} & PaginationOptions;


// get OntologyAnnotations for any type that extends Annotatable
export async function getOntologyAnnotations(
    {
        annotatable,
        start,
        size,
    }: GetOntologyAnnotationsOptions,
): Promise<ApiResponse<GraphQLOntologyAnnotation[]>> {
    const constraints = [];
    if (annotatable) {
        const constraint = intermineConstraint('OntologyAnnotation.subject.id', '=', annotatable.id);
        constraints.push(constraint);
    }
    const query = interminePathQuery(
        intermineOntologyAnnotationAttributes,
        intermineOntologyAnnotationSort,
        constraints,
    );
    // get the data
    const dataPromise = this.pathQuery(query, {start, size})
        .then((response: IntermineOntologyAnnotationResponse) => response2ontologyAnnotations(response));
    // get a summary of the data and convert it to page info
    const pageInfoPromise = this.pathQuery(query, {summaryPath: 'OntologyAnnotation.id'})
        .then((response: IntermineSummaryResponse) => response2graphqlPageInfo(response, start, size));
    // return the expected GraphQL type
    return Promise.all([dataPromise, pageInfoPromise])
        .then(([data, pageInfo]) => ({data, metadata: {pageInfo}}));
}
