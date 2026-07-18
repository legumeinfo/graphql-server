-- GlycineMine SqliteAPI subset schema (auto-generated from pg_dump)
-- includes synonym (LOOKUP) + soterm (SO term identifiers).
-- Reference `.id` endpoints use FK columns, so location/sequence tables are NOT required
-- unless a ported function selects a non-id attribute of them.
-- 47 class tables + 30 indirection tables = 77 tables
PRAGMA foreign_keys=OFF;

CREATE TABLE author (
  firstname TEXT,
  initials TEXT,
  lastname TEXT,
  id INTEGER PRIMARY KEY,
  name TEXT,
  class TEXT
);

CREATE TABLE cds (
  score REAL,
  scoretype TEXT,
  description TEXT,
  id INTEGER PRIMARY KEY,
  symbol TEXT,
  length INTEGER,
  name TEXT,
  assemblyversion TEXT,
  annotationversion TEXT,
  isprimary INTEGER,
  secondaryidentifier TEXT,
  primaryidentifier TEXT,
  sequenceontologytermid INTEGER,
  supercontiglocationid INTEGER,
  organismid INTEGER,
  chromosomelocationid INTEGER,
  supercontigid INTEGER,
  sequenceid INTEGER,
  chromosomeid INTEGER,
  transcriptid INTEGER,
  strainid INTEGER,
  class TEXT
);

CREATE TABLE chromosome (
  score REAL,
  scoretype TEXT,
  description TEXT,
  id INTEGER PRIMARY KEY,
  symbol TEXT,
  length INTEGER,
  name TEXT,
  assemblyversion TEXT,
  annotationversion TEXT,
  secondaryidentifier TEXT,
  primaryidentifier TEXT,
  sequenceontologytermid INTEGER,
  supercontiglocationid INTEGER,
  organismid INTEGER,
  chromosomelocationid INTEGER,
  supercontigid INTEGER,
  sequenceid INTEGER,
  chromosomeid INTEGER,
  strainid INTEGER,
  class TEXT
);

CREATE TABLE dataset (
  description TEXT,
  licence TEXT,
  id INTEGER PRIMARY KEY,
  url TEXT,
  name TEXT,
  version TEXT,
  synopsis TEXT,
  datasourceid INTEGER,
  publicationid INTEGER,
  class TEXT
);

CREATE TABLE datasource (
  description TEXT,
  id INTEGER PRIMARY KEY,
  url TEXT,
  name TEXT,
  class TEXT
);

CREATE TABLE exon (
  score REAL,
  scoretype TEXT,
  description TEXT,
  id INTEGER PRIMARY KEY,
  symbol TEXT,
  length INTEGER,
  name TEXT,
  assemblyversion TEXT,
  annotationversion TEXT,
  secondaryidentifier TEXT,
  primaryidentifier TEXT,
  sequenceontologytermid INTEGER,
  supercontiglocationid INTEGER,
  organismid INTEGER,
  chromosomelocationid INTEGER,
  supercontigid INTEGER,
  sequenceid INTEGER,
  chromosomeid INTEGER,
  strainid INTEGER,
  class TEXT
);

CREATE TABLE expressionsample (
  num INTEGER,
  description TEXT,
  replicategroup TEXT,
  id INTEGER PRIMARY KEY,
  biosample TEXT,
  sraexperiment TEXT,
  name TEXT,
  primaryidentifier TEXT,
  tissue TEXT,
  treatment TEXT,
  species TEXT,
  genotype TEXT,
  developmentstage TEXT,
  sourceid INTEGER,
  class TEXT
);

CREATE TABLE expressionsource (
  sra TEXT,
  description TEXT,
  id INTEGER PRIMARY KEY,
  bioproject TEXT,
  unit TEXT,
  geoseries TEXT,
  primaryidentifier TEXT,
  synopsis TEXT,
  organismid INTEGER,
  strainid INTEGER,
  class TEXT
);

CREATE TABLE gene (
  briefdescription TEXT,
  scoretype TEXT,
  description TEXT,
  id INTEGER PRIMARY KEY,
  length INTEGER,
  name TEXT,
  primaryidentifier TEXT,
  ensemblname TEXT,
  score REAL,
  symbol TEXT,
  assemblyversion TEXT,
  annotationversion TEXT,
  secondaryidentifier TEXT,
  upstreamintergenicregionid INTEGER,
  downstreamintergenicregionid INTEGER,
  sequenceontologytermid INTEGER,
  supercontiglocationid INTEGER,
  organismid INTEGER,
  chromosomelocationid INTEGER,
  supercontigid INTEGER,
  sequenceid INTEGER,
  chromosomeid INTEGER,
  strainid INTEGER,
  class TEXT
);

CREATE TABLE genefamily (
  description TEXT,
  id INTEGER PRIMARY KEY,
  version TEXT,
  intermine_size INTEGER,
  primaryidentifier TEXT,
  phylotreeid INTEGER,
  class TEXT
);

CREATE TABLE genefamilyassignment (
  bestdomainscore REAL,
  score REAL,
  evalue REAL,
  id INTEGER PRIMARY KEY,
  proteinid INTEGER,
  geneid INTEGER,
  genefamilyid INTEGER,
  class TEXT
);

