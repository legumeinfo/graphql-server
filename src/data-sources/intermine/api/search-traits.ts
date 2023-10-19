import {
    ApiResponse,
    IntermineSummaryResponse,
    intermineConstraint,
    intermineNotNullConstraint,
    interminePathQuery,
    response2graphqlPageInfo,
} from '../intermine.server.js';
import {
    GraphQLTrait,
    IntermineTraitResponse,
    intermineTraitAttributes,
    intermineTraitSort,
    response2traits,
} from '../models/index.js';
import { PaginationOptions } from './pagination.js';


export type SearchTraitsOptions = {
    name?: string;
    genus?: string;
    species?: string;
    studyType?: string;
    publicationId: string;
    author?: string;
} & PaginationOptions;


// Path query search for Traits by name, genus, species, study type (GWAS or QTLStudy), publication DOI or PMID, and author.
// NOTE: Trait.description is typically empty, as it describes the methods used to measure the trait, which are often not available.
export async function searchTraits(
    {
        name,
        genus,
        species,
        studyType,
        publicationId,
        author,
        page,
        pageSize,
    }: SearchTraitsOptions,
): Promise<ApiResponse<GraphQLTrait[]>> {
    const constraints = [];
    if (name) {
        const constraint = intermineConstraint('Trait.name', 'CONTAINS', name);
        constraints.push(constraint);
    }
    if (genus) {
        // NEED TO IMPLEMENT OUTER JOIN
        // <query name="" model="genomic" view="Trait.primaryIdentifier" longDescription="" sortOrder="Trait.primaryIdentifier asc" constraintLogic="A and B">
        //   <join path="Trait.gwas" style="OUTER"/>
        //   <join path="Trait.qtlStudy" style="OUTER"/>
        //   <constraint path="Trait.qtlStudy.organism.genus" code="A" op="=" value="Phaseolus"/>
        //   <constraint path="Trait.gwas.organism.genus" code="B" op="=" value="Phaseolus"/>
        // </query>
    }
    if (species) {
        // NEED TO IMPLEMENT OUTER JOIN
        // <query name="" model="genomic" view="Trait.primaryIdentifier" longDescription="" sortOrder="Trait.primaryIdentifier asc" constraintLogic="A and B">
        //   <join path="Trait.qtls" style="OUTER"/>
        //   <join path="Trait.gwas" style="OUTER"/>
        //   <constraint path="Trait.gwas.organism.species" code="A" op="=" value="vulgaris"/>
        //   <constraint path="Trait.qtls.qtlStudy.organism.species" code="B" op="=" value="vulgaris"/>
        // </query>
    }
    if (studyType == "GWAS") {
        const constraint = intermineNotNullConstraint("Trait.gwas");
        constraints.push(constraint);
    }
    if (studyType == "QTLStudy") {
        const constraint = intermineNotNullConstraint("Trait.qtlStudy");
        constraints.push(constraint);
    }
    if (publicationId) {
        if (publicationId.includes('/')) {
            // DOI contains /, like 10.1007/s00122-006-0217-2
            const constraint = intermineConstraint('Trait.publications.doi', '=', publicationId);
            constraints.push(constraint);
        } else {
            // assume PMID
            const constraint = intermineConstraint('Trait.publications.pubMedId', '=', publicationId);
            constraints.push(constraint);
        }
    }
    if (author) {
        const constraint = intermineConstraint('Trait.publications.authors.name', 'CONTAINS', author);
        constraints.push(constraint);
    }
    const query = interminePathQuery(
        intermineTraitAttributes,
        intermineTraitSort,
        constraints,
    );
    // get the data
    const dataPromise = this.pathQuery(query, {page, pageSize})
        .then((response: IntermineTraitResponse) => response2traits(response));
    // get a summary of the data and convert it to page info
    const pageInfoPromise = this.pathQuery(query, {summaryPath: 'Trait.id'})
        .then((response: IntermineSummaryResponse) => response2graphqlPageInfo(response, page, pageSize));
    // return the expected GraphQL type
    return Promise.all([dataPromise, pageInfoPromise])
        .then(([data, pageInfo]) => ({data, metadata: {pageInfo}}));
}
