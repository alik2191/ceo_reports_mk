import React, { useState } from 'react';
import { ScreenId } from '../../types';
import { FINANCIAL_PL_ROWS } from '../../data/mockData';

interface FinancialAnalystScreenProps {
  onNavigate: (screen: ScreenId) => void;
}

export const FinancialAnalystScreen: React.FC<FinancialAnalystScreenProps> = ({ onNavigate }) => {
  const [selectedEntity, setSelectedEntity] = useState<'all' | 'mk' | 'localica'>('all');
  const [activeTab, setActiveTab] = useState<'pl' | 'units'>('pl');
  const [revenueMultiplier, setRevenueMultiplier] = useState(100); // 100%
  const [costMultiplier, setCostMultiplier] = useState(100); // 100%

  // Simulated live numbers
  const baseRevenue =
    selectedEntity === 'all' ? 142800 : selectedEntity === 'mk' ? 94200 : 48600;
  const baseCosts =
    selectedEntity === 'all' ? 107950 : selectedEntity === 'mk' ? 68150 : 39800;

  const simRevenue = Math.round((baseRevenue * revenueMultiplier) / 100);
  const simCosts = Math.round((baseCosts * costMultiplier) / 100);
  const simProfit = simRevenue - simCosts;
  const simMargin = ((simProfit / simRevenue) * 100).toFixed(2);

  return (
    <div id="screen-financial-analyst" className="flex-1 flex flex-col min-w-0 bg-[#f8faff]">
      {/* ================= TOPBAR HEADER ================= */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-8 py-3.5 shadow-xs flex items-center justify-between flex-wrap gap-4">
        <div className="flex flex-col">
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Фінансовий аналітик · P&amp;L, Маржинальність та Cash Flow
            </h1>
            <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-xs font-semibold ring-1 ring-blue-700/10">
              Консолідовано
            </span>
            <span className="inline-flex items-center gap-1 text-xs text-slate-600 font-semibold px-2 py-0.5 rounded-md bg-slate-100">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
              Жовтень 2024 · Валюта: EUR (€)
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Звіт про фінансові результати (P&amp;L), маржинальність, прямі витрати COGS та моделювання сценаріїв
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-lg text-xs font-bold text-blue-900 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Єдиний холдинг: MK:translations + Localica.io</span>
          </div>

          <button
            onClick={() => alert('Формування консолідованого звіту P&L .xlsx розпочато')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs transition cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[16px] text-emerald-600">table_view</span>
            <span>Експорт P&amp;L Excel</span>
          </button>
        </div>
      </header>

      {/* ================= CONTENT BODY ================= */}
      <div className="p-8 space-y-6 max-w-7xl mx-auto w-full">
        {/* 4 Financial KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {/* Card 1: Revenue */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Виручка (Revenue)
            </span>
            <div className="mt-2 text-3xl font-extrabold text-slate-900 tracking-tight">
              {simRevenue.toLocaleString()} €
            </div>
            <div className="mt-3 pt-2.5 border-t border-slate-100 flex justify-between text-xs">
              <span className="text-slate-500">План на дату: 140 000 €</span>
              <span className="text-emerald-600 font-bold">+2.0% до плану</span>
            </div>
          </div>

          {/* Card 2: Costs */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Витрати (COGS + OPEX)
            </span>
            <div className="mt-2 text-3xl font-extrabold text-slate-800 tracking-tight">
              {simCosts.toLocaleString()} €
            </div>
            <div className="mt-3 pt-2.5 border-t border-slate-100 flex justify-between text-xs">
              <span className="text-slate-500">Ліміт бюджету: 110 000 €</span>
              <span className="text-emerald-600 font-bold">В межах норми</span>
            </div>
          </div>

          {/* Card 3: Gross Profit */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Валовий прибуток (GP)
            </span>
            <div className="mt-2 text-3xl font-extrabold text-emerald-600 tracking-tight">
              {simProfit.toLocaleString()} €
            </div>
            <div className="mt-3 pt-2.5 border-t border-slate-100 flex justify-between text-xs">
              <span className="text-slate-500">План: +32 000 €</span>
              <span className="text-emerald-600 font-bold">+8.9% перевищення</span>
            </div>
          </div>

          {/* Card 4: Margin */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Маржинальність групи
            </span>
            <div className="mt-2 text-3xl font-extrabold text-blue-600 tracking-tight">
              {simMargin}%
            </div>
            <div className="mt-3 pt-2.5 border-t border-slate-100 flex justify-between text-xs">
              <span className="text-slate-500">Формула: (GP / Rev) * 100</span>
              <span className="text-blue-600 font-bold">Ціль: ≥22.0%</span>
            </div>
          </div>
        </div>

        {/* View Tabs (P&L vs Unit Economics) */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
          <button
            onClick={() => setActiveTab('pl')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'pl'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">table_chart</span>
            <span>Зведений P&amp;L звіт холдингу</span>
          </button>
          <button
            onClick={() => setActiveTab('units')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'units'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">pie_chart</span>
            <span>Юніт-економіка та показники ефективності</span>
          </button>
        </div>

        {activeTab === 'pl' ? (
          /* ================= P&L TABLE ================= */
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Звіт про прибутки та збитки (P&amp;L) за компаніями
                </h2>
                <p className="text-xs text-slate-500">
                  Повна деталізація доходів, собівартості субпідрядників та операційних витрат
                </p>
              </div>
              <span className="text-xs text-slate-400">Верифіковано фінконтролем: 18.10.2024</span>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-bold text-[10px] tracking-wider">
                    <th className="py-3.5 px-4">Компанія / Стаття</th>
                    <th className="py-3.5 px-4 text-right">Виручка (€)</th>
                    <th className="py-3.5 px-4 text-right">Прямі витрати (€)</th>
                    <th className="py-3.5 px-4 text-right">Валовий прибуток (€)</th>
                    <th className="py-3.5 px-4 text-right">Маржа (%)</th>
                    <th className="py-3.5 px-4">Коментар фінвідділу</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                  {FINANCIAL_PL_ROWS.map((row) => (
                    <tr
                      key={row.id}
                      className={
                        row.isTotal
                          ? 'bg-blue-50/70 font-bold border-t-2 border-blue-200 text-slate-900'
                          : 'hover:bg-slate-50/70 transition'
                      }
                    >
                      <td className="py-3.5 px-4 flex items-center gap-2">
                        <span className={`w-2.5 h-2.5 rounded-full ${row.dotColor}`}></span>
                        <span className="font-bold">{row.name}</span>
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold">{row.revenue}</td>
                      <td className="py-3.5 px-4 text-right text-slate-500">{row.costs}</td>
                      <td className="py-3.5 px-4 text-right font-extrabold text-emerald-700">{row.profit}</td>
                      <td className="py-3.5 px-4 text-right">
                        <span className={`inline-block px-2 py-0.5 rounded font-extrabold text-[11px] ${row.marginBg}`}>
                          {row.margin}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 text-[11px]">{row.comment}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* ================= UNIT ECONOMICS ================= */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-blue-700 font-bold text-sm">
                <span className="material-symbols-outlined text-[20px]">translate</span>
                Локалізація (LOC)
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-500">Середня ставка за слово (B2B):</span>
                  <span className="font-bold text-slate-900">0.082 € / слово</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-500">Собівартість підрядника:</span>
                  <span className="font-semibold text-slate-800">0.046 € / слово</span>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="text-slate-500">Юніт-маржа перекладу:</span>
                  <span className="font-extrabold text-emerald-600">43.9%</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm">
                <span className="material-symbols-outlined text-[20px]">trending_up</span>
                Продажі (SLS)
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-500">Середній чек контракту (AOV):</span>
                  <span className="font-bold text-slate-900">4 650 €</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-500">LTV / CAC співвідношення:</span>
                  <span className="font-semibold text-slate-800">4.8x (Високе)</span>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="text-slate-500">Конверсія з SQL в угоду:</span>
                  <span className="font-extrabold text-emerald-600">24.2%</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-rose-700 font-bold text-sm">
                <span className="material-symbols-outlined text-[20px]">campaign</span>
                Маркетинг (MKT)
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-500">Вартість кваліфікованого ліда:</span>
                  <span className="font-bold text-rose-600">84.50 € (Ціль: ≤65 €)</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-500">Бюджетний розрив лідогенерації:</span>
                  <span className="font-semibold text-slate-800">-12.6%</span>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="text-slate-500">Рекомендована дія:</span>
                  <span className="font-bold text-blue-700">Перерозподіл на LinkedIn</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= SCENARIO MODELING TOOL ================= */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <span className="material-symbols-outlined text-[20px]">tune</span>
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Фінансовий стрес-тест та моделювання сценаріїв</h2>
              <p className="text-xs text-slate-500">
                Змініть параметри виручки та витрат для прогнозування маржинальності та чистого прибутку
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1.5">
                <span className="text-slate-700">Динаміка виручки:</span>
                <span className="font-bold text-blue-700">{revenueMultiplier}%</span>
              </div>
              <input
                type="range"
                min={70}
                max={130}
                value={revenueMultiplier}
                onChange={(e) => setRevenueMultiplier(Number(e.target.value))}
                className="w-full accent-blue-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                <span>-30%</span>
                <span>Базовий (100%)</span>
                <span>+30%</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1.5">
                <span className="text-slate-700">Динаміка прямих витрат:</span>
                <span className="font-bold text-rose-700">{costMultiplier}%</span>
              </div>
              <input
                type="range"
                min={70}
                max={130}
                value={costMultiplier}
                onChange={(e) => setCostMultiplier(Number(e.target.value))}
                className="w-full accent-rose-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                <span>-30%</span>
                <span>Базовий (100%)</span>
                <span>+30%</span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div>
              <span className="text-slate-500">Прогнозований валовий прибуток: </span>
              <strong className="text-slate-900 font-extrabold text-sm">
                {simProfit.toLocaleString()} €
              </strong>
            </div>
            <div>
              <span className="text-slate-500">Прогнозована маржа: </span>
              <strong className="text-blue-700 font-extrabold text-sm">{simMargin}%</strong>
            </div>
            <button
              onClick={() => {
                setRevenueMultiplier(100);
                setCostMultiplier(100);
              }}
              className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold cursor-pointer"
            >
              Скинути до базового
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
