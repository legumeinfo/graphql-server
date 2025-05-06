// get the mine's web properties
export async function getMineWebProperties(): Promise<object> {
  return (
    this.webProperties()
      // TODO: there should be a type for this
      .then((response: {'web-properties': {project: object}}) => {
        return response['web-properties'].project;
      })
  );
}
