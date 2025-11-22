import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '@/api/types';
import { STORAGE_KEYS } from '@/utils/constants';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Load initial state from localStorage (user info only, no tokens)
const loadStoredAuth = (): Pick<AuthState, 'user' | 'isAuthenticated'> => {
  if (typeof window === 'undefined') {
    return { user: null, isAuthenticated: false };
  }

  try {
    const userJson = localStorage.getItem(STORAGE_KEYS.USER_INFO);
    const user = userJson ? JSON.parse(userJson) : null;

    return {
      user,
      isAuthenticated: !!user,
    };
  } catch (error) {
    console.error('Error loading auth from storage:', error);
    return { user: null, isAuthenticated: false };
  }
};

const initialState: AuthState = {
  ...loadStoredAuth(),
  isLoading: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Set user after successful session-based login
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;

      // Persist user info to localStorage (session cookie handles auth)
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.USER_INFO, JSON.stringify(action.payload));
      }
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;

      // Clear localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem(STORAGE_KEYS.USER_INFO);
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const { setUser, logout, setLoading } = authSlice.actions;
export default authSlice.reducer;