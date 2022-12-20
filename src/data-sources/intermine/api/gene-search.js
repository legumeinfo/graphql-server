// search for genes using a keyword
async function geneSearch(keyword, {start=0, size=10}={}) {
    const options = {
        start,
        size,
        facet_Category: 'Gene',
    };
    return this.keywordSearch(keyword, options)
        .then((response) => {
            return Promise.all(
                response.results
                    .map((result) => result.id)
                    .map((id) => this.getGene(id))
            );
        });
}


module.exports = geneSearch;
