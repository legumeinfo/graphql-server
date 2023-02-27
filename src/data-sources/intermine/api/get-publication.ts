import { intermineConstraint, interminePathQuery } from '../intermine.server.js';
import {
  GraphQLPublication,
  InterminePublicationResponse,
  interminePublicationAttributes,
  interminePublicationSort,
  response2publications,
} from '../models/index.js';


// get a publication by DOI
export async function getPublication(doi: string): Promise<GraphQLPublication> {
    const constraints = [intermineConstraint('Publication.doi', '=', doi)];
    const query = interminePathQuery(
        interminePublicationAttributes,
        interminePublicationSort,
        constraints,
    );
    return this.pathQuery(query)
        .then((response: InterminePublicationResponse) => response2publications(response))
        .then((publications: Array<GraphQLPublication>) => {
            if (!publications.length) {
                const msg = `Publication with DOI '${doi}' not found`;
                this.inputError(msg);
            }
            return publications[0];
        });
}
