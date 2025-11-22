// Base API response wrapper for Hillfog API
export interface HillfogApiResponse<T> {
  success: boolean;
  message?: string;
  value?: T;
}

// Pagination object
export interface PageOf<T> {
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  content: T[];
}

// Scorecard related types
export interface HfScorecard {
  oid: string;
  name: string;
  content: string;
  mission: string;
  visionOid?: string;
  frequencyOid?: string;
  organizationOid?: string;
  createdDate?: string;
  lastModifiedDate?: string;
}

export interface IPerspective {
  id: string;
  name: string;
  description?: string;
  weight?: number;
  objectives: IStrategyObjective[];
}

export interface IStrategyObjective {
  id: string;
  name: string;
  description?: string;
  weight?: number;
  kpis: string[]; // Array of KPI OIDs
}

export interface IScorecardForm {
  name: string;
  content: string;
  mission: string;
  visionOid?: string;
  frequencyOid?: string;
  organizationOid?: string;
  perspectives: IPerspective[];
}

// KPI related types
export interface HfKpi {
  oid: string;
  id: string;
  name: string;
  description?: string;
  frequencyOid?: string;
  formulaOid?: string;
  aggregationMethodOid?: string;
  unit?: string;
  target?: number;
  min?: number;
  max?: number;
  createdDate?: string;
  lastModifiedDate?: string;
}

export interface HfKpiQueryResult {
  oid: string;
  id: string;
  name: string;
  description?: string;
  frequency?: string;
  formula?: string;
  unit?: string;
}

// Measure Data types
export interface MeasureDataInputBody {
  content: string; // Server-rendered HTML form
}

export interface MeasureDataUpdateRequest {
  kpiOid: string;
  date: string;
  frequency: string;
  [key: string]: any; // Dynamic fields like target_YYYYMMDD, actual_YYYYMMDD
}

// Scorecard Color Settings
export interface ScorecardColorSettings {
  oid: string;
  scorecardOid: string;
  minColor?: string;
  midColor?: string;
  maxColor?: string;
  minValue?: number;
  midValue?: number;
  maxValue?: number;
}

// User/Auth types
export interface User {
  oid: string;
  username: string;
  name: string;
  email?: string;
  roles?: string[];
}

export interface AuthResponse {
  user: User;
  token: string;
}

// Query parameters
export interface QueryGridParams {
  page?: number;
  size?: number;
  searchValue?: string;
  sortField?: string;
  sortOrder?: 'asc' | 'desc';
}

// Error class
export class HillfogApiError extends Error {
  constructor(message: string, public code?: string, public details?: any) {
    super(message);
    this.name = 'HillfogApiError';
  }
}
