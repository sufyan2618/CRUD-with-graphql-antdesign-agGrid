import { useState, useMemo } from 'react';

function usePaginationAndFilters(initialPageSize = 15) {
  const [paginationPageSize] = useState(initialPageSize);
  const [page, setPage] = useState(1);
  const [sortModel, setSortModel] = useState<any[]>([]);
  const [filterModel, setFilterModel] = useState<any>({});

  const graphqlVariables = useMemo(() => {
    const sort = sortModel.length > 0
      ? { field: sortModel[0].colId, order: sortModel[0].sort }
      : null;

    const filter = Object.keys(filterModel).length > 0
      ? Object.fromEntries(
          Object.entries(filterModel).map(([key, value]: [string, any]) =>
            [key, value.filter || value]
          )
        )
      : null;

    return { page, limit: paginationPageSize, sort, filter };
  }, [page, sortModel, filterModel, paginationPageSize]);

  return {
    page,
    setPage,
    sortModel,
    setSortModel,
    filterModel,
    setFilterModel,
    graphqlVariables,
    paginationPageSize
  };
}

export default usePaginationAndFilters;