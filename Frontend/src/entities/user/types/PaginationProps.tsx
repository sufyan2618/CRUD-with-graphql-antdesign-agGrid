interface PaginationProps {
    totalItems: number;
    currentPage: number;
    pageSize: number;
    onPageChange: (page: number) => void;
  }

export type { PaginationProps };    