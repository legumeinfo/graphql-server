import { intermineConstraint, interminePathQuery } from '../intermine.server.js';
import {
  GraphQLDataSet,
  IntermineDataSetResponse,
  intermineDataSetAttributes,
  intermineDataSetSort,
  response2dataSets,
} from '../models/index.js';


// get a DataSet by name
export async function getDataSet(name: string): Promise<GraphQLDataSet> {
    const constraints = [intermineConstraint('DataSet.name', '=', name)];
    const query = interminePathQuery(
        intermineDataSetAttributes,
        intermineDataSetSort,
        constraints,
    );
    return this.pathQuery(query)
        .then((response: IntermineDataSetResponse) => response2dataSets(response))
        .then((dataSets: Array<GraphQLDataSet>) => {
            if (!dataSets.length) {
                const msg = `DataSet with name '${name}' not found`;
                this.inputError(msg);
            }
            return dataSets[0];
        });
}
