// get the mine's web properties
export async function getMineWebProperties(): Promise<Object> {
    return this.webProperties()
        // TODO: there should be a type for this
        .then((response: {"web-properties": {project: Object}}) => {
            return response["web-properties"].project;
        });
}
