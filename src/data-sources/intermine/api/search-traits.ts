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

// TODO: resolve the case where a genus or species is given but NOT the studyType.
// The SQL way of doing that is something like this:
// (SELECT trait.primaryidentifier FROM trait,qtlstudy,organism WHERE trait.qtlstudyid=qtlstudy.id AND qtlstudy.organismid=organism.id AND organism.genus='Vigna')
// UNION
// (SELECT trait.primaryidentifier FROM trait,gwas,organism WHERE trait.gwasid=gwas.id AND gwas.organismid=organism.id AND organism.genus='Vigna')
// ORDER BY trait.primaryidentifier;

// Path query search for Traits by name, genus, species, study type (GWAS or QTLStudy), publication (DOI or PMID), and author.
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
    if (studyType == "GWAS") {
        // any GWAS trait
        const constraint = intermineNotNullConstraint("Trait.gwas");
        constraints.push(constraint);
        if (species) {
            // narrow to given species
            const constraint = intermineConstraint('Trait.gwas.organism.species', '=', species);
            constraints.push(constraint);
        }
        if (genus) {
            // narrow to given genus
            const constraint = intermineConstraint('Trait.gwas.organism.genus', '=', genus);
            constraints.push(constraint);
        }
    }
    if (studyType == "QTLStudy") {
        // any QTLStudy trait
        const constraint = intermineNotNullConstraint("Trait.qtlStudy");
        constraints.push(constraint);
        if (species) {
            // narrow to given species
            const constraint = intermineConstraint('Trait.qtlStudy.organism.species', '=', species);
            constraints.push(constraint);
        }
        if (genus) {
            // narrow to given genus
            const constraint = intermineConstraint('Trait.qtlStudy.organism.genus', '=', genus);
            constraints.push(constraint);
        }
    }
    if (publicationId) {
        if (publicationId.includes('/')) {
            // DOI contains /, like 10.1007/s00122-006-0217-2
            const constraint = intermineConstraint('Trait.publications.doi', '=', publicationId);
            constraints.push(constraint);
        } else {
            // assume PMID if not DOI
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
