// authStore.js
import {create} from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
    persist(
      (set) => ({
        isLoggedIn: false,
        userRole: null,
        nickName: null,
        login: () => set({ isLoggedIn: true }),
        logout: () => {
          localStorage.removeItem('accessToken');
          set({
            isLoggedIn: false,
            userRole: null,
            nickName: null,
          });
        },
        setUserRole: (role) => set({ userRole: role }),
        setNickName: (nickname) => set({ nickName: nickname }),
        setProfileImage: (profileImage) => set({ profileImage: profileImage }),
      }),
      {
        name: 'auth-storage', // localStorage에 저장될 키 이름
        partialize: (state) => ({
          isLoggedIn: state.isLoggedIn,
          userRole: state.userRole,
          nickName: state.nickName,
          profileImage: state.profileImage,
        }),
      }
    )
  );

export default useAuthStore;