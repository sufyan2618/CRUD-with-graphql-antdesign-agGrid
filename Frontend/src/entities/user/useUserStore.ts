// entities/user/useUserStore.ts (Updated with pagination state)

import { create } from 'zustand';

interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
}

interface UserStoreState {
  // Modal state
  addFormVisible: boolean;
  isEditing: boolean;
  editData: UserData | null;
  
  // Pagination and filtering state (moved from the hook)
  page: number;
  paginationPageSize: number;
  sortModel: any[];
  filterModel: any;
  
  // Computed variables
  graphqlVariables: any;
}

interface UserStoreActions {
  // Modal actions
  showAddForm: () => void;
  hideAddForm: () => void;
  startEditing: (user: UserData) => void;
  toggleEditing: () => void;
  
  // Pagination and filtering actions
  setPage: (page: number) => void;
  setSortModel: (model: any[]) => void;
  setFilterModel: (model: any) => void;
  updateGraphqlVariables: () => void;
}

export const useUserStore = create<UserStoreState & UserStoreActions>((set, get) => ({
  // Initial state
  addFormVisible: false,
  isEditing: false,
  editData: null,
  page: 1,
  paginationPageSize: 15,
  sortModel: [],
  filterModel: {},
  graphqlVariables: { page: 1, limit: 15, sort: null, filter: null },

  // Modal actions
  showAddForm: () => set({ addFormVisible: true }),
  hideAddForm: () => set({ addFormVisible: false }),
  startEditing: (user) => set({ isEditing: true, editData: user }),
  toggleEditing: () => set((state) => ({ isEditing: !state.isEditing })),

  // Pagination actions
  setPage: (page) => {
    set({ page });
    get().updateGraphqlVariables();
  },
  
  setSortModel: (model) => {
    set({ sortModel: model, page: 1 }); // Reset to page 1 when sorting changes
    get().updateGraphqlVariables();
  },
  
  setFilterModel: (model) => {
    set({ filterModel: model, page: 1 }); // Reset to page 1 when filtering changes
    get().updateGraphqlVariables();
  },

  // Update GraphQL variables whenever pagination state changes
  updateGraphqlVariables: () => {
    const state = get();
    const sort = state.sortModel.length > 0
      ? { field: state.sortModel[0].colId, order: state.sortModel[0].sort }
      : null;

    const filter = Object.keys(state.filterModel).length > 0
      ? Object.fromEntries(
          Object.entries(state.filterModel).map(([key, value]: [string, any]) =>
            [key, value.filter || value]
          )
        )
      : null;

    set({
      graphqlVariables: {
        page: state.page,
        limit: state.paginationPageSize,
        sort,
        filter
      }
    });
  },
}));

export default useUserStore;
