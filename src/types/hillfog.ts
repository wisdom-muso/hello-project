/**
 * Hillfog Data Types
 * 
 * TypeScript interfaces that match the original Hillfog backend data models.
 */

// ==================== BASE INTERFACES ====================

export interface BaseEntity {
  id: string; // Maps to 'oid' in Hillfog
  createdDate?: string; // Maps to 'cdateString' in Hillfog
  updatedDate?: string; // Maps to 'udateString' in Hillfog
  createdBy?: string; // Maps to 'cuserid' in Hillfog
  updatedBy?: string; // Maps to 'uuserid' in Hillfog
}

// ==================== SCORECARD ENTITIES ====================

export interface HfScorecard extends BaseEntity {
  name: string;
  content?: string; // Description
  mission?: string;
  perspectives?: HfPerspective[];
  objectives?: HfObjective[];
  kpis?: HfKpi[];
  score?: number;
  status?: string;
}

export interface HfPerspective extends BaseEntity {
  name: string;
  description?: string;
  weight?: number;
  scorecardId?: string;
  objectives?: HfObjective[];
  score?: number;
  color?: string;
}

export interface HfScColor extends BaseEntity {
  scorecardId: string;
  name: string;
  min: number;
  max: number;
  color: string;
}

// ==================== KPI ENTITIES ====================

export interface HfKpi extends BaseEntity {
  kpiId: string; // Maps to 'id' field in Hillfog
  name: string;
  description?: string;
  weight?: number;
  unit?: string;
  formulaId?: string; // Maps to 'forId' in Hillfog
  max?: number;
  target?: number;
  min?: number;
  management?: string; // '1'=Higher is better, '2'=Lower is better, '3'=Closer to target
  compareType?: string; // '1'=>=, '2'=<=, '3'==, '4'=Between
  aggregationId?: string; // Maps to 'aggrId' in Hillfog
  dataType?: string; // '1'=Number, '2'=Percentage, '3'=Currency
  quasiRange?: number;
  actual?: number;
  score?: number;
  trend?: 'up' | 'down' | 'stable';
  status?: 'good' | 'warning' | 'danger';
  frequency?: string;
  measureData?: HfMeasureData[];
}

export interface HfFormula extends BaseEntity {
  formulaId: string;
  name: string;
  type: string;
  expression: string;
  description?: string;
}

export interface HfAggregationMethod extends BaseEntity {
  aggregationId: string; // Maps to 'aggrId' in Hillfog
  name: string;
  type: string;
  expression1: string;
  expression2: string;
  description?: string;
}

// ==================== OKR ENTITIES ====================

export interface HfObjective extends BaseEntity {
  objectiveId: string;
  name: string;
  description?: string;
  weight?: number;
  target?: number;
  actual?: number;
  score?: number;
  perspectiveId?: string;
  scorecardId?: string;
  keyResults?: HfKeyResult[];
  status?: 'on-track' | 'at-risk' | 'off-track';
  progress?: number;
  startDate?: string;
  endDate?: string;
}

export interface HfKeyResult extends BaseEntity {
  keyResultId: string;
  name: string;
  description?: string;
  objectiveId: string;
  target?: number;
  actual?: number;
  score?: number;
  unit?: string;
  measureData?: HfMeasureData[];
  status?: 'on-track' | 'at-risk' | 'off-track';
  progress?: number;
}

// ==================== MEASURE DATA ENTITIES ====================

export interface HfMeasureData extends BaseEntity {
  kpiId?: string;
  keyResultId?: string;
  employeeId?: string;
  organizationId?: string;
  date: string;
  frequency: string; // 'D'=Daily, 'W'=Weekly, 'M'=Monthly, 'Q'=Quarterly, 'H'=Half-yearly, 'Y'=Yearly
  actual?: number;
  target?: number;
  score?: number;
  status?: string;
  note?: string;
}

// ==================== ORGANIZATION ENTITIES ====================

export interface HfEmployee extends BaseEntity {
  account: string;
  empId: string;
  name: string;
  description?: string;
  uploadOid?: string; // Profile image
  jobTitle?: string;
  email?: string;
  phone?: string;
  department?: string;
  manager?: string;
  active?: boolean;
  roles?: string[];
  permissions?: string[];
}

export interface HfOrgDept extends BaseEntity {
  deptId: string;
  name: string;
  description?: string;
  parentId?: string;
  managerId?: string;
  employees?: HfEmployee[];
  children?: HfOrgDept[];
  level?: number;
}

// ==================== PDCA ENTITIES ====================

export interface HfPdca extends BaseEntity {
  title: string;
  description?: string;
  type: string;
  status: string;
  employeeId: string;
  organizationId?: string;
  startDate?: string;
  endDate?: string;
  planContent?: string;
  doContent?: string;
  checkContent?: string;
  actionContent?: string;
  attachments?: HfPdcaAttachment[];
}

export interface HfPdcaAttachment extends BaseEntity {
  pdcaId: string;
  fileName: string;
  filePath: string;
  fileSize?: number;
  contentType?: string;
}

// ==================== REPORT ENTITIES ====================

export interface HfReportData {
  title: string;
  subtitle?: string;
  period: string;
  frequency: string;
  generatedDate: string;
  data: any[];
  charts?: HfChartData[];
  summary?: HfReportSummary;
}

export interface HfChartData {
  type: 'line' | 'bar' | 'pie' | 'gauge' | 'area';
  title: string;
  data: any[];
  xAxis?: string;
  yAxis?: string;
  colors?: string[];
}

export interface HfReportSummary {
  totalKpis?: number;
  achievedKpis?: number;
  averageScore?: number;
  trend?: 'improving' | 'declining' | 'stable';
  insights?: string[];
}

// ==================== DASHBOARD ENTITIES ====================

export interface HfDashboardData {
  employee: HfEmployee;
  scorecards: HfScorecard[];
  kpis: HfKpi[];
  objectives: HfObjective[];
  recentMeasureData: HfMeasureData[];
  alerts: HfAlert[];
  statistics: HfDashboardStats;
}

export interface HfAlert {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  date: string;
  read?: boolean;
  actionUrl?: string;
}

export interface HfDashboardStats {
  totalKpis: number;
  onTrackKpis: number;
  atRiskKpis: number;
  offTrackKpis: number;
  averageScore: number;
  completedObjectives: number;
  totalObjectives: number;
  pendingTasks: number;
}

// ==================== UTILITY TYPES ====================

export interface HfApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  gridData?: T[];
  totalCount?: number;
  pageSize?: number;
  currentPage?: number;
}

export interface HfQueryParams {
  page?: number;
  pageSize?: number;
  searchValue?: string;
  orderBy?: string;
  sortType?: 'ASC' | 'DESC';
  filters?: Record<string, any>;
}

export interface HfSelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

// ==================== FORM TYPES ====================

export interface HfScorecardForm {
  name: string;
  content?: string;
  mission?: string;
}

export interface HfKpiForm {
  kpiId: string;
  name: string;
  description?: string;
  weight?: number;
  unit?: string;
  formulaId?: string;
  max?: number;
  target?: number;
  min?: number;
  management?: string;
  compareType?: string;
  aggregationId?: string;
  dataType?: string;
  quasiRange?: number;
}

export interface HfObjectiveForm {
  objectiveId: string;
  name: string;
  description?: string;
  weight?: number;
  target?: number;
  perspectiveId?: string;
  scorecardId?: string;
  startDate?: string;
  endDate?: string;
}

export interface HfMeasureDataForm {
  kpiId?: string;
  keyResultId?: string;
  date: string;
  frequency: string;
  actual?: number;
  target?: number;
  note?: string;
}

// ==================== CONSTANTS ====================

export const HILLFOG_CONSTANTS = {
  FREQUENCIES: {
    DAILY: 'D',
    WEEKLY: 'W',
    MONTHLY: 'M',
    QUARTERLY: 'Q',
    HALF_YEARLY: 'H',
    YEARLY: 'Y',
  },
  
  MANAGEMENT_TYPES: {
    HIGHER_BETTER: '1',
    LOWER_BETTER: '2',
    CLOSER_TARGET: '3',
  },
  
  COMPARE_TYPES: {
    GREATER_EQUAL: '1',
    LESS_EQUAL: '2',
    EQUAL: '3',
    BETWEEN: '4',
  },
  
  DATA_TYPES: {
    NUMBER: '1',
    PERCENTAGE: '2',
    CURRENCY: '3',
  },
  
  STATUS: {
    ACTIVE: 'Y',
    INACTIVE: 'N',
  },
} as const;