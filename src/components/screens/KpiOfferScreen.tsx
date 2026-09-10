import React, { useState } from 'react';
import { ScreenId } from '../../types';
import { OFFER_KPIS } from '../../data/mockData';

interface KpiOfferScreenProps {
  onNavigate: (screen: ScreenId) => void;
}

export const KpiOfferScreen: React.FC<KpiOfferScreenProps> = ({ onNavigate }) => {
  const [candidateName, setCandidateName] = useState('Олексій Коваленко');
  const [position, setPosition] = useState('Senior B2B Sales Manager');
  const [company, setCompany] = useState('MK:translations');
  const [baseSalary, setBaseSalary] = useState(1800);
  const [targetBonus, setTargetBonus] = useState(1200);
  const [simulatedAchievement, setSimulatedAchievement] = useState(100);
  const [accountingStatus, setAccountingStatus] = useState<'pending' | 'verified' | 'rejected'>('verified');
  const [accountingComment, setAccountingComment] = useState(
    'Сітка бонусів відповідає затвердженій тарифній сітці департаменту продажів SLS на Q4 2024. Ліміт фонду заробітної плати витримано. Правило Cap 150% інтегровано.'
  );
  const [isApproved, setIsApproved] = useState(false);

  // Bonus formula: Target Bonus * min(simulatedAchievement, 150) / 100
  const effectiveBonusRate = Math.min(simulatedAchievement, 150);
  const calculatedBonus = Math.round((targetBonus * effectiveBonusRate) / 100);
  const totalOTE = baseSalary + targetBonus;
  const simulatedTotal = baseSalary + calculatedBonus;
  const maxCapEarnings = baseSalary + Math.round(targetBonus * 1.5);

  const handleApprove = () => {
    setIsApproved(true);
    alert('Офер верифіковано бухгалтерією та підписано кваліфікованим електронним підписом.');
  };

  return (
    <div id="screen-kpi-offer" className="flex-1 flex flex-col min-w-0 bg-[#f8faff]">
      {/* ================= TOPBAR HEADER ================= */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-8 py-3.5 shadow-xs flex items-center justify-between flex-wrap gap-4">
        <div className="flex flex-col">
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              KPI в офері (Бухгалтерія) · Розрахунок та верифікація
            </h1>
            <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-xs font-semibold ring-1 ring-blue-700/10">
              OFFER-2024-042
            </span>
            <span
              className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-md ${
                isApproved
                  ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/10'
                  : 'bg-amber-50 text-amber-700 ring-1 ring-amber-600/10'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  isApproved ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'
                }`}
              ></span>
              {isApproved ? 'Верифіковано бухгалтерією' : 'Очікує верифікації бухгалтерії'}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Кандидат: <strong className="text-slate-800 font-bold">{candidateName}</strong> · Посада: {position} · {company} · Валюта: EUR (€)
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs transition cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[16px]">print</span>
            <span>Роздрукувати офер</span>
          </button>
          <button
            disabled={isApproved}
            onClick={handleApprove}
            className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-white text-xs font-bold shadow-xs transition cursor-pointer ${
              isApproved ? 'bg-emerald-600' : 'bg-blue-600 hover:bg-blue-700'
            }`}
            type="button"
          >
            <span className="material-symbols-outlined text-[16px]">
              {isApproved ? 'verified' : 'task_alt'}
            </span>
            <span>{isApproved ? 'Верифіковано ✓' : 'Затвердити офер (Бухгалтерія)'}</span>
          </button>
        </div>
      </header>

      {/* ================= CONTENT BODY ================= */}
      <div className="p-8 space-y-6 max-w-7xl mx-auto w-full">
        {/* 4 Top KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {/* Card 1: Base Salary */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Фіксована ставка (Net)
            </span>
            <div className="mt-2 text-3xl font-extrabold text-slate-900 tracking-tight">
              {baseSalary.toLocaleString()} €
            </div>
            <div className="mt-3 pt-2.5 border-t border-slate-100 text-xs text-slate-500">
              Гарантована щомісячна виплата
            </div>
          </div>

          {/* Card 2: Target Bonus */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Цільовий бонус (100% KPI)
            </span>
            <div className="mt-2 text-3xl font-extrabold text-blue-600 tracking-tight">
              {targetBonus.toLocaleString()} €
            </div>
            <div className="mt-3 pt-2.5 border-t border-slate-100 text-xs text-slate-500">
              При 100% виконанні цілей посади
            </div>
          </div>

          {/* Card 3: OTE */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Сумарний дохід (OTE)
            </span>
            <div className="mt-2 text-3xl font-extrabold text-emerald-600 tracking-tight">
              {totalOTE.toLocaleString()} €
            </div>
            <div className="mt-3 pt-2.5 border-t border-slate-100 text-xs text-slate-500">
              Ставка + цільовий бонус (On-Target)
            </div>
          </div>

          {/* Card 4: Cap 150% */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Максимальний дохід (Cap 150%)
            </span>
            <div className="mt-2 text-3xl font-extrabold text-indigo-600 tracking-tight">
              {maxCapEarnings.toLocaleString()} €
            </div>
            <div className="mt-3 pt-2.5 border-t border-slate-100 text-xs text-slate-500">
              Максимальна стеля бонусу за ТЗ (150%)
            </div>
          </div>
        </div>

        {/* ================= INTERACTIVE KPI SIMULATOR ================= */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Симулятор нарахування бонусу оферу</h2>
              <p className="text-xs text-slate-500">
                Змініть відсоток виконання для перевірки розрахунку та ліміту Cap 150%
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-slate-600">Симуляція виконання:</span>
              <span className="px-3 py-1 rounded-xl bg-blue-100 text-blue-800 font-extrabold text-sm">
                {simulatedAchievement}%
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <input
              type="range"
              min={0}
              max={180}
              step={5}
              value={simulatedAchievement}
              onChange={(e) => setSimulatedAchievement(Number(e.target.value))}
              className="w-full accent-blue-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-400 font-medium">
              <span>0% (Лише фікс)</span>
              <span>80%</span>
              <span className="font-bold text-blue-600">100% (Ціль)</span>
              <span className="font-bold text-indigo-600">150% (Стеля Cap)</span>
              <span>180%</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-blue-600 text-[20px]">calculate</span>
              <span>
                При поточному виконанні ({simulatedAchievement}%): бонус становить{' '}
                <strong className="text-blue-700 font-extrabold">{calculatedBonus.toLocaleString()} €</strong>{' '}
                (ефективний коефіцієнт: {effectiveBonusRate}%).
              </span>
            </div>
            <div className="text-right">
              <span className="text-slate-500 font-medium">Разом до виплати: </span>
              <strong className="text-emerald-700 font-extrabold text-sm">
                {simulatedTotal.toLocaleString()} €
              </strong>
            </div>
          </div>
        </div>

        {/* ================= TABLE: KPI GOALS GRID ================= */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Сітка цілей KPI для оферу</h2>
              <p className="text-xs text-slate-500">
                Розподіл ваги метрик, планові показники та умови нарахування премії
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold ring-1 ring-emerald-600/20">
              Сумарна вага: 100%
            </span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-bold text-[10px] tracking-wider">
                  <th className="py-3 px-4">Код</th>
                  <th className="py-3 px-4">Назва показника (Ціль)</th>
                  <th className="py-3 px-4 text-center">Вага</th>
                  <th className="py-3 px-4 text-right">Плановий показник</th>
                  <th className="py-3 px-4">Одиниця виміру</th>
                  <th className="py-3 px-4">Джерело підтвердження</th>
                  <th className="py-3 px-4 text-right">Макс. внесок</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                {OFFER_KPIS.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3 px-4 font-mono font-bold text-blue-700">{item.code}</td>
                    <td className="py-3 px-4 font-bold text-slate-900">{item.name}</td>
                    <td className="py-3 px-4 text-center">
                      <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-bold">
                        {item.weight}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-extrabold text-slate-900">
                      {(item.targetValue ?? 0).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-slate-500">{item.unit}</td>
                    <td className="py-3 px-4 text-slate-500 text-[11px]">{item.source}</td>
                    <td className="py-3 px-4 text-right font-bold text-indigo-700">
                      {Math.round(item.weight * 1.5)}% (Cap)
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ================= ACCOUNTING VERIFICATION BOX ================= */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <span className="material-symbols-outlined text-[20px]">verified</span>
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Верифікація головного бухгалтера</h2>
              <p className="text-xs text-slate-500">Фінансовий комплаєнс, перевірка лімітів ФОП та аудит-трейл</p>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1" htmlFor="accountingNotes">
                Висновок та примітки бухгалтерії
              </label>
              <textarea
                id="accountingNotes"
                rows={3}
                value={accountingComment}
                onChange={(e) => setAccountingComment(e.target.value)}
                className="w-full text-xs border border-slate-300 rounded-lg p-3 text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 resize-none bg-slate-50"
              />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-slate-400 text-[18px]">history_edu</span>
                <span>Перевірив: Олена Дорошенко (Головний бухгалтер MK Group) · 18 Жовтня 2024</span>
              </div>
              <button
                onClick={() => onNavigate('ceo')}
                className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Перейти до Панелі CEO</span>
                <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
