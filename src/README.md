# File Structure #

## Types
Each type is defined in a file under `types/`:
```
types/
├── Annotatable.graphql
├── BioEntity.graphql
├── ExpressionSample.graphql
├── ExpressionSource.graphql
├── GeneFamilyAssignment.graphql
├── GeneFamily.graphql
├── Gene.graphql
├── ...
...
```

## Resolvers
Each *InterMine* resolver is defined in a file under `resolvers/intermine/`:
```
resolvers/intermine/
├── author.js
├── chromosome.js
├── data-set.js
...
```

## API methods
The *InterMine API* methods used by the resolvers are defined under `data-sources/intermine/api`:
```
data-sources/intermine/api/
├── get-author.js
├── get-authors.js
├── get-chromosome.js
...
```

## Models
*InterMine models* associate InterMine path query *attributes* with GraphQL type *fields* via constants `intermine[Type]Attributes` and `graphql[Type]Attributes` 
(e.g. `intermineGeneAttributes` and `graphqlGeneAttributes`).

The queries run in the API methods use these constants to query and populate the type. Sort order is defined with constant `intermine[Type]Sort` (e.g. `intermineGeneSort`).

InterMine models are defined under `data-sources/intermine/models`:
```
data-sources/intermine/models/
├── author.js
├── chromosome.js
├── data-set.js
...
```

## Resolving InterMine references and collections
Only attributes, not references or collections, are populated using the definitions in the models files. Population of references and collections
is done via resolver methods that use additional API methods as well as temporary attributes defined in the model.

For example, `intermineGeneAttributes` includes two attributes of references:
```
const intermineGeneAttributes = [
    'Gene.id',
    'Gene.primaryIdentifier',
    'Gene.description',
    'Gene.symbol',
    'Gene.name',
    'Gene.assemblyVersion',
    'Gene.annotationVersion',
    'Gene.length',
    'Gene.organism.id',        // internal resolution of organism
    'Gene.strain.id',          // internal resolution of strain
];
```
Those are included in `graphqlGeneAttributes` (even though they are not fields of the Gene type):
```
const graphqlGeneAttributes = [
    'id',
    'identifier',
    'description',
    'symbol',
    'name',
    'assemblyVersion',
    'annotationVersion',
    'length',
    'organismId',              // internal resolution of organism
    'strainId',                // internal resolution of strain
];
```

The `Gene.organism` and `Gene.strain` resolvers then use these temporary attributes to populate the corresponding objects:
```
    Gene: {
        organism: async (gene, { }, { dataSources }) => {
            return dataSources[sourceName].getOrganism(gene.organismId);
        },
        strain: async (gene, { }, { dataSources }) => {
            return dataSources[sourceName].getStrain(gene.strainId);
        },
        ...
```

Collections are populated using custom API methods that incorporate pagination. For example, the `Gene.locations` resolver
uses the `getLocations({sequenceFeature, start, size})` API method:
```
        locations: async (gene, { start, size }, { dataSources }) => {
            const args = {
                sequenceFeature: gene,
                start,
                size
            };
            return dataSources[sourceName].getLocations(args);
        },
```
