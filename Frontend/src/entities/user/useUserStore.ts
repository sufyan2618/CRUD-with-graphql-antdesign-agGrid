import { create } from "zustand";

interface UserFormType {
    addFormVisible: boolean;
    showAddForm: () => void;
    hideAddForm: () => void;
    isEditing: boolean;
    editData: any | null; 
    toggleEditing: () => void;
}

const useUserStore = create<UserFormType>((set) => ({
    addFormVisible: false, 
    isEditing: false,
    editData: null,
    showAddForm: () => set({ addFormVisible: true }),
    hideAddForm: () => set({ addFormVisible: false }),
    toggleEditing: () => set((state) => ({ isEditing: !state.isEditing })),
})
)
export default useUserStore;
