import axiosInstance from './axiosInstance';
import { AxiosRequestConfig, AxiosResponse } from 'axios';

// Utility to serialize data to OGNL format (Struts 2)
export const serializeToOGNL = (data: Record<string, any>, prefix: string = ''): URLSearchParams => {
  const params = new URLSearchParams();

  const serialize = (obj: any, path: string) => {
    if (obj === null || obj === undefined) {
      return;
    }

    if (Array.isArray(obj)) {
      obj.forEach((item, index) => {
        serialize(item, `${path}[${index}]`);
      });
    } else if (typeof obj === 'object' && !(obj instanceof File) && !(obj instanceof Date)) {
      Object.keys(obj).forEach((key) => {
        const newPath = path ? `${path}.${key}` : key;
        serialize(obj[key], newPath);
      });
    } else {
      params.append(path, String(obj));
    }
  };

  Object.keys(data).forEach((key) => {
    const path = prefix ? `${prefix}.${key}` : key;
    serialize(data[key], path);
  });

  return params;
};

// Utility to serialize FormData from object (for file uploads)
export const serializeToFormData = (data: Record<string, any>): FormData => {
  const formData = new FormData();

  Object.keys(data).forEach((key) => {
    const value = data[key];

    if (value === null || value === undefined) {
      return;
    }

    if (Array.isArray(value)) {
      value.forEach((item, index) => {
        if (typeof item === 'object' && !(item instanceof File)) {
          formData.append(`${key}[${index}]`, JSON.stringify(item));
        } else {
          formData.append(`${key}[${index}]`, item);
        }
      });
    } else if (value instanceof File || value instanceof Blob) {
      formData.append(key, value);
    } else if (typeof value === 'object') {
      formData.append(key, JSON.stringify(value));
    } else {
      formData.append(key, String(value));
    }
  });

  return formData;
};

// Generic API client wrapper functions
class HillfogClient {
  // GET request
  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await axiosInstance.get(url, config);
    return response.data;
  }

  // POST request with OGNL or FormData serialization
  async post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig & { useFormData?: boolean; ognlPrefix?: string }
  ): Promise<T> {
    const { useFormData, ognlPrefix, ...axiosConfig } = config || {};

    if (useFormData && data) {
      const formData = serializeToFormData(data);
      const response: AxiosResponse<T> = await axiosInstance.post(url, formData, {
        ...axiosConfig,
        headers: {
          ...axiosConfig.headers,
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    }

    // Default: use OGNL serialization for Struts 2
    if (data) {
      const ognlParams = serializeToOGNL(data, ognlPrefix);
      const response: AxiosResponse<T> = await axiosInstance.post(url, ognlParams, axiosConfig);
      return response.data;
    }

    const response: AxiosResponse<T> = await axiosInstance.post(url, data, axiosConfig);
    return response.data;
  }

  // PUT request with OGNL or FormData serialization
  async put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig & { useFormData?: boolean; ognlPrefix?: string }
  ): Promise<T> {
    const { useFormData, ognlPrefix, ...axiosConfig } = config || {};

    if (useFormData && data) {
      const formData = serializeToFormData(data);
      const response: AxiosResponse<T> = await axiosInstance.put(url, formData, {
        ...axiosConfig,
        headers: {
          ...axiosConfig.headers,
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    }

    // Default: use OGNL serialization for Struts 2
    if (data) {
      const ognlParams = serializeToOGNL(data, ognlPrefix);
      const response: AxiosResponse<T> = await axiosInstance.put(url, ognlParams, axiosConfig);
      return response.data;
    }

    const response: AxiosResponse<T> = await axiosInstance.put(url, data, axiosConfig);
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