import { intermineConstraint, interminePathQuery } from '../intermine.server.js';
import {
  GraphQLPublication,
  InterminePublicationResponse,
  interminePublicationAttributes,
  interminePublicationSort,
  response2publications,
} from '../models/index.js';


// get a publication by ID
export async function getPublication(id: number): Promise<GraphQLPublication> {
    const constraints = [intermineConstraint('Publication.id', '=', id)];
    const query = interminePathQuery(
        interminePublicationAttributes,
        interminePublicationSort,
        constraints,
    );
    return this.pathQuery(query)
        .then((response: InterminePublicationResponse) => response2publications(response))
        .then((publications: Array<GraphQLPublication>) => {
            if (!publications.length) {
                const msg = `Publication with ID '${id}' not found`;
                this.inputError(msg);
            }
            return publications[0];
        });
}
