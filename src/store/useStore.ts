"use client";

import { create } from 'zustand';
import { User } from '@/types';

interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  sidebarCollapsed: boolean;
  setUser: (user: User | null) => void;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
}

export const useStore = create<AppState>((set) => ({
  user: null,
  isAuthenticated: false,
  sidebarCollapsed: false,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
}));
