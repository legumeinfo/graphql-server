import {
  ApiResponse,
  intermineConstraint,
  interminePathQuery,
} from '../intermine.server.js';
import {
  GraphQLDataSource,
  IntermineDataSourceResponse,
  intermineDataSourceAttributes,
  intermineDataSourceSort,
  response2dataSources,
} from '../models/index.js';

// get a DataSource by name
export async function getDataSource(name: string): Promise<ApiResponse<GraphQLDataSource>> {
    const constraints = [intermineConstraint('DataSource.name', '=', name)];
    const query = interminePathQuery(
        intermineDataSourceAttributes,
        intermineDataSourceSort,
        constraints,
    );
    return this.pathQuery(query)
        .then((response: IntermineDataSourceResponse) => response2dataSources(response))
        .then((dataSources: Array<GraphQLDataSource>) => {
            if (!dataSources.length) return null;
            return dataSources[0];
        })
        .then((dataSource: GraphQLDataSource) => ({data: dataSource}));
}
