import {
  ApiResponse,
  intermineConstraint,
  interminePathQuery,
} from '../intermine.server.js';
import {
  GraphQLDataSet,
  IntermineDataSetResponse,
  intermineDataSetAttributes,
  intermineDataSetSort,
  response2dataSets,
} from '../models/index.js';

// get a DataSet by name
export async function getDataSet(
  name: string,
): Promise<ApiResponse<GraphQLDataSet>> {
  const constraints = [intermineConstraint('DataSet.name', '=', name)];
  const query = interminePathQuery(
    intermineDataSetAttributes,
    intermineDataSetSort,
    constraints,
  );
  return this.pathQuery(query)
    .then((response: IntermineDataSetResponse) => response2dataSets(response))
    .then((dataSets: Array<GraphQLDataSet>) => {
      if (!dataSets.length) return null;
      return dataSets[0];
    })
    .then((dataSet: GraphQLDataSet) => ({data: dataSet}));
}
