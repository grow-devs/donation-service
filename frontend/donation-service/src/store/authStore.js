import {create} from 'zustand';

const useAuthStore = create((set) => ({
    isLoggedIn: false,
    userRole: null,
    setLoggedIn: (value) => set({ isLoggedIn: value }),
    setUserRole: (role) => set({ userRole: role }),
}))

export default useAuthStore;