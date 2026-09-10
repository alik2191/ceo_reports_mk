import React, { useState } from 'react';
import { ScreenId } from '../../types';
import { MOCK_DEPARTMENT_REPORTS } from '../../data/mockData';

interface CooOperationsScreenProps {
  onNavigate: (screen: ScreenId) => void;
}

export const CooOperationsScreen: React.FC<CooOperationsScreenProps> = ({ onNavigate }) => {
  const [returnModalOpen, setReturnModalOpen] = useState(false);
  const [selectedDept, setSelectedDept] = useState({ name: 'Маркетинг (MKT)', lead: 'В. Степаненко' });
  const [returnReason, setReturnReason] = useState('');
  const [systemicRisks, setSystemicRisks] = useState(
    'Ключовий ризик — відставання маркетингової воронки за темпом лідогенерації (-12.6% від плану на дату). Необхідна корекція каналів лідогенерації для Localica та авторизація позапланових пулів.'
  );
  const [cooComment, setCooComment] = useState(
    'Загальний операційний темп утримується на рівні 94.2%. Виробничий кластер перекладів та продажі перекривають норматив. Питання маркетингової лідогенерації потребує затвердження запропонованого перерозподілу бюджету на зустрічі о 16:30.'
  );
  const [isSubmittedToCeo, setIsSubmittedToCeo] = useState(false);
  const [escalations, setEscalations] = useState([
    {
      id: 'esc-1',
      title: 'Затримка узгодження перекладацьких пулів Localica',
      desc: 'Потрібна авторизація бюджету підрядників на Q4 (8 200 €)',
      level: 'danger',
    },
    {
      id: 'esc-2',
      title: 'Коригування таргетованого бюджету МКТ',
      desc: 'Перерозподіл 3 500 € з Google Ads на прямий LinkedIn аутріч',
      level: 'warning',
    },
  ]);
  const [newEscalationText, setNewEscalationText] = useState('');
  const [toastMessage, setToastMessage] = useState<{ title: string; desc: string } | null>(null);

  const showToast = (title: string, desc: string) => {
    setToastMessage({ title, desc });
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleOpenReturnModal = (dept: string, lead: string) => {
    setSelectedDept({ name: dept, lead });
    setReturnReason('');
    setReturnModalOpen(true);
  };

  const handleConfirmReturn = (e: React.FormEvent) => {
    e.preventDefault();
    setReturnModalOpen(false);
    showToast('Звіт повернуто', `Звіт підрозділу ${selectedDept.name} повернуто керівнику ${selectedDept.lead} на доопрацювання.`);
  };

  const handleAddEscalation = () => {
    if (!newEscalationText.trim()) return;
    const newId = `esc-${Date.now()}`;
    setEscalations((prev) => [
      ...prev,
      {
        id: newId,
        title: newEscalationText.trim(),
        desc: 'Додано щойно операційним директором (COO)',
        level: 'warning',
      },
    ]);
    setNewEscalationText('');
    showToast('Ескалацію додано', 'Запис внесено до чернетки звіту для CEO.');
  };

  const handleRemoveEscalation = (id: string) => {
    setEscalations((prev) => prev.filter((item) => item.id !== id));
    showToast('Ескалацію вилучено', 'Запис видалено з переліку блокерів.');
  };

  const handleSendToCeo = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittedToCeo(true);
    showToast('Огляд передано генеральному директору', 'Зріз тижня #42 успішно зафіксовано в системі.');
  };

  return (
    <div id="screen-coo-operations" className="flex-1 flex flex-col min-w-0 bg-[#f8faff]">
      {/* ================= TOPBAR HEADER ================= */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-8 py-3.5 shadow-xs flex items-center justify-between flex-wrap gap-4">
        <div className="flex flex-col">
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Операції (COO) · Щотижневий огляд та ескалації
            </h1>
            <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-xs font-semibold ring-1 ring-blue-700/10">
              Консолідовано
            </span>
            <span className="inline-flex items-center gap-1 text-xs text-amber-700 font-semibold px-2 py-0.5 rounded-md bg-amber-50 ring-1 ring-amber-600/10">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
              Дедлайн понеділка: 15:00 (Залишилось 12 хв)
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Консолідовано: MK Group &amp; Localica · Тиждень #42 (Жовтень 2024) · Зведений моніторинг 6 підрозділів
          </p>
        </div>

        {/* Action Buttons & Quick Utilities */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => showToast('Дані оновлено', 'Показники 6 структурних підрозділів актуалізовано')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs transition-all cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[16px] text-slate-500">refresh</span>
            <span>Оновити</span>
          </button>
          <button
            onClick={() => showToast('Експорт CSV', 'Формування зведеного CSV звітів відділів...')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs transition-all cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[16px] text-slate-600">file_download</span>
            <span>Звіти відділів CSV</span>
          </button>
          <button
            onClick={() => showToast('Експорт звіту COO', 'Звіт операційного директора завантажено')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs transition-all cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[16px] text-emerald-600">download</span>
            <span>Звіт COO CSV</span>
          </button>
        </div>
      </header>

      {/* ================= CONTENT WRAPPER ================= */}
      <div className="p-8 space-y-6 max-w-7xl mx-auto w-full">
        {/* ================= 3. ШЛЯХ РЕГЛАМЕНТНОЇ ЗВІТНОСТІ ================= */}
        <section className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs" data-purpose="reporting-pathway">
          <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 flex-wrap gap-2">
            <div className="flex items-center gap-2.5">
              <div className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse"></div>
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Шлях регламентної звітності (Тижневий регламент)
              </h2>
            </div>
            <span className="text-xs text-slate-500">
              Дедлайн фіксації огляду COO: <span className="font-bold text-amber-600">Пн 15:00</span> (залишилось 12 хв до передачі на CEO)
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
            {/* Step 1 */}
            <div className="bg-slate-50/80 border border-slate-200 rounded-xl p-3.5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Етап 1</span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    <span className="material-symbols-outlined text-[12px]">check_circle</span> Завершено
                  </span>
                </div>
                <div className="text-xs font-bold text-slate-900">Дані внесено</div>
                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                  Співробітники щоденника (Пн–Сб). Усі транзакційні показники зафіксовано.
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500 font-medium">
                <span>Охоплення: 100%</span>
                <span>Пд: Нд 23:59</span>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-slate-50/80 border border-slate-200 rounded-xl p-3.5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Етап 2</span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    <span className="material-symbols-outlined text-[12px]">check_circle</span> 6/6 Вчасно
                  </span>
                </div>
                <div className="text-xs font-bold text-slate-900">Звіти відділів</div>
                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                  Керівники 6 підрозділів закрили форми та коментарі до дедлайну 12:00.
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500 font-medium">
                <span>Дедлайн: Пн 12:00</span>
                <span className="text-emerald-600 font-bold">Прийнято</span>
              </div>
            </div>

            {/* Step 3: ACTIVE */}
            <div className="bg-blue-50/80 border-2 border-blue-500 rounded-xl p-3.5 flex flex-col justify-between shadow-xs relative overflow-hidden">
              <div className="absolute -right-3 -bottom-3 w-16 h-16 bg-blue-500/10 rounded-full blur-xs pointer-events-none"></div>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-extrabold text-blue-700 uppercase tracking-wider">
                    Етап 3 · В РОБОТІ
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-blue-600 text-white shadow-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span> Поточний
                  </span>
                </div>
                <div className="text-xs font-bold text-blue-950">Операційний огляд COO</div>
                <p className="text-[11px] text-blue-900/80 mt-1 leading-relaxed">
                  Верифікація аномалій, системні ескалації та зведення для CEO холдингу.
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-blue-200/80 flex items-center justify-between text-[11px] font-semibold text-blue-800">
                <span>Дедлайн: Пн 15:00</span>
                <span className="text-amber-700 font-bold">12 хв до фіксації</span>
              </div>
            </div>

            {/* Step 4 */}
            <div className="bg-slate-50/80 border border-slate-200 rounded-xl p-3.5 flex flex-col justify-between opacity-80">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Етап 4</span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded bg-slate-200 text-slate-600">
                    <span className="material-symbols-outlined text-[12px]">lock_clock</span> Очікує
                  </span>
                </div>
                <div className="text-xs font-bold text-slate-700">Доступно CEO</div>
                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                  Стратегічна панель генерального директора та сесія синхронізації холдингу.
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500 font-medium">
                <span>Орієнтир: Пн 19:00</span>
                <span>На черзі</span>
              </div>
            </div>
          </div>
        </section>

        {/* ================= 4. МЕТРИКИ COO (5 KPI-КАРТОК) ================= */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Metric 1: Точність прогнозу */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Точність прогнозу
                </span>
                <div className="mt-2 flex items-baseline gap-1.5">
                  <span className="text-2xl font-extrabold text-slate-900 tracking-tight">93.8%</span>
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                    Висока
                  </span>
                </div>
              </div>
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <span className="material-symbols-outlined text-[18px]">verified</span>
              </div>
            </div>
            <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
              <span>Формула: 100 - |вик - 100|</span>
            </div>
          </div>

          {/* Metric 2: Своєчасність звітів */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Своєчасність звітів
                </span>
                <div className="mt-2 flex items-baseline gap-1.5">
                  <span className="text-2xl font-extrabold text-emerald-600 tracking-tight">100%</span>
                  <span className="text-[11px] text-slate-500 font-medium">(6 з 6)</span>
                </div>
              </div>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <span className="material-symbols-outlined text-[18px]">schedule</span>
              </div>
            </div>
            <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Всі здали до 12:00
              </span>
            </div>
          </div>

          {/* Metric 3: Підрозділів подано */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Підрозділів подано
                </span>
                <div className="mt-2 flex items-baseline gap-1.5">
                  <span className="text-2xl font-extrabold text-slate-900 tracking-tight">6 / 6</span>
                  <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
                    100% кворум
                  </span>
                </div>
              </div>
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                <span className="material-symbols-outlined text-[18px]">lan</span>
              </div>
            </div>
            <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
              <span>MK:translations &amp; Localica</span>
            </div>
          </div>

          {/* Metric 4: Активні ескалації */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between ring-1 ring-amber-100">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Активні ескалації
                </span>
                <div className="mt-2 flex items-baseline gap-1.5">
                  <span className="text-2xl font-extrabold text-amber-600 tracking-tight">
                    {escalations.length}
                  </span>
                  <span className="text-[11px] text-slate-500 font-medium">потребують CEO</span>
                </div>
              </div>
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                <span className="material-symbols-outlined text-[18px]">priority_high</span>
              </div>
            </div>
            <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
              <span className="text-amber-700 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span> Бюджет &amp; Пули Q4
              </span>
            </div>
          </div>

          {/* Metric 5: Середнє виконання */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Середнє виконання
                </span>
                <div className="mt-2 flex items-baseline gap-1.5">
                  <span className="text-2xl font-extrabold text-slate-900 tracking-tight">94.2%</span>
                  <span className="text-xs font-semibold text-emerald-600 flex items-center">
                    <span className="material-symbols-outlined text-[14px]">arrow_upward</span> +1.8%
                  </span>
                </div>
              </div>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <span className="material-symbols-outlined text-[18px]">trending_up</span>
              </div>
            </div>
            <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
              <span className="text-emerald-600 font-semibold">Зелена зона холдингу</span>
            </div>
          </div>
        </section>

        {/* ================= 5. ОСНОВНИЙ КОНТЕНТ (7 / 5) ================= */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
          {/* ЛІВА КОЛОНКА (7 cols): Звіти структурних підрозділів */}
          <section className="xl:col-span-7 bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 flex-wrap gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-slate-900">Звіти структурних підрозділів</h2>
                  <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-bold">
                    6 з 6 закрито
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Статус виконання цілей, дедлайн, відхилення та інструмент повернення на доопрацювання
                </p>
              </div>
              <div className="flex items-center gap-3 text-xs font-medium text-slate-600">
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500"></span>≥95%</span>
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500"></span>90-95%</span>
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-rose-500"></span>&lt;90%</span>
              </div>
            </div>

            {/* Список звітів */}
            <div className="space-y-3">
              {MOCK_DEPARTMENT_REPORTS.map((rep) => {
                const isUnderRisk = rep.executionRate < 90;
                const isBorderline = rep.executionRate >= 90 && rep.executionRate < 95;

                return (
                  <div
                    key={rep.id}
                    className={`p-4 rounded-xl border transition-all space-y-3 ${
                      isUnderRisk
                        ? 'border-rose-200 bg-rose-50/40 hover:shadow-xs'
                        : isBorderline
                        ? 'border-amber-200 bg-amber-50/40 hover:shadow-xs'
                        : 'border-slate-200/90 bg-white hover:border-blue-300 hover:shadow-xs'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-xs ${
                            isUnderRisk
                              ? 'bg-rose-100 text-rose-700'
                              : isBorderline
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-blue-100 text-blue-700'
                          }`}
                        >
                          {rep.deptCode}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-sm font-bold text-slate-900">{rep.deptName}</h3>
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                isUnderRisk
                                  ? 'bg-rose-100 text-rose-700'
                                  : isBorderline
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-emerald-100 text-emerald-800'
                              }`}
                            >
                              {rep.statusBadge}
                            </span>
                          </div>
                          <span className="text-xs text-slate-500">
                            Керівник: {rep.leadName} · Здано: {rep.submittedTime} (Вчасно)
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div
                          className={`text-xl font-extrabold ${
                            isUnderRisk
                              ? 'text-rose-600'
                              : isBorderline
                              ? 'text-amber-700'
                              : 'text-slate-900'
                          }`}
                        >
                          {rep.executionRate}%
                        </div>
                        <span className="text-[11px] text-slate-400">{rep.goalsCount} цілі підрозділу</span>
                      </div>
                    </div>

                    <div
                      className={`p-2.5 rounded-lg border text-xs flex items-center justify-between ${
                        isUnderRisk
                          ? 'bg-white/80 border-rose-200/60 text-rose-900'
                          : isBorderline
                          ? 'bg-white/80 border-amber-200/60 text-amber-900'
                          : 'bg-slate-50 border-slate-100 text-slate-600'
                      }`}
                    >
                      <span className="flex items-center gap-1.5 truncate">
                        {isUnderRisk && (
                          <span className="material-symbols-outlined text-[16px] text-rose-500 shrink-0">
                            error
                          </span>
                        )}
                        {rep.deltaText}
                      </span>
                      <span
                        className={`text-[11px] font-bold shrink-0 ml-2 ${
                          isUnderRisk
                            ? 'text-rose-700'
                            : isBorderline
                            ? 'text-amber-700'
                            : 'text-emerald-600'
                        }`}
                      >
                        {rep.summaryNote.slice(0, 30)}...
                      </span>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-1 border-t border-slate-100">
                      <button
                        onClick={() => handleOpenReturnModal(rep.deptName, rep.leadName)}
                        className="px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-50 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                        type="button"
                      >
                        <span className="material-symbols-outlined text-[16px]">assignment_return</span>
                        <span>Повернути керівнику</span>
                      </button>
                      <button
                        onClick={() => onNavigate('reports')}
                        className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 rounded-lg border border-slate-200 shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                        type="button"
                      >
                        <span className="material-symbols-outlined text-[16px]">visibility</span>
                        <span>Переглянути звіт</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* ПРАВА КОЛОНКА (5 cols): Підготовка огляду для CEO */}
          <section
            className="xl:col-span-5 bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 flex flex-col justify-between"
            id="ceo-summary-form"
          >
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                    <span className="material-symbols-outlined text-[20px]">rate_review</span>
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-900">Підготовка огляду для CEO</h2>
                    <span className="text-xs text-slate-500">Офіційне зведення COO за Тиждень #42</span>
                  </div>
                </div>
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-bold ring-1 ${
                    isSubmittedToCeo
                      ? 'bg-emerald-50 text-emerald-700 ring-emerald-600/20'
                      : 'bg-blue-50 text-blue-700 ring-blue-700/10'
                  }`}
                >
                  {isSubmittedToCeo ? 'Передано CEO' : 'Чернетка'}
                </span>
              </div>

              <form className="space-y-4" onSubmit={handleSendToCeo}>
                {/* 1. Ризики та системні проблеми */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-slate-700" htmlFor="systemicRisks">
                      Ризики та системні проблеми тижня
                    </label>
                    <span className="text-[11px] text-rose-600 font-semibold">* Обов'язково</span>
                  </div>
                  <textarea
                    id="systemicRisks"
                    disabled={isSubmittedToCeo}
                    value={systemicRisks}
                    onChange={(e) => setSystemicRisks(e.target.value)}
                    rows={3}
                    className="w-full text-xs border border-slate-300 rounded-lg p-3 text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 leading-relaxed shadow-xs resize-none bg-slate-50/50 focus:bg-white transition-all disabled:bg-slate-100 disabled:cursor-not-allowed"
                  />
                </div>

                {/* 2. Список ескалацій для CEO */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-slate-700">Список ескалацій для CEO</label>
                    <span className="text-[11px] text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded">
                      {escalations.length} активні
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mb-2 leading-tight">
                    Фіксує блокери, які потребують прямого рішення або бюджету від генерального директора.
                  </p>

                  <div className="space-y-2">
                    {escalations.map((esc) => (
                      <div
                        key={esc.id}
                        className="p-3 rounded-lg border border-slate-200 bg-slate-50/80 flex items-start justify-between gap-2.5"
                      >
                        <div className="flex items-start gap-2 min-w-0">
                          <span
                            className={`material-symbols-outlined text-[18px] shrink-0 mt-0.5 ${
                              esc.level === 'danger' ? 'text-rose-500' : 'text-amber-500'
                            }`}
                          >
                            {esc.level === 'danger' ? 'priority_high' : 'tune'}
                          </span>
                          <div className="min-w-0">
                            <span className="text-xs font-bold text-slate-900 block leading-tight">
                              {esc.title}
                            </span>
                            <p className="text-[11px] text-slate-500 mt-0.5">{esc.desc}</p>
                          </div>
                        </div>
                        {!isSubmittedToCeo && (
                          <button
                            onClick={() => handleRemoveEscalation(esc.id)}
                            className="text-slate-400 hover:text-rose-600 p-1 transition-colors shrink-0 cursor-pointer"
                            title="Видалити ескалацію"
                            type="button"
                          >
                            <span className="material-symbols-outlined text-[16px]">close</span>
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  {!isSubmittedToCeo && (
                    <div className="flex items-center gap-2 mt-2">
                      <input
                        value={newEscalationText}
                        onChange={(e) => setNewEscalationText(e.target.value)}
                        placeholder="Короткий опис проблеми чи запиту до CEO..."
                        className="flex-1 text-xs border border-slate-300 rounded-lg py-2 px-3 text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-xs"
                        type="text"
                      />
                      <button
                        onClick={handleAddEscalation}
                        className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-lg transition-colors shrink-0 flex items-center gap-1 shadow-xs cursor-pointer"
                        type="button"
                      >
                        <span className="material-symbols-outlined text-[16px]">add</span>
                        <span>Додати</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* 3. Офіційний коментар COO */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1" htmlFor="cooComment">
                    Офіційний коментар COO до тижневого зрізу
                  </label>
                  <textarea
                    id="cooComment"
                    disabled={isSubmittedToCeo}
                    value={cooComment}
                    onChange={(e) => setCooComment(e.target.value)}
                    rows={4}
                    className="w-full text-xs border border-slate-300 rounded-lg p-3 text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 leading-relaxed shadow-xs resize-none bg-slate-50/50 focus:bg-white transition-all disabled:bg-slate-100 disabled:cursor-not-allowed"
                  />
                </div>

                {/* Submit Button & Note */}
                <div className="pt-3 border-t border-slate-100 space-y-2">
                  <button
                    disabled={isSubmittedToCeo}
                    className={`w-full py-3 px-4 text-white text-xs font-bold rounded-lg shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      isSubmittedToCeo
                        ? 'bg-emerald-600 hover:bg-emerald-700'
                        : 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/20'
                    }`}
                    type="submit"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {isSubmittedToCeo ? 'done_all' : 'send'}
                    </span>
                    <span>
                      {isSubmittedToCeo
                        ? 'Передано CEO (Зафіксовано 14:48)'
                        : 'Передати CEO (Операційний огляд)'}
                    </span>
                  </button>
                  <p className="text-[11px] text-slate-400 text-center flex items-center justify-center gap-1">
                    <span className="material-symbols-outlined text-[13px]">lock</span>
                    <span>Фіксація зрізу на 15:00 закриває редагування форми за ТЗ</span>
                  </p>
                </div>
              </form>
            </div>
          </section>
        </div>
      </div>

      {/* ================= МОДАЛЬНЕ ВІКНО: ПОВЕРНЕННЯ ЗВІТУ КЕРІВНИКУ ================= */}
      {returnModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200">
            <div className="px-6 py-4 bg-slate-50/90 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-rose-600 text-[22px]">
                  assignment_return
                </span>
                <h3 className="text-sm font-bold text-slate-900">Повернення звіту на доопрацювання</h3>
              </div>
              <button
                onClick={() => setReturnModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                type="button"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form className="p-6 space-y-4" onSubmit={handleConfirmReturn}>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Підрозділ:</span>
                  <span className="font-bold text-slate-900">{selectedDept.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Керівник:</span>
                  <span className="font-semibold text-slate-800">{selectedDept.lead}</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1" htmlFor="returnReasonInput">
                  Обов'язкова причина повернення (ТЗ) <span className="text-rose-600">*</span>
                </label>
                <textarea
                  id="returnReasonInput"
                  required
                  rows={4}
                  value={returnReason}
                  onChange={(e) => setReturnReason(e.target.value)}
                  placeholder="Вкажіть конкретні дані, які потребують перерахунку або додаткових пояснень керівника..."
                  className="w-full text-xs border border-slate-300 rounded-lg p-3 text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 resize-none"
                />
              </div>

              <div className="p-2.5 rounded-lg bg-amber-50 text-amber-800 text-[11px] flex items-start gap-2 border border-amber-200">
                <span className="material-symbols-outlined text-[16px] text-amber-600 shrink-0 mt-0.5">info</span>
                <span>Керівник отримає системне сповіщення. Статус звіту підрозділу буде змінено на «Повернуто COO».</span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => setReturnModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
                  type="button"
                >
                  Скасувати
                </button>
                <button
                  className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
                  type="submit"
                >
                  <span className="material-symbols-outlined text-[16px]">assignment_return</span>
                  <span>Підтвердити повернення</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-xl shadow-2xl flex items-center gap-3 transition-all border border-slate-700 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <span className="material-symbols-outlined text-emerald-400 text-[22px]">check_circle</span>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-white">{toastMessage.title}</span>
            <span className="text-[11px] text-slate-300">{toastMessage.desc}</span>
          </div>
        </div>
      )}
    </div>
  );
};
