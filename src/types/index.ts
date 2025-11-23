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
// Administration Types
export interface Employee {
  oid: string; // Primary key from hillfog
  employeeId: string; // Unique employee identifier
  fullName: string;
  email: string;
  organizationOid: string; // Foreign key to Organization
  role: 'ADMIN' | 'MANAGER' | 'USER';
  isLocked: boolean;
  // Add other fields as per EmployeeController.java model
}

export interface Organization {
  oid: string;
  orgId: string; // Unique organization identifier
  name: string;
  parentOid: string | null; // For hierarchical structure
  description: string;
  // Add other fields as per OrganizationController.java model
}

// OKR Types
export interface KeyResult {
  oid: string;
  name: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  weight: number;
  // Add other fields as per OkrBaseController.java model
}

export interface Objective {
  oid: string;
  name: string;
  description: string;
  keyResults: KeyResult[];
  // Add other fields as per OkrBaseController.java model
}

export interface OkrBase {
  oid: string;
  title: string;
  period: string; // e.g., "Q1 2025"
  objectives: Objective[];
}

// PDCA Types
export interface PdcaCycle {
  oid: string;
  name: string;
  startDate: string;
  endDate: string;
  status: 'PLAN' | 'DO' | 'CHECK' | 'ACT';
  // Add other fields as per PdcaController.java model
}

// System Setup Types
export interface Formula {
  oid: string;
  name: string;
  expression: string; // The calculation logic
  description: string;
}

export interface AggregationMethod {
  oid: string;
  name: string;
  methodType: 'SUM' | 'AVERAGE' | 'CUSTOM';
  // Add other fields as per AggregationMethodController.java model
}
