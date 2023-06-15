export interface GraphQLPageInfo {
  currentPage: number;
  pageSize: number;
  numResults: number;
  pageCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}


export const pageInfoFactory =
  (numResults: number, currentPage: number|null, pageSize: number|null) => {
    if (currentPage == null) currentPage = 1;
    if (pageSize == null) pageSize = numResults;
    const pageCount = Math.ceil(numResults/pageSize);
    return {
      currentPage,
      pageSize,
      numResults,
      pageCount,
      hasPreviousPage: currentPage > 1,
      hasNextPage: currentPage < pageCount,
    };
  };
