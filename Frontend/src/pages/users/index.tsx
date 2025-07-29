// pages/users/index.tsx
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { AgGridReact, type CustomCellRendererProps } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-material.css';
import type { ColDef } from 'ag-grid-community';
import { useMutation, useQuery } from '@apollo/client';

import { GET_USERS } from '../../entities/user/queries';
import Paging from '../../shared/ui/pagination';
import { DELETE_USER } from '../../entities/user/mutations';
import { Button, Popconfirm } from 'antd';

const UsersPage: React.FC = () => {
    const [paginationPageSize] = useState(15);
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

    const { data, loading, error, refetch } = useQuery(GET_USERS, {
        variables: graphqlVariables,
        fetchPolicy: 'cache-and-network',
    });

    const [deleteUser] = useMutation(DELETE_USER, {
        variables: { id: '' }, 
            
            onCompleted: () => {
                refetch(graphqlVariables)
            },  
        });

        const handleDelete = (id: string) => {
            deleteUser({ variables: { id } });
        };
        useEffect(() => {
            if (data && data.users.items.length === 0 && page > 1) {
                setPage(page - 1);
            }
        }, [data, page])

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
        { field: 'createdAt', headerName: 'Creation Date', flex: 1, sortable: true, valueFormatter: (props) => new Date(props.value).toLocaleDateString() },
       {
            headerName: 'Actions',
            flex: 1,
            cellRenderer: (props: CustomCellRendererProps) => (
                <div style={{ display: 'flex', gap: '8px' }}>
                    <Button
                        type="primary"
                        size="small"
                        onClick={() => alert(`Edit user ${props.data.id}`)} // Placeholder for your edit modal
                    >
                        Edit
                    </Button>
                    <Popconfirm
                        title="Delete this user?"
                        description="Are you sure you want to delete this user? This action cannot be undone."
                        onConfirm={() => handleDelete(props.data.id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button type="primary" danger size="small">
                            Delete
                        </Button>
                    </Popconfirm>
                </div>
            )
        }
    ], [handleDelete]);

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


    const totalItems = data?.users?.totalCount || 0;
    const totalPages = Math.ceil(totalItems / paginationPageSize);


    // Function to handle page change
    const goToPage = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setPage(newPage);
        }
    };

    if (error) return <p>Error: {error.message}</p>;

    return (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* AG Grid */}
            <div className="ag-theme-material" style={{ height: 500, width: '100%' }}>
                <AgGridReact
                    columnDefs={columnDefs}
                    rowData={data?.users?.items || []}
                    loading={loading}
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

            {/* Pagination */}
            <div style={{ padding: '16px 0', flexShrink: 0 }}>
                <Paging
                    currentPage={page}
                    totalItems={totalItems}
                    pageSize={paginationPageSize}
                    onPageChange={goToPage}
                />
            </div>
           
        </div>
    );
};

export default UsersPage;