CREATE TABLE genefamilytally (
  id INTEGER PRIMARY KEY,
  averagecount REAL,
  totalcount INTEGER,
  numannotations INTEGER,
  organismid INTEGER,
  genefamilyid INTEGER,
  class TEXT
);

CREATE TABLE geneflankingregion (
  scoretype TEXT,
  description TEXT,
  id INTEGER PRIMARY KEY,
  length INTEGER,
  name TEXT,
  distance TEXT,
  primaryidentifier TEXT,
  score REAL,
  direction TEXT,
  symbol TEXT,
  assemblyversion TEXT,
  annotationversion TEXT,
  includegene INTEGER,
  secondaryidentifier TEXT,
  geneid INTEGER,
  sequenceontologytermid INTEGER,
  supercontiglocationid INTEGER,
  organismid INTEGER,
  chromosomelocationid INTEGER,
  supercontigid INTEGER,
  sequenceid INTEGER,
  chromosomeid INTEGER,
  strainid INTEGER,
  class TEXT
);

CREATE TABLE genefunction (
  symbollong TEXT,
  classicallocus TEXT,
  id INTEGER PRIMARY KEY,
  symbol TEXT,
  curators TEXT,
  confidence INTEGER,
  primaryidentifier TEXT,
  pubname TEXT,
  synopsis TEXT,
  class TEXT
);

CREATE TABLE geneticmap (
  description TEXT,
  id INTEGER PRIMARY KEY,
  genotypes TEXT,
  genotypingmethod TEXT,
  primaryidentifier TEXT,
  synopsis TEXT,
  genotypingplatformid INTEGER,
  organismid INTEGER,
  class TEXT
);

CREATE TABLE geneticmarker (
  motif TEXT,
  intermine_alias TEXT,
  scoretype TEXT,
  description TEXT,
  id INTEGER PRIMARY KEY,
  type TEXT,
  length INTEGER,
  name TEXT,
  alleles TEXT,
  primaryidentifier TEXT,
  score REAL,
  symbol TEXT,
  assemblyversion TEXT,
  annotationversion TEXT,
  secondaryidentifier TEXT,
  sequenceontologytermid INTEGER,
  supercontiglocationid INTEGER,
  organismid INTEGER,
  chromosomelocationid INTEGER,
  supercontigid INTEGER,
  sequenceid INTEGER,
  chromosomeid INTEGER,
  strainid INTEGER,
  class TEXT
);

CREATE TABLE genotypingplatform (
  id INTEGER PRIMARY KEY,
  primaryidentifier TEXT,
  class TEXT
);

CREATE TABLE gwas (
  description TEXT,
  id INTEGER PRIMARY KEY,
  genotypes TEXT,
  genotypingmethod TEXT,
  primaryidentifier TEXT,
  synopsis TEXT,
  genotypingplatformid INTEGER,
  organismid INTEGER,
  class TEXT
);

CREATE TABLE gwasresult (
  id INTEGER PRIMARY KEY,
  pvalue REAL,
  primaryidentifier TEXT,
  markername TEXT,
  gwasid INTEGER,
  traitid INTEGER,
  class TEXT
);

CREATE TABLE intergenicregion (
  score REAL,
  scoretype TEXT,
  description TEXT,
  id INTEGER PRIMARY KEY,
  symbol TEXT,
  length INTEGER,
  name TEXT,
  assemblyversion TEXT,
  annotationversion TEXT,
  secondaryidentifier TEXT,
  primaryidentifier TEXT,
  sequenceontologytermid INTEGER,
  supercontiglocationid INTEGER,
  organismid INTEGER,
  chromosomelocationid INTEGER,
  supercontigid INTEGER,
  sequenceid INTEGER,
  chromosomeid INTEGER,
  strainid INTEGER,
  class TEXT
);

CREATE TABLE intron (
  score REAL,
  scoretype TEXT,
  description TEXT,
  id INTEGER PRIMARY KEY,
  symbol TEXT,
  length INTEGER,
  name TEXT,
  assemblyversion TEXT,
  annotationversion TEXT,
  secondaryidentifier TEXT,
  primaryidentifier TEXT,
  sequenceontologytermid INTEGER,
  supercontiglocationid INTEGER,
  organismid INTEGER,
  chromosomelocationid INTEGER,
  supercontigid INTEGER,
  sequenceid INTEGER,
  chromosomeid INTEGER,
  strainid INTEGER,
  class TEXT
);

CREATE TABLE linkagegroup (
  id INTEGER PRIMARY KEY,
  name TEXT,
  length REAL,
  primaryidentifier TEXT,
  number INTEGER,
  geneticmapid INTEGER,
  class TEXT
);

CREATE TABLE linkagegroupposition (
  id INTEGER PRIMARY KEY,
  intermine_position REAL,
  markername TEXT,
  linkagegroupid INTEGER,
  class TEXT
);

CREATE TABLE mrna (
  score REAL,
  scoretype TEXT,
  description TEXT,
  id INTEGER PRIMARY KEY,
  symbol TEXT,
  length INTEGER,
  name TEXT,
  assemblyversion TEXT,
  annotationversion TEXT,
  isprimary INTEGER,
  secondaryidentifier TEXT,
  primaryidentifier TEXT,
  geneid INTEGER,
  sequenceontologytermid INTEGER,
  supercontiglocationid INTEGER,
  organismid INTEGER,
  chromosomelocationid INTEGER,
  supercontigid INTEGER,
  sequenceid INTEGER,
  chromosomeid INTEGER,
  proteinid INTEGER,
  strainid INTEGER,
  class TEXT
);

CREATE TABLE ontology (
  id INTEGER PRIMARY KEY,
  url TEXT,
  name TEXT,
  class TEXT
);

CREATE TABLE ontologyannotation (
  id INTEGER PRIMARY KEY,
  qualifier TEXT,
  subjectid INTEGER,
  ontologytermid INTEGER,
  class TEXT
);

CREATE TABLE ontologyrelation (
  id INTEGER PRIMARY KEY,
  redundant INTEGER,
  direct INTEGER,
  relationship TEXT,
  parenttermid INTEGER,
  childtermid INTEGER,
  class TEXT
);

CREATE TABLE ontologyterm (
  identifier TEXT,
  description TEXT,
  id INTEGER PRIMARY KEY,
  obsolete INTEGER,
  name TEXT,
  namespace TEXT,
  ontologyid INTEGER,
  class TEXT
);

CREATE TABLE ontologytermsynonym (
  id INTEGER PRIMARY KEY,
  type TEXT,
  name TEXT,
  class TEXT
);

CREATE TABLE organism (
  abbreviation TEXT,
  description TEXT,
  id INTEGER PRIMARY KEY,
  species TEXT,
  genus TEXT,
  taxonid TEXT,
  name TEXT,
  commonname TEXT,
  shortname TEXT,
  class TEXT
);

CREATE TABLE pangeneset (
  id INTEGER PRIMARY KEY,
  primaryidentifier TEXT,
  class TEXT
);

CREATE TABLE pathway (
  id INTEGER PRIMARY KEY,
  name TEXT,
  primaryidentifier TEXT,
  class TEXT
);

CREATE TABLE phylonode (
  identifier TEXT,
  id INTEGER PRIMARY KEY,
  isroot INTEGER,
  length REAL,
  numchildren INTEGER,
  isleaf INTEGER,
  proteinid INTEGER,
  treeid INTEGER,
  parentid INTEGER,
  class TEXT
);

CREATE TABLE phylotree (
  id INTEGER PRIMARY KEY,
  numleaves INTEGER,
  primaryidentifier TEXT,
  genefamilyid INTEGER,
  class TEXT
);

CREATE TABLE protein (
  primaryaccession TEXT,
  description TEXT,
  id INTEGER PRIMARY KEY,
  length INTEGER,
  name TEXT,
  primaryidentifier TEXT,
  md5checksum TEXT,
  molecularweight REAL,
  symbol TEXT,
  assemblyversion TEXT,
  annotationversion TEXT,
  isprimary INTEGER,
  secondaryidentifier TEXT,
  phylonodeid INTEGER,
  transcriptid INTEGER,
  organismid INTEGER,
  sequenceid INTEGER,
  strainid INTEGER,
  class TEXT
);

CREATE TABLE proteindomain (
  description TEXT,
  id INTEGER PRIMARY KEY,
  type TEXT,
  name TEXT,
  primaryidentifier TEXT,
  shortname TEXT,
  class TEXT
);

CREATE TABLE proteinmatch (
  description TEXT,
  id INTEGER PRIMARY KEY,
  status TEXT,
  length INTEGER,
  name TEXT,
  intermine_date TEXT,
  primaryidentifier TEXT,
  accession TEXT,
  source TEXT,
  signaturedesc TEXT,
  symbol TEXT,
  target TEXT,
  assemblyversion TEXT,
  annotationversion TEXT,
  secondaryidentifier TEXT,
  proteinid INTEGER,
  organismid INTEGER,
  strainid INTEGER,
  class TEXT
);

CREATE TABLE publication (
  intermine_year INTEGER,
  citation TEXT,
  issue TEXT,
  id INTEGER PRIMARY KEY,
  title TEXT,
  doi TEXT,
  volume TEXT,
  journal TEXT,
  firstauthor TEXT,
  intermine_month TEXT,
  abstracttext TEXT,
  pages TEXT,
  pubmedid TEXT,
  class TEXT
);

CREATE TABLE qtl (
  lod REAL,
  likelihoodratio REAL,
  intermine_end REAL,
  id INTEGER PRIMARY KEY,
  markernames TEXT,
  name TEXT,
  markerr2 REAL,
  intermine_start REAL,
  primaryidentifier TEXT,
  peak REAL,
  traitid INTEGER,
  qtlstudyid INTEGER,
  linkagegroupid INTEGER,
  class TEXT
);

CREATE TABLE qtlstudy (
  description TEXT,
  id INTEGER PRIMARY KEY,
  genotypes TEXT,
  primaryidentifier TEXT,
  synopsis TEXT,
  organismid INTEGER,
  class TEXT
);

