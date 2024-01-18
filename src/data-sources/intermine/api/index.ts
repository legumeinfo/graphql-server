import { IntermineServer } from '../intermine.server.js';

// annotatable
import { getAnnotatable } from './get-annotatable.js';
// author
import { getAuthor } from './get-author.js';
import { getAuthors } from './get-authors.js';
// bio-entity
import { getBioEntity } from './get-bio-entity.js';
import { getBioEntities } from './get-bio-entities.js';
// CDS
import { getCDS } from './get-cds.js';
import { getCDSs } from './get-cdss.js';
// chromosome
import { getChromosome } from './get-chromosome.js';
// chromosome location
import { getChromosomeLocation } from './get-chromosome-location.js';
// data set
import { getDataSet } from './get-data-set.js';
import { getDataSets } from './get-data-sets.js';
// data source
import { getDataSource } from './get-data-source.js';
// exon
import { getExon } from './get-exon.js';
import { getExons } from './get-exons.js';
// expression sample
import { getExpressionSample } from './get-expression-sample.js';
import { getExpressionSamples } from './get-expression-samples.js';
import { searchExpressionSamples } from './search-expression-samples.js';
// expression source
import { getExpressionSource } from './get-expression-source.js';
import { searchExpressionSources } from './search-expression-sources.js';
// expression value
import { getExpressionValue } from './get-expression-value.js';
import { searchExpressionValues } from './search-expression-values.js';
// genes
import { getGene } from './get-gene.js';
import { getGenes } from './get-genes.js';
import { searchGenes } from './search-genes.js';
// gene family
import { getGeneFamily } from './get-gene-family.js';
import { getGeneFamilies } from './get-gene-families.js';
import { searchGeneFamilies } from './search-gene-families.js';
// gene family assignment
import { getGeneFamilyAssignment } from './get-gene-family-assignment.js';
import { getGeneFamilyAssignments} from './get-gene-family-assignments.js';
// gene family tally
import { getGeneFamilyTally } from './get-gene-family-tally.js';
import { getGeneFamilyTallies } from './get-gene-family-tallies.js';
// gene flanking region
import { getGeneFlankingRegion } from './get-gene-flanking-region.js';
import { getGeneFlankingRegions } from './get-gene-flanking-regions.js';
// genetic map
import { getGeneticMap } from './get-genetic-map.js';
import { searchGeneticMaps } from './search-genetic-maps.js';
// genetic marker
import { getGeneticMarker } from './get-genetic-marker.js';
import { getGeneticMarkers } from './get-genetic-markers.js';
// genotyping platform
import { getGenotypingPlatform } from './get-genotyping-platform.js';
import { getGenotypingPlatforms } from './get-genotyping-platforms.js';
// gwas
import { getGWAS } from './get-gwas.js';
import { searchGWASes } from './search-gwases.js';
// gwas result
import { getGWASResult } from './get-gwas-result.js';
import { getGWASResults } from './get-gwas-results.js';
// intergenic region
import { getIntergenicRegion } from './get-intergenic-region.js';
import { getAdjacentGenes } from './get-adjacent-genes.js';
// intron
import { getIntron } from './get-intron.js';
import { getIntrons } from './get-introns.js';
// linkage group
import { getLinkageGroup } from './get-linkage-group.js';
import { getLinkageGroups } from './get-linkage-groups.js';
// linkage group position
import { getLinkageGroupPosition } from './get-linkage-group-position.js';
import { getLinkageGroupPositions } from './get-linkage-group-positions.js';
// location
import { getLocation } from './get-location.js';
import { getLocations } from './get-locations.js';
// locatedFeatures
import { getLocatedFeatures } from './get-located-features.js';
// mRNA
import { getMRNA } from './get-mrna.js';
// newick
import { getNewick } from './get-newick.js';
// ontology
import { getOntology } from './get-ontology.js';
// ontology annotation
import { getOntologyAnnotation } from './get-ontology-annotation.js';
import { getOntologyAnnotations } from './get-ontology-annotations.js';
import { getOntologyAnnotationDataSets } from './get-ontology-annotation-data-sets.js';
// ontology term
import { getOntologyTerm } from './get-ontology-term.js';
import { getOntologyTerms } from './get-ontology-terms.js';
import { getOntologyTermOntology } from './get-ontology-term-ontology.js';
import { getOntologyTermCrossReferences } from './get-ontology-term-cross-references.js';
import { getOntologyTermDataSets } from './get-ontology-term-data-sets.js';
import { getOntologyTermParents } from './get-ontology-term-parents.js';
import { getOntologyTermRelations } from './get-ontology-term-relations.js';
import { getOntologyTermSynonyms } from './get-ontology-term-synonyms.js';
import { searchOntologyTerms } from './search-ontology-terms.js';
// organism
import { getOrganism } from './get-organism.js';
import { searchOrganisms } from './search-organisms.js';
// overlapping features
import { getOverlappingFeatures } from './get-overlapping-features.js';
// pan gene set
import { getPanGeneSet } from './get-pan-gene-set.js';
import { getPanGeneSets } from './get-pan-gene-sets.js';
// pathway
import { getPathway } from './get-pathway.js';
import { getPathways } from './get-pathways.js';
// phylonode
import { getPhylonode } from './get-phylonode.js';
import { getPhylonodes } from './get-phylonodes.js';
// phylotree
import { getPhylotree } from './get-phylotree.js';
// protein
import { getProtein } from './get-protein.js';
import { getProteins } from './get-proteins.js';
import { searchProteins } from './search-proteins.js';
// protein domain
import { getProteinDomain } from './get-protein-domain.js';
import { getProteinDomains } from './get-protein-domains.js';
import { getProteinDomainChildFeatures } from './get-protein-domain-child-features.js';
import { getProteinDomainParentFeatures } from './get-protein-domain-parent-features.js';
import { searchProteinDomains } from './search-protein-domains.js';
// protein match
import { getProteinMatch } from './get-protein-match.js';
import { getProteinMatches } from './get-protein-matches.js';
// publication
import { getPublication } from './get-publication.js';
import { getPublications } from './get-publications.js';
import { searchPublications } from './search-publications.js';
// qtl
import { getQTL } from './get-qtl.js';
import { getQTLs } from './get-qtls.js';
import { getQTLGenes } from './get-qtl-genes.js';
import { searchQTLs } from './search-qtls.js';
// qtl study
import { getQTLStudy } from './get-qtl-study.js';
import { searchQTLStudies } from './search-qtl-studies.js';
// sequence
import { getSequence } from './get-sequence.js';
// sequence feature
import { getSequenceFeature } from './get-sequence-feature.js';
import { getSequenceFeatureChildFeatures } from './get-sequence-feature-child-features.js';
// SO term
import { getSOTerm } from './get-so-term.js';
import { getSOTermParents } from './get-so-term-parents.js';
// supercontig
import { getSupercontig } from './get-supercontig.js';
// supercontig location
import { getSupercontigLocation } from './get-supercontig-location.js';
// syntenic region
import { getSyntenicRegion } from './get-syntenic-region.js';
import { getSyntenicRegions } from './get-syntenic-regions.js';
// synteny block
import { getSyntenyBlock } from './get-synteny-block.js';
// strain
import { getStrain } from './get-strain.js';
import { getStrains } from './get-strains.js';
import { searchStrains } from './search-strains.js';
// trait
import { getTrait } from './get-trait.js';
import { searchTraits } from './search-traits.js';
// transcript
import { getTranscript } from './get-transcript.js';
import { getTranscripts } from './get-transcripts.js';
// utr
import { getUTR } from './get-utr.js';
import { getUTRs } from './get-utrs.js';
// mine web properties
import { getMineWebProperties } from './get-mine-web-properties.js';


