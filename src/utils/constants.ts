import {
  LayoutDashboard,
  BarChart3,
  TrendingUp,
  Edit,
  FileText,
  Settings,
} from 'lucide-react';

// Route paths
export const ROUTES = {
  DASHBOARD: '/dashboard',
  SCORECARDS: '/scorecards',
  SCORECARD_CREATE: '/scorecards/create',
  SCORECARD_EDIT: '/scorecards/edit',
  KPIS: '/kpis',
  KPI_CREATE: '/kpis/create',
  KPI_EDIT: '/kpis/edit',
  MEASURE_DATA: '/measure-data',
  REPORTS: '/reports',
  SETTINGS: '/settings',
  SETTINGS_PROFILE: '/settings/profile',
  LOGIN: '/login',
} as const;

// Pagination defaults
export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

// Date formats
export const DATE_FORMAT = 'YYYY-MM-DD';
export const DATETIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';
export const DISPLAY_DATE_FORMAT = 'MMM DD, YYYY';

// Local storage keys - updated for session-based auth
export const STORAGE_KEYS = {
  USER_INFO: 'hillfog_user_info',
  THEME: 'hillfog_theme',
} as const;

// API Endpoints - Updated to Struts 2 .action pattern
export const API_ENDPOINTS = {
  // Auth
  AUTH_LOGIN: '/login.action',
  AUTH_LOGOUT: '/logout.action',
  AUTH_SESSION_CHECK: '/session/check.action',
  
  // Scorecard
  SCORECARD_QUERY: '/scorecard/query.action',
  SCORECARD_GET: '/scorecard/get.action',
  SCORECARD_SAVE: '/scorecard/save.action',
  SCORECARD_UPDATE: '/scorecard/update.action',
  SCORECARD_DELETE: '/scorecard/delete.action',
  SCORECARD_COLOR_SETTINGS: '/scorecard/colorSettings.action',
  SCORECARD_COLOR_UPDATE: '/scorecard/colorSettingsUpdate.action',
  
  // KPI
  KPI_QUERY: '/kpi/query.action',
  KPI_GET: '/kpi/get.action',
  KPI_SAVE: '/kpi/save.action',
  KPI_UPDATE: '/kpi/update.action',
  KPI_DELETE: '/kpi/delete.action',
  KPI_FIND_MAP: '/kpi/findMap.action',
  
  // Measure Data
  MEASURE_DATA_BODY: '/measureData/body.action',
  MEASURE_DATA_UPDATE: '/measureData/update.action',
} as const;

// KPI Frequency options
export const KPI_FREQUENCIES = [
  { label: 'Daily', value: 'daily' },
  { label: 'Weekly', value: 'weekly' },
  { label: 'Monthly', value: 'monthly' },
  { label: 'Quarterly', value: 'quarterly' },
  { label: 'Yearly', value: 'yearly' },
] as const;

// Color presets for scorecard color settings
export const COLOR_PRESETS = [
  '#FF4D4F', // Red
  '#FF7A45', // Orange
  '#FFA940', // Gold
  '#FFEC3D', // Yellow
  '#BAE637', // Lime
  '#73D13D', // Green
  '#36CFC9', // Cyan
  '#40A9FF', // Blue
  '#597EF7', // Geek Blue
  '#9254DE', // Purple
] as const;

// Navigation menu items
export interface MenuItem {
  key: string;
  icon: any;
  label: string;
}

export const NAVIGATION_MENU_ITEMS: MenuItem[] = [
  {
    key: 'dashboard',
    icon: LayoutDashboard,
    label: 'Dashboard',
  },
  {
    key: 'scorecards',
    icon: BarChart3,
    label: 'Scorecards',
  },
  {
    key: 'kpis',
    icon: TrendingUp,
    label: 'KPI Management',
  },
  {
    key: 'measure-data',
    icon: Edit,
    label: 'Measure Data',
  },
  {
    key: 'reports',
    icon: FileText,
    label: 'Reports',
  },
  {
    key: 'settings',
    icon: Settings,
    label: 'Settings',
  },
];