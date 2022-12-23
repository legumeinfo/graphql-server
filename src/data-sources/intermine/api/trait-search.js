// search for traits using a keyword
async function traitSearch(keyword, {start=0, size=10}={}) {
    const options = {
        start,
        size,
        facet_Category: 'Trait',
    };
    return this.keywordSearch(keyword, options)
        .then((response) => {
            return Promise.all(
                response.results
                    .map((result) => result.id)
                    .map((id) => this.getTrait(id))
            );
        });
}


module.exports = traitSearch;
