import {
    ApiResponse,
    IntermineSummaryResponse,
    intermineConstraint,
    intermineOneOfConstraint,
    interminePathQuery,
    response2graphqlPageInfo,
} from '../intermine.server.js';
import {
    GraphQLGene,
    IntermineGeneResponse,
    intermineGeneAttributes,
    intermineGeneSort,
    response2genes,
} from '../models/index.js';
import { PaginationOptions } from './pagination.js';

// genus, species, strain, assemblyVersion, annotationVersion, identifiers, page, pageSize
// all parameters are required!
export type GetPanGenesOfGenesOptions = {
    genus: string;
    species: string;
    strain: string;
    assemblyVersion: string;
    annotationVersion: string;
    identifiers: Array<string>;
} & PaginationOptions;

// <query name="" model="genomic" view="Gene.primaryIdentifier Gene.name Gene.description Gene.strain.identifier Gene.panGeneSets.genes.primaryIdentifier" longDescription="" sortOrder="Gene.primaryIdentifier asc" constraintLogic="A and B and C and D and E">
//   <constraint path="Gene.panGeneSets.genes.primaryIdentifier" code="A" op="ONE OF">
//     <value>glyma.Lee.gnm2.ann1.Gm_00467</value>
//     <value>glyma.Lee.gnm2.ann1.Gm_06449</value>
//     <value>glyma.Lee.gnm2.ann1.Gm_16589</value>
//   </constraint>
//   <constraint path="Gene.organism.abbreviation" code="B" op="=" value="glyma"/>
//   <constraint path="Gene.strain.identifier" code="E" op="=" value="Wm82"/>
//   <constraint path="Gene.annotationVersion" code="C" op="=" value="ann1"/>
//   <constraint path="Gene.assemblyVersion" code="D" op="=" value="gnm4"/>
// </query>
    
// get Genes associated with a Protein, GeneFamily, PanGeneSet, ProteinDomain
// all values are required!
export async function getPanGenesOfGenes(
    {
        genus,
        species,
        strain,
        assemblyVersion,
        annotationVersion,
        identifiers,
        page,
        pageSize,
    }: GetPanGenesOfGenesOptions,
): Promise<ApiResponse<GraphQLGene[]>> {
    const constraints = [];
    const genusConstraint = intermineConstraint('Gene.organism.genus', '=', genus, 'A');
    const speciesConstraint = intermineConstraint('Gene.organism.species', '=', species, 'B');
    const strainConstraint = intermineConstraint('Gene.strain.identifier', '=', strain, 'C');
    const assemblyVersionConstraint = intermineConstraint('Gene.assemblyVersion', '=', assemblyVersion, 'D');
    const annotationVersionConstraint = intermineConstraint('Gene.annotationVersion', '=', annotationVersion, 'E');
    const identifiersConstraint = intermineOneOfConstraint('Gene.panGeneSets.genes.primaryIdentifier', identifiers, 'F');
    constraints.push(genusConstraint);
    constraints.push(speciesConstraint);
    constraints.push(strainConstraint);
    constraints.push(assemblyVersionConstraint);
    constraints.push(annotationVersionConstraint);
    constraints.push(identifiersConstraint);
    const query = interminePathQuery(
        intermineGeneAttributes,
        intermineGeneSort,
        constraints,
    );
    // get the data
    const dataPromise = this.pathQuery(query, {page, pageSize})
        .then((response: IntermineGeneResponse) => response2genes(response));
    // get a summary of the data and convert it to page info
    const pageInfoPromise = this.pathQuery(query, {summaryPath: 'Gene.id'})
        .then((response: IntermineSummaryResponse) => response2graphqlPageInfo(response, page, pageSize));
    // return the expected GraphQL type
    return Promise.all([dataPromise, pageInfoPromise])
        .then(([data, pageInfo]) => ({data, metadata: {pageInfo}}));
}
