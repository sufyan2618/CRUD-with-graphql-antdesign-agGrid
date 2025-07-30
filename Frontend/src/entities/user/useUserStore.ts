import { create } from "zustand";
import {type User} from "./types/PaginationProps"; // Adjust the import path as necessary
interface UserFormType {
    addFormVisible: boolean;
    showAddForm: () => void;
    hideAddForm: () => void;
    isEditing: boolean;
    editData: User | null; 
    toggleEditing: () => void;
    startEditing: (user: any) => void; 
}

const useUserStore = create<UserFormType>((set) => ({
    addFormVisible: false, 
    isEditing: false,
    editData: null,
    showAddForm: () => set({ addFormVisible: true }),
    hideAddForm: () => set({ addFormVisible: false }),
    toggleEditing: () => set((state) => ({ isEditing: !state.isEditing })),
    startEditing: (user) => set({ isEditing: true, editData: user }),
})
)
export default useUserStore;
