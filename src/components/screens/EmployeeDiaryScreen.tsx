import React, { useState } from 'react';
import { ScreenId, DiaryEntry } from '../../types';
import { MOCK_DIARY_ENTRIES } from '../../data/mockData';

interface EmployeeDiaryScreenProps {
  onNavigate: (screen: ScreenId) => void;
}

export const EmployeeDiaryScreen: React.FC<EmployeeDiaryScreenProps> = ({ onNavigate }) => {
  const [entries, setEntries] = useState<DiaryEntry[]>(MOCK_DIARY_ENTRIES);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEntry, setNewEntry] = useState({
    date: '2024-10-18',
    hours: 8,
    kpiMetric: 'Переклад слів',
    volume: 3200,
    unit: 'слів',
    description: '',
  });

  const totalHours = entries.reduce((acc, curr) => acc + (Number(curr.hours) || 8), 0);
  const totalVolume = entries.reduce(
    (acc, curr) => acc + (Number(curr.volume) || Number(curr.wordsCount) || 0),
    0
  );

  const handleAddEntry = (e: React.FormEvent) => {
    e.preventDefault();
    const created: DiaryEntry = {
      id: `diary-${Date.now()}`,
      date: newEntry.date,
      hours: Number(newEntry.hours),
      kpiMetric: newEntry.kpiMetric,
      volume: Number(newEntry.volume),
      unit: newEntry.unit,
      description: newEntry.description || 'Виконання планового замовлення локалізації',
      status: 'approved',
    };
    setEntries((prev) => [created, ...prev]);
    setIsModalOpen(false);
    setNewEntry({
      date: '2024-10-18',
      hours: 8,
      kpiMetric: 'Переклад слів',
      volume: 3200,
      unit: 'слів',
      description: '',
    });
    alert('Запис успішно внесено до щоденника.');
  };

  const handleSubmitWeek = () => {
    setIsSubmitted(true);
    alert('Щоденник за Тиждень #42 успішно зафіксовано та передано керівнику підрозділу на верифікацію.');
  };

  return (
    <div id="screen-employee-diary" className="flex-1 flex flex-col min-w-0 bg-[#f8faff]">
      {/* ================= TOPBAR HEADER ================= */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-8 py-3.5 shadow-xs flex items-center justify-between flex-wrap gap-4">
        <div className="flex flex-col">
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Щоденник співробітника · Щоденний облік завдань та часу
            </h1>
            <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-xs font-semibold ring-1 ring-blue-700/10">
              Тиждень #42
            </span>
            <span
              className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-md ${
                isSubmitted
                  ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/10'
                  : 'bg-blue-50 text-blue-700 ring-1 ring-blue-700/10'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  isSubmitted ? 'bg-emerald-500' : 'bg-blue-600 animate-pulse'
                }`}
              ></span>
              {isSubmitted ? 'Здано керівнику' : 'В процесі заповнення'}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Співробітник: <strong className="text-slate-800 font-bold">Богдан Лисенко</strong> · Локалізація (LOC) · Керівник: Оксана Ткаченко
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 text-xs font-semibold shadow-xs transition cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[16px] text-blue-600">add</span>
            <span>Додати запис дня</span>
          </button>
          <button
            disabled={isSubmitted}
            onClick={handleSubmitWeek}
            className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-white text-xs font-bold shadow-xs transition cursor-pointer ${
              isSubmitted ? 'bg-emerald-600' : 'bg-blue-600 hover:bg-blue-700'
            }`}
            type="button"
          >
            <span className="material-symbols-outlined text-[16px]">
              {isSubmitted ? 'done_all' : 'send'}
            </span>
            <span>{isSubmitted ? 'Зафіксовано ✓' : 'Подати щоденник керівнику'}</span>
          </button>
        </div>
      </header>

      {/* ================= CONTENT BODY ================= */}
      <div className="p-8 space-y-6 max-w-7xl mx-auto w-full">
        {/* 4 KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Відпрацьовано годин
            </span>
            <div className="mt-2 text-3xl font-extrabold text-slate-900 tracking-tight">
              {totalHours} год
            </div>
            <div className="mt-3 pt-2.5 border-t border-slate-100 flex justify-between text-xs">
              <span className="text-slate-500">Норма тижня: 40.0 год</span>
              <span className="text-emerald-600 font-bold">101.2% норми</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Виконання особистого плану
            </span>
            <div className="mt-2 text-3xl font-extrabold text-blue-600 tracking-tight">
              96.5%
            </div>
            <div className="mt-3 pt-2.5 border-t border-slate-100 flex justify-between text-xs">
              <span className="text-slate-500">Критерій бонусу: ≥95%</span>
              <span className="text-blue-600 font-bold">В зоні бонусу</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Обсяг виконаних робіт
            </span>
            <div className="mt-2 text-3xl font-extrabold text-emerald-600 tracking-tight">
              {(totalVolume || 0).toLocaleString()} слів
            </div>
            <div className="mt-3 pt-2.5 border-t border-slate-100 flex justify-between text-xs">
              <span className="text-slate-500">Локалізація EN &gt; UA/PL</span>
              <span className="text-emerald-600 font-bold">+5.2% до темпу</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Дедлайн закриття
            </span>
            <div className="mt-2 text-3xl font-extrabold text-indigo-600 tracking-tight">
              Нд 23:59
            </div>
            <div className="mt-3 pt-2.5 border-t border-slate-100 flex justify-between text-xs">
              <span className="text-slate-500">Потім вхід у звіт відділу</span>
              <span className="text-slate-700 font-semibold">Пн 12:00</span>
            </div>
          </div>
        </div>

        {/* ================= DIARY ENTRIES TABLE ================= */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Щоденні записи та задачі (Тиждень #42)
              </h2>
              <p className="text-xs text-slate-500">
                Фіксація годин, виконаного обсягу та результатів для щотижневої верифікації
              </p>
            </div>
            <span className="text-xs text-slate-400">Всього записів: {entries.length}</span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-bold text-[10px] tracking-wider">
                  <th className="py-3.5 px-4">Дата</th>
                  <th className="py-3.5 px-4">Метрика / Завдання</th>
                  <th className="py-3.5 px-4 text-center">Години</th>
                  <th className="py-3.5 px-4 text-right">Обсяг</th>
                  <th className="py-3.5 px-4">Опис робіт та результат</th>
                  <th className="py-3.5 px-4">Статус</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                {entries.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900 whitespace-nowrap">
                      {item.date}
                    </td>
                    <td className="py-3 px-4 font-semibold text-blue-700">{item.kpiMetric || 'Переклад слів'}</td>
                    <td className="py-3 px-4 text-center font-bold text-slate-900">{item.hours ?? 8} год</td>
                    <td className="py-3 px-4 text-right font-extrabold text-emerald-700">
                      {(Number(item.volume) || Number(item.wordsCount) || 0).toLocaleString()} {item.unit || 'слів'}
                    </td>
                    <td className="py-3 px-4 text-slate-600 max-w-md leading-relaxed">
                      {item.description || item.comment || 'Виконання планового замовлення'}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10px] font-bold">
                        Верифіковано
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Note on SLA */}
        <div className="p-4 rounded-xl bg-blue-50 border border-blue-200/80 flex items-start gap-3 text-xs text-blue-900">
          <span className="material-symbols-outlined text-blue-600 text-[20px] shrink-0">info</span>
          <div className="leading-relaxed">
            <strong>Регламент Етапу 1 (ТЗ):</strong> Щоденник заповнюється співробітниками щоденно до закінчення робочого дня або підсумково до неділі 23:59. У понеділок о 12:00 на основі цих даних формується підсумковий звіт підрозділу, який передається на огляд операційному директору (COO).
          </div>
        </div>
      </div>

      {/* Add Entry Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-200 space-y-4">
            <div className="flex items-start justify-between">
              <h3 className="text-base font-bold text-slate-900">Додати запис робочого дня</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleAddEntry} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1" htmlFor="diaryDate">Дата виконання</label>
                <input
                  id="diaryDate"
                  required
                  type="date"
                  value={newEntry.date}
                  onChange={(e) => setNewEntry({ ...newEntry, date: e.target.value })}
                  className="w-full text-xs border border-slate-300 rounded-lg p-2.5 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1" htmlFor="diaryHours">Відпрацьовано годин</label>
                  <input
                    id="diaryHours"
                    required
                    type="number"
                    min={1}
                    max={16}
                    value={newEntry.hours}
                    onChange={(e) => setNewEntry({ ...newEntry, hours: Number(e.target.value) })}
                    className="w-full text-xs border border-slate-300 rounded-lg p-2.5 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1" htmlFor="diaryVolume">Обсяг (слів/тасок)</label>
                  <input
                    id="diaryVolume"
                    required
                    type="number"
                    value={newEntry.volume}
                    onChange={(e) => setNewEntry({ ...newEntry, volume: Number(e.target.value) })}
                    className="w-full text-xs border border-slate-300 rounded-lg p-2.5 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1" htmlFor="diaryDesc">Опис завдань та результат</label>
                <textarea
                  id="diaryDesc"
                  required
                  rows={3}
                  value={newEntry.description}
                  onChange={(e) => setNewEntry({ ...newEntry, description: e.target.value })}
                  placeholder="Опишіть замовлення, клієнта чи виконані етапи робіт..."
                  className="w-full text-xs border border-slate-300 rounded-lg p-2.5 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold cursor-pointer"
                >
                  Скасувати
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold cursor-pointer shadow-xs"
                >
                  Зберегти запис
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
