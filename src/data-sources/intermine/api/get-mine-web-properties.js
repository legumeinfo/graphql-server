// get the mine's web properties
async function getMineWebProperties() {
    return this.webProperties()
        .then((response) => {
            return response["web-properties"].project;
        });
}


module.exports = getMineWebProperties;
