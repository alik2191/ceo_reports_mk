export type ScreenId =
  | 'ceo'
  | 'coo'
  | 'goals'
  | 'reports'
  | 'diary'
  | 'kpi_offer'
  | 'finance'
  | 'audit'
  | 'structure'
  | 'catalog'
  | 'settings';

export interface ScreenMeta {
  id: ScreenId;
  fullName: string;
  navLabel: string;
  category: 'main' | 'analytics' | 'org';
  icon: string;
  badge?: string;
  description: string;
}

export interface Employee {
  id: string;
  name: string;
  fullName?: string;
  initials: string;
  avatarInitials?: string;
  role: string;
  position?: string;
  grade: string;
  department: string;
  deptCode: 'LOC' | 'SLS' | 'MKT' | 'OPS' | 'HR' | 'FIN' | 'TECH';
  company: 'MK:translations' | 'Localica' | 'Холдинг (Центр)';
  legalEntity: string;
  email: string;
  phone?: string;
  telegram: string;
  location: string;
  employmentType: 'Штат' | 'B2B Контракт' | 'ФОП' | 'Freelance';
  status: 'active' | 'vacation' | 'onboarding';
  statusLabel: string;
  manager: string;
  managerRole: string;
  offerBonus: string;
  diaryStatus: string;
  diaryProgress: number;
}

export interface DepartmentNode {
  id: string;
  name: string;
  code: 'LOC' | 'SLS' | 'MKT' | 'OPS' | 'HR' | 'FIN';
  headName: string;
  headRole: string;
  headcount: number;
  planHeadcount: number;
  executionRate: number;
  kpiStatus: 'Виконано' | 'На межі' | 'Під ризиком';
  locations: string;
  teamBreakdown: string[];
}

export interface OfferKpiItem {
  id: string;
  candidateName: string;
  initials: string;
  position: string;
  department: string;
  deptCode: 'LOC' | 'SLS' | 'MKT' | 'OPS' | 'HR' | 'FIN';
  kpiName: string;
  kpiWeight: string;
  baseBonus: number;
  planTarget: string;
  planNumeric: number;
  factActual: string;
  factNumeric: number;
  executionRate: number;
  calculatedBonus: number;
  bonusDelta: string;
  verificationStatus: 'verified_lead' | 'verified_coo' | 'verified' | 'needs_clarification';
  statusLabel: string;
}

export interface FinancialMetric {
  title: string;
  value: string;
  change: string;
  subtext: string;
}

export interface AuditEntry {
  id: string;
  timestamp: string;
  timeOnly?: string;
  event?: string;
  action?: string;
  category: string;
  actor?: string;
  user?: string;
  actorRole?: string;
  target?: string;
  module?: string;
  details: string;
  ipAddress?: string;
  ip?: string;
  session?: string;
  statusTag?: string;
  severity: 'info' | 'warning' | 'critical';
  hash: string;
}

export interface CorporateGoal {
  id: string;
  title: string;
  metric: string;
  type: 'Стратегічна (KPI в офері)' | 'Функціональна (KPI в офері)' | 'Стратегічна' | 'Функціональна';
  period: string;
  fullPlan: string;
  planToDate: string;
  factAuto: string;
  executionRate: number;
  status: 'completed' | 'borderline' | 'at_risk';
  direction: 'more' | 'less';
}

export interface DepartmentReportItem {
  id: string;
  deptCode: 'LOC' | 'SLS' | 'MKT' | 'OPS' | 'HR' | 'FIN';
  deptName: string;
  leadName: string;
  submittedTime: string;
  status: 'submitted' | 'returned' | 'approved';
  executionRate: number;
  deltaText: string;
  goalsCount: number;
  summaryNote: string;
  statusBadge: 'Виконано' | 'На межі' | 'Під ризиком';
  goalsList?: {
    code: string;
    name: string;
    weight: number;
    plan: string;
    fact: string;
    rate: number;
  }[];
}

export interface DiaryEntry {
  id: string;
  date: string;
  isToday?: boolean;
  deptCode?: string;
  company?: string;
  metricsSummary?: string;
  comment?: string;
  hours?: number;
  kpiMetric?: string;
  volume?: number;
  unit?: string;
  description?: string;
  status?: string;
  wordsCount?: number;
  projectsTotal?: number;
  projectsOnTime?: number;
  lqaErrors?: number;
  reworks?: number;
  auditStatus?: 'Синхронізовано' | 'Очікує';
}
