import axiosInstance from './axiosInstance';
import { AxiosRequestConfig, AxiosResponse } from 'axios';

// Generic API client wrapper functions for Spring Boot backend
class HillfogClient {
  // GET request
  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await axiosInstance.get(url, config);
    return response.data;
  }

  // POST request with JSON payload or Form Data
  async post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig & { useFormData?: boolean }
  ): Promise<T> {
    let payload = data;
    let headers = config?.headers;

    if (config?.useFormData) {
      // Convert object to application/x-www-form-urlencoded string
      payload = Object.keys(data)
        .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(data[key]))
        .join('&');
      headers = {
        ...headers,
        'Content-Type': 'application/x-www-form-urlencoded',
      };
    }

    const response: AxiosResponse<T> = await axiosInstance.post(url, payload, { ...config, headers });
    return response.data;
  }

  // PUT request with JSON payload
  async put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response: AxiosResponse<T> = await axiosInstance.put(url, data, config);
    return response.data;
  }

  // PATCH request
  async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await axiosInstance.patch(url, data, config);
    return response.data;
  }

  // DELETE request
  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await axiosInstance.delete(url, config);
    return response.data;
  }
}

// Export singleton instance
export const hillfogClient = new HillfogClient();
export default hillfogClient;