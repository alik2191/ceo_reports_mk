import React, { useState } from 'react';
import { ScreenId } from '../../types';

interface CompanyStructureScreenProps {
  onNavigate: (screen: ScreenId) => void;
}

interface DepartmentData {
  id: string;
  code: string;
  name: string;
  lead: string;
  leadRole: string;
  staffCount: number;
  planCount: number;
  breakdown: string[];
  performance: number;
  status: 'optimal' | 'overperformed' | 'risk' | 'warning';
  locations: string;
  company: 'MK Group' | 'MK:translations' | 'Localica';
}

const DEPARTMENTS: DepartmentData[] = [
  {
    id: 'loc',
    code: 'LOC',
    name: 'Локалізація та лінгвістика',
    lead: 'О. Ковальчук',
    leadRole: 'Тімлід локалізації',
    staffCount: 14,
    planCount: 14,
    breakdown: ['Редактори: 4', 'Перекладачі: 6', 'DTP & QA: 4'],
    performance: 96.5,
    status: 'optimal',
    locations: 'Варшава (6), Київ (8)',
    company: 'MK:translations',
  },
  {
    id: 'sls',
    code: 'SLS',
    name: 'Відділ корпоративних продажів',
    lead: 'І. Данченко',
    leadRole: 'Тімлід B2B продажів',
    staffCount: 8,
    planCount: 9,
    breakdown: ['Enterprise: 2', 'B2B SDR: 3', 'Key Account: 3'],
    performance: 104.2,
    status: 'overperformed',
    locations: 'Варшава (5), Віддалено (3)',
    company: 'MK Group',
  },
  {
    id: 'mkt',
    code: 'MKT',
    name: 'Маркетинг та генерація лідів',
    lead: 'В. Степаненко',
    leadRole: 'Head of Marketing',
    staffCount: 6,
    planCount: 6,
    breakdown: ['LeadGen: 2', 'PPC / Targeted: 2', 'Content & SMM: 2'],
    performance: 87.4,
    status: 'risk',
    locations: 'Київ (4), Варшава (2)',
    company: 'Localica',
  },
  {
    id: 'ops',
    code: 'OPS',
    name: 'Операційний менеджмент',
    lead: 'Ю. Савчук',
    leadRole: 'Head of Operations',
    staffCount: 7,
    planCount: 7,
    breakdown: ['Senior PM: 3', 'Координатори: 3', 'Vendor Manager: 1'],
    performance: 92.6,
    status: 'warning',
    locations: 'Варшава (4), Київ (3)',
    company: 'MK:translations',
  },
  {
    id: 'hr',
    code: 'HR',
    name: 'Відділ HR та найму',
    lead: 'М. Семенюк',
    leadRole: 'Head of People & Culture',
    staffCount: 4,
    planCount: 4,
    breakdown: ['Рекрутер (IT/Ling): 2', 'People Partner: 1', 'L&D Coordinator: 1'],
    performance: 98.0,
    status: 'optimal',
    locations: 'Київ (2), Варшава (2)',
    company: 'MK Group',
  },
  {
    id: 'fin',
    code: 'FIN',
    name: 'Фінансовий департамент',
    lead: 'Т. Бондар',
    leadRole: 'Фінансовий директор (CFO)',
    staffCount: 5,
    planCount: 5,
    breakdown: ['Фінменеджер: 1', 'Казначей: 1', 'Бухгалтери (PL/UA): 3'],
    performance: 95.8,
    status: 'optimal',
    locations: 'Київ (4), Варшава (1)',
    company: 'MK Group',
  },
];

