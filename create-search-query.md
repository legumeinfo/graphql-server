# Create a search query #
In order to implement a new search, you may need to create (or alter) a search query in the GraphQL server. Here are the steps, using the example of
a query that searches for publications containing a given string in their title.

## `src/types/Query.graphql` ##
Add your new query, which is typically the lower-case name of your target type in plural:
```
    publications(title: String, start: Int, size: Int): [Publication]
```   
The arguments are the arguments needed for the search (typically a single string) as well as the paging parameters `start` and `size`. Your query
returns a list of your target type, `[Publication]` in this example.

## `src/resolvers/intermine/publication.js` ##
Add the above query to the resolvers for your type, in this example the file `publication.js`:
```
    Query: {
        publication: ... already here ...,
        publications: async (_source, { title, start, size }, { dataSources }) => {
            const args = {
                title,
                start,
                size,
            };
            return dataSources[sourceName].searchPublications(args);
        },
    },
```
This resolver calls an API method `searchPublications` which we will now implement.

## `src/data-sources/intermine/api/search-publications.js` ##
Create the API method `searchPublications` in the new file `search-publications.js`. Here's this example; one generally copies and edits an
existing search method.
```
// path query search for Publications by title
async function searchPublications({title, start=0, size=10}={}) {
    const constraints = [];
    if (title) {
        const constraint = this.pathquery.intermineConstraint('Publication.title', 'CONTAINS', title);
        constraints.push(constraint);
    }
    const query = this.pathquery.interminePathQuery(
        this.models.interminePublicationAttributes,
        this.models.interminePublicationSort,
        constraints,
    );
    const options = {start, size};
    return this.pathQuery(query, options)
        .then((response) => this.models.response2publications(response));
}


module.exports = searchPublications;
```
The key part of this method is that it takes a string called `title` in the arguments JSON and uses the InterMine path query constraint 
`CONTAINS` to match that string against the title of a publication `Publication.title`.

## Test your new search query in Apollo Studio ##
Run `npm start` to fire up a local Apollo Studio instance, and open the indicated URL in a browser. Find your new search query and give it a run.
If it doesn't work properly, you need to fix it before you move on to creating a web component.
