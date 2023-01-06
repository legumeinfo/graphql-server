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

## MineWebProperties type

This type holds properties of the mine, given by the WebPropertiesServlet. It can be used to check
the version of the mine and other things. Example:
```json
"mineWebProperties": {
    "subTitle": "A small variety of genomes and annotations to aid code development.",
    "citation": "<a href=\"http://www.ncbi.nlm.nih.gov/pubmed/23023984\" target=\"_blank\">Smith RN, et al. InterMine: a flexible data warehouse system for the integration and analysis of heterogeneous biological data. Bioinformatics. 2012 Dec 1;28(23):3163-5.</a>",
    "releaseVersion": "5.1.0.2",
    "standalone": "true",
    "helpLocation": "https://mines.legumeinfo.org/minimine/help",
    "title": "MiniMine",
    "sitePrefix": "https://mines.legumeinfo.org/minimine"
}
```

## classes populated in LIS InterMine 5.1.0.2 (excluding simple objects)
### checked if implemented here as a type ##

- [x] org.intermine.model.bio.Author
- [ ] org.intermine.model.bio.CDS
- [ ] org.intermine.model.bio.CDSRegion
- [x] org.intermine.model.bio.Chromosome
- [ ] org.intermine.model.bio.CrossReference
- [x] org.intermine.model.bio.DataSet
- [ ] org.intermine.model.bio.DataSource
- [ ] org.intermine.model.bio.Exon
- [x] org.intermine.model.bio.ExpressionSample
- [x] org.intermine.model.bio.ExpressionSource
- [ ] org.intermine.model.bio.FivePrimeUTR
- [ ] org.intermine.model.bio.GOTerm
- [x] org.intermine.model.bio.GWAS
- [x] org.intermine.model.bio.GWASResult
- [x] org.intermine.model.bio.Gene
- [x] org.intermine.model.bio.GeneFamily
- [x] org.intermine.model.bio.GeneFamilyAssignment
- [x] org.intermine.model.bio.GeneFamilyTally
- [ ] org.intermine.model.bio.GeneFlankingRegion
- [x] org.intermine.model.bio.GeneticMap
- [x] org.intermine.model.bio.GeneticMarker
- [ ] org.intermine.model.bio.IntergenicRegion
- [x] org.intermine.model.bio.LinkageGroup
- [x] org.intermine.model.bio.LinkageGroupPosition
- [x] org.intermine.model.bio.Location
- [x] org.intermine.model.bio.MRNA
- [x] org.intermine.model.bio.Ontology
- [x] org.intermine.model.bio.OntologyAnnotation
- [ ] org.intermine.model.bio.OntologyRelation
- [x] org.intermine.model.bio.OntologyTerm
- [ ] org.intermine.model.bio.OntologyTermSynonym
- [x] org.intermine.model.bio.Organism
- [x] org.intermine.model.bio.Pathway
- [x] org.intermine.model.bio.Phylonode
- [x] org.intermine.model.bio.Phylotree
- [x] org.intermine.model.bio.Protein
- [x] org.intermine.model.bio.ProteinDomain
- [x] org.intermine.model.bio.Publication
- [x] org.intermine.model.bio.QTL
- [x] org.intermine.model.bio.QTLStudy
- [ ] org.intermine.model.bio.SOTerm
- [ ] org.intermine.model.bio.Sequence
- [x] org.intermine.model.bio.Strain
- [ ] org.intermine.model.bio.Supercontig
- [x] org.intermine.model.bio.SyntenicRegion
- [x] org.intermine.model.bio.SyntenyBlock
- [ ] org.intermine.model.bio.ThreePrimeUTR
- [x] org.intermine.model.bio.Trait
