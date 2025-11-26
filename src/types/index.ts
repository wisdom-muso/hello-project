// Re-export Hillfog types as primary types
export * from './hillfog';

// Legacy types for backward compatibility
export interface LegacyObjective {
  id: string; // Standardized UUID field
  name: string;
  description?: string;
  targetValue?: number;
  currentValue?: number;
  measures?: LegacyMeasure[];
}

export interface LegacyPerspective {
  id: string; // Standardized UUID field
  name: string;
  description?: string;
  objectives: LegacyObjective[];
}

export interface LegacyScorecard {
  id: string; // Standardized UUID field
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  perspectives: LegacyPerspective[];
}

// Legacy Measure Types
export interface LegacyMeasure {
  id: string; // Standardized UUID field
  name: string;
  description?: string;
  unit?: string;
  frequency?: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  targetValue?: number;
  currentValue?: number;
  objectiveId?: string; // Reference field also standardized
}

export interface LegacyMeasureData {
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

// Type aliases for compatibility
export type Scorecard = HfScorecard;
export type Objective = HfObjective;
export type Measure = HfKpi;
export type MeasureData = HfMeasureData;
export type Employee = HfEmployee;

// Legacy Administration Types (for backward compatibility)
export interface LegacyEmployee {
  oid: string; // Primary key from hillfog
  employeeId: string; // Unique employee identifier
  fullName: string;
  email: string;
  organizationOid: string; // Foreign key to Organization
  role: 'ADMIN' | 'MANAGER' | 'USER';
  isLocked: boolean;
}

export interface Organization {
  oid: string;
  orgId: string; // Unique organization identifier
  name: string;
  parentOid: string | null; // For hierarchical structure
  description: string;
}

// Legacy OKR Types (for backward compatibility)
export interface KeyResult {
  oid: string;
  name: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  weight: number;
}

export interface LegacyOkrObjective {
  oid: string;
  name: string;
  description: string;
  keyResults: KeyResult[];
}

export interface OkrBase {
  oid: string;
  title: string;
  period: string; // e.g., "Q1 2025"
  objectives: LegacyOkrObjective[];
}

// PDCA Types
export interface PdcaCycle {
  oid: string;
  name: string;
  startDate: string;
  endDate: string;
  status: 'PLAN' | 'DO' | 'CHECK' | 'ACT';
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
}

// Reporting Types
export interface ReportData {
  reportId: string;
  title: string;
  parameters: any;
  data: any; // Flexible structure for chart/table data
}

// Query Tool Types
export interface CommonQuery {
  oid: string;
  name: string;
  sqlStatement: string; // The SQL or query language statement
  isPublic: boolean;
}
