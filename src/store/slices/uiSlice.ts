import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UiState {
  sidebarCollapsed: boolean;
  theme: 'light' | 'dark';
  breadcrumbs: { title: string; path?: string }[];
}

const initialState: UiState = {
  sidebarCollapsed: false,
  theme: 'light',
  breadcrumbs: [],
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    setSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
      state.sidebarCollapsed = action.payload;
    },
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
    },
    setBreadcrumbs: (state, action: PayloadAction<{ title: string; path?: string }[]>) => {
      state.breadcrumbs = action.payload;
    },
  },
});

export const { toggleSidebar, setSidebarCollapsed, setTheme, setBreadcrumbs } = uiSlice.actions;
export default uiSlice.reducer;
