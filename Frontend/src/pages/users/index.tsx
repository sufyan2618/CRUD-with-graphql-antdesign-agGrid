import React, { useMemo, useCallback, useEffect } from 'react';
import { AgGridReact, type CustomCellRendererProps } from 'ag-grid-react';
import { themeQuartz, iconSetMaterial, colorSchemeDarkBlue } from 'ag-grid-community';
import type { ColDef } from 'ag-grid-community';
import { useMutation, useQuery } from '@apollo/client';
import { Loader2 } from 'lucide-react';

import formatTimestamp from '../../shared/lib/util/formatTimeStamp';
import { GET_USERS } from '../../entities/user/queries';
import { DELETE_USER } from '../../entities/user/mutations';
import { Popconfirm } from 'antd';
import useUserStore from '../../entities/user/useUserStore';
import { useWindowSize } from '../../shared/lib/hooks/useWindowSize';
import useThemeStore from '../../entities/theme/useThemeStore';
import { Header } from '../../shared/ui/Header';
import Paging from '../../shared/ui/pagination';
import toast from 'react-hot-toast';

const MOBILE_BREAKPOINT = 768;

const UsersPage: React.FC = () => {
    const { theme } = useThemeStore();
    const isDark = theme === 'dark';
    const { showAddForm, startEditing , page,
        setPage,
        setSortModel,
        paginationPageSize,
        setFilterModel,
        graphqlVariables} = useUserStore();


    const { data, loading, error, refetch } = useQuery(GET_USERS, {
        variables: graphqlVariables,
        fetchPolicy: 'cache-and-network',
    });

    const { width } = useWindowSize();
    const isMobile = width < MOBILE_BREAKPOINT;
  

    // Theme-aware AG Grid theme
    const myTheme = useMemo(() => {
        const baseTheme = themeQuartz.withPart(iconSetMaterial);
        return isDark
            ? baseTheme.withPart(colorSchemeDarkBlue)
            : baseTheme;
    }, [isDark]);

    const [deleteUser] = useMutation(DELETE_USER, {
        onCompleted: () => {
            refetch(graphqlVariables);
        },
    });

    const handleDelete = useCallback(async (id: string) => {
        const response = await deleteUser({ variables: { id } });
        if (response){
            toast.success('User deleted successfully!');
        }

    }, [deleteUser]);

    useEffect(() => {
        if (data && data.users.items.length === 0 && page > 1) {
            setPage(page - 1);
        }
    }, [data, page, setPage]);

    const roleFormatter = (props: CustomCellRendererProps) => {
        const role = props.value;
        if (role === 'ADMIN') return 'Administrator';
        if (role === 'USER') return 'User';
        if (role === 'GUEST') return 'Guest';
        return role;
    };

    const columnDefs: ColDef[] = useMemo(() => [
        { field: 'id', headerName: 'ID', flex: 1, hide: isMobile },
        { field: 'name', headerName: 'Name', sortable: true, filter: false, flex: isMobile ? 2 : 1 },
        { field: 'email', headerName: 'Email', sortable: false, filter: 'agTextColumnFilter', flex: 2, hide: isMobile },
        { field: 'role', headerName: 'Role', sortable: false, filter: 'agTextColumnFilter', flex: 1, cellRenderer: roleFormatter },
        { field: 'status', headerName: 'Status', sortable: false, flex: 1, filter: false, hide: isMobile },
        {
            field: 'createdAt',
            headerName: 'Creation Date',
            flex: 1,
            sortable: true,
            filter: false,
            hide: isMobile,
            valueFormatter: (params: any) => {
                const timestamp = Number(params.value);
                return formatTimestamp(timestamp);
            },
        },
        {
            headerName: 'Actions',
            minWidth: isMobile ? 100 : 120,
            flex: 1,
            pinned: isMobile ? 'right' : false,
            cellRenderer: (props: CustomCellRendererProps) => (
                <div className={`flex items-center h-full ${isMobile ? 'gap-1' : 'gap-2'}`}>
                    <button
                        onClick={() => startEditing(props.data)}
                        className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-2 py-1 
                                  rounded transition-colors duration-150 font-medium min-w-[50px]"
                    >
                        Edit
                    </button>
                    <Popconfirm
                        title="Delete this user?"
                        description="Are you sure you want to delete this user? This action cannot be undone."
                        onConfirm={() => handleDelete(props.data.id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <button className="bg-red-500 hover:bg-red-600 text-white text-xs px-2 py-1 
                                         rounded transition-colors duration-150 font-medium min-w-[50px]">
                            {isMobile ? 'Del' : 'Delete'}
                        </button>
                    </Popconfirm>
                </div>
            )
        }
    ], [handleDelete, startEditing, isMobile]);


    const totalItems = data?.users?.totalCount || 0;

    const goToPage = (newPage: number) => {
        const totalPages = Math.ceil(totalItems / paginationPageSize);
        if (newPage >= 1 && newPage <= totalPages) {
            setPage(newPage);
        }
    };

    if (error) return <p>Error: {error.message}</p>;

    return (
  
        <div className={`h-screen flex flex-col p-3 md:p-6 font-sans transition-colors duration-200 gap-4 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
            <div className="flex-shrink-0">
                <Header 
                    onAddUser={showAddForm}
                    totalUsers={totalItems}
                    currentPage={page}
                />
            </div>
            <div className={`flex-grow w-full min-h-[300px] rounded-xl overflow-hidden shadow-sm border relative flex flex-col transition-colors duration-200 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
                <div className={`flex-shrink-0 px-5 py-4 border-b-2 flex justify-between items-center ...`}>
                </div>

                <div className="flex-grow">
                    {loading ? (
                        <div className="h-full flex items-center justify-center">
                            <Loader2 className="animate-spin  text-gray-500" size={24} />
                        </div>
                    ) : (
                        <AgGridReact
                            theme={myTheme}
                            columnDefs={columnDefs}
                            rowData={data?.users?.items || []}
                        />
                    )}
                </div>
            </div>
    
            {/* Enhanced Pagination Container (No change needed) */}
            <div className={`flex-shrink-0 flex justify-center items-center p-5 rounded-xl shadow-sm border ...`}>
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
