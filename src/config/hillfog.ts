/**
 * Hillfog Backend Configuration
 */

export const HILLFOG_CONFIG = {
  // Backend URL - should be configured based on environment
  BACKEND_URL: process.env.NEXT_PUBLIC_HILLFOG_BACKEND_URL || 'http://localhost:8088',
  
  // API endpoints
  ENDPOINTS: {
    // Authentication
    LOGIN: '/login.action',
    LOGOUT: '/logout.action',
    CHECK_SESSION: '/checkUserSession.action',
    
    // Scorecards
    SCORECARD_PAGE: '/hfScorecardPage',
    SCORECARD_QUERY: '/hfScorecardQueryGridJson',
    SCORECARD_SAVE: '/hfScorecardSaveJson',
    SCORECARD_UPDATE: '/hfScorecardUpdateJson',
    SCORECARD_DELETE: '/hfScorecardDeleteJson',
    
    // KPIs
    KPI_PAGE: '/hfKpiBasePage',
    KPI_QUERY: '/hfKpiBaseQueryGridJson',
    KPI_SAVE: '/hfKpiBaseSaveJson',
    KPI_UPDATE: '/hfKpiBaseUpdateJson',
    KPI_DELETE: '/hfKpiBaseDeleteJson',
    
    // Employees
    EMPLOYEE_PAGE: '/hfEmployeePage',
    EMPLOYEE_QUERY: '/hfEmployeeQueryGridJson',
    EMPLOYEE_SAVE: '/hfEmployeeSaveJson',
    EMPLOYEE_UPDATE: '/hfEmployeeUpdateJson',
    EMPLOYEE_DELETE: '/hfEmployeeDeleteJson',
    
    // Objectives (OKR)
    OBJECTIVE_PAGE: '/hfOkrBasePage',
    OBJECTIVE_QUERY: '/hfOkrBaseQueryGridJson',
    OBJECTIVE_SAVE: '/hfOkrBaseSaveJson',
    OBJECTIVE_UPDATE: '/hfOkrBaseUpdateJson',
    OBJECTIVE_DELETE: '/hfOkrBaseDeleteJson',
    
    // Measure Data
    MEASURE_DATA_PAGE: '/hfMeasureDataPage',
    MEASURE_DATA_BODY: '/hfMeasureDataBodyJson',
    MEASURE_DATA_UPDATE: '/hfMeasureDataUpdateJson',
    
    // Reports
    KPI_REPORT: '/hfKpiBaseReportJson',
    OKR_REPORT: '/hfOkrBaseReportJson',
    SCORECARD_REPORT: '/hfScorecardReportJson',
    
    // Dashboard
    PERSONAL_DASHBOARD: '/hfPersonalDashboardJson',
    
    // Common Query
    COMMON_QUERY: '/hfCommonQueryJson',
  },
  
  // Default pagination settings
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 10,
    MAX_PAGE_SIZE: 100,
  },
  
  // Request timeout (in milliseconds)
  TIMEOUT: 30000,
  
  // Session settings
  SESSION: {
    CHECK_INTERVAL: 5 * 60 * 1000, // Check session every 5 minutes
    WARNING_TIME: 2 * 60 * 1000,   // Warn user 2 minutes before expiry
  },
  
  // File upload settings
  UPLOAD: {
    MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
    ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'text/plain'],
  },
  
  // Chart settings
  CHARTS: {
    DEFAULT_COLORS: [
      '#1890ff', '#52c41a', '#faad14', '#f5222d', '#722ed1',
      '#13c2c2', '#eb2f96', '#fa541c', '#a0d911', '#2f54eb'
    ],
    ANIMATION_DURATION: 1000,
  },
  
  // Date formats
  DATE_FORMATS: {
    DISPLAY: 'YYYY-MM-DD',
    DISPLAY_WITH_TIME: 'YYYY-MM-DD HH:mm:ss',
    API: 'YYYY-MM-DD HH:mm:ss',
    COMPACT: 'YYYYMMDDHHMMSS',
  },
  
  // Frequency codes
  FREQUENCIES: {
    DAILY: 'D',
    WEEKLY: 'W',
    MONTHLY: 'M',
    QUARTERLY: 'Q',
    HALF_YEARLY: 'H',
    YEARLY: 'Y',
  },
  
  // Status codes
  STATUS: {
    ACTIVE: 'Y',
    INACTIVE: 'N',
    SUCCESS: 'SUCCESS',
    ERROR: 'ERROR',
    WARNING: 'WARNING',
  },
  
  // Management types
  MANAGEMENT_TYPES: {
    HIGHER_BETTER: '1',
    LOWER_BETTER: '2',
    CLOSER_TARGET: '3',
  },
  
  // Compare types
  COMPARE_TYPES: {
    GREATER_EQUAL: '1',
    LESS_EQUAL: '2',
    EQUAL: '3',
    BETWEEN: '4',
  },
  
  // Data types
  DATA_TYPES: {
    NUMBER: '1',
    PERCENTAGE: '2',
    CURRENCY: '3',
  },
} as const;

// Environment-specific configurations
export const getHillfogConfig = () => {
  const env = process.env.NODE_ENV || 'development';
  
  const configs = {
    development: {
      ...HILLFOG_CONFIG,
      BACKEND_URL: process.env.NEXT_PUBLIC_HILLFOG_BACKEND_URL || 'http://localhost:8088',
    },
    production: {
      ...HILLFOG_CONFIG,
      BACKEND_URL: process.env.NEXT_PUBLIC_HILLFOG_BACKEND_URL || 'https://hillfog.example.com',
    },
    test: {
      ...HILLFOG_CONFIG,
      BACKEND_URL: 'http://localhost:8088',
      TIMEOUT: 5000,
    },
  };
  
  return configs[env as keyof typeof configs] || configs.development;
};

export default getHillfogConfig();