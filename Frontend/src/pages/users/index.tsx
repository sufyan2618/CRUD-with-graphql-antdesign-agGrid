// pages/users/index.tsx
import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { AgGridReact, type CustomCellRendererProps } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

import type { ColDef } from 'ag-grid-community';
import { useQuery } from '@apollo/client';
import { GET_USERS } from '../../entities/user/queries';

const UsersPage: React.FC = () => {
    const [paginationPageSize] = useState(20);
    const [page, setPage] = useState(1);
    const [sortModel, setSortModel] = useState<any[]>([]);
    const [filterModel, setFilterModel] = useState<any>({});

    // Build GraphQL variables from current state
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

        return {
            page,
            limit: paginationPageSize,
            sort,
            filter
        };
    }, [page, sortModel, filterModel, paginationPageSize]);

    // Fetch data with current parameters
    const { data, loading, error, refetch } = useQuery(GET_USERS, {
        variables: graphqlVariables,
        notifyOnNetworkStatusChange: true,
    });

    const roleFormatter = (props: CustomCellRendererProps) => {
        const role = props.value;
        if (role === 'ADMIN') return 'Administrator';
        if (role === 'USER') return 'User';
        if (role === 'GUEST') return 'Guest';
        return role;
    };

    const columnDefs: ColDef[] = useMemo(() => [
        { field: 'id', headerName: 'ID' },
        { field: 'name', headerName: 'Name', sortable: true, filter: 'agTextColumnFilter' },
        { field: 'email', headerName: 'Email', sortable: false, filter: 'agTextColumnFilter' },
        { field: 'role', headerName: 'Role', sortable: false, filter: 'agTextColumnFilter', cellRenderer: roleFormatter },
        {
            field: 'status', headerName: 'Status', sortable: false, filter: 'agTextColumnFilter',
            cellRenderer: (props: CustomCellRendererProps) => props.value === 'ACTIVE' ? 'Active' : 'Inactive'
        },
        {
            field: 'createdAt', headerName: 'Creation Date', sortable: true,
            valueFormatter: (props) => new Date(props.value).toLocaleDateString()
        }
    ], []);

    // Handle sorting changes
    const onSortChanged = useCallback((event: any) => {
        const sortModel = event.api.getSortModel();
        setSortModel(sortModel);
        setPage(1); // Reset to first page when sorting changes
    }, []);

    // Handle filter changes
    const onFilterChanged = useCallback((event: any) => {
        const filterModel = event.api.getFilterModel();
        setFilterModel(filterModel);
        setPage(1); // Reset to first page when filter changes
    }, []);

    // Handle pagination
    const onPaginationChanged = useCallback((event: any) => {
        const currentPage = event.api.paginationGetCurrentPage() + 1; // AG Grid is 0-indexed
        setPage(currentPage);
    }, []);

    return (
        <div className="ag-theme-alpine" style={{ height: 500 }}>
            <AgGridReact
                columnDefs={columnDefs}
                rowData={data?.users?.items || []}
                loading={loading}
                pagination={true}
                paginationPageSize={paginationPageSize}
                onSortChanged={onSortChanged}
                onFilterChanged={onFilterChanged}
                onPaginationChanged={onPaginationChanged}
                // Optional: Show loading overlay
                loadingOverlayComponent={'agLoadingOverlay'}
            />
        </div>
    );
};

export default UsersPage;
