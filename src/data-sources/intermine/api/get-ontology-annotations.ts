import {
    ApiResponse,
    IntermineSummaryResponse,
    intermineConstraint,
    interminePathQuery,
    response2graphqlPageInfo,
} from '../intermine.server.js';
import {
    // GraphQLOntologyTerm,
    GraphQLOntologyAnnotation,
    IntermineOntologyAnnotationResponse,
    intermineOntologyAnnotationAttributes,
    intermineOntologyAnnotationSort,
    response2ontologyAnnotations,
} from '../models/index.js';
import { PaginationOptions } from './pagination.js';

export type GetOntologyAnnotationsOptions = {
    primaryIdentifier?: string;
    // ontologyTerm?: GraphQLOntologyTerm;
} & PaginationOptions;

// get OntologyAnnotations for an Annotatable, given its primaryIdentifier
export async function getOntologyAnnotations(
    {
        primaryIdentifier,
        // ontologyTerm,
        page,
        pageSize,
    }: GetOntologyAnnotationsOptions,
): Promise<ApiResponse<GraphQLOntologyAnnotation[]>> {
    const constraints = [intermineConstraint('OntologyAnnotation.subject.primaryIdentifier', '=', primaryIdentifier)];
    // if (ontologyTerm) {
    //     constraints.push(intermineConstraint('OntologyAnnotation.ontologyTerm.id', '=', ontologyTerm.id));
    // }
    const query = interminePathQuery(
        intermineOntologyAnnotationAttributes,
        intermineOntologyAnnotationSort,
        constraints,
    );
    // get the data
    const dataPromise = this.pathQuery(query, {page, pageSize})
        .then((response: IntermineOntologyAnnotationResponse) => response2ontologyAnnotations(response));
    // get a summary of the data and convert it to page info
    const pageInfoPromise = this.pathQuery(query, {summaryPath: 'OntologyAnnotation.id'})
        .then((response: IntermineSummaryResponse) => response2graphqlPageInfo(response, page, pageSize));
    // return the expected GraphQL type
    return Promise.all([dataPromise, pageInfoPromise])
        .then(([data, pageInfo]) => ({data, metadata: {pageInfo}}));
}
