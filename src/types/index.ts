// Scorecard Types
export interface Objective {
  oid: string;
  name: string;
  description?: string;
  targetValue?: number;
  currentValue?: number;
  measures?: Measure[];
}

export interface Perspective {
  oid: string;
  name: string;
  description?: string;
  objectives: Objective[];
}

export interface Scorecard {
  oid: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  perspectives: Perspective[];
}

// Measure Types
export interface Measure {
  oid: string;
  name: string;
  description?: string;
  unit?: string;
  frequency?: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  targetValue?: number;
  currentValue?: number;
  objectiveOid?: string;
}

export interface MeasureData {
  oid: string;
  measureOid: string;
  value: number;
  date: string;
  notes?: string;
}

// User Types
export interface User {
  oid: string;
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