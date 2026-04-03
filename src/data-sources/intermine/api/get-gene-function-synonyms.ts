import {intermineConstraint, interminePathQuery} from '../intermine.server.js';

// get synonym values for all genes associated with a GeneFunction
export async function getSynonymsForGeneFunction(
  id: number,
): Promise<string[]> {
  const constraints = [intermineConstraint('GeneFunction.id', '=', id)];
  const attributes = ['GeneFunction.gene.synonyms.value'];
  const query = interminePathQuery(attributes, '', constraints, []);

  // get the data
  const response = await this.pathQuery(query, {});

  // extract unique synonym values from the response
  const synonyms = new Set<string>();
  if (response.results && Array.isArray(response.results)) {
    response.results.forEach((result: any[]) => {
      if (result[0]) {
        synonyms.add(result[0]);
      }
    });
  }

  return Array.from(synonyms).sort();
}
