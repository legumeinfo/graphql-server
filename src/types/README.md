# types #

This schema is based on the InterMine data model.

In principle, it could be generated from the model XML file, for example:

https://github.com/legumeinfo/minimine/blob/main/dbmodel/build/resources/main/genomic_model.xml

Each GraphQL type is defined in its own graphql file, e.g. Gene.graphql.

## interfaces.graphql ##

The defined interfaces correspond to widely-extended objects in the InterMine data model:

- Annotatable
- BioEntity
- SequenceFeature

This way we ensure that dependent types contain the attributes defined in the corresponding interface.
