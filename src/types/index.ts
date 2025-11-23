// Scorecard Types
export interface Objective {
  id: string; // Standardized UUID field
  name: string;
  description?: string;
  targetValue?: number;
  currentValue?: number;
  measures?: Measure[];
}

export interface Perspective {
  id: string; // Standardized UUID field
  name: string;
  description?: string;
  objectives: Objective[];
}

export interface Scorecard {
  id: string; // Standardized UUID field
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  perspectives: Perspective[];
}

// Measure Types
export interface Measure {
  id: string; // Standardized UUID field
  name: string;
  description?: string;
  unit?: string;
  frequency?: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  targetValue?: number;
  currentValue?: number;
  objectiveId?: string; // Reference field also standardized
}

export interface MeasureData {
  id: string; // Standardized UUID field
  measureId: string; // Reference field also standardized
  value: number;
  date: string;
  notes?: string;
}

// User Types
export interface User {
  id: string; // Standardized UUID field
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'user';
  avatar?: string;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}