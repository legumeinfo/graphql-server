# types #

Each type is defined in a file in this directory, e.g. `Gene.graphql`.

This schema is based closely on the LIS InterMine data model:

https://github.com/legumeinfo/minimine/blob/main/dbmodel/build/resources/main/genomic_model.xml

There are three interface types which correspond to widely-extended objects in the InterMine data model:

- Annotatable
- BioEntity
- SequenceFeature

This way we ensure that implementing types contain the attributes defined in the corresponding interface.

## classes populated in LIS InterMine 5.1.0.2 (excluding simple objects) ##

- org.intermine.model.bio.Author
- org.intermine.model.bio.CDS
- org.intermine.model.bio.CDSRegion
- org.intermine.model.bio.Chromosome
- org.intermine.model.bio.CrossReference
- org.intermine.model.bio.DataSet
- org.intermine.model.bio.DataSource
- org.intermine.model.bio.Exon
- org.intermine.model.bio.ExpressionSample
- org.intermine.model.bio.ExpressionSource
- org.intermine.model.bio.FivePrimeUTR
- org.intermine.model.bio.GOTerm
- org.intermine.model.bio.GWAS
- org.intermine.model.bio.GWASResult
- org.intermine.model.bio.Gene
- org.intermine.model.bio.GeneFamily
- org.intermine.model.bio.GeneFamilyAssignment
- org.intermine.model.bio.GeneFamilyTally
- org.intermine.model.bio.GeneFlankingRegion
- org.intermine.model.bio.GeneticMap
- org.intermine.model.bio.GeneticMarker
- org.intermine.model.bio.IntergenicRegion
- org.intermine.model.bio.LinkageGroup
- org.intermine.model.bio.LinkageGroupPosition
- org.intermine.model.bio.Location
- org.intermine.model.bio.MRNA
- org.intermine.model.bio.Ontology
- org.intermine.model.bio.OntologyAnnotation
- org.intermine.model.bio.OntologyRelation
- org.intermine.model.bio.OntologyTerm
- org.intermine.model.bio.OntologyTermSynonym
- org.intermine.model.bio.Organism
- org.intermine.model.bio.Pathway
- org.intermine.model.bio.Phylonode
- org.intermine.model.bio.Phylotree
- org.intermine.model.bio.Protein
- org.intermine.model.bio.ProteinDomain
- org.intermine.model.bio.Publication
- org.intermine.model.bio.QTL
- org.intermine.model.bio.QTLStudy
- org.intermine.model.bio.SOTerm
- org.intermine.model.bio.Sequence
- org.intermine.model.bio.Strain
- org.intermine.model.bio.Supercontig
- org.intermine.model.bio.SyntenicRegion
- org.intermine.model.bio.SyntenyBlock
- org.intermine.model.bio.ThreePrimeUTR
- org.intermine.model.bio.Trait
