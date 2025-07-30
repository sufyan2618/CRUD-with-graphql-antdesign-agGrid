export interface PaginationProps {
    totalItems: number;
    currentPage: number;
    pageSize: number;
    onPageChange: (page: number) => void;
  }

  

export interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    status: string;
    createdAt: string;
}