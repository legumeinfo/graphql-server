export interface GraphQLIdentifierCount {
  identifier: string;
  count: number;
}

export interface GraphQLResultsInfo {
  uniqueValues: number;
  identifierCounts: GraphQLIdentifierCount[];
}

export const resultsInfoFactory = (
  uniqueValues: number,
  idCountMap: Record<string, number>,
) => {
  const identifierCounts = Object.entries(idCountMap).map(
    ([identifier, count]) => ({identifier, count}),
  );
  return {uniqueValues, identifierCounts};
};
