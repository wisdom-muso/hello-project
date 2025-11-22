import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { HillfogApiResponse, HillfogApiError } from './types';

// Create custom axios instance with base configuration for Struts 2 backend
const axiosInstance: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8088',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
  withCredentials: true, // CRITICAL: Required for session-based auth with JSESSIONID cookies
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Log request in development
    if (process.env.NODE_ENV === 'development') {
      console.log('🚀 Request:', {
        method: config.method?.toUpperCase(),
        url: config.url,
        data: config.data,
      });
    }

    return config;
  },
  (error: AxiosError) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor - handle Hillfog API wrapper
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    const data = response.data;

    // Log response in development
    if (process.env.NODE_ENV === 'development') {
      console.log('✅ Response:', {
        status: response.status,
        url: response.config.url,
        data: data,
      });
    }

    // Check if response follows Hillfog wrapper format
    if (data && typeof data === 'object' && 'success' in data) {
      const wrappedData = data as HillfogApiResponse<any>;
      
      if (wrappedData.success === true) {
        // Return the unwrapped value
        return { ...response, data: wrappedData.value };
      } else {
        // API returned success: false
        throw new HillfogApiError(
          wrappedData.message || 'API request failed',
          'API_ERROR',
          wrappedData
        );
      }
    }

    // For non-wrapped responses, return as-is
    return response;
  },
  (error: AxiosError) => {
    // Handle common error scenarios
    if (error.response) {
      const { status, data } = error.response;

      // Check if error response has Hillfog wrapper format
      if (data && typeof data === 'object' && 'success' in data) {
        const wrappedData = data as HillfogApiResponse<any>;
        if (wrappedData.success === false) {
          throw new HillfogApiError(
            wrappedData.message || 'API request failed',
            'API_ERROR',
            wrappedData
          );
        }
      }

      switch (status) {
        case 401:
          // Unauthorized - session expired
          console.error('🔒 Unauthorized - Session expired');
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
          throw new HillfogApiError('Session expired. Please login again.', 'UNAUTHORIZED');
        case 403:
          console.error('🚫 Forbidden - Access denied');
          throw new HillfogApiError('Forbidden. You do not have permission.', 'FORBIDDEN');
        case 404:
          console.error('🔍 Not Found');
          throw new HillfogApiError('Resource not found.', 'NOT_FOUND');
        case 500:
          console.error('💥 Server Error');
          throw new HillfogApiError('Server error. Please try again later.', 'SERVER_ERROR');
        default:
          console.error('❌ Error:', data);
          throw new HillfogApiError('An error occurred', 'HTTP_ERROR', data);
      }
    } else if (error.request) {
      console.error('📡 No response received:', error.request);
      throw new HillfogApiError('No response from server. Please check your connection.', 'NETWORK_ERROR');
    } else {
      console.error('⚠️ Error setting up request:', error.message);
      throw new HillfogApiError(error.message || 'An unexpected error occurred', 'UNKNOWN_ERROR');
    }
  }
);

export default axiosInstance;