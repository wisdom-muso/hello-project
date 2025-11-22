import { message } from 'antd';

// Format date utility
export const formatDate = (date: string | Date, format: string = 'MM/DD/YYYY'): string => {
  const d = new Date(date);
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const year = d.getFullYear();

  return format
    .replace('MM', month)
    .replace('DD', day)
    .replace('YYYY', String(year));
};

// Handle API errors
export const handleApiError = (error: any): void => {
  const errorMessage = error?.response?.data?.message || error?.message || 'An error occurred';
  message.error(errorMessage);
  console.error('API Error:', error);
};

// Debounce utility
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Format number with commas
export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('en-US').format(num);
};

// Calculate percentage
export const calculatePercentage = (current: number, target: number): number => {
  if (target === 0) return 0;
  return Math.round((current / target) * 100);
};
