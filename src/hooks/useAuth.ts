import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { setUser, logout as logoutAction, setLoading } from '@/store/slices/authSlice';
import { hillfogClient } from '@/api/hillfogClient';
import { message } from 'antd';
import { useRouter } from 'next/navigation';
import { ROUTES, API_ENDPOINTS } from '@/utils/constants';
import { User } from '@/api/types';

interface LoginCredentials {
  username: string;
  password: string;
}

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAppSelector((state) => state.auth);

  // Login function - uses session-based auth
  const login = async (credentials: LoginCredentials) => {
    dispatch(setLoading(true));
    try {
      // Session cookie is automatically set by backend via Set-Cookie header
      const response = await hillfogClient.post<{ user: User }>(
        API_ENDPOINTS.AUTH_LOGIN,
        credentials
      );
      
      dispatch(setUser(response.user));
      
      message.success('Login successful');
      router.push(ROUTES.DASHBOARD);
      return { success: true };
    } catch (error: any) {
      const errorMessage = error?.message || 'Login failed';
      message.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      dispatch(setLoading(false));
    }
  };

  // Logout function - clears session on backend
  const logout = async () => {
    try {
      await hillfogClient.post(API_ENDPOINTS.AUTH_LOGOUT);
      dispatch(logoutAction());
      message.success('Logged out successfully');
      router.push(ROUTES.LOGIN);
    } catch (error) {
      console.error('Logout error:', error);
      // Even if logout fails, clear local state
      dispatch(logoutAction());
      router.push(ROUTES.LOGIN);
    }
  };

  // Check if user has specific role
  const hasRole = (role: string): boolean => {
    return user?.roles?.includes(role) || false;
  };

  // Check if user is admin
  const isAdmin = (): boolean => {
    return hasRole('admin');
  };

  // Check session validity
  const checkSession = async () => {
    if (!isAuthenticated) {
      return false;
    }

    try {
      const response = await hillfogClient.get<{ user: User }>(
        API_ENDPOINTS.AUTH_SESSION_CHECK
      );
      
      if (response.user) {
        dispatch(setUser(response.user));
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Session check failed:', error);
      dispatch(logoutAction());
      return false;
    }
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    hasRole,
    isAdmin,
    checkSession,
  };
};

export default useAuth;