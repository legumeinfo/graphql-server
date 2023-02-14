import { intermineConstraint, interminePathQuery } from '../intermine.server.js';
import {
  GraphQLMRNA,
  IntermineMRNAResponse,
  intermineMRNAAttributes,
  intermineMRNASort,
  response2mRNAs,
} from '../models/index.js';


// get an MRNA by ID
export async function getMRNA(id: number): Promise<GraphQLMRNA> {
    const constraints = [intermineConstraint('MRNA.id', '=', id)];
    const query = interminePathQuery(
        intermineMRNAAttributes,
        intermineMRNASort,
        constraints,
    );
    return this.pathQuery(query)
        .then((response: IntermineMRNAResponse) => response2mRNAs(response))
        .then((mRNAs: Array<GraphQLMRNA>) => {
            if (!mRNAs.length) {
                const msg = `MRNA with ID '${id}' not found`;
                this.inputError(msg);
            }
            return mRNAs[0];
        });
}
