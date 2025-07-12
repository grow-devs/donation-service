import {create} from 'zustand';

const useAuthStore = create((set) => ({
    isLoggedIn: false,
    userRole: null,
    nickName: null,
    login: () => set({ isLoggedIn: true }),
    logout: () => set({ isLoggedIn: false }),
    setUserRole: (role) => set({ userRole: role }),
    setNickName: (nickname) => set({ nickName: nickname })
}))

export default useAuthStore;