import { intermineConstraint, interminePathQuery } from '../intermine.server.js';
import {
    GraphQLQTLStudy,
    IntermineQTLStudyResponse,
    intermineQTLStudyAttributes,
    intermineQTLStudySort,
    response2qtlStudies,
} from '../models/index.js';
import { PaginationOptions } from './pagination.js';


export type SearchQTLStudiesOptions = {
    description?: string;
} & PaginationOptions;


// path query search for QTLStudies by description
export async function searchQTLStudies(
    {
        description,
        start,
        size,
    }: SearchQTLStudiesOptions,
): Promise<GraphQLQTLStudy[]> {
    const constraints = [];
    if (description) {
        const descriptionConstraint = intermineConstraint('QTLStudy.description', 'CONTAINS', description);
        constraints.push(descriptionConstraint);
    }
    const query = interminePathQuery(
        intermineQTLStudyAttributes,
        intermineQTLStudySort,
        constraints,
    );
    const options = {start, size};
    return this.pathQuery(query, options)
        .then((response: IntermineQTLStudyResponse) => response2qtlStudies(response));
}
