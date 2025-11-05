import { create } from "zustand";
import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { User } from "../types/User";

const TOKEN_KEY = "areyousingle_jwt_token";

interface AuthState {
  token: string | null;
  user: User | null;
  isLoading: boolean;
  setToken: (token: string) => Promise<void>;
  setUser: (user: User | null) => void;
  clearAuth: () => Promise<void>;
  hydrateAuth: () => Promise<void>;
}

const setItem = async (key: string, value: string) => {
  if (Platform.OS === "web") {
    await AsyncStorage.setItem(key, value);
  } else {
    await SecureStore.setItemAsync(key, value);
  }
};

const getItem = async (key: string) => {
  if (Platform.OS === "web") {
    return await AsyncStorage.getItem(key);
  } else {
    return await SecureStore.getItemAsync(key);
  }
};

const deleteItem = async (key: string) => {
  if (Platform.OS === "web") {
    await AsyncStorage.removeItem(key);
  } else {
    await SecureStore.deleteItemAsync(key);
  }
};

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  isLoading: true,

  setToken: async (token) => {
    try {
      await setItem(TOKEN_KEY, token);
      set({ token });
    } catch (error) {
      console.error("Lỗi khi lưu token:", error);
    }
  },

  setUser: (user) => {
    set({ user });
  },

  clearAuth: async () => {
    try {
      await deleteItem(TOKEN_KEY);
      set({ token: null, user: null });
    } catch (error) {
      console.error("Lỗi khi xóa token:", error);
    }
  },

  hydrateAuth: async () => {
    try {
      const token = await getItem(TOKEN_KEY);
      if (token) set({ token });
    } catch (error) {
      console.error("Lỗi khi nạp token:", error);
    } finally {
      set({ isLoading: false });
    }
  },
}));

interface FilterState {
  gender?: "male" | "female";
  minAge?: number;
  maxAge?: number;
  setFilter: (filter: Partial<FilterState>) => void;
  clearFilter: () => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  gender: undefined,
  minAge: undefined,
  maxAge: undefined,
  setFilter: (filter) => set((state) => ({ ...state, ...filter })),
  clearFilter: () =>
    set({ gender: undefined, minAge: undefined, maxAge: undefined }),
}));
