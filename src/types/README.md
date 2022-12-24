# types #

Each type is defined in a file in this directory, e.g. `Gene.graphql`.

This schema is based closely on the LIS InterMine data model:

https://github.com/legumeinfo/minimine/blob/main/dbmodel/build/resources/main/genomic_model.xml

There are three interface types which correspond to widely-extended objects in the InterMine data model:

- Annotatable
- BioEntity
- SequenceFeature

This way we ensure that implementing types contain the attributes defined in the corresponding interface.
