# types #

Each type is defined in a file in this directory, e.g. `Gene.graphql`.

This schema is based closely on the LIS InterMine data model:

https://github.com/legumeinfo/minimine/blob/main/dbmodel/build/resources/main/genomic_model.xml

There are four interface types which correspond to widely-extended objects in the InterMine data model:

- Annotatable
- BioEntity (extends Annotatable)
- SequenceFeature (extends BioEntity)
- Transcript (extends SequenceFeature)

This way we ensure that implementing types contain the attributes defined in the corresponding interface.

## classes populated in LIS InterMine 5.1.0.3 (excluding simple objects)
### checked if implemented here as a type ##

- [x] org.intermine.model.bio.Annotatable
- [x] org.intermine.model.bio.Author
- [x] org.intermine.model.bio.BioEntity
- [x] org.intermine.model.bio.CDS
- [ ] org.intermine.model.bio.CDSRegion
- [x] org.intermine.model.bio.Chromosome
- [ ] org.intermine.model.bio.CrossReference
- [x] org.intermine.model.bio.DataSet
- [x] org.intermine.model.bio.DataSource
- [x] org.intermine.model.bio.Exon
- [x] org.intermine.model.bio.ExpressionSample
- [x] org.intermine.model.bio.ExpressionSource
- [x] org.intermine.model.bio.ExpressionValue
- [ ] org.intermine.model.bio.FivePrimeUTR
- [ ] org.intermine.model.bio.GOTerm
- [x] org.intermine.model.bio.GWAS
- [x] org.intermine.model.bio.GWASResult
- [x] org.intermine.model.bio.Gene
- [x] org.intermine.model.bio.GeneFamily
- [x] org.intermine.model.bio.GeneFamilyAssignment
- [x] org.intermine.model.bio.GeneFamilyTally
- [x] org.intermine.model.bio.GeneFlankingRegion
- [x] org.intermine.model.bio.GeneticMap
- [x] org.intermine.model.bio.GeneticMarker
- [x] org.intermine.model.bio.GenotypingPlatform
- [x] org.intermine.model.bio.IntergenicRegion
- [x] org.intermine.model.bio.Intron
- [x] org.intermine.model.bio.LinkageGroup
- [x] org.intermine.model.bio.LinkageGroupPosition
- [x] org.intermine.model.bio.Location
- [x] org.intermine.model.bio.MRNA
- [ ] org.intermine.model.bio.Newick
- [x] org.intermine.model.bio.Ontology
- [x] org.intermine.model.bio.OntologyAnnotation
- [ ] org.intermine.model.bio.OntologyEvidence
- [x] org.intermine.model.bio.OntologyRelation
- [x] org.intermine.model.bio.OntologyTerm
- [x] org.intermine.model.bio.OntologyTermSynonym
- [x] org.intermine.model.bio.Organism
- [x] org.intermine.model.bio.PanGeneSet
- [x] org.intermine.model.bio.Pathway
- [x] org.intermine.model.bio.Phylonode
- [x] org.intermine.model.bio.Phylotree
- [x] org.intermine.model.bio.Protein
- [x] org.intermine.model.bio.ProteinDomain
- [ ] org.intermine.model.bio.ProteinHmmMatch
- [x] org.intermine.model.bio.ProteinMatch
- [x] org.intermine.model.bio.Publication
- [x] org.intermine.model.bio.QTL
- [x] org.intermine.model.bio.QTLStudy
- [x] org.intermine.model.bio.SOTerm
- [x] org.intermine.model.bio.Sequence
- [x] org.intermine.model.bio.SequenceFeature
- [x] org.intermine.model.bio.Strain
- [x] org.intermine.model.bio.Supercontig
- [x] org.intermine.model.bio.SyntenicRegion
- [x] org.intermine.model.bio.SyntenyBlock
- [ ] org.intermine.model.bio.ThreePrimeUTR
- [x] org.intermine.model.bio.Trait
- [x] org.intermine.model.bio.Transcript
- [x] org.intermine.model.bio.UTR