CREATE TABLE strain (
  identifier TEXT,
  description TEXT,
  id INTEGER PRIMARY KEY,
  name TEXT,
  origin TEXT,
  accession TEXT,
  organismid INTEGER,
  class TEXT
);

CREATE TABLE supercontig (
  score REAL,
  scoretype TEXT,
  description TEXT,
  id INTEGER PRIMARY KEY,
  symbol TEXT,
  length INTEGER,
  name TEXT,
  assemblyversion TEXT,
  annotationversion TEXT,
  secondaryidentifier TEXT,
  primaryidentifier TEXT,
  sequenceontologytermid INTEGER,
  supercontiglocationid INTEGER,
  organismid INTEGER,
  chromosomelocationid INTEGER,
  supercontigid INTEGER,
  sequenceid INTEGER,
  chromosomeid INTEGER,
  strainid INTEGER,
  class TEXT
);

CREATE TABLE trait (
  description TEXT,
  id INTEGER PRIMARY KEY,
  name TEXT,
  primaryidentifier TEXT,
  organismid INTEGER,
  gwasid INTEGER,
  qtlstudyid INTEGER,
  class TEXT
);

CREATE TABLE transcript (
  score REAL,
  scoretype TEXT,
  description TEXT,
  id INTEGER PRIMARY KEY,
  symbol TEXT,
  length INTEGER,
  name TEXT,
  assemblyversion TEXT,
  annotationversion TEXT,
  secondaryidentifier TEXT,
  primaryidentifier TEXT,
  geneid INTEGER,
  sequenceontologytermid INTEGER,
  supercontiglocationid INTEGER,
  organismid INTEGER,
  chromosomelocationid INTEGER,
  supercontigid INTEGER,
  sequenceid INTEGER,
  chromosomeid INTEGER,
  proteinid INTEGER,
  strainid INTEGER,
  class TEXT
);

CREATE TABLE utr (
  score REAL,
  scoretype TEXT,
  description TEXT,
  id INTEGER PRIMARY KEY,
  symbol TEXT,
  length INTEGER,
  name TEXT,
  assemblyversion TEXT,
  annotationversion TEXT,
  secondaryidentifier TEXT,
  primaryidentifier TEXT,
  sequenceontologytermid INTEGER,
  supercontiglocationid INTEGER,
  organismid INTEGER,
  chromosomelocationid INTEGER,
  supercontigid INTEGER,
  sequenceid INTEGER,
  chromosomeid INTEGER,
  strainid INTEGER,
  class TEXT
);

CREATE TABLE synonym (
  id INTEGER PRIMARY KEY,
  intermine_value TEXT,
  subjectid INTEGER,
  class TEXT
);

CREATE TABLE soterm (
  identifier TEXT,
  description TEXT,
  id INTEGER PRIMARY KEY,
  obsolete INTEGER,
  name TEXT,
  namespace TEXT,
  ontologyid INTEGER,
  class TEXT
);

CREATE TABLE adjacentgenesintergenicregion (
  intergenicregion INTEGER,
  adjacentgenes INTEGER
);

CREATE TABLE authorspublications (
  authors INTEGER,
  publications INTEGER
);

CREATE TABLE childfeaturessequencefeature (
  sequencefeature INTEGER,
  childfeatures INTEGER
);

CREATE TABLE datasetsentities (
  entities INTEGER,
  datasets INTEGER
);

CREATE TABLE datasetslocation (
  location INTEGER,
  datasets INTEGER
);

CREATE TABLE datasetsontology (
  ontology INTEGER,
  datasets INTEGER
);

CREATE TABLE datasetsontologyannotation (
  ontologyannotation INTEGER,
  datasets INTEGER
);

CREATE TABLE datasetsontologyterm (
  ontologyterm INTEGER,
  datasets INTEGER
);

CREATE TABLE datasetsorganism (
  organism INTEGER,
  datasets INTEGER
);

CREATE TABLE datasetsstrain (
  strain INTEGER,
  datasets INTEGER
);

CREATE TABLE entitiespublications (
  entities INTEGER,
  publications INTEGER
);

CREATE TABLE exonstranscripts (
  exons INTEGER,
  transcripts INTEGER
);

CREATE TABLE genefamiliesproteindomains (
  proteindomains INTEGER,
  genefamilies INTEGER
);

CREATE TABLE genefamilyassignmentsprotein (
  protein INTEGER,
  genefamilyassignments INTEGER
);

CREATE TABLE genefunctionstrait (
  trait INTEGER,
  genefunctions INTEGER
);

CREATE TABLE genegenefamilyassignments (
  gene INTEGER,
  genefamilyassignments INTEGER
);

CREATE TABLE genegenefunctions (
  genefunctions INTEGER,
  gene INTEGER
);

CREATE TABLE genesintrons (
  introns INTEGER,
  genes INTEGER
);

CREATE TABLE genespangenesets (
  genes INTEGER,
  pangenesets INTEGER
);

CREATE TABLE genespathways (
  pathways INTEGER,
  genes INTEGER
);

CREATE TABLE genesproteindomains (
  proteindomains INTEGER,
  genes INTEGER
);