// the constructor used to type constrain the super class
export type ApiBaseConstructor<T = IntermineServer> = new (...args: any[]) => T;


// the interface of the class generated by the mixin
export declare class ApiMixinInterface {
    verifyIntermineVersion: Function;
    // annotatable
    getAnnotatable: Function;
    // author
    getAuthor: Function;
    getAuthors: Function;
    // bio-entity
    getBioEntity: Function;
    getBioEntities: Function;
    // CDS
    getCDS: Function;
    getCDSs: Function;
    // chromosome
    getChromosome: Function;
    // chromosome location
    getChromosomeLocation: Function;
    // data set
    getDataSet: Function;
    getDataSets: Function;
    // data source
    getDataSource: Function;
    // exon
    getExon: Function;
    getExons: Function;
    // expression sample
    getExpressionSample: Function;
    getExpressionSamples: Function;
    searchExpressionSamples: Function;
    // expression source
    getExpressionSource: Function;
    searchExpressionSources: Function;
    // expression value
    getExpressionValue: Function;
    searchExpressionValues: Function;
    // genes
    getGene: Function;
    getGenes: Function;
    searchGenes: Function;
    // gene family
    getGeneFamily: Function;
    getGeneFamilies: Function;
    searchGeneFamilies: Function;
    // gene family assignment
    getGeneFamilyAssignment: Function;
    getGeneFamilyAssignments: Function;
    // gene family tally
    getGeneFamilyTally: Function;
    getGeneFamilyTallies: Function;
    // gene flanking region
    getGeneFlankingRegion: Function;
    getGeneFlankingRegions: Function;
    // genetic map
    getGeneticMap: Function;
    searchGeneticMaps: Function;
    // genetic marker
    getGeneticMarker: Function;
    getGeneticMarkers: Function;
    // genotyping platform
    getGenotypingPlatform: Function;
    getGenotypingPlatforms: Function;
    // gwas
    getGWAS: Function;
    searchGWASes: Function;
    // gwas result
    getGWASResult: Function;
    getGWASResults: Function;
    // intergenic region
    getIntergenicRegion: Function;
    getAdjacentGenes: Function;
    // intron
    getIntron: Function;
    getIntrons: Function;
    // linkage group
    getLinkageGroup: Function;
    getLinkageGroups: Function;
    // linkage group position
    getLinkageGroupPosition: Function;
    getLinkageGroupPositions: Function;
    // location
    getLocation: Function;
    getLocations: Function;
    // locatedFeatures
    getLocatedFeatures: Function;
    // mRNA
    getMRNA: Function;
    // newick
    getNewick: Function;
    // ontology
    getOntology: Function;
    // ontology annotation
    getOntologyAnnotation: Function;
    getOntologyAnnotations: Function;
    getOntologyAnnotationDataSets: Function;
    // ontology term
    getOntologyTerm: Function;
    getOntologyTerms: Function;
    getOntologyTermOntology: Function;
    getOntologyTermCrossReferences: Function;
    getOntologyTermDataSets: Function;
    getOntologyTermParents: Function;
    getOntologyTermRelations: Function;
    getOntologyTermSynonyms: Function;
    searchOntologyTerms: Function;
    // organism
    getOrganism: Function;
    searchOrganisms: Function;
    // overlapping features
    getOverlappingFeatures: Function;
    // pan-gene set
    getPanGeneSet: Function;
    getPanGeneSets: Function;
    // pathway
    getPathway: Function;
    getPathways: Function;
    // phylonode
    getPhylonode: Function;
    getPhylonodes: Function;
    // phylotree
    getPhylotree: Function;
    // protein
    getProtein: Function;
    getProteins: Function;
    searchProteins: Function;
    // protein domain
    getProteinDomain: Function;
    getProteinDomains: Function;
    getProteinDomainChildFeatures: Function;
    getProteinDomainParentFeatures: Function;
    searchProteinDomains: Function;
    // protein match
    getProteinMatch: Function;
    getProteinMatches: Function;
    // publication
    getPublication: Function;
    getPublications: Function;
    searchPublications: Function;
    // qtl
    getQTL: Function;
    getQTLs: Function;
    getQTLGenes: Function;
    searchQTLs: Function;
    // qtl study
    getQTLStudy: Function;
    searchQTLStudies: Function;
    // sequence
    getSequence: Function;
    // sequence feature
    getSequenceFeature: Function;
    getSequenceFeatureChildFeatures: Function;
    // SO term
    getSOTerm: Function;
    getSOTermParents: Function;
    // supercontig
    getSupercontig: Function;
    // supercontig location
    getSupercontigLocation: Function;
    // syntenic region
    getSyntenicRegion: Function;
    getSyntenicRegions: Function;
    // synteny block
    getSyntenyBlock: Function;
    // strain
    getStrain: Function;
    getStrains: Function;
    searchStrains: Function;
    // trait
    getTrait: Function;
    searchTraits: Function;
    // transcript
    getTranscript: Function;
    getTranscripts: Function;
    // UTR
    getUTR: Function;
    getUTRs: Function;
    // mine web properties
    getMineWebProperties: Function;
}


