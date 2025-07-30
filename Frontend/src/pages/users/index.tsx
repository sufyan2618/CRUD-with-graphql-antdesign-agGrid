// pages/users/index.tsx
import React, { useMemo, useCallback, useEffect } from 'react';
import { AgGridReact, type CustomCellRendererProps } from 'ag-grid-react';
import { themeMaterial, themeQuartz, iconSetMaterial, colorSchemeDarkBlue } from 'ag-grid-community';
import type { ColDef } from 'ag-grid-community';
import { useMutation, useQuery } from '@apollo/client';
import formatTimestamp from '../../shared/lib/util/formatTimeStamp';
import { GET_USERS } from '../../entities/user/queries';
import Paging from '../../shared/ui/pagination';
import { DELETE_USER } from '../../entities/user/mutations';
import { Button, Popconfirm } from 'antd';
import usePaginationAndFilters from '../../shared/lib/hooks/usePaginationAndFilters';
import useUserStore from '../../entities/user/useUserStore';
import { useWindowSize } from '../../shared/lib/hooks/useWindowSize';
const myTheme = themeQuartz
    .withPart(iconSetMaterial)
    .withPart(colorSchemeDarkBlue);

const MOBILE_BREAKPOINT = 768;

const UsersPage: React.FC = () => {
    const {
        page,
        setPage,
        setSortModel,
        paginationPageSize,
        setFilterModel,
        graphqlVariables
    } = usePaginationAndFilters();

    const { data, loading, error, refetch } = useQuery(GET_USERS, {
        variables: graphqlVariables,
        fetchPolicy: 'cache-and-network',
    });
    console.log(data);
    const { width } = useWindowSize();
    const isMobile = width < MOBILE_BREAKPOINT;
    const { startEditing, showAddForm } = useUserStore()

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
        { field: 'id', headerName: 'ID', flex: 1, hide: isMobile },
        { field: 'name', headerName: 'Name', sortable: true, filter: false, flex: 1 },
        { field: 'email', headerName: 'Email', sortable: false, filter: 'agTextColumnFilter', flex: 2, hide: isMobile },
        { field: 'role', headerName: 'Role', sortable: false, filter: 'agTextColumnFilter', flex: 1, cellRenderer: roleFormatter },
        { field: 'status', headerName: 'Status', sortable: false, flex: 1, filter: false },
        {
            field: 'createdAt', headerName: 'Creation Date', flex: 1, sortable: true, filter: false, hide: isMobile,
            valueFormatter: (params: any) => {
                const timestamp = Number(params.value);
                return formatTimestamp(timestamp);
            },
        },
        {
            headerName: 'Actions',
            minWidth: 120,
            flex: 1,
            cellRenderer: (props: CustomCellRendererProps) => (
                <div style={{ display: 'flex', gap: '8px' }}>
                    <Button
                        type="primary"
                        size="small"
                        onClick={() => {
                            startEditing(props.data);
                        }}
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
    ], [handleDelete, startEditing, isMobile]);

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


    // Function for handling page change
    const goToPage = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setPage(newPage);
        }
    };

    if (error) return <p>Error: {error.message}</p>;

    return (
        <div style={{
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            padding: isMobile ? '10px' : '20px',
            boxSizing: 'border-box'
        }}>
            <div style={{
                flexShrink: 0,
                marginBottom: '16px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap'
            }}>
                <button
                    className="bg-red-60"
                    onClick={showAddForm}
                    style={{ marginBottom: '20px' }}
                >
                    Add User
                </button>
            </div>


            <div style={{
                flexGrow: 1,
                width: '100%',
                minHeight: '300px',
                marginBottom: '16px'
            }}>
                <AgGridReact
                    theme={myTheme}
                    columnDefs={columnDefs}
                    rowData={data?.users?.items || []}
                    loading={loading}
                    pagination={false}
                    onSortChanged={onSortChanged}
                    onFilterChanged={onFilterChanged}
                    loadingOverlayComponent={'agLoadingOverlay'}

                    autoSizeStrategy={{
                        type: 'fitGridWidth',
                        defaultMinWidth: isMobile ? 80 : 100
                    }}

                    suppressHorizontalScroll={false}
                    alwaysShowHorizontalScroll={false}
                />
            </div>

            <div style={{
                flexShrink: 0,
                display: 'flex',
                justifyContent: 'center',
                padding: isMobile ? '8px 0' : '16px 0'
            }}>
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