export const CompanyStructureScreen: React.FC<CompanyStructureScreenProps> = ({ onNavigate }) => {
  const [selectedCompanyFilter, setSelectedCompanyFilter] = useState('all');
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [selectedDeptModal, setSelectedDeptModal] = useState<DepartmentData | null>(null);
  const [showAddPositionModal, setShowAddPositionModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showApprovalChainModal, setShowApprovalChainModal] = useState(false);
  const [showRoleProfileModal, setShowRoleProfileModal] = useState<string | null>(null);
  const [staffingListDept, setStaffingListDept] = useState<DepartmentData | null>(null);

  // Filtered departments based on company selector
  const filteredDepartments = DEPARTMENTS.filter((dept) => {
    if (selectedCompanyFilter === 'mk') return dept.company === 'MK:translations' || dept.company === 'MK Group';
    if (selectedCompanyFilter === 'localica') return dept.company === 'Localica' || dept.company === 'MK Group';
    return true;
  });

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 10, 130));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 10, 70));
  const handleResetZoom = () => setZoomLevel(100);

  return (
    <div id="screen-company-structure" className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto bg-slate-50">
      {/* ================= HEADER SECTION ================= */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-20 shadow-2xs" data-purpose="header-section">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Title & Subtitle */}
          <div>
            <div className="flex items-center space-x-2 text-xs text-slate-500 mb-1">
              <span>Організація</span>
              <span>/</span>
              <span className="text-slate-800 font-medium">Ієрархія підпорядкування</span>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-200">
                Консолідовано
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                ● Актуально
              </span>
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              Структура компанії · Організаційна ієрархія та матриця ролей
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Візуалізація підпорядкування 6 підрозділів холдингу MK:translations та Localica згідно з регламентом ТЗ (Розділ 4)
            </p>
          </div>

          {/* Header Actions */}
          <div className="flex items-center flex-wrap gap-2.5">
            {/* Filter Dropdown */}
            <div className="relative">
              <select
                value={selectedCompanyFilter}
                onChange={(e) => setSelectedCompanyFilter(e.target.value)}
                className="bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-700 pl-3 pr-8 py-2 hover:bg-slate-50 focus:ring-1 focus:ring-blue-500 focus:outline-none transition shadow-xs cursor-pointer"
              >
                <option value="all">Всі компанії (MK Group)</option>
                <option value="mk">Тільки MK:translations</option>
                <option value="localica">Тільки Localica</option>
              </select>
            </div>

            {/* Export Button */}
            <button
              onClick={() => setShowExportModal(true)}
              className="inline-flex items-center space-x-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-3 py-2 rounded-lg text-xs font-medium transition shadow-xs cursor-pointer"
              type="button"
            >
              <svg className="w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              </svg>
              <span>Експорт (PDF/SVG)</span>
            </button>

            {/* Primary Add Node Action */}
            <button
              onClick={() => setShowAddPositionModal(true)}
              className="inline-flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-2 rounded-lg text-xs font-semibold shadow-xs transition cursor-pointer"
              type="button"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M12 4v16m8-8H4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              </svg>
              <span>Додати позицію / вузол</span>
            </button>
          </div>
        </div>
      </header>

      {/* ================= SCROLLABLE WORKSPACE BODY ================= */}
      <div className="p-6 space-y-6">
        {/* ================= 4 TOP KPI CARDS ROW ================= */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" data-purpose="kpi-metrics-row">
          {/* Card 1: Всього співробітників */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs relative overflow-hidden flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span className="font-medium">Всього співробітників</span>
                <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                  </svg>
                </div>
              </div>
              <div className="text-2xl font-bold text-slate-900 tracking-tight">48 осіб</div>
            </div>
            <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
              <span className="text-emerald-600 font-medium flex items-center gap-1">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500"></span> 45 в основному штаті
              </span>
              <span className="text-slate-500 font-medium">+3 випробувальний</span>
            </div>
          </div>

          {/* Card 2: Структурні юніти */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs relative overflow-hidden flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span className="font-medium">Структурні юніти</span>
                <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                  </svg>
                </div>
              </div>
              <div className="text-2xl font-bold text-slate-900 tracking-tight">6 відділів</div>
            </div>
            <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
              <span className="text-emerald-600 font-medium">100% укомплектовано лідами</span>
              <span className="text-slate-400">LOC · SLS · MKT · OPS · HR · FIN</span>
            </div>
          </div>

          {/* Card 3: Рівні підпорядкування */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs relative overflow-hidden flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span className="font-medium">Рівні підпорядкування</span>
                <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                  </svg>
                </div>
              </div>
              <div className="text-2xl font-bold text-slate-900 tracking-tight">4 рівні</div>
            </div>
            <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
              <span className="text-slate-600 font-medium">CEO → C-Level → Ліди → Спеціалісти</span>
              <span className="text-blue-600 font-semibold">Оптимально</span>
            </div>
          </div>

          {/* Card 4: Вакансії у відкритті */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs relative overflow-hidden flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span className="font-medium">Вакансії у відкритті</span>
                <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                  </svg>
                </div>
              </div>
              <div className="text-2xl font-bold text-purple-700 tracking-tight">2 позиції</div>
            </div>
            <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
              <span className="text-slate-600 truncate">Senior ML Eng, Mid B2B Sales</span>
              <button
                onClick={() => onNavigate('kpi_offer')}
                className="text-blue-600 hover:text-blue-700 font-semibold cursor-pointer"
                type="button"
              >
                Перейти →
              </button>
            </div>
          </div>
        </section>

        {/* ================= ORG CHART TREE CONTAINER ================= */}
        <section className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden" data-purpose="org-matrix-visualization">
          {/* Controls Bar inside Canvas */}
          <div className="px-5 py-3 border-b border-slate-200 bg-slate-50/70 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-semibold text-slate-700">Масштаб схеми:</span>
              <div className="inline-flex rounded-lg border border-slate-300 bg-white shadow-2xs p-0.5 text-xs">
                <button
                  onClick={handleZoomOut}
                  className="px-2 py-1 hover:bg-slate-100 rounded text-slate-600 font-bold cursor-pointer"
                  type="button"
                >
                  −
                </button>
                <span className="px-2 py-1 text-slate-700 font-semibold border-x border-slate-200">
                  {zoomLevel}%
                </span>
                <button
                  onClick={handleZoomIn}
                  className="px-2 py-1 hover:bg-slate-100 rounded text-slate-600 font-bold cursor-pointer"
                  type="button"
                >
                  +
                </button>
              </div>
              <button
                onClick={handleResetZoom}
                className="text-xs text-slate-600 hover:text-slate-900 border border-slate-300 bg-white px-2.5 py-1 rounded-lg font-medium shadow-2xs hover:bg-slate-50 transition cursor-pointer"
                type="button"
              >
                Скинути вигляд
              </button>
              <button
                onClick={() => setSelectedCompanyFilter('all')}
                className="text-xs text-blue-600 hover:text-blue-700 border border-blue-200 bg-blue-50/50 px-2.5 py-1 rounded-lg font-medium transition cursor-pointer"
                type="button"
              >
                Розгорнути всі гілки
              </button>
            </div>

            {/* Color Legend */}
            <div className="flex items-center space-x-4 text-[11px] text-slate-600">
              <div className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-xs bg-blue-600"></span>
                <span>CEO / Керівництво</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-xs bg-indigo-600"></span>
                <span>C-Level дирекція</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-xs bg-emerald-600"></span>
                <span>Операційні ліди підрозділів</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>Активний статус</span>
              </div>
            </div>
          </div>

          {/* Visual Org Chart Canvas */}
          <div className="p-8 overflow-x-auto canvas-scroll bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px]">
            <div
              className="min-w-[1060px] flex flex-col items-center transition-transform duration-200 origin-top"
              style={{ transform: `scale(${zoomLevel / 100})` }}
            >
              {/* LEVEL 1: CEO NODE */}
              <div className="relative flex flex-col items-center" data-purpose="tree-level-ceo">
                {/* CEO Card */}
                <div className="w-80 bg-white rounded-xl border-2 border-blue-600 shadow-md p-4 transition-transform hover:-translate-y-0.5 hover:shadow-lg relative z-10">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center text-base shadow-xs ring-2 ring-blue-100">
                        ОК
                      </div>
                      <div>
                        <div className="flex items-center space-x-1.5">
                          <h3 className="text-sm font-bold text-slate-900">О. Ковальчук</h3>
                          <span className="w-2 h-2 rounded-full bg-emerald-500" title="В мережі / Варшава"></span>
                        </div>
                        <p className="text-xs font-semibold text-blue-600">Генеральний директор (CEO)</p>
                        <p className="text-[10px] text-slate-400">MK Group · Стратегічне управління</p>
                      </div>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 font-bold uppercase rounded-full bg-blue-100 text-blue-700">L1</span>
                  </div>
                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">
                      Прямих підлеглих: <strong className="text-slate-800">3 директори</strong>
                    </span>
                    <button
                      onClick={() => setShowRoleProfileModal('ceo')}
                      className="text-blue-600 hover:text-blue-700 font-medium cursor-pointer"
                      type="button"
                    >
                      Профіль посади →
                    </button>
                  </div>
                </div>
                {/* Line down from CEO */}
                <div className="w-0.5 h-10 bg-slate-300"></div>
              </div>

              {/* LEVEL 2: C-LEVEL / DIRECTORS */}
              <div className="relative w-full flex flex-col items-center" data-purpose="tree-level-directors">
                {/* Horizontal Bridge connecting C-levels */}
                <div className="w-[780px] h-0.5 bg-slate-300"></div>

                {/* 3 Directors Columns */}
                <div className="w-[840px] flex justify-between pt-4">
                  {/* Director 1: COO (Operations Lead) */}
                  <div className="w-64 flex flex-col items-center relative">
                    <div className="w-0.5 h-4 bg-slate-300 absolute -top-4"></div>
                    <div className="w-full bg-white rounded-xl border border-indigo-200 shadow-xs p-3.5 hover:shadow-md transition">
                      <div className="flex items-center space-x-2.5">
                        <div className="w-10 h-10 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-700 font-bold flex items-center justify-center text-sm">
                          КМ
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="text-xs font-bold text-slate-900 truncate">К. Марченко</h4>
                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-700 font-semibold">
                              COO
                            </span>
                          </div>
                          <p className="text-[11px] font-medium text-slate-600 truncate">Операційний директор</p>
                          <p className="text-[10px] text-slate-400">Курує 5 операційних відділів</p>
                        </div>
                      </div>
                      <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
                        <span>Команда: <strong>35 людей</strong></span>
                        <button
                          onClick={() => setShowRoleProfileModal('coo')}
                          className="text-indigo-600 font-semibold hover:underline cursor-pointer"
                        >
                          Офіс Варшава
                        </button>
                      </div>
                    </div>
                    {/* Connector from COO down to Departments */}
                    <div className="w-0.5 h-12 bg-indigo-300"></div>
                  </div>

                  {/* Director 2: CFO (Finance Lead) */}
                  <div className="w-64 flex flex-col items-center relative">
                    <div className="w-0.5 h-4 bg-slate-300 absolute -top-4"></div>
                    <div className="w-full bg-white rounded-xl border border-slate-200 shadow-xs p-3.5 hover:shadow-md transition">
                      <div className="flex items-center space-x-2.5">
                        <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold flex items-center justify-center text-sm">
                          ТБ
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="text-xs font-bold text-slate-900 truncate">Т. Бондар</h4>
                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold">
                              CFO
                            </span>
                          </div>
                          <p className="text-[11px] font-medium text-slate-600 truncate">Фінансовий директор / Головбух</p>
                          <p className="text-[10px] text-slate-400">Холдинговий аудит та казначейство</p>
                        </div>
                      </div>
                      <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
                        <span>Команда: <strong>5 людей (FIN)</strong></span>
                        <button
                          onClick={() => setShowRoleProfileModal('cfo')}
                          className="text-slate-600 font-semibold hover:underline cursor-pointer"
                        >
                          Київ / Ремоут
                        </button>
                      </div>
                    </div>
                    {/* Connector down to FIN department */}
                    <div className="w-0.5 h-12 bg-emerald-300"></div>
                  </div>

                  {/* Director 3: CTO (Chief Tech Officer) */}
                  <div className="w-64 flex flex-col items-center relative">
                    <div className="w-0.5 h-4 bg-slate-300 absolute -top-4"></div>
                    <div className="w-full bg-white rounded-xl border border-slate-200 shadow-xs p-3.5 hover:shadow-md transition">
                      <div className="flex items-center space-x-2.5">
                        <div className="w-10 h-10 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 font-bold flex items-center justify-center text-sm">
                          ВГ
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="text-xs font-bold text-slate-900 truncate">В. Грицай</h4>
                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 font-semibold">
                              CTO
                            </span>
                          </div>
                          <p className="text-[11px] font-medium text-slate-600 truncate">Chief Technology Officer</p>
                          <p className="text-[10px] text-slate-400">CRM, AI-пайплайн, CAT-системи</p>
                        </div>
                      </div>
                      <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
                        <span>Команда: <strong>4 ML/Dev</strong></span>
                        <button
                          onClick={() => onNavigate('kpi_offer')}
                          className="text-amber-600 font-medium hover:underline cursor-pointer"
                        >
                          1 відкрита вак.
                        </button>
                      </div>
                    </div>
                    {/* Standalone functional branch line */}
                    <div className="w-0.5 h-6 bg-slate-300"></div>
                    <span className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-500 rounded border border-slate-200 font-medium">
                      Інфраструктура
                    </span>
                  </div>
                </div>
              </div>

              {/* LEVEL 3: OPERATIONAL UNITS & DEPARTMENTS GRID */}
              <div className="w-full mt-2 relative" data-purpose="tree-level-departments">
                {/* Horizontal branch connector for COO's departments */}
                <div className="w-[880px] h-0.5 bg-indigo-300 mx-auto"></div>

                {/* 6 Structural Department Nodes */}
                <div className="grid grid-cols-6 gap-3 pt-4">
                  {/* Unit 1: Відділ локалізації (LOC) */}
                  <div className="flex flex-col items-center">
                    <div className="w-0.5 h-4 bg-indigo-300 -mt-4 mb-0"></div>
                    <div className="w-full bg-white rounded-lg border border-blue-200 shadow-xs p-3 hover:border-blue-400 transition flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-blue-100 text-blue-800 border border-blue-200">
                            LOC
                          </span>
                          <span className="text-[10px] font-semibold text-slate-500">14 фахівців</span>
                        </div>
                        <h5 className="text-xs font-bold text-slate-900 leading-tight">Локалізація</h5>
                        <p className="text-[10px] text-slate-500 mt-0.5 mb-2">Тімлід: <strong>О. Ковальчук</strong></p>
                        <div className="text-[9px] text-slate-600 bg-slate-50 p-1.5 rounded border border-slate-100 space-y-0.5">
                          <p>• Редактори: 4</p>
                          <p>• Перекладачі: 6</p>
                          <p>• DTP &amp; QA: 4</p>
                        </div>
                      </div>
                      <div className="mt-2 pt-1.5 border-t border-slate-100 flex items-center justify-between text-[9px]">
                        <span className="text-emerald-600 font-semibold">Виконання: 96.5%</span>
                        <button
                          onClick={() => setSelectedDeptModal(DEPARTMENTS[0])}
                          className="text-blue-600 hover:underline font-bold cursor-pointer"
                          type="button"
                        >
                          Деталі
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Unit 2: Відділ продажів (SLS) */}
                  <div className="flex flex-col items-center">
                    <div className="w-0.5 h-4 bg-indigo-300 -mt-4 mb-0"></div>
                    <div className="w-full bg-white rounded-lg border border-emerald-200 shadow-xs p-3 hover:border-emerald-400 transition flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                            SLS
                          </span>
                          <span className="text-[10px] font-semibold text-slate-500">8 фахівців</span>
                        </div>
                        <h5 className="text-xs font-bold text-slate-900 leading-tight">Продажі</h5>
                        <p className="text-[10px] text-slate-500 mt-0.5 mb-2">Тімлід: <strong>І. Данченко</strong></p>
                        <div className="text-[9px] text-slate-600 bg-slate-50 p-1.5 rounded border border-slate-100 space-y-0.5">
                          <p>• Enterprise: 2</p>
                          <p>• B2B SDR: 3</p>
                          <p>• Key Account: 3</p>
                        </div>
                      </div>
                      <div className="mt-2 pt-1.5 border-t border-slate-100 flex items-center justify-between text-[9px]">
                        <span className="text-emerald-600 font-semibold">Виконання: 104.2%</span>
                        <button
                          onClick={() => setSelectedDeptModal(DEPARTMENTS[1])}
                          className="text-blue-600 hover:underline font-bold cursor-pointer"
                          type="button"
                        >
                          Деталі
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Unit 3: Відділ маркетингу (MKT) */}
                  <div className="flex flex-col items-center">
                    <div className="w-0.5 h-4 bg-indigo-300 -mt-4 mb-0"></div>
                    <div className="w-full bg-white rounded-lg border border-rose-200 shadow-xs p-3 hover:border-rose-400 transition flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-rose-100 text-rose-800 border border-rose-200">
                            MKT
                          </span>
                          <span className="text-[10px] font-semibold text-slate-500">6 фахівців</span>
                        </div>
                        <h5 className="text-xs font-bold text-slate-900 leading-tight">Маркетинг</h5>
                        <p className="text-[10px] text-slate-500 mt-0.5 mb-2">Тімлід: <strong>В. Степаненко</strong></p>
                        <div className="text-[9px] text-slate-600 bg-slate-50 p-1.5 rounded border border-slate-100 space-y-0.5">
                          <p>• LeadGen: 2</p>
                          <p>• PPC / Targeted: 2</p>
                          <p>• Content &amp; SMM: 2</p>
                        </div>
                      </div>
                      <div className="mt-2 pt-1.5 border-t border-slate-100 flex items-center justify-between text-[9px]">
                        <span className="text-rose-600 font-bold">Під ризиком (87.4%)</span>
                        <button
                          onClick={() => setSelectedDeptModal(DEPARTMENTS[2])}
                          className="text-blue-600 hover:underline font-bold cursor-pointer"
                          type="button"
                        >
                          Деталі
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Unit 4: Операційний відділ (OPS) */}
                  <div className="flex flex-col items-center">
                    <div className="w-0.5 h-4 bg-indigo-300 -mt-4 mb-0"></div>
                    <div className="w-full bg-white rounded-lg border border-amber-200 shadow-xs p-3 hover:border-amber-400 transition flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-amber-100 text-amber-800 border border-amber-200">
                            OPS
                          </span>
                          <span className="text-[10px] font-semibold text-slate-500">7 фахівців</span>
                        </div>
                        <h5 className="text-xs font-bold text-slate-900 leading-tight">Операції</h5>
                        <p className="text-[10px] text-slate-500 mt-0.5 mb-2">Тімлід: <strong>Ю. Савчук</strong></p>
                        <div className="text-[9px] text-slate-600 bg-slate-50 p-1.5 rounded border border-slate-100 space-y-0.5">
                          <p>• Senior PM: 3</p>
                          <p>• Координатори: 3</p>
                          <p>• Vendor Manager: 1</p>
                        </div>
                      </div>
                      <div className="mt-2 pt-1.5 border-t border-slate-100 flex items-center justify-between text-[9px]">
                        <span className="text-amber-600 font-semibold">Виконання: 92.6%</span>
                        <button
                          onClick={() => setSelectedDeptModal(DEPARTMENTS[3])}
                          className="text-blue-600 hover:underline font-bold cursor-pointer"
                          type="button"
                        >
                          Деталі
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Unit 5: Відділ HR та талантів (HR) */}
                  <div className="flex flex-col items-center">
                    <div className="w-0.5 h-4 bg-indigo-300 -mt-4 mb-0"></div>
                    <div className="w-full bg-white rounded-lg border border-violet-200 shadow-xs p-3 hover:border-violet-400 transition flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-violet-100 text-violet-800 border border-violet-200">
                            HR
                          </span>
                          <span className="text-[10px] font-semibold text-slate-500">4 фахівці</span>
                        </div>
                        <h5 className="text-xs font-bold text-slate-900 leading-tight">HR &amp; Таланти</h5>
                        <p className="text-[10px] text-slate-500 mt-0.5 mb-2">Тімлід: <strong>М. Семенюк</strong></p>
                        <div className="text-[9px] text-slate-600 bg-slate-50 p-1.5 rounded border border-slate-100 space-y-0.5">
                          <p>• Рекрутер (IT/Ling): 2</p>
                          <p>• People Partner: 1</p>
                          <p>• L&amp;D Coordinator: 1</p>
                        </div>
                      </div>
                      <div className="mt-2 pt-1.5 border-t border-slate-100 flex items-center justify-between text-[9px]">
                        <span className="text-emerald-600 font-semibold">Виконання: 98.0%</span>
                        <button
                          onClick={() => setSelectedDeptModal(DEPARTMENTS[4])}
                          className="text-blue-600 hover:underline font-bold cursor-pointer"
                          type="button"
                        >
                          Деталі
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Unit 6: Фінансовий департамент (FIN - підпорядкований CFO) */}
                  <div className="flex flex-col items-center">
                    <div className="w-0.5 h-4 bg-emerald-300 -mt-4 mb-0"></div>
                    <div className="w-full bg-white rounded-lg border border-emerald-200 shadow-xs p-3 hover:border-emerald-400 transition flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                            FIN
                          </span>
                          <span className="text-[10px] font-semibold text-slate-500">5 фахівців</span>
                        </div>
                        <h5 className="text-xs font-bold text-slate-900 leading-tight">Фінанси</h5>
                        <p className="text-[10px] text-slate-500 mt-0.5 mb-2">Керівник: <strong>Т. Бондар (CFO)</strong></p>
                        <div className="text-[9px] text-slate-600 bg-slate-50 p-1.5 rounded border border-slate-100 space-y-0.5">
                          <p>• Фінменеджер: 1</p>
                          <p>• Казначей: 1</p>
                          <p>• Бухгалтери (PL/UA): 3</p>
                        </div>
                      </div>
                      <div className="mt-2 pt-1.5 border-t border-slate-100 flex items-center justify-between text-[9px]">
                        <span className="text-emerald-600 font-semibold">Виконання: 95.8%</span>
                        <button
                          onClick={() => setSelectedDeptModal(DEPARTMENTS[5])}
                          className="text-blue-600 hover:underline font-bold cursor-pointer"
                          type="button"
                        >
                          Деталі
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Matrix Summary Footer Drawer inside Chart Card */}
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col md:flex-row md:items-center md:justify-between gap-3 text-xs text-slate-600">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0"></span>
              <span className="font-medium text-slate-800">
                Регламент змін структури (ТЗ розділ 4):
              </span>
              <span className="text-slate-500">
                Будь-які зміни підпорядкування автоматично оновлюють матрицю доступу та маршрути регламентної щотижневої звітності.
              </span>
            </div>
            <div className="flex items-center space-x-3 self-end md:self-auto shrink-0">
              <button
                onClick={() => onNavigate('audit')}
                className="text-blue-600 hover:underline font-medium cursor-pointer"
                type="button"
              >
                Журнал змін ієрархії →
              </button>
              <button
                onClick={() => setShowApprovalChainModal(true)}
                className="px-2.5 py-1 rounded bg-white border border-slate-300 hover:bg-slate-50 font-medium text-slate-700 shadow-2xs transition cursor-pointer"
                type="button"
              >
                Перевірити ланцюги узгодження
              </button>
            </div>
          </div>
        </section>

        {/* ================= DEPARTMENT STAFFING TABLE ================= */}
        <section className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden" data-purpose="department-matrix-table">
          <div className="px-5 py-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Укомплектованість підрозділів холдингу</h2>
              <p className="text-xs text-slate-500">Розподіл штатних позицій, лідів та фокусних локацій (Польща / Україна / Remotely)</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200 self-start sm:self-auto">
              Всього ставок: 50 (48 зайнято)
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50/80 text-[11px] uppercase tracking-wider text-slate-500 font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Підрозділ (Код)</th>
                  <th className="px-4 py-3">Керівник / Тімлід</th>
                  <th className="px-4 py-3">Штат (Факт / План)</th>
                  <th className="px-4 py-3">Локації персоналу</th>
                  <th className="px-4 py-3">Статус KPI тижня</th>
                  <th className="px-4 py-3 text-right">Дії</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-normal">
                {filteredDepartments.map((dept) => (
                  <tr key={dept.id} className="hover:bg-slate-50/60 transition">
                    <td className="px-4 py-3 font-semibold text-slate-900">
                      <div className="flex items-center space-x-2">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            dept.status === 'optimal'
                              ? 'bg-blue-500'
                              : dept.status === 'overperformed'
                              ? 'bg-emerald-500'
                              : dept.status === 'risk'
                              ? 'bg-rose-500'
                              : 'bg-amber-500'
                          }`}
                        ></span>
                        <span>{dept.name} ({dept.code})</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-800">{dept.lead} ({dept.leadRole.split(' ')[0]})</td>
                    <td className="px-4 py-3 font-medium">
                      {dept.staffCount} / {dept.planCount}{' '}
                      <span className="text-slate-400">
                        ({dept.staffCount === dept.planCount ? '100%' : `${dept.planCount - dept.staffCount} вакансія`})
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-500">{dept.locations}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold ${
                          dept.status === 'overperformed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : dept.status === 'optimal'
                            ? 'bg-emerald-100 text-emerald-800'
                            : dept.status === 'risk'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {dept.performance}% {dept.status === 'risk' ? 'Під ризиком' : dept.status === 'overperformed' ? 'Перевиконано' : 'Виконано'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => setStaffingListDept(dept)}
                        className="text-blue-600 hover:text-blue-800 font-semibold cursor-pointer"
                        type="button"
                      >
                        Список співробітників
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {/* ================= MODAL: ДЕТАЛІ ПІДРОЗДІЛУ ================= */}
      {selectedDeptModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                  {selectedDeptModal.code} · {selectedDeptModal.company}
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-1.5">{selectedDeptModal.name}</h3>
                <p className="text-xs text-slate-500">Керівник: {selectedDeptModal.lead} ({selectedDeptModal.leadRole})</p>
              </div>
              <button
                onClick={() => setSelectedDeptModal(null)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2.5 text-xs border-y border-slate-100 py-3">
              <div className="flex justify-between">
                <span className="text-slate-500">Поточний штат / план:</span>
                <span className="font-bold text-slate-800">
                  {selectedDeptModal.staffCount} із {selectedDeptModal.planCount} ставок ({selectedDeptModal.staffCount === selectedDeptModal.planCount ? '100% укомплектовано' : 'Є вакансії'})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Інтегральне виконання KPI тижня:</span>
                <span className={`font-extrabold ${selectedDeptModal.performance < 90 ? 'text-rose-600' : 'text-emerald-600'}`}>
                  {selectedDeptModal.performance}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Основні робочі хаби:</span>
                <span className="font-medium text-slate-700">{selectedDeptModal.locations}</span>
              </div>
              <div className="pt-2">
                <span className="text-slate-500 block mb-1">Штатний розпис за ролями:</span>
                <div className="grid grid-cols-2 gap-1.5 bg-slate-50 p-2 rounded-lg border border-slate-100">
                  {selectedDeptModal.breakdown.map((item, idx) => (
                    <span key={idx} className="text-slate-700 font-medium">• {item}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => {
                  setSelectedDeptModal(null);
                  onNavigate('catalog');
                }}
                className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs rounded-xl transition cursor-pointer"
              >
                Каталог фахівців
              </button>
              <button
                onClick={() => {
                  setSelectedDeptModal(null);
                  onNavigate('reports');
                }}
                className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition cursor-pointer"
              >
                Перейти до звіту відділу
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: СПИСОК СПІВРОБІТНИКІВ ПІДРОЗДІЛУ ================= */}
      {staffingListDept && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                  {staffingListDept.code}
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-1">
                  Штат підрозділу: {staffingListDept.name}
                </h3>
                <p className="text-xs text-slate-500">Усього {staffingListDept.staffCount} співробітників · Тімлід: {staffingListDept.lead}</p>
              </div>
              <button
                onClick={() => setStaffingListDept(null)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 block">{staffingListDept.lead}</span>
                  <span className="text-[11px] text-slate-500">{staffingListDept.leadRole}</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 text-[10px] font-bold">Team Lead</span>
              </div>
              {staffingListDept.breakdown.map((item, idx) => (
                <div key={idx} className="p-2.5 rounded-lg bg-white border border-slate-100 flex items-center justify-between">
                  <span className="font-medium text-slate-800">{item}</span>
                  <span className="text-slate-400 text-[11px]">{staffingListDept.locations.split(',')[0]}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setStaffingListDept(null)}
                className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 cursor-pointer"
              >
                Закрити
              </button>
              <button
                onClick={() => {
                  setStaffingListDept(null);
                  onNavigate('catalog');
                }}
                className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold cursor-pointer"
              >
                Відкрити в Корпоративному каталозі →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: ДОДАТИ ПОЗИЦІЮ / ВУЗОЛ ================= */}
      {showAddPositionModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">Додати позицію / вузол у структуру</h3>
                <p className="text-xs text-slate-500 mt-0.5">Створення нового структурного юніта або штатної позиції за регламентом ТЗ</p>
              </div>
              <button
                onClick={() => setShowAddPositionModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert('Запит на додавання посади направлено на погодження CEO / CFO');
                setShowAddPositionModal(false);
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Назва посади / позиції</label>
                <input
                  type="text"
                  required
                  placeholder="напр. Senior Localization Engineer"
                  className="w-full border border-slate-300 rounded-lg p-2 bg-slate-50 focus:bg-white focus:ring-1 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Підпорядкування (Батьківський вузол)</label>
                <select className="w-full border border-slate-300 rounded-lg p-2 bg-slate-50 focus:bg-white focus:ring-1 focus:ring-blue-500 focus:outline-none">
                  <option>COO (К. Марченко) → Локалізація (LOC)</option>
                  <option>COO (К. Марченко) → Продажі (SLS)</option>
                  <option>COO (К. Марченко) → Маркетинг (MKT)</option>
                  <option>COO (К. Марченко) → Операції (OPS)</option>
                  <option>COO (К. Марченко) → HR (HR)</option>
                  <option>CFO (Т. Бондар) → Фінанси (FIN)</option>
                  <option>CTO (В. Грицай) → Інфраструктура / ML</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Компанія</label>
                  <select className="w-full border border-slate-300 rounded-lg p-2 bg-slate-50 focus:bg-white focus:ring-1 focus:ring-blue-500 focus:outline-none">
                    <option>MK:translations</option>
                    <option>Localica</option>
                    <option>MK Group (Holding)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Локація</label>
                  <select className="w-full border border-slate-300 rounded-lg p-2 bg-slate-50 focus:bg-white focus:ring-1 focus:ring-blue-500 focus:outline-none">
                    <option>Варшава (Офіс)</option>
                    <option>Київ (Офіс)</option>
                    <option>Remote (ЄС / Україна)</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddPositionModal(false)}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50 cursor-pointer"
                >
                  Скасувати
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold cursor-pointer"
                >
                  Надіслати на узгодження
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: ЕКСПОРТ ДІАГРАМИ ================= */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">Експорт організаційної структури</h3>
                <p className="text-xs text-slate-500 mt-0.5">Формування векторного звіту холдингу MK Group</p>
              </div>
              <button
                onClick={() => setShowExportModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              <label className="p-3 rounded-xl border border-blue-200 bg-blue-50/50 flex items-center justify-between cursor-pointer">
                <div className="flex items-center gap-2.5">
                  <input type="radio" name="exportFmt" defaultChecked className="text-blue-600" />
                  <div>
                    <span className="font-bold text-slate-900 block">PDF Документ (Векторний альбомний)</span>
                    <span className="text-[11px] text-slate-500">Включає ієрархічне дерево та штатну таблицю укомплектованості</span>
                  </div>
                </div>
                <span className="font-mono text-blue-700 font-bold">.pdf</span>
              </label>

              <label className="p-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-between cursor-pointer">
                <div className="flex items-center gap-2.5">
                  <input type="radio" name="exportFmt" className="text-blue-600" />
                  <div>
                    <span className="font-bold text-slate-900 block">SVG Векторна схема</span>
                    <span className="text-[11px] text-slate-500">Для інтеграції в корпоративні презентації Miro/Figma</span>
                  </div>
                </div>
                <span className="font-mono text-slate-700 font-bold">.svg</span>
              </label>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setShowExportModal(false)}
                className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50 cursor-pointer"
              >
                Закрити
              </button>
              <button
                onClick={() => {
                  alert('Файл структури MK Group успішно згенеровано та завантажено!');
                  setShowExportModal(false);
                }}
                className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold cursor-pointer"
              >
                Завантажити файл
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: ПРОФІЛЬ ПОСАДИ (CEO / COO / CFO) ================= */}
      {showRoleProfileModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                  {showRoleProfileModal.toUpperCase()} · Top Executive
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-1">
                  {showRoleProfileModal === 'ceo'
                    ? 'О. Ковальчук — Генеральний директор (CEO)'
                    : showRoleProfileModal === 'coo'
                    ? 'К. Марченко — Операційний директор (COO)'
                    : 'Т. Бондар — Фінансовий директор (CFO)'}
                </h3>
                <p className="text-xs text-slate-500">
                  {showRoleProfileModal === 'ceo'
                    ? 'Стратегічний розвиток, OKR холдингу, інвестиції'
                    : showRoleProfileModal === 'coo'
                    ? 'Операційне лідерство, дедлайни звітів, 5 підрозділів'
                    : 'Казначейство, аудит, фінансові плани'}
                </p>
              </div>
              <button
                onClick={() => setShowRoleProfileModal(null)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs border-y border-slate-100 py-3">
              <div className="flex justify-between">
                <span className="text-slate-500">Локація:</span>
                <span className="font-bold text-slate-800">Варшава HQ</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Права в системі:</span>
                <span className="font-bold text-blue-700">Full SuperAdmin / Executive</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Корпоративна пошта:</span>
                <span className="font-mono text-slate-700">
                  {showRoleProfileModal}@mk-translations.com
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowRoleProfileModal(null)}
                className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 cursor-pointer"
              >
                Закрити
              </button>
              <button
                onClick={() => {
                  const target = showRoleProfileModal === 'ceo' ? 'ceo' : showRoleProfileModal === 'coo' ? 'coo' : 'fin_analyst';
                  setShowRoleProfileModal(null);
                  onNavigate(target as ScreenId);
                }}
                className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold cursor-pointer"
              >
                Перейти до робочої панелі →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: ЛАНЦЮГИ УЗГОДЖЕННЯ (APPROVAL CHAINS) ================= */}
      {showApprovalChainModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">Ланцюги регламентного узгодження</h3>
                <p className="text-xs text-slate-500 mt-0.5">Відповідність регламенту ТЗ розділ 4</p>
              </div>
              <button
                onClick={() => setShowApprovalChainModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="font-bold text-slate-900 block">1. Щотижневі звіти підрозділів (Понеділок 12:00)</span>
                <p className="text-slate-600">
                  Тімліди (LOC, SLS, MKT, OPS, HR) ➔ Автоматична консолідація ➔ COO (К. Марченко)
                </p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="font-bold text-slate-900 block">2. Зведений операційний зріз (Понеділок 15:00)</span>
                <p className="text-slate-600">
                  COO (К. Марченко) + CFO (Т. Бондар) ➔ Фінальний звіт холдингу ➔ CEO (О. Ковальчук)
                </p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="font-bold text-slate-900 block">3. Затвердження оферу кандидата з сіткою KPI</span>
                <p className="text-slate-600">
                  HR (М. Семенюк) ➔ Тімлід підрозділу ➔ Верифікація Бухгалтерією / CFO ➔ CEO
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end pt-2 border-t border-slate-100">
              <button
                onClick={() => setShowApprovalChainModal(false)}
                className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold cursor-pointer"
              >
                Зрозуміло
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
