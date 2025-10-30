
import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import type { User } from '../types/User';
const TOKEN_KEY = 'areyousingle_jwt_token';


interface AuthState {
  token: string | null;
  user: User | null;
  isLoading: boolean; 
  
  setToken: (token: string) => Promise<void>;
  
  setUser: (user: User | null) => void;
  clearAuth: () => Promise<void>;
  
  hydrateAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  isLoading: true, 

  setToken: async (token) => {
    try {
      await SecureStore.setItemAsync(TOKEN_KEY, token);
      set({ token });
    } catch (error) {
      console.error('Lỗi khi lưu token:', error);
    }
  },

  setUser: (user) => {
    set({ user });
  },

  clearAuth: async () => {
    try {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
      set({ token: null, user: null });
    } catch (error) {
      console.error('Lỗi khi xóa token:', error);
    }
  },

  hydrateAuth: async () => {
    try {
      const token = await SecureStore.getItemAsync(TOKEN_KEY);
      
      if (token) {
        set({ token });
      }
    } catch (error) {
      console.error('Lỗi khi nạp token:', error);
    } finally {
      set({ isLoading: false });
    }
  },
}));