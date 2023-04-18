import { intermineConstraint, interminePathQuery } from '../intermine.server.js';
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
): Promise<GraphQLOntologyAnnotation[]> {
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
    const options = {start, size};
    return this.pathQuery(query, options)
        .then((response: IntermineOntologyAnnotationResponse) => response2ontologyAnnotations(response));
}
