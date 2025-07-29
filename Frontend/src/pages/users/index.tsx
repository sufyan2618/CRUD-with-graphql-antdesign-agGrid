// pages/users/index.tsx
import React, { useState, useMemo, useCallback } from 'react';
import { AgGridReact, type CustomCellRendererProps } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-material.css';
import type { ColDef } from 'ag-grid-community';
import { useQuery } from '@apollo/client';
import { GET_USERS } from '../../entities/user/queries';

const UsersPage: React.FC = () => {
    const [paginationPageSize] = useState(20);
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

    const { data, loading, error } = useQuery(GET_USERS, {
        variables: graphqlVariables,
    });

    const roleFormatter = (props: CustomCellRendererProps) => {
        const role = props.value;
        if (role === 'ADMIN') return 'Administrator';
        if (role === 'USER') return 'User';
        if (role === 'GUEST') return 'Guest';
        return role;
    };

    const columnDefs: ColDef[] = useMemo(() => [
        { field: 'id', headerName: 'ID', flex: 1 },
        { field: 'name', headerName: 'Name', sortable: true, filter: 'agTextColumnFilter', flex: 1 },
        { field: 'email', headerName: 'Email', sortable: false, filter: 'agTextColumnFilter', flex: 2 },
        { field: 'role', headerName: 'Role', sortable: false, filter: 'agTextColumnFilter', flex: 1, cellRenderer: roleFormatter },
        { field: 'status', headerName: 'Status', sortable: false, flex: 1, filter: 'agTextColumnFilter', cellRenderer: (props: CustomCellRendererProps) => props.value === 'ACTIVE' ? 'Active' : 'Inactive' },
        { field: 'createdAt', headerName: 'Creation Date', flex: 1, sortable: true, valueFormatter: (props) => new Date(props.value).toLocaleDateString() }
    ], []);

    const onSortChanged = useCallback((event: any) => {
        const sortModel = event.api.getSortModel();
        setSortModel(sortModel);
        setPage(1);
    }, []);

    const onFilterChanged = useCallback((event: any) => {
        const filterModel = event.api.getFilterModel();
        setFilterModel(filterModel);
        setPage(1);
    }, []);

    // Calculate pagination info
    const totalItems = data?.users?.totalCount || 0;
    const totalPages = Math.ceil(totalItems / paginationPageSize);
    const startItem = (page - 1) * paginationPageSize + 1;
    const endItem = Math.min(page * paginationPageSize, totalItems);

    // Custom pagination handlers
    const goToPage = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setPage(newPage);
        }
    };

    const goToFirstPage = () => goToPage(1);
    const goToLastPage = () => goToPage(totalPages);
    const goToPreviousPage = () => goToPage(page - 1);
    const goToNextPage = () => goToPage(page + 1);

    if (error) return <p>Error: {error.message}</p>;

    return (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* AG Grid */}
            <div className="ag-theme-material" style={{ height: 500, width: '100%' }}>
                <AgGridReact
                    columnDefs={columnDefs}
                    rowData={data?.users?.items || []}
                    loading={loading}
                    // Disable grid's built-in pagination
                    pagination={false}
                    onSortChanged={onSortChanged}
                    onFilterChanged={onFilterChanged}
                    loadingOverlayComponent={'agLoadingOverlay'}
                    autoSizeStrategy={{
                        type: 'fitGridWidth',
                        defaultMinWidth: 100
                    }}
                />
            </div>

            {/* Custom Pagination Controls */}
            <div style={{ 
                padding: '10px', 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                borderTop: '1px solid #ddd',
                backgroundColor: '#f5f5f5'
            }}>
                <div>
                    Showing {startItem} to {endItem} of {totalItems} entries
                </div>
                
                <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                    <button 
                        onClick={goToFirstPage} 
                        disabled={page === 1}
                        style={{ padding: '5px 10px', cursor: page === 1 ? 'not-allowed' : 'pointer' }}
                    >
                        First
                    </button>
                    <button 
                        onClick={goToPreviousPage} 
                        disabled={page === 1}
                        style={{ padding: '5px 10px', cursor: page === 1 ? 'not-allowed' : 'pointer' }}
                    >
                        Previous
                    </button>
                    
                    <span style={{ margin: '0 10px' }}>
                        Page {page} of {totalPages}
                    </span>
                    
                    <button 
                        onClick={goToNextPage} 
                        disabled={page === totalPages}
                        style={{ padding: '5px 10px', cursor: page === totalPages ? 'not-allowed' : 'pointer' }}
                    >
                        Next
                    </button>
                    <button 
                        onClick={goToLastPage} 
                        disabled={page === totalPages}
                        style={{ padding: '5px 10px', cursor: page === totalPages ? 'not-allowed' : 'pointer' }}
                    >
                        Last
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UsersPage;