CREATE TABLE genesproteins (
  proteins INTEGER,
  genes INTEGER
);

CREATE TABLE genesqtl (
  qtl INTEGER,
  genes INTEGER
);

CREATE TABLE genotypingplatformsmarkers (
  genotypingplatforms INTEGER,
  markers INTEGER
);

CREATE TABLE gwasresultsmarkers (
  markers INTEGER,
  gwasresults INTEGER
);

CREATE TABLE intronstranscripts (
  introns INTEGER,
  transcripts INTEGER
);

CREATE TABLE markersqtls (
  qtls INTEGER,
  markers INTEGER
);

CREATE TABLE pangenesetsproteins (
  proteins INTEGER,
  pangenesets INTEGER
);

CREATE TABLE pangenesetstranscripts (
  transcripts INTEGER,
  pangenesets INTEGER
);

CREATE TABLE transcriptsutrs (
  utrs INTEGER,
  transcripts INTEGER
);

-- indexes
CREATE INDEX ix_cds_sequenceontologytermid ON cds(sequenceontologytermid);
CREATE INDEX ix_cds_supercontiglocationid ON cds(supercontiglocationid);
CREATE INDEX ix_cds_organismid ON cds(organismid);
CREATE INDEX ix_cds_chromosomelocationid ON cds(chromosomelocationid);
CREATE INDEX ix_cds_supercontigid ON cds(supercontigid);
CREATE INDEX ix_cds_sequenceid ON cds(sequenceid);
CREATE INDEX ix_cds_chromosomeid ON cds(chromosomeid);
CREATE INDEX ix_cds_transcriptid ON cds(transcriptid);
CREATE INDEX ix_cds_strainid ON cds(strainid);
CREATE INDEX ix_chromosome_sequenceontologytermid ON chromosome(sequenceontologytermid);
CREATE INDEX ix_chromosome_supercontiglocationid ON chromosome(supercontiglocationid);
CREATE INDEX ix_chromosome_organismid ON chromosome(organismid);
CREATE INDEX ix_chromosome_chromosomelocationid ON chromosome(chromosomelocationid);
CREATE INDEX ix_chromosome_supercontigid ON chromosome(supercontigid);
CREATE INDEX ix_chromosome_sequenceid ON chromosome(sequenceid);
CREATE INDEX ix_chromosome_chromosomeid ON chromosome(chromosomeid);
CREATE INDEX ix_chromosome_strainid ON chromosome(strainid);
CREATE INDEX ix_dataset_datasourceid ON dataset(datasourceid);
CREATE INDEX ix_dataset_publicationid ON dataset(publicationid);
CREATE INDEX ix_exon_sequenceontologytermid ON exon(sequenceontologytermid);
CREATE INDEX ix_exon_supercontiglocationid ON exon(supercontiglocationid);
CREATE INDEX ix_exon_organismid ON exon(organismid);
CREATE INDEX ix_exon_chromosomelocationid ON exon(chromosomelocationid);
CREATE INDEX ix_exon_supercontigid ON exon(supercontigid);
CREATE INDEX ix_exon_sequenceid ON exon(sequenceid);
CREATE INDEX ix_exon_chromosomeid ON exon(chromosomeid);
CREATE INDEX ix_exon_strainid ON exon(strainid);
CREATE INDEX ix_expressionsample_sourceid ON expressionsample(sourceid);
CREATE INDEX ix_expressionsource_organismid ON expressionsource(organismid);
CREATE INDEX ix_expressionsource_strainid ON expressionsource(strainid);
CREATE INDEX ix_gene_upstreamintergenicregionid ON gene(upstreamintergenicregionid);
CREATE INDEX ix_gene_downstreamintergenicregionid ON gene(downstreamintergenicregionid);
CREATE INDEX ix_gene_sequenceontologytermid ON gene(sequenceontologytermid);
CREATE INDEX ix_gene_supercontiglocationid ON gene(supercontiglocationid);
CREATE INDEX ix_gene_organismid ON gene(organismid);
CREATE INDEX ix_gene_chromosomelocationid ON gene(chromosomelocationid);
CREATE INDEX ix_gene_supercontigid ON gene(supercontigid);
CREATE INDEX ix_gene_sequenceid ON gene(sequenceid);
CREATE INDEX ix_gene_chromosomeid ON gene(chromosomeid);
CREATE INDEX ix_gene_strainid ON gene(strainid);
CREATE INDEX ix_genefamily_phylotreeid ON genefamily(phylotreeid);
CREATE INDEX ix_genefamilyassignment_proteinid ON genefamilyassignment(proteinid);
CREATE INDEX ix_genefamilyassignment_geneid ON genefamilyassignment(geneid);
CREATE INDEX ix_genefamilyassignment_genefamilyid ON genefamilyassignment(genefamilyid);
CREATE INDEX ix_genefamilytally_organismid ON genefamilytally(organismid);
CREATE INDEX ix_genefamilytally_genefamilyid ON genefamilytally(genefamilyid);
CREATE INDEX ix_geneflankingregion_geneid ON geneflankingregion(geneid);
CREATE INDEX ix_geneflankingregion_sequenceontologytermid ON geneflankingregion(sequenceontologytermid);
CREATE INDEX ix_geneflankingregion_supercontiglocationid ON geneflankingregion(supercontiglocationid);
CREATE INDEX ix_geneflankingregion_organismid ON geneflankingregion(organismid);
CREATE INDEX ix_geneflankingregion_chromosomelocationid ON geneflankingregion(chromosomelocationid);
CREATE INDEX ix_geneflankingregion_supercontigid ON geneflankingregion(supercontigid);
CREATE INDEX ix_geneflankingregion_sequenceid ON geneflankingregion(sequenceid);
CREATE INDEX ix_geneflankingregion_chromosomeid ON geneflankingregion(chromosomeid);
CREATE INDEX ix_geneflankingregion_strainid ON geneflankingregion(strainid);
CREATE INDEX ix_geneticmap_genotypingplatformid ON geneticmap(genotypingplatformid);
CREATE INDEX ix_geneticmap_organismid ON geneticmap(organismid);
CREATE INDEX ix_geneticmarker_sequenceontologytermid ON geneticmarker(sequenceontologytermid);
CREATE INDEX ix_geneticmarker_supercontiglocationid ON geneticmarker(supercontiglocationid);
CREATE INDEX ix_geneticmarker_organismid ON geneticmarker(organismid);
CREATE INDEX ix_geneticmarker_chromosomelocationid ON geneticmarker(chromosomelocationid);
CREATE INDEX ix_geneticmarker_supercontigid ON geneticmarker(supercontigid);
CREATE INDEX ix_geneticmarker_sequenceid ON geneticmarker(sequenceid);
CREATE INDEX ix_geneticmarker_chromosomeid ON geneticmarker(chromosomeid);
CREATE INDEX ix_geneticmarker_strainid ON geneticmarker(strainid);
CREATE INDEX ix_gwas_genotypingplatformid ON gwas(genotypingplatformid);
CREATE INDEX ix_gwas_organismid ON gwas(organismid);
CREATE INDEX ix_gwasresult_gwasid ON gwasresult(gwasid);
CREATE INDEX ix_gwasresult_traitid ON gwasresult(traitid);
CREATE INDEX ix_intergenicregion_sequenceontologytermid ON intergenicregion(sequenceontologytermid);
CREATE INDEX ix_intergenicregion_supercontiglocationid ON intergenicregion(supercontiglocationid);
CREATE INDEX ix_intergenicregion_organismid ON intergenicregion(organismid);
CREATE INDEX ix_intergenicregion_chromosomelocationid ON intergenicregion(chromosomelocationid);
CREATE INDEX ix_intergenicregion_supercontigid ON intergenicregion(supercontigid);
CREATE INDEX ix_intergenicregion_sequenceid ON intergenicregion(sequenceid);
CREATE INDEX ix_intergenicregion_chromosomeid ON intergenicregion(chromosomeid);
CREATE INDEX ix_intergenicregion_strainid ON intergenicregion(strainid);
CREATE INDEX ix_intron_sequenceontologytermid ON intron(sequenceontologytermid);
CREATE INDEX ix_intron_supercontiglocationid ON intron(supercontiglocationid);
CREATE INDEX ix_intron_organismid ON intron(organismid);
CREATE INDEX ix_intron_chromosomelocationid ON intron(chromosomelocationid);
CREATE INDEX ix_intron_supercontigid ON intron(supercontigid);
CREATE INDEX ix_intron_sequenceid ON intron(sequenceid);
CREATE INDEX ix_intron_chromosomeid ON intron(chromosomeid);
CREATE INDEX ix_intron_strainid ON intron(strainid);
CREATE INDEX ix_linkagegroup_geneticmapid ON linkagegroup(geneticmapid);
CREATE INDEX ix_linkagegroupposition_linkagegroupid ON linkagegroupposition(linkagegroupid);
CREATE INDEX ix_mrna_geneid ON mrna(geneid);
CREATE INDEX ix_mrna_sequenceontologytermid ON mrna(sequenceontologytermid);
CREATE INDEX ix_mrna_supercontiglocationid ON mrna(supercontiglocationid);
CREATE INDEX ix_mrna_organismid ON mrna(organismid);
CREATE INDEX ix_mrna_chromosomelocationid ON mrna(chromosomelocationid);
CREATE INDEX ix_mrna_supercontigid ON mrna(supercontigid);
CREATE INDEX ix_mrna_sequenceid ON mrna(sequenceid);
CREATE INDEX ix_mrna_chromosomeid ON mrna(chromosomeid);
CREATE INDEX ix_mrna_proteinid ON mrna(proteinid);
CREATE INDEX ix_mrna_strainid ON mrna(strainid);
CREATE INDEX ix_ontologyannotation_subjectid ON ontologyannotation(subjectid);
CREATE INDEX ix_ontologyannotation_ontologytermid ON ontologyannotation(ontologytermid);
CREATE INDEX ix_ontologyrelation_parenttermid ON ontologyrelation(parenttermid);
CREATE INDEX ix_ontologyrelation_childtermid ON ontologyrelation(childtermid);
CREATE INDEX ix_ontologyterm_ontologyid ON ontologyterm(ontologyid);
CREATE INDEX ix_organism_taxonid ON organism(taxonid);
CREATE INDEX ix_phylonode_proteinid ON phylonode(proteinid);
CREATE INDEX ix_phylonode_treeid ON phylonode(treeid);
CREATE INDEX ix_phylonode_parentid ON phylonode(parentid);
CREATE INDEX ix_phylotree_genefamilyid ON phylotree(genefamilyid);
CREATE INDEX ix_protein_phylonodeid ON protein(phylonodeid);
CREATE INDEX ix_protein_transcriptid ON protein(transcriptid);
CREATE INDEX ix_protein_organismid ON protein(organismid);
CREATE INDEX ix_protein_sequenceid ON protein(sequenceid);
CREATE INDEX ix_protein_strainid ON protein(strainid);
CREATE INDEX ix_proteinmatch_proteinid ON proteinmatch(proteinid);
CREATE INDEX ix_proteinmatch_organismid ON proteinmatch(organismid);
CREATE INDEX ix_proteinmatch_strainid ON proteinmatch(strainid);
CREATE INDEX ix_publication_pubmedid ON publication(pubmedid);
CREATE INDEX ix_qtl_traitid ON qtl(traitid);
CREATE INDEX ix_qtl_qtlstudyid ON qtl(qtlstudyid);
CREATE INDEX ix_qtl_linkagegroupid ON qtl(linkagegroupid);
CREATE INDEX ix_qtlstudy_organismid ON qtlstudy(organismid);
CREATE INDEX ix_strain_organismid ON strain(organismid);
CREATE INDEX ix_supercontig_sequenceontologytermid ON supercontig(sequenceontologytermid);
CREATE INDEX ix_supercontig_supercontiglocationid ON supercontig(supercontiglocationid);
CREATE INDEX ix_supercontig_organismid ON supercontig(organismid);
CREATE INDEX ix_supercontig_chromosomelocationid ON supercontig(chromosomelocationid);
CREATE INDEX ix_supercontig_supercontigid ON supercontig(supercontigid);
CREATE INDEX ix_supercontig_sequenceid ON supercontig(sequenceid);
CREATE INDEX ix_supercontig_chromosomeid ON supercontig(chromosomeid);
CREATE INDEX ix_supercontig_strainid ON supercontig(strainid);
CREATE INDEX ix_trait_organismid ON trait(organismid);
CREATE INDEX ix_trait_gwasid ON trait(gwasid);
CREATE INDEX ix_trait_qtlstudyid ON trait(qtlstudyid);
CREATE INDEX ix_transcript_geneid ON transcript(geneid);
CREATE INDEX ix_transcript_sequenceontologytermid ON transcript(sequenceontologytermid);
CREATE INDEX ix_transcript_supercontiglocationid ON transcript(supercontiglocationid);
CREATE INDEX ix_transcript_organismid ON transcript(organismid);
CREATE INDEX ix_transcript_chromosomelocationid ON transcript(chromosomelocationid);
CREATE INDEX ix_transcript_supercontigid ON transcript(supercontigid);
CREATE INDEX ix_transcript_sequenceid ON transcript(sequenceid);
CREATE INDEX ix_transcript_chromosomeid ON transcript(chromosomeid);
CREATE INDEX ix_transcript_proteinid ON transcript(proteinid);
CREATE INDEX ix_transcript_strainid ON transcript(strainid);
CREATE INDEX ix_utr_sequenceontologytermid ON utr(sequenceontologytermid);
CREATE INDEX ix_utr_supercontiglocationid ON utr(supercontiglocationid);
CREATE INDEX ix_utr_organismid ON utr(organismid);
CREATE INDEX ix_utr_chromosomelocationid ON utr(chromosomelocationid);
CREATE INDEX ix_utr_supercontigid ON utr(supercontigid);
CREATE INDEX ix_utr_sequenceid ON utr(sequenceid);
CREATE INDEX ix_utr_chromosomeid ON utr(chromosomeid);
CREATE INDEX ix_utr_strainid ON utr(strainid);
CREATE INDEX ix_synonym_subjectid ON synonym(subjectid);
CREATE INDEX ix_soterm_ontologyid ON soterm(ontologyid);
CREATE INDEX ix_adjacentgenesintergenicregion_intergenicregion ON adjacentgenesintergenicregion(intergenicregion);
CREATE INDEX ix_adjacentgenesintergenicregion_adjacentgenes ON adjacentgenesintergenicregion(adjacentgenes);
CREATE INDEX ix_authorspublications_authors ON authorspublications(authors);
CREATE INDEX ix_authorspublications_publications ON authorspublications(publications);
CREATE INDEX ix_childfeaturessequencefeature_sequencefeature ON childfeaturessequencefeature(sequencefeature);
CREATE INDEX ix_childfeaturessequencefeature_childfeatures ON childfeaturessequencefeature(childfeatures);
CREATE INDEX ix_datasetsentities_entities ON datasetsentities(entities);
CREATE INDEX ix_datasetsentities_datasets ON datasetsentities(datasets);
CREATE INDEX ix_datasetslocation_location ON datasetslocation(location);
CREATE INDEX ix_datasetslocation_datasets ON datasetslocation(datasets);
CREATE INDEX ix_datasetsontology_ontology ON datasetsontology(ontology);
CREATE INDEX ix_datasetsontology_datasets ON datasetsontology(datasets);
CREATE INDEX ix_datasetsontologyannotation_ontologyannotation ON datasetsontologyannotation(ontologyannotation);
CREATE INDEX ix_datasetsontologyannotation_datasets ON datasetsontologyannotation(datasets);
CREATE INDEX ix_datasetsontologyterm_ontologyterm ON datasetsontologyterm(ontologyterm);
CREATE INDEX ix_datasetsontologyterm_datasets ON datasetsontologyterm(datasets);
CREATE INDEX ix_datasetsorganism_organism ON datasetsorganism(organism);
CREATE INDEX ix_datasetsorganism_datasets ON datasetsorganism(datasets);
CREATE INDEX ix_datasetsstrain_strain ON datasetsstrain(strain);
CREATE INDEX ix_datasetsstrain_datasets ON datasetsstrain(datasets);
CREATE INDEX ix_entitiespublications_entities ON entitiespublications(entities);
CREATE INDEX ix_entitiespublications_publications ON entitiespublications(publications);
CREATE INDEX ix_exonstranscripts_exons ON exonstranscripts(exons);
CREATE INDEX ix_exonstranscripts_transcripts ON exonstranscripts(transcripts);
CREATE INDEX ix_genefamiliesproteindomains_proteindomains ON genefamiliesproteindomains(proteindomains);
CREATE INDEX ix_genefamiliesproteindomains_genefamilies ON genefamiliesproteindomains(genefamilies);
CREATE INDEX ix_genefamilyassignmentsprotein_protein ON genefamilyassignmentsprotein(protein);
CREATE INDEX ix_genefamilyassignmentsprotein_genefamilyassignments ON genefamilyassignmentsprotein(genefamilyassignments);
CREATE INDEX ix_genefunctionstrait_trait ON genefunctionstrait(trait);
CREATE INDEX ix_genefunctionstrait_genefunctions ON genefunctionstrait(genefunctions);
CREATE INDEX ix_genegenefamilyassignments_gene ON genegenefamilyassignments(gene);
CREATE INDEX ix_genegenefamilyassignments_genefamilyassignments ON genegenefamilyassignments(genefamilyassignments);
CREATE INDEX ix_genegenefunctions_genefunctions ON genegenefunctions(genefunctions);
CREATE INDEX ix_genegenefunctions_gene ON genegenefunctions(gene);
CREATE INDEX ix_genesintrons_introns ON genesintrons(introns);
CREATE INDEX ix_genesintrons_genes ON genesintrons(genes);
CREATE INDEX ix_genespangenesets_genes ON genespangenesets(genes);
CREATE INDEX ix_genespangenesets_pangenesets ON genespangenesets(pangenesets);
CREATE INDEX ix_genespathways_pathways ON genespathways(pathways);
CREATE INDEX ix_genespathways_genes ON genespathways(genes);
CREATE INDEX ix_genesproteindomains_proteindomains ON genesproteindomains(proteindomains);
CREATE INDEX ix_genesproteindomains_genes ON genesproteindomains(genes);
CREATE INDEX ix_genesproteins_proteins ON genesproteins(proteins);
CREATE INDEX ix_genesproteins_genes ON genesproteins(genes);
CREATE INDEX ix_genesqtl_qtl ON genesqtl(qtl);
CREATE INDEX ix_genesqtl_genes ON genesqtl(genes);
CREATE INDEX ix_genotypingplatformsmarkers_genotypingplatforms ON genotypingplatformsmarkers(genotypingplatforms);
CREATE INDEX ix_genotypingplatformsmarkers_markers ON genotypingplatformsmarkers(markers);
CREATE INDEX ix_gwasresultsmarkers_markers ON gwasresultsmarkers(markers);
CREATE INDEX ix_gwasresultsmarkers_gwasresults ON gwasresultsmarkers(gwasresults);
CREATE INDEX ix_intronstranscripts_introns ON intronstranscripts(introns);
CREATE INDEX ix_intronstranscripts_transcripts ON intronstranscripts(transcripts);
CREATE INDEX ix_markersqtls_qtls ON markersqtls(qtls);
CREATE INDEX ix_markersqtls_markers ON markersqtls(markers);
CREATE INDEX ix_pangenesetsproteins_proteins ON pangenesetsproteins(proteins);
CREATE INDEX ix_pangenesetsproteins_pangenesets ON pangenesetsproteins(pangenesets);
CREATE INDEX ix_pangenesetstranscripts_transcripts ON pangenesetstranscripts(transcripts);
CREATE INDEX ix_pangenesetstranscripts_pangenesets ON pangenesetstranscripts(pangenesets);
CREATE INDEX ix_transcriptsutrs_utrs ON transcriptsutrs(utrs);
CREATE INDEX ix_transcriptsutrs_transcripts ON transcriptsutrs(transcripts);