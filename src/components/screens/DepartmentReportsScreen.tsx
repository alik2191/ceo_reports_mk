import React, { useState } from 'react';
import { ScreenId } from '../../types';
import { MOCK_DEPARTMENT_REPORTS } from '../../data/mockData';

interface DepartmentReportsScreenProps {
  onNavigate: (screen: ScreenId) => void;
}

export const DepartmentReportsScreen: React.FC<DepartmentReportsScreenProps> = ({ onNavigate }) => {
  const [selectedDeptId, setSelectedDeptId] = useState('dept-rep-1'); // Default MKT

  const currentReport =
    MOCK_DEPARTMENT_REPORTS.find((r) => r.id === selectedDeptId) || MOCK_DEPARTMENT_REPORTS[0];

  const isUnderRisk = currentReport.executionRate < 90;
  const isBorderline = currentReport.executionRate >= 90 && currentReport.executionRate < 95;

  return (
    <div id="screen-department-reports" className="flex-1 flex flex-col min-w-0 bg-[#f8faff]">
      {/* ================= TOPBAR HEADER ================= */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-8 py-3.5 shadow-xs flex items-center justify-between flex-wrap gap-4">
        <div className="flex flex-col">
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Звіти відділу · Тижневі зрізи, виконання KPI та коментарі
            </h1>
            <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-xs font-semibold ring-1 ring-blue-700/10">
              Тиждень #42
            </span>
            <span
              className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-md ${
                isUnderRisk
                  ? 'bg-rose-50 text-rose-700 ring-1 ring-rose-600/10'
                  : 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/10'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  isUnderRisk ? 'bg-rose-500' : 'bg-emerald-500'
                }`}
              ></span>
              Дедлайн: Пн 12:00 (Здано вчасно о {currentReport.submittedTime})
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Підрозділ: <strong className="text-slate-800 font-bold">{currentReport.deptName}</strong> · Керівник: {currentReport.leadName}
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => onNavigate('coo')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs transition cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            <span>Операції (COO)</span>
          </button>
          <button
            onClick={() => alert(`Експорт звіту підрозділу ${currentReport.deptName} у форматі CSV розпочато.`)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[16px]">download</span>
            <span>Експорт звіту CSV</span>
          </button>
        </div>
      </header>

      {/* ================= CONTENT BODY ================= */}
      <div className="p-8 space-y-6 max-w-7xl mx-auto w-full">
        {/* Department Switcher Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200">
          {MOCK_DEPARTMENT_REPORTS.map((r) => {
            const active = r.id === selectedDeptId;
            const underRisk = r.executionRate < 90;
            return (
              <button
                key={r.id}
                onClick={() => setSelectedDeptId(r.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 cursor-pointer ${
                  active
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <span className="font-mono">{r.deptCode}</span>
                <span>{r.deptName.split(' ')[0]}</span>
                <span
                  className={`px-1.5 py-0.5 rounded text-[10px] ${
                    underRisk
                      ? 'bg-rose-500 text-white'
                      : active
                      ? 'bg-slate-700 text-slate-200'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {r.executionRate}%
                </span>
              </button>
            );
          })}
        </div>

        {/* 4 KPI Cards for the department */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Інтегральне виконання
            </span>
            <div
              className={`mt-2 text-3xl font-extrabold tracking-tight ${
                isUnderRisk ? 'text-rose-600' : isBorderline ? 'text-amber-700' : 'text-slate-900'
              }`}
            >
              {currentReport.executionRate}%
            </div>
            <div className="mt-3 pt-2.5 border-t border-slate-100 flex justify-between text-xs">
              <span className="text-slate-500">Статус:</span>
              <span
                className={`font-bold ${
                  isUnderRisk ? 'text-rose-700' : isBorderline ? 'text-amber-700' : 'text-emerald-600'
                }`}
              >
                {currentReport.statusBadge}
              </span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Кількість цілей
            </span>
            <div className="mt-2 text-3xl font-extrabold text-blue-600 tracking-tight">
              {currentReport.goalsCount} цілі
            </div>
            <div className="mt-3 pt-2.5 border-t border-slate-100 flex justify-between text-xs">
              <span className="text-slate-500">Зафіксовано в системі</span>
              <span className="text-blue-600 font-bold">100% фактів</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Своєчасність здачі
            </span>
            <div className="mt-2 text-3xl font-extrabold text-emerald-600 tracking-tight">
              100%
            </div>
            <div className="mt-3 pt-2.5 border-t border-slate-100 flex justify-between text-xs">
              <span className="text-slate-500">Дедлайн: Пн 12:00</span>
              <span className="text-emerald-600 font-bold">Вчасно</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Відхилення від норми
            </span>
            <div
              className={`mt-2 text-3xl font-extrabold tracking-tight ${
                isUnderRisk ? 'text-rose-600' : 'text-slate-900'
              }`}
            >
              {currentReport.deltaText}
            </div>
            <div className="mt-3 pt-2.5 border-t border-slate-100 flex justify-between text-xs">
              <span className="text-slate-500">Вплив на холдинг</span>
              <span className="text-slate-700 font-semibold">Враховано в CEO</span>
            </div>
          </div>
        </div>

        {/* ================= DEPARTMENT GOALS BREAKDOWN ================= */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Виконання цілей підрозділу ({currentReport.deptName})
              </h2>
              <p className="text-xs text-slate-500">
                Детальний моніторинг показників, планів на дату та ефективного внеску
              </p>
            </div>
            <span className="text-xs font-semibold text-slate-500">
              Правило Cap 150% застосовано
            </span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-bold text-[10px] tracking-wider">
                  <th className="py-3 px-4">Код цілі</th>
                  <th className="py-3 px-4">Назва показника</th>
                  <th className="py-3 px-4 text-center">Вага</th>
                  <th className="py-3 px-4 text-right">План на тиждень</th>
                  <th className="py-3 px-4 text-right">Фактичний показник</th>
                  <th className="py-3 px-4 text-right">% виконання</th>
                  <th className="py-3 px-4">Статус</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                {currentReport.goalsList.map((g) => (
                  <tr key={g.code} className="hover:bg-slate-50/70 transition">
                    <td className="py-3 px-4 font-mono font-bold text-blue-700">{g.code}</td>
                    <td className="py-3 px-4 font-bold text-slate-900">{g.name}</td>
                    <td className="py-3 px-4 text-center">
                      <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-bold">
                        {g.weight}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right text-slate-600">{g.plan}</td>
                    <td className="py-3 px-4 text-right font-extrabold text-slate-900">{g.fact}</td>
                    <td className="py-3 px-4 text-right">
                      <span
                        className={`inline-block px-2 py-0.5 rounded font-extrabold ${
                          g.rate < 90
                            ? 'bg-rose-100 text-rose-800'
                            : g.rate >= 100
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {g.rate}%
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`text-[11px] font-semibold ${
                          g.rate < 90 ? 'text-rose-600' : 'text-emerald-600'
                        }`}
                      >
                        {g.rate < 90 ? 'Відставання' : 'Виконано'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ================= SUPERVISOR COMMENTARY ================= */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <span className="material-symbols-outlined text-[20px]">rate_review</span>
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Офіційний коментар керівника підрозділу ({currentReport.leadName})
              </h2>
              <p className="text-xs text-slate-500">
                Подано в регламентний термін до дедлайну понеділка 12:00
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="text-xs text-slate-700 leading-relaxed font-medium">
              «{currentReport.summaryNote} Підрозділ завершив тиждень із показником {currentReport.executionRate}%. 
              Усі щоденники співробітників верифіковано. Потреби в ресурсах та ескалації узгоджено з операційним директором (COO).»
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 text-[11px] text-slate-400">
              <span>Здано: {currentReport.submittedTime} (Пн)</span>
              <span>Підписано ЕЦП керівника підрозділу</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