// a mixin that adds the API to the IntermineServer class
export const ApiMixin = <T extends ApiBaseConstructor<IntermineServer>>(superClass: T) => {

    class ApiMixinClass extends superClass {

        static intermineVersion = '5.1.0.4';

        // Verifies that the version of the IntermineServer is the version the API is expecting
        async verifyIntermineVersion() {
            const properties = await this.webProperties();
            const serverVersion = properties['web-properties'].project.releaseVersion;
            if (serverVersion != ApiMixinClass.intermineVersion) {
                console.warn(`data-sources: intermine: ${this.baseURL} has version ${serverVersion}; expected ${ApiMixinClass.intermineVersion}`);
            }
        }

        // annotatable
        getAnnotatable = getAnnotatable;
        // author
        getAuthor = getAuthor;
        getAuthors = getAuthors;
        // bio-entity
        getBioEntity = getBioEntity;
        getBioEntities = getBioEntities;
        // CDS
        getCDS = getCDS;
        getCDSs = getCDSs;
        // chromosome
        getChromosome = getChromosome;
        // chromosome location
        getChromosomeLocation = getChromosomeLocation;
        // data set
        getDataSet = getDataSet;
        getDataSets = getDataSets;
        // data source
        getDataSource = getDataSource;
        // exon
        getExon = getExon;
        getExons = getExons;
        // expression sample
        getExpressionSample = getExpressionSample;
        getExpressionSamples = getExpressionSamples;
        searchExpressionSamples = searchExpressionSamples;
        // expression source
        getExpressionSource = getExpressionSource;
        searchExpressionSources = searchExpressionSources;
        // expression value
        getExpressionValue = getExpressionValue;
        searchExpressionValues = searchExpressionValues;
        // genes
        getGene = getGene;
        getGenes = getGenes;
        searchGenes = searchGenes;
        // gene family
        getGeneFamily = getGeneFamily;
        getGeneFamilies = getGeneFamilies;
        searchGeneFamilies = searchGeneFamilies;
        // gene family assignment
        getGeneFamilyAssignment = getGeneFamilyAssignment;
        getGeneFamilyAssignments = getGeneFamilyAssignments;
        // gene family tally
        getGeneFamilyTally = getGeneFamilyTally;
        getGeneFamilyTallies = getGeneFamilyTallies;
        // gene flanking region
        getGeneFlankingRegion = getGeneFlankingRegion;
        getGeneFlankingRegions = getGeneFlankingRegions;
        // genetic map
        getGeneticMap = getGeneticMap;
        searchGeneticMaps = searchGeneticMaps;
        // genetic marker
        getGeneticMarker = getGeneticMarker;
        getGeneticMarkers = getGeneticMarkers;
        // genotyping platform
        getGenotypingPlatform = getGenotypingPlatform;
        getGenotypingPlatforms = getGenotypingPlatforms;
        // gwas
        getGWAS = getGWAS;
        searchGWASes = searchGWASes;
        // gwas result
        getGWASResult = getGWASResult;
        getGWASResults = getGWASResults;
        // intergenic-region
        getIntergenicRegion = getIntergenicRegion;
        getAdjacentGenes = getAdjacentGenes;
        // intron
        getIntron = getIntron;
        getIntrons = getIntrons;
        // linkage group
        getLinkageGroup = getLinkageGroup;
        getLinkageGroups = getLinkageGroups;
        // linkage group position
        getLinkageGroupPosition = getLinkageGroupPosition;
        getLinkageGroupPositions = getLinkageGroupPositions;
        // location
        getLocation = getLocation;
        getLocations = getLocations;
        // locatedFeatures
        getLocatedFeatures = getLocatedFeatures;
        // mRNA
        getMRNA = getMRNA;
        // newick
        getNewick = getNewick;
        // ontology
        getOntology = getOntology;
        // ontology annotation
        getOntologyAnnotation = getOntologyAnnotation;
        getOntologyAnnotations = getOntologyAnnotations;
        getOntologyAnnotationDataSets = getOntologyAnnotationDataSets;
        // ontology term
        getOntologyTerm = getOntologyTerm;
        getOntologyTerms = getOntologyTerms;
        getOntologyTermOntology = getOntologyTermOntology;
        getOntologyTermCrossReferences = getOntologyTermCrossReferences;
        getOntologyTermDataSets = getOntologyTermDataSets;
        getOntologyTermParents = getOntologyTermParents;
        getOntologyTermRelations = getOntologyTermRelations;
        getOntologyTermSynonyms = getOntologyTermSynonyms;
        searchOntologyTerms = searchOntologyTerms;
        // organism
        getOrganism = getOrganism;
        searchOrganisms = searchOrganisms;
        // overlapping features
        getOverlappingFeatures = getOverlappingFeatures;
        // pan-gene set
        getPanGeneSet = getPanGeneSet;
        getPanGeneSets = getPanGeneSets;
        // pathway
        getPathway = getPathway;
        getPathways = getPathways;
        // phylonode
        getPhylonode = getPhylonode;
        getPhylonodes = getPhylonodes;
        // phylotree
        getPhylotree = getPhylotree;
        // protein
        getProtein = getProtein;
        getProteins = getProteins;
        searchProteins = searchProteins;
        // protein domain
        getProteinDomain = getProteinDomain;
        getProteinDomains = getProteinDomains;
        getProteinDomainChildFeatures = getProteinDomainChildFeatures;
        getProteinDomainParentFeatures = getProteinDomainParentFeatures;
        searchProteinDomains = searchProteinDomains;
        // protein match
        getProteinMatch = getProteinMatch;
        getProteinMatches = getProteinMatches;
        // publication
        getPublication = getPublication;
        getPublications = getPublications;
        searchPublications = searchPublications;
        // qtl
        getQTL = getQTL;
        getQTLs = getQTLs;
        getQTLGenes = getQTLGenes;
        searchQTLs = searchQTLs;
        // qtl study
        getQTLStudy = getQTLStudy;
        searchQTLStudies = searchQTLStudies;
        // sequence
        getSequence = getSequence;
        // sequence feature
        getSequenceFeature = getSequenceFeature;
        getSequenceFeatureChildFeatures = getSequenceFeatureChildFeatures;
        // SO term
        getSOTerm = getSOTerm;
        getSOTermParents = getSOTermParents;
        // supercontig
        getSupercontig = getSupercontig;
        // supercontig location
        getSupercontigLocation = getSupercontigLocation;
        // syntenic region
        getSyntenicRegion = getSyntenicRegion;
        getSyntenicRegions = getSyntenicRegions;
        // synteny block
        getSyntenyBlock = getSyntenyBlock;
        // strain
        getStrain = getStrain;
        getStrains = getStrains;
        searchStrains = searchStrains;
        // trait
        getTrait = getTrait;
        searchTraits = searchTraits;
        // transcript
        getTranscript = getTranscript;
        getTranscripts = getTranscripts;
        // UTR
        getUTR = getUTR;
        getUTRs = getUTRs;
        // mine web properties
        getMineWebProperties = getMineWebProperties;
    }

    // cast return type to mixin's interface intersected with the superClass type
    // necessary because TypeScript can't infer mixed-in types...
    return ApiMixinClass as ApiBaseConstructor<ApiMixinInterface> & T;

};
