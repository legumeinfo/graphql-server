// get the mine's web properties
export async function getMineWebProperties() {
    return this.webProperties()
        .then((response) => {
            return response["web-properties"].project;
        });
}
