import { intermineConstraint, interminePathQuery } from '../intermine.server.js';
import {
  GraphQLDataSet,
  IntermineDataSetResponse,
  intermineDataSetAttributes,
  intermineDataSetSort,
  response2dataSets,
} from '../models/index.js';


// get a DataSet by ID
export async function getDataSet(id: number): Promise<GraphQLDataSet> {
    const constraints = [intermineConstraint('DataSet.id', '=', id)];
    const query = interminePathQuery(
        intermineDataSetAttributes,
        intermineDataSetSort,
        constraints,
    );
    return this.pathQuery(query)
        .then((response: IntermineDataSetResponse) => response2dataSets(response))
        .then((dataSets: Array<GraphQLDataSet>) => {
            if (!dataSets.length) {
                const msg = `DataSet with ID '${id}' not found`;
                this.inputError(msg);
            }
            return dataSets[0];
        });
}
