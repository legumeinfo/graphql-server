import {
    ApiResponse,
    IntermineCountResponse,
    intermineConstraint,
    interminePathQuery,
    countResponse2graphqlPageInfo,
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
        page,
        pageSize,
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
    const dataPromise = this.pathQuery(query, {page, pageSize})
        .then((response: IntermineOntologyAnnotationResponse) => response2ontologyAnnotations(response));
    // get a summary of the data and convert it to page info
    const pageInfoPromise = this.pathQueryCount(query)
        .then((response: IntermineCountResponse) => countResponse2graphqlPageInfo(response, page, pageSize));
    // return the expected GraphQL type
    return Promise.all([dataPromise, pageInfoPromise])
        .then(([data, pageInfo]) => ({data, metadata: {pageInfo}}));
}
