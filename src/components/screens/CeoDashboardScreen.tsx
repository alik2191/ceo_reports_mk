import React, { useState } from 'react';
import { ScreenId } from '../../types';
import { FINANCIAL_PL_ROWS, MOCK_DEPARTMENTS } from '../../data/mockData';

interface CeoDashboardScreenProps {
  onNavigate: (screen: ScreenId) => void;
}

export const CeoDashboardScreen: React.FC<CeoDashboardScreenProps> = ({ onNavigate }) => {
  const [showExplainer, setShowExplainer] = useState(false);
  const [attentionOpen, setAttentionOpen] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState('Жовтень 2024');
  const [escalationsApproved, setEscalationsApproved] = useState<Record<string, boolean>>({});

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 700);
  };

  const handleApproveEscalation = (id: string, title: string) => {
    setEscalationsApproved((prev) => ({ ...prev, [id]: true }));
    alert(`Ескалацію «${title}» успішно погоджено генеральним директором (CEO).`);
  };

  return (
    <div id="screen-ceo-dashboard" className="flex-1 flex flex-col min-w-0 bg-slate-50">
      {/* ================= TOP-BAR HEADER ================= */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-8 py-3.5 shadow-xs flex items-center justify-between gap-4 flex-wrap">
        {/* Page Title & Scope */}
        <div className="flex flex-col">
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Панель CEO · Єдиний дашборд холдингу
            </h1>
            <span className="px-2.5 py-0.5 rounded-md bg-blue-100 text-blue-800 text-xs font-bold ring-1 ring-blue-700/20">
              Єдина статистика 2-х компаній
            </span>
            <span className="inline-flex items-center gap-1 text-xs text-emerald-700 font-semibold px-2 py-0.5 rounded-md bg-emerald-50 ring-1 ring-emerald-600/10">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              MK:translations + Localica.io
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Єдиний дашборд: консолідовані дані та зведена статистика обох компаній · {selectedMonth} · Валюта: EUR (€)
          </p>
        </div>

        {/* Action Buttons & Quick Utilities */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-lg text-xs font-medium text-slate-600 mr-1">
            <span className="material-symbols-outlined text-[15px] text-slate-500">schedule</span>
            <span>18 Жовтня, 14:45 (Warsaw)</span>
          </div>

          <button
            onClick={handleRefresh}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs transition-all ${
              isRefreshing ? 'animate-pulse' : ''
            }`}
            type="button"
          >
            <span className="material-symbols-outlined text-[16px] text-slate-500">refresh</span>
            <span>Оновити</span>
          </button>

          {/* Export Excel with Tooltip */}
          <div className="relative group">
            <button
              onClick={() => alert('Експорт консолідованої книги .xlsx (Аркуші: Відділи KPI, План цілей, Фінанси та маржа)')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs transition-all cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-[16px] text-emerald-600">table_view</span>
              <span>Експорт Excel</span>
              <span className="material-symbols-outlined text-[14px] text-slate-400">info</span>
            </button>
            <div className="absolute right-0 top-full mt-1.5 w-60 p-2.5 bg-slate-900 text-slate-200 text-[11px] rounded-lg shadow-xl opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity z-50">
              <div className="font-bold text-white mb-1">Структура книги (.xlsx):</div>
              <ul className="space-y-1 text-slate-300">
                <li className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>Аркуш 1: Відділи KPI (факт)
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>Аркуш 2: План цілей холдингу
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>Аркуш 3: Фінанси та маржа групи
                </li>
              </ul>
            </div>
          </div>

          <button
            onClick={() => setShowExplainer(!showExplainer)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs shadow-blue-600/20 transition-all cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[16px]">help</span>
            <span>Довідка по KPI</span>
          </button>
        </div>
      </header>

      {/* ================= CONTENT BODY ================= */}
      <div className="p-8 space-y-6 max-w-7xl mx-auto w-full">
        {/* KPI EXPLAINER COLLAPSIBLE BANNER */}
        {showExplainer && (
          <div className="bg-gradient-to-r from-blue-900 to-indigo-950 text-white p-5 rounded-2xl shadow-lg ring-1 ring-blue-500/20 relative overflow-hidden transition-all animate-in fade-in duration-200">
            <div className="flex items-start justify-between relative z-10">
              <div className="flex items-center gap-2 text-blue-300 font-bold text-sm">
                <span className="material-symbols-outlined text-yellow-400">lightbulb</span>
                Методологія та ключові бізнес-правила розрахунку KPI
              </div>
              <button
                onClick={() => setShowExplainer(false)}
                className="text-slate-400 hover:text-white transition-colors"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3 text-xs text-slate-200">
              <div className="bg-white/10 p-3 rounded-xl backdrop-blur-xs border border-white/10">
                <div className="font-bold text-white mb-1">Правило обмеження (Cap 150%)</div>
                Внесок однієї конкретної цілі в інтегральний результат відділу обмежено стелею 150%, щоб запобігти викривленню показників за рахунок другорядних метрик.
              </div>
              <div className="bg-white/10 p-3 rounded-xl backdrop-blur-xs border border-white/10">
                <div className="font-bold text-white mb-1">Операційна виручка-факт</div>
                Накопичувальний розрахунок на основі щоденних звітів відділу продажів SLS, підтверджених верифікованими банківськими виписками та закритими інвойсами.
              </div>
              <div className="bg-white/10 p-3 rounded-xl backdrop-blur-xs border border-white/10">
                <div className="font-bold text-white mb-1">Консолідована маржа групи</div>
                Розраховується суворо з суми консолідованого валового прибутку до консолідованої виручки за формулою (GP / Rev) * 100%, а не середньоарифметично.
              </div>
            </div>
          </div>
        )}

        {/* ================= 3. ВЕРХНІЙ РЯД KPI CARDS ================= */}
        <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {/* KPI 1: Середнє виконання */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Середнє виконання
                </span>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-slate-900 tracking-tight">94.2%</span>
                  <span className="text-xs font-semibold text-emerald-600 flex items-center">
                    <span className="material-symbols-outlined text-[14px]">arrow_upward</span> +3.1%
                  </span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <span className="material-symbols-outlined text-[20px]">analytics</span>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="inline-flex items-center gap-1 font-semibold text-slate-600">
                <span className="w-2 h-2 rounded-full bg-blue-600"></span> В межах норми
              </span>
              <span className="text-[11px] text-slate-400 font-medium">Ліміт внеску 150%</span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-2">
              <div className="bg-blue-600 h-full rounded-full" style={{ width: '94.2%' }}></div>
            </div>
          </div>

          {/* KPI 2: Операційна виручка-факт */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Операційна виручка-факт
                </span>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-slate-900 tracking-tight">128 450 €</span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <span className="material-symbols-outlined text-[20px]">payments</span>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">95.1% від місячного плану</span>
              <span className="text-emerald-600 font-bold text-[11px]">+6 550 € до темпу</span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-2">
              <div className="bg-emerald-500 h-full rounded-full" style={{ width: '95.1%' }}></div>
            </div>
          </div>

          {/* KPI 3: Операційний план на дату */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Операційний план на дату
                </span>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-slate-900 tracking-tight">135 000 €</span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                <span className="material-symbols-outlined text-[20px]">flag_circle</span>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">Загальний графік місяця</span>
              <span className="text-amber-600 font-bold text-[11px]">Дельта: -6 550 €</span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-2">
              <div className="bg-indigo-500 h-full rounded-full" style={{ width: '100%' }}></div>
            </div>
          </div>

          {/* KPI 4: Відділи під ризиком */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between ring-1 ring-rose-100">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Відділи під ризиком (&lt;90%)
                </span>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-rose-600 tracking-tight">1</span>
                  <span className="text-xs font-semibold text-slate-500">з 6 відділів</span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
                <span className="material-symbols-outlined text-[20px]">warning</span>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="inline-flex items-center gap-1 font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded">
                Маркетинг (MKT)
              </span>
              <span className="text-rose-600 font-extrabold text-[11px]">87.4% виконання</span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-2">
              <div className="bg-rose-500 h-full rounded-full" style={{ width: '87.4%' }}></div>
            </div>
          </div>
        </section>

        {/* ================= ЄДИНИЙ КОНТУР: СТАТИСТИКА 2-Х КОМПАНІЙ (MK:translations + Localica.io) ================= */}
        <section className="bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 text-white rounded-2xl p-6 shadow-md border border-slate-800 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <h2 className="text-base font-bold text-white tracking-tight">
                  Єдина статистика 2-х компаній холдингу
                </h2>
                <span className="px-2.5 py-0.5 rounded-md bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-500/30">
                  MK:translations &amp; Localica.io
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Консолідований огляд ключових показників без розділення на окремі екрани
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold">
              <span className="px-3 py-1 rounded-lg bg-white/10 text-slate-200 border border-white/10">
                Загальна виручка: <strong className="text-white font-mono font-bold">142 800 €</strong>
              </span>
              <span className="px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Маржа: <strong className="font-mono font-bold">24.40%</strong>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Company 1: MK:translations */}
            <div className="bg-slate-800/80 rounded-xl p-4 border border-blue-500/30 flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center text-sm shadow-xs">
                      MK
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-sm">MK:translations</h3>
                      <span className="text-[11px] text-slate-400">Core Agency · Локалізація</span>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300">
                    66.0% частка
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-700/60 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Виручка</span>
                    <span className="text-base font-extrabold text-white font-mono">94 200 €</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Прибуток</span>
                    <span className="text-base font-extrabold text-emerald-400 font-mono">+26 050 €</span>
                  </div>
                  <div className="mt-1">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Витрати (COGS)</span>
                    <span className="text-xs font-semibold text-slate-300 font-mono">68 150 €</span>
                  </div>
                  <div className="mt-1">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Маржинальність</span>
                    <span className="text-xs font-bold text-blue-400 font-mono">27.65%</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between text-[11px] text-slate-400">
                <span>Команда: 32 співробітники</span>
                <span className="text-emerald-400 font-semibold">Виконання: 104.2%</span>
              </div>
            </div>

            {/* Company 2: Localica.io */}
            <div className="bg-slate-800/80 rounded-xl p-4 border border-indigo-500/30 flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white font-bold flex items-center justify-center text-sm shadow-xs">
                      LOC
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-sm">Localica.io</h3>
                      <span className="text-[11px] text-slate-400">Tech SaaS · MT Engine</span>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300">
                    34.0% частка
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-700/60 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Виручка</span>
                    <span className="text-base font-extrabold text-white font-mono">48 600 €</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Прибуток</span>
                    <span className="text-base font-extrabold text-emerald-400 font-mono">+8 800 €</span>
                  </div>
                  <div className="mt-1">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Витрати (COGS)</span>
                    <span className="text-xs font-semibold text-slate-300 font-mono">39 800 €</span>
                  </div>
                  <div className="mt-1">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Маржинальність</span>
                    <span className="text-xs font-bold text-indigo-400 font-mono">18.11%</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between text-[11px] text-slate-400">
                <span>Команда: 16 співробітників</span>
                <span className="text-amber-400 font-semibold">Виконання: 92.6%</span>
              </div>
            </div>

            {/* Consolidated Holding Total */}
            <div className="bg-gradient-to-br from-blue-900/40 to-indigo-900/40 rounded-xl p-4 border border-emerald-500/40 flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white font-bold flex items-center justify-center text-sm shadow-xs">
                      Σ
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-sm">Холдинг (Разом)</h3>
                      <span className="text-[11px] text-emerald-300">Консолідований підсумок</span>
                    </div>
                  </div>
                  <span className="text-[11px] font-extrabold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                    100% Група
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-700/60 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Сумарна виручка</span>
                    <span className="text-base font-extrabold text-emerald-400 font-mono">142 800 €</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Сумарний прибуток</span>
                    <span className="text-base font-extrabold text-emerald-300 font-mono">+34 850 €</span>
                  </div>
                  <div className="mt-1">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Сумарні витрати</span>
                    <span className="text-xs font-semibold text-slate-200 font-mono">107 950 €</span>
                  </div>
                  <div className="mt-1">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Загальна маржа</span>
                    <span className="text-xs font-extrabold text-emerald-400 font-mono">24.40%</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between text-[11px] text-slate-300">
                <span>Всього в холдингу: 48 фахівців</span>
                <span className="text-emerald-300 font-bold">Синхронізація 100%</span>
              </div>
            </div>
          </div>
        </section>

        {/* ================= 4. СЕКЦІЯ 1: ОПЕРАЦІЙНИЙ ЗРІЗ COO ТА ПОТРЕБУЄ УВАГИ ================= */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Ліва колонка: «Потребує уваги (2 категорії)» */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">notification_important</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-bold text-slate-900 text-sm">Потребує уваги</h2>
                    <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 text-[10px] font-bold">
                      2 категорії
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">Операційні вузькі місця та термінові ескалації поточного зрізу</p>
                </div>
              </div>
              <button
                onClick={() => setAttentionOpen(!attentionOpen)}
                className="w-8 h-8 rounded-lg hover:bg-slate-200/60 flex items-center justify-center text-slate-500 transition-all cursor-pointer"
                type="button"
              >
                <span
                  className={`material-symbols-outlined text-[20px] transition-transform duration-200 ${
                    attentionOpen ? '' : 'rotate-180'
                  }`}
                >
                  keyboard_arrow_up
                </span>
              </button>
            </div>

            {attentionOpen && (
              <div className="p-5 space-y-4 flex-1">
                {/* Category 1: COO Escalations */}
                <div className="bg-slate-50/80 rounded-xl p-4 border border-slate-200/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-800">Ескалації з огляду COO</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-semibold">
                        Передано CEO вчасно до 15:00
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 font-medium">2 запити</span>
                  </div>

                  {/* Escalation Card 1 */}
                  <div className="bg-white p-3 rounded-lg border border-slate-200/90 shadow-xs flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2.5">
                      <span className="material-symbols-outlined text-rose-500 text-[18px] mt-0.5">
                        priority_high
                      </span>
                      <div className="space-y-0.5">
                        <span className="text-xs font-bold text-slate-900 block">
                          Затримка узгодження перекладацьких пулів Localica
                        </span>
                        <p className="text-[11px] text-slate-500 leading-relaxed">
                          Потрібне остаточне рішення щодо авторизації бюджету субпідрядників для німецької та японської локалей (8 200 €).
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => onNavigate('coo')}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-700 font-semibold text-xs rounded-md transition-colors shrink-0 cursor-pointer"
                      type="button"
                    >
                      Переглянути
                    </button>
                  </div>

                  {/* Escalation Card 2 */}
                  <div className="bg-white p-3 rounded-lg border border-slate-200/90 shadow-xs flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2.5">
                      <span className="material-symbols-outlined text-amber-500 text-[18px] mt-0.5">tune</span>
                      <div className="space-y-0.5">
                        <span className="text-xs font-bold text-slate-900 block">
                          Коригування таргетованого бюджету MKT
                        </span>
                        <p className="text-[11px] text-slate-500 leading-relaxed">
                          Пропонується тимчасовий перерозподіл 3 500 € з контекстної реклами на прямий LinkedIn аутріч.
                        </p>
                      </div>
                    </div>
                    {escalationsApproved['mkt_budget'] ? (
                      <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 font-bold text-xs rounded-md shrink-0">
                        Погоджено ✓
                      </span>
                    ) : (
                      <button
                        onClick={() =>
                          handleApproveEscalation('mkt_budget', 'Коригування таргетованого бюджету MKT')
                        }
                        className="px-2.5 py-1 bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-700 font-semibold text-xs rounded-md transition-colors shrink-0 cursor-pointer"
                        type="button"
                      >
                        Погодити
                      </button>
                    )}
                  </div>
                </div>

                {/* Category 2: Department at Risk */}
                <div className="bg-rose-50/70 border border-rose-200/80 rounded-xl p-4 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-rose-900 flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px] text-rose-600">campaign</span>
                      Відділ під ризиком виконання: Маркетинг (MKT)
                    </span>
                    <span className="px-2 py-0.5 rounded bg-rose-600 text-white font-extrabold text-[10px]">
                      87.4%
                    </span>
                  </div>
                  <p className="text-xs text-rose-800 leading-relaxed">
                    Ключова ціль <strong className="font-bold">«Кваліфіковані ліди (SQL)»</strong> відстає від календарного темпу (факт: 82% від плану). Потрібна стабілізація лідогенерації для захисту плану продажів наступного періоду.
                  </p>
                </div>

                <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1">
                  <span>* Згідно з регламентом ТЗ (розділ 13) блок «Шлях звітності» на рівні CEO не відображається.</span>
                  <a
                    className="text-blue-600 font-semibold hover:underline cursor-pointer"
                    href="#audit"
                    onClick={(e) => {
                      e.preventDefault();
                      onNavigate('audit');
                    }}
                  >
                    Детальний лог відхилень →
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Права колонка: «Операційний огляд COO» */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-xs p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[20px]">verified_user</span>
                  </div>
                  <div>
                    <h2 className="font-bold text-slate-900 text-sm">Операційний огляд COO</h2>
                    <span className="text-xs text-slate-500">Останній зріз поточного тижня</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                  Всі звіти отримано
                </span>
              </div>

              {/* 2 Mini Stats */}
              <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Своєчасність звітів
                  </span>
                  <div className="mt-1 flex items-baseline gap-1.5">
                    <span className="text-xl font-extrabold text-emerald-600">100%</span>
                    <span className="text-[11px] text-slate-500 font-medium">(6 з 6 відділів)</span>
                  </div>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Точність прогнозу
                  </span>
                  <div className="mt-1 flex items-baseline gap-1.5">
                    <span className="text-xl font-extrabold text-slate-900">93.8%</span>
                    <span className="text-[10px] font-bold text-emerald-600 px-1 rounded bg-emerald-50">
                      Висока
                    </span>
                  </div>
                </div>
              </div>

              {/* Official COO Quote Card */}
              <div className="mt-4 p-4 rounded-xl bg-gradient-to-br from-slate-50 to-blue-50/40 border border-slate-200/90 relative">
                <div className="flex items-center gap-1.5 text-slate-700 font-bold text-xs mb-1.5">
                  <span className="material-symbols-outlined text-[16px] text-blue-600">format_quote</span>
                  Офіційний коментар COO для CEO:
                </div>
                <p className="text-xs text-slate-600 italic leading-relaxed">
                  «Усі 6 операційних відділів закрили тижневу звітність до 15:00. Виробниче завантаження локалізації стабільне (92%), продажі перевищують темп (+8%). Ключовий фокус тижня — коригування вартості залучення лідів у маркетингу».
                </p>
                <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500 font-medium">
                  <span>П'ятниця, 14:48 · Warsaw</span>
                  <span className="font-bold text-slate-800">Операційний директор (COO)</span>
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-end">
              <button
                onClick={() => onNavigate('reports')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
                type="button"
              >
                <span className="material-symbols-outlined text-[16px]">history</span>
                Архів тижневих зрізів
              </button>
            </div>
          </div>
        </section>

        {/* ================= 5. СЕКЦІЯ 2: ВИКОНАННЯ ЗА ВІДДІЛАМИ (CRM-КАРТКИ 3x2) ================= */}
        <section className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-slate-900 text-base">Виконання за відділами</h2>
                <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-bold">
                  6 операційних одиниць
                </span>
              </div>
              <p className="text-xs text-slate-500">Поточний прогрес та динаміка KPI кожного структурного підрозділу</p>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-4 text-xs font-medium text-slate-600">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>Виконано (≥95%)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>На межі (90-95%)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>Під ризиком (&lt;90%)
              </span>
            </div>
          </div>

          {/* 3x2 CRM Card Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Card 1: Marketing (MKT) - Under Risk */}
            <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/30 hover:border-rose-300 hover:shadow-xs transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center font-bold">
                      <span className="material-symbols-outlined text-[18px]">campaign</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">Маркетинг</h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[11px] font-mono text-slate-400 font-semibold">MKT</span>
                        <span className="text-[11px] text-slate-400">· 4 цілі</span>
                      </div>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-700 text-[10px] font-bold">
                    Під ризиком
                  </span>
                </div>
                <div className="mt-3 flex items-baseline justify-between">
                  <span className="text-2xl font-extrabold text-rose-600">87.4%</span>
                  <span className="text-xs font-semibold text-rose-600 flex items-center">
                    <span className="material-symbols-outlined text-[14px]">trending_down</span> -3.1%
                  </span>
                </div>
                <div className="w-full bg-slate-200/80 h-1.5 rounded-full overflow-hidden mt-2">
                  <div className="bg-rose-500 h-full rounded-full" style={{ width: '87.4%' }}></div>
                </div>
              </div>
              <div className="mt-4 pt-2.5 border-t border-rose-200/60 flex items-center justify-between text-[11px]">
                <span className="inline-flex items-center gap-1 text-slate-400 font-medium">
                  <span className="material-symbols-outlined text-[13px]">lock</span> План заблоковано
                </span>
                <button
                  onClick={() => onNavigate('reports')}
                  className="font-semibold text-rose-700 hover:underline cursor-pointer"
                >
                  Звіт відділу →
                </button>
              </div>
            </div>

            {/* Card 2: Sales (SLS) - Completed */}
            <div className="p-4 rounded-xl border border-slate-200 bg-white hover:border-emerald-300 hover:shadow-xs transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                      <span className="material-symbols-outlined text-[18px]">trending_up</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">Продажі</h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[11px] font-mono text-slate-400 font-semibold">SLS</span>
                        <span className="text-[11px] text-slate-400">· 4 цілі</span>
                      </div>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                    Виконано
                  </span>
                </div>
                <div className="mt-3 flex items-baseline justify-between">
                  <span className="text-2xl font-extrabold text-slate-900">104.2%</span>
                  <span className="text-xs font-semibold text-emerald-600 flex items-center">
                    <span className="material-symbols-outlined text-[14px]">trending_up</span> +5.4%
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-2">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: '100%' }}></div>
                </div>
              </div>
              <div className="mt-4 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <span className="inline-flex items-center gap-1 text-slate-400 font-medium">
                  <span className="material-symbols-outlined text-[13px]">lock</span> План заблоковано
                </span>
                <button
                  onClick={() => onNavigate('reports')}
                  className="font-semibold text-blue-600 hover:underline cursor-pointer"
                >
                  Звіт відділу →
                </button>
              </div>
            </div>

            {/* Card 3: Localization (LOC) - Completed */}
            <div className="p-4 rounded-xl border border-slate-200 bg-white hover:border-blue-300 hover:shadow-xs transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                      <span className="material-symbols-outlined text-[18px]">translate</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">Локалізація</h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[11px] font-mono text-slate-400 font-semibold">LOC</span>
                        <span className="text-[11px] text-slate-400">· 5 цілей</span>
                      </div>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 text-[10px] font-bold">
                    Виконано
                  </span>
                </div>
                <div className="mt-3 flex items-baseline justify-between">
                  <span className="text-2xl font-extrabold text-slate-900">96.5%</span>
                  <span className="text-xs font-semibold text-slate-500 flex items-center">
                    <span className="material-symbols-outlined text-[14px]">trending_flat</span> 0.0%
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-2">
                  <div className="bg-blue-600 h-full rounded-full" style={{ width: '96.5%' }}></div>
                </div>
              </div>
              <div className="mt-4 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <span className="inline-flex items-center gap-1 text-slate-400 font-medium">
                  <span className="material-symbols-outlined text-[13px]">lock</span> План заблоковано
                </span>
                <button
                  onClick={() => onNavigate('reports')}
                  className="font-semibold text-blue-600 hover:underline cursor-pointer"
                >
                  Звіт відділу →
                </button>
              </div>
            </div>

            {/* Card 4: HR - Completed */}
            <div className="p-4 rounded-xl border border-slate-200 bg-white hover:border-emerald-300 hover:shadow-xs transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                      <span className="material-symbols-outlined text-[18px]">groups</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">HR &amp; Команда</h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[11px] font-mono text-slate-400 font-semibold">HR</span>
                        <span className="text-[11px] text-slate-400">· 4 цілі</span>
                      </div>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                    Виконано
                  </span>
                </div>
                <div className="mt-3 flex items-baseline justify-between">
                  <span className="text-2xl font-extrabold text-slate-900">98.0%</span>
                  <span className="text-xs font-semibold text-emerald-600 flex items-center">
                    <span className="material-symbols-outlined text-[14px]">trending_up</span> +1.8%
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-2">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: '98%' }}></div>
                </div>
              </div>
              <div className="mt-4 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <span className="inline-flex items-center gap-1 text-slate-400 font-medium">
                  <span className="material-symbols-outlined text-[13px]">lock</span> План заблоковано
                </span>
                <button
                  onClick={() => onNavigate('reports')}
                  className="font-semibold text-blue-600 hover:underline cursor-pointer"
                >
                  Звіт відділу →
                </button>
              </div>
            </div>

            {/* Card 5: Finance (FIN) - Completed */}
            <div className="p-4 rounded-xl border border-slate-200 bg-white hover:border-emerald-300 hover:shadow-xs transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center font-bold">
                      <span className="material-symbols-outlined text-[18px]">account_balance</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">Фінанси</h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[11px] font-mono text-slate-400 font-semibold">FIN</span>
                        <span className="text-[11px] text-slate-400">· 4 цілі</span>
                      </div>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                    Виконано
                  </span>
                </div>
                <div className="mt-3 flex items-baseline justify-between">
                  <span className="text-2xl font-extrabold text-slate-900">95.8%</span>
                  <span className="text-xs font-semibold text-emerald-600 flex items-center">
                    <span className="material-symbols-outlined text-[14px]">trending_up</span> +0.7%
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-2">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: '95.8%' }}></div>
                </div>
              </div>
              <div className="mt-4 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <span className="inline-flex items-center gap-1 text-slate-400 font-medium">
                  <span className="material-symbols-outlined text-[13px]">lock</span> План заблоковано
                </span>
                <button
                  onClick={() => onNavigate('reports')}
                  className="font-semibold text-blue-600 hover:underline cursor-pointer"
                >
                  Звіт відділу →
                </button>
              </div>
            </div>

            {/* Card 6: Operations (OPS) - Borderline */}
            <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/30 hover:border-amber-300 hover:shadow-xs transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                      <span className="material-symbols-outlined text-[18px]">settings_suggest</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">Операції</h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[11px] font-mono text-slate-400 font-semibold">OPS</span>
                        <span className="text-[11px] text-slate-400">· 4 цілі</span>
                      </div>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-bold">
                    На межі
                  </span>
                </div>
                <div className="mt-3 flex items-baseline justify-between">
                  <span className="text-2xl font-extrabold text-amber-700">92.6%</span>
                  <span className="text-xs font-semibold text-slate-500 flex items-center">
                    <span className="material-symbols-outlined text-[14px]">trending_flat</span> 0.0%
                  </span>
                </div>
                <div className="w-full bg-slate-200/80 h-1.5 rounded-full overflow-hidden mt-2">
                  <div className="bg-amber-500 h-full rounded-full" style={{ width: '92.6%' }}></div>
                </div>
              </div>
              <div className="mt-4 pt-2.5 border-t border-amber-200/60 flex items-center justify-between text-[11px]">
                <span className="inline-flex items-center gap-1 text-slate-400 font-medium">
                  <span className="material-symbols-outlined text-[13px]">lock</span> План заблоковано
                </span>
                <button
                  onClick={() => onNavigate('reports')}
                  className="font-semibold text-blue-600 hover:underline cursor-pointer"
                >
                  Звіт відділу →
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ================= 6. СЕКЦІЯ 3: ФІНАНСОВІ РЕЗУЛЬТАТИ КОМПАНІЙ (РОЗДІЛ 14 ТЗ) ================= */}
        <section className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-slate-900 text-base">Фінансові результати компаній</h2>
                <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 text-xs font-bold ring-1 ring-indigo-700/10">
                  Розділ 14 ТЗ
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Консолідований підсумок доходів, прямих витрат та валової маржинальності за компаніями
              </p>
            </div>

            {/* Month Selector & Navigation Button */}
            <div className="flex items-center gap-2.5 flex-wrap">
              <div className="flex items-center bg-slate-100 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 border border-slate-200">
                <span className="material-symbols-outlined text-[16px] text-slate-400 mr-1.5">calendar_month</span>
                <select
                  aria-label="Вибір звітного місяця"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="bg-transparent border-0 p-0 pr-4 text-xs font-semibold text-slate-800 focus:ring-0 cursor-pointer"
                >
                  <option value="Вересень 2024">Вересень 2024</option>
                  <option value="Жовтень 2024">Жовтень 2024</option>
                  <option value="Листопад 2024">Листопад 2024</option>
                </select>
              </div>
              <button
                onClick={() => onNavigate('finance')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors shadow-xs cursor-pointer"
                type="button"
              >
                <span className="material-symbols-outlined text-[16px]">query_stats</span>
                <span>Фінансовий аналітик</span>
              </button>
            </div>
          </div>

          {/* Premium Modern Financial Table */}
          <div className="overflow-x-auto rounded-xl border border-slate-200/90">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase font-bold text-[10px] tracking-wider">
                  <th className="py-3 px-4">Суб'єкт аналізу</th>
                  <th className="py-3 px-4 text-right">Виручка (€)</th>
                  <th className="py-3 px-4 text-right">Витрати (€)</th>
                  <th className="py-3 px-4 text-right">Прибуток (€)</th>
                  <th className="py-3 px-4 text-right">Маржа (%)</th>
                  <th className="py-3 px-4">Стратегічний статус / Коментар</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800 font-medium">
                {FINANCIAL_PL_ROWS.map((row) => {
                  if (row.isTotal) {
                    return (
                      <tr
                        key={row.id}
                        className="bg-gradient-to-r from-blue-50/70 via-indigo-50/50 to-slate-50 font-bold border-t-2 border-blue-200"
                      >
                        <td className="py-4 px-4 text-slate-900 flex items-center gap-2 text-sm">
                          <span className="material-symbols-outlined text-blue-700 text-[18px]">domain</span>
                          {row.name}
                        </td>
                        <td className="py-4 px-4 text-right text-slate-900 text-sm font-extrabold">{row.revenue}</td>
                        <td className="py-4 px-4 text-right text-slate-600">{row.costs}</td>
                        <td className="py-4 px-4 text-right text-emerald-700 text-sm font-extrabold">{row.profit}</td>
                        <td className="py-4 px-4 text-right">
                          <span className="inline-block px-2.5 py-1 rounded-md bg-emerald-600 text-white font-extrabold text-xs shadow-xs">
                            {row.margin}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-slate-600 font-semibold text-[11px]">{row.comment}</td>
                      </tr>
                    );
                  }
                  return (
                    <tr key={row.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-slate-900 flex items-center gap-2">
                        <span className={`w-2.5 h-2.5 rounded-full ${row.dotColor}`}></span>
                        {row.name}
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold text-slate-900">{row.revenue}</td>
                      <td className="py-3.5 px-4 text-right text-slate-500">{row.costs}</td>
                      <td className="py-3.5 px-4 text-right font-bold text-emerald-600">{row.profit}</td>
                      <td className="py-3.5 px-4 text-right">
                        <span className={`inline-block px-2 py-0.5 rounded font-extrabold text-[11px] ${row.marginBg}`}>
                          {row.margin}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 text-[11px]">{row.comment}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Verification & Audit Footer */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-slate-600">
              <span className="material-symbols-outlined text-emerald-600 text-[18px]">verified</span>
              <span>Дані верифіковані головним бухгалтером та COO. Наступне календарне закриття: 31 жовтня.</span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => onNavigate('audit')}
                className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold transition-colors cursor-pointer"
                type="button"
              >
                Журнал коригувань
              </button>
              <button
                onClick={() => alert('Фінансовий звіт CEO успішно збережено в аудит-лог.')}
                className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-xs transition-colors cursor-pointer"
                type="button"
              >
                Затвердити показники
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
