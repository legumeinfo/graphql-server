# File Structure #

Definition of types and resolvers is done within individual files as follows.

Each type is defined in a file under /types and its resolvers are defined in a file under `/types`:
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

Each InterMine resolver is defined in a file under `/resolvers/intermine`:
```
resolvers/
├── intermine
│   ├── expression-sample.js
│   ├── expression-source.js
│   ├── gene-family-assignment.js
│   ├── gene-family.js
│   ├── gene.js
│   ├── ...
```

Right now, the scripts under `data-sources` are not yet broken apart, but I (Sam) plan to do so.
