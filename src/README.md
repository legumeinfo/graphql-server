# File Structure #

Definition of types and resolvers is done via [GraphQL Tools schema merging](https://the-guild.dev/graphql/tools/docs/schema-merging).

Each type is defined in a file under /types and its resolvers are defined in a file under /resolvers, as follows:
```
types/
├── GeneFamilyAssignment.graphql
├── GeneFamily.graphql
├── Gene.graphql
...
```
```
resolvers/
├── GeneFamilyAssignment.js
├── GeneFamily.js
├── Gene.js
...
```

Right now, the scripts under `data-sources` are not yet broken apart, but I (Sam) plan to do so.
