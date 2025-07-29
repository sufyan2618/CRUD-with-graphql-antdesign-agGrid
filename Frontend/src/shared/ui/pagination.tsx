import React from 'react';
import { Pagination } from 'antd';
import { type PaginationProps } from '../../entities/user/types/PaginationProps';



const Paging: React.FC<PaginationProps> = ({ totalItems, currentPage, pageSize, onPageChange }) => (
  <Pagination
    align='center'
    current={currentPage}
    pageSize={pageSize}  
    total={totalItems}
    onChange={onPageChange}  
    showSizeChanger={false}
  />
);

export default Paging;
