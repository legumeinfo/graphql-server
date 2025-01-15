import {
    ApiResponse,
    IntermineCountResponse,
    intermineConstraint,
    interminePathQuery,
    countResponse2graphqlPageInfo,
} from '../intermine.server.js';
import {
    GraphQLOntologyAnnotation,
    IntermineOntologyAnnotationResponse,
    intermineOntologyAnnotationAttributes,
    intermineOntologyAnnotationSort,
    response2ontologyAnnotations,
} from '../models/index.js';
import { PaginationOptions } from './pagination.js';

// get OntologyAnnotatoins using the given query and returns the expected GraphQL types
async function getOntologyAnnotations(pathQuery: string, { page, pageSize }: PaginationOptions): Promise<ApiResponse<GraphQLOntologyAnnotation>> {
    // get the data
    const dataPromise = this.pathQuery(pathQuery, {page, pageSize})
        .then((response: IntermineOntologyAnnotationResponse) => response2ontologyAnnotations(response));
    // get a summary of the data and convert it to page info
    const pageInfoPromise = this.pathQueryCount(pathQuery)
        .then((response: IntermineCountResponse) => countResponse2graphqlPageInfo(response, page, pageSize));
    // return the expected GraphQL type
    return Promise.all([dataPromise, pageInfoPromise])
        .then(([data, pageInfo]) => ({data, metadata: {pageInfo}}));
}

// get OntologyAnnotations for an Annotatable, given its id
export async function getOntologyAnnotationsForAnnotatable(id: number, { page, pageSize }: PaginationOptions): Promise<ApiResponse<GraphQLOntologyAnnotation>> {
    const constraints = [intermineConstraint('OntologyAnnotation.subject.id', '=', id)];
    const query = interminePathQuery(
        intermineOntologyAnnotationAttributes,
        intermineOntologyAnnotationSort,
        constraints,
    );
    return getOntologyAnnotations.call(this, query, {page, pageSize});
}

// get OntologyAnnotations for an OntologyTerm, given its id
export async function getOntologyAnnotationsForOntologyTerm(id: number, { page, pageSize }: PaginationOptions): Promise<ApiResponse<GraphQLOntologyAnnotation>> {
    const constraints = [intermineConstraint('OntologyAnnotation.ontologyTerm.id', '=', id)];
    const query = interminePathQuery(
        intermineOntologyAnnotationAttributes,
        intermineOntologyAnnotationSort,
        constraints,
    );
    return getOntologyAnnotations.call(this, query, {page, pageSize});
}
