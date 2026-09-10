import React, { useState } from 'react';
import { ScreenId } from '../../types';

interface GoalsPlanningScreenProps {
  onNavigate: (screen: ScreenId) => void;
}

interface StrategicGoal {
  id: string;
  code: string;
  title: string;
  description: string;
  pillar: string;
  owner: string;
  departments: string[];
  targetValue: string;
  currentValue: string;
  progress: number;
  status: 'on_track' | 'at_risk' | 'completed';
  quarter: string;
}

export const GoalsPlanningScreen: React.FC<GoalsPlanningScreenProps> = ({ onNavigate }) => {
  const [selectedQuarter, setSelectedQuarter] = useState('Q4 2024');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [goals, setGoals] = useState<StrategicGoal[]>([
    {
      id: 'goal-1',
      code: 'STRAT-01',
      title: 'Експансія B2B продажів на ринки Центральної та Західної Європи',
      description: 'Збільшення частки клієнтів з Німеччини, Польщі та Великобританії до 60% загального портфеля.',
      pillar: 'Дохід та експансія',
      owner: 'Михайло Кравченко (CEO) / Андрій Мельник (SLS)',
      departments: ['SLS', 'MKT', 'LOC'],
      targetValue: '150 000 € / міс',
      currentValue: '142 800 € / міс',
      progress: 95.2,
      status: 'on_track',
      quarter: 'Q4 2024',
    },
    {
      id: 'goal-2',
      code: 'STRAT-02',
      title: 'Автоматизація виробничого пайплайну платформи Localica',
      description: 'Інтеграція нейромережевих CAT-інструментів та TMS для прискорення обробки проєктів на 25%.',
      pillar: 'Операційна ефективність',
      owner: 'Ірина Мельник (COO) / Оксана Ткаченко (LOC)',
      departments: ['LOC', 'OPS'],
      targetValue: '98% вчасних здач',
      currentValue: '96.5%',
      progress: 98.4,
      status: 'completed',
      quarter: 'Q4 2024',
    },
    {
      id: 'goal-3',
      code: 'STRAT-03',
      title: 'Оптимізація вартості залучення B2B лідів (CAC & CPL)',
      description: 'Зниження собівартості кваліфікованого ліда в Google Ads та LinkedIn аутрічі до ≤65 €.',
      pillar: 'Маркетинг та лідогенерація',
      owner: 'Василь Степаненко (MKT)',
      departments: ['MKT'],
      targetValue: '≤65 € / SQL',
      currentValue: '84.50 € / SQL',
      progress: 82.0,
      status: 'at_risk',
      quarter: 'Q4 2024',
    },
    {
      id: 'goal-4',
      code: 'STRAT-04',
      title: 'Збереження ключових талантів та утримання плинності кадрів',
      description: 'Впровадження прозорої системи грейдів, перегляду KPI оферів та утримання річної плинності <6%.',
      pillar: 'HR та культура',
      owner: 'Юлія Сидоренко (HR)',
      departments: ['HR'],
      targetValue: '<6% плинність',
      currentValue: '3.8% факт',
      progress: 100,
      status: 'completed',
      quarter: 'Q4 2024',
    },
  ]);

  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    pillar: 'Дохід та експансія',
    owner: 'Ірина Мельник (COO)',
    targetValue: '',
  });

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoal.title.trim()) return;

    const newItem: StrategicGoal = {
      id: `goal-${Date.now()}`,
      code: `STRAT-0${goals.length + 1}`,
      title: newGoal.title,
      description: newGoal.description,
      pillar: newGoal.pillar,
      owner: newGoal.owner,
      departments: ['OPS'],
      targetValue: newGoal.targetValue || '100%',
      currentValue: '0%',
      progress: 10,
      status: 'on_track',
      quarter: selectedQuarter,
    };

    setGoals((prev) => [...prev, newItem]);
    setIsAddModalOpen(false);
    setNewGoal({
      title: '',
      description: '',
      pillar: 'Дохід та експансія',
      owner: 'Ірина Мельник (COO)',
      targetValue: '',
    });
    alert('Стратегічну ціль успішно додано до плану та декомпозовано на підрозділи.');
  };

  return (
    <div id="screen-goals-planning" className="flex-1 flex flex-col min-w-0 bg-[#f8faff]">
      {/* ================= TOPBAR HEADER ================= */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-8 py-3.5 shadow-xs flex items-center justify-between flex-wrap gap-4">
        <div className="flex flex-col">
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Планування цілей · Каскадування OKR та річний план холдингу
            </h1>
            <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-xs font-semibold ring-1 ring-blue-700/10">
              {selectedQuarter}
            </span>
            <span className="inline-flex items-center gap-1 text-xs text-emerald-700 font-semibold px-2 py-0.5 rounded-md bg-emerald-50 ring-1 ring-emerald-600/10">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              Затверджено генеральним директором (CEO)
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Стратегічні вектори MK Group, декомпозиція цілей на 6 операційних відділів та інтегральний контроль
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <select
            aria-label="Вибір кварталу планування"
            value={selectedQuarter}
            onChange={(e) => setSelectedQuarter(e.target.value)}
            className="px-3 py-1.5 bg-slate-100 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 cursor-pointer"
          >
            <option value="Q3 2024">Q3 2024 (Архів)</option>
            <option value="Q4 2024">Q4 2024 (Поточний)</option>
            <option value="Q1 2025">Q1 2025 (План)</option>
            <option value="Рік 2025">Річний план 2025</option>
          </select>

          <button
            onClick={() => alert('Формування карти цілей OKR у PDF розпочато')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs transition cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[16px] text-slate-600">picture_as_pdf</span>
            <span>Експорт OKR PDF</span>
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
            <span>Додати ціль OKR</span>
          </button>
        </div>
      </header>

      {/* ================= CONTENT BODY ================= */}
      <div className="p-8 space-y-6 max-w-7xl mx-auto w-full">
        {/* 4 Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Стратегічні вектори
            </span>
            <div className="mt-2 text-3xl font-extrabold text-slate-900 tracking-tight">
              {goals.length} цілей
            </div>
            <div className="mt-3 pt-2.5 border-t border-slate-100 flex justify-between text-xs">
              <span className="text-slate-500">Покриття компаній:</span>
              <span className="text-blue-600 font-bold">MK:trans &amp; Localica</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Загальний прогрес OKR
            </span>
            <div className="mt-2 text-3xl font-extrabold text-emerald-600 tracking-tight">
              94.2%
            </div>
            <div className="mt-3 pt-2.5 border-t border-slate-100 flex justify-between text-xs">
              <span className="text-slate-500">Статус кварталу:</span>
              <span className="text-emerald-600 font-bold">В графіку</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Декомпозиція на підрозділи
            </span>
            <div className="mt-2 text-3xl font-extrabold text-slate-900 tracking-tight">
              26 KPI
            </div>
            <div className="mt-3 pt-2.5 border-t border-slate-100 flex justify-between text-xs">
              <span className="text-slate-500">Закріплено за 6 відділами</span>
              <span className="text-blue-600 font-bold">100% розподіл</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between ring-1 ring-rose-100">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Цілі під ризиком
            </span>
            <div className="mt-2 text-3xl font-extrabold text-rose-600 tracking-tight">
              1 ціль
            </div>
            <div className="mt-3 pt-2.5 border-t border-slate-100 flex justify-between text-xs">
              <span className="text-rose-700 font-bold">Маркетинг (MKT)</span>
              <span className="text-slate-500 text-[11px]">82.0% прогрес</span>
            </div>
          </div>
        </div>

        {/* ================= GOALS LIST ================= */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Стратегічні цілі холдингу (OKR)</h2>
              <p className="text-xs text-slate-500">Детальний моніторинг, відповідальні особи та прогрес виконання</p>
            </div>
            <button
              onClick={() => onNavigate('ceo')}
              className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Панель CEO</span>
              <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
            </button>
          </div>

          <div className="space-y-4">
            {goals.map((g) => {
              const isRisk = g.status === 'at_risk';
              const isDone = g.status === 'completed';

              return (
                <div
                  key={g.id}
                  className={`bg-white rounded-2xl p-6 border shadow-xs transition-all space-y-4 ${
                    isRisk
                      ? 'border-rose-200 bg-rose-50/20 hover:border-rose-300'
                      : isDone
                      ? 'border-emerald-200 bg-emerald-50/10'
                      : 'border-slate-200 hover:border-blue-300'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                          {g.code}
                        </span>
                        <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                          {g.pillar}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            isRisk
                              ? 'bg-rose-100 text-rose-800'
                              : isDone
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {isRisk ? 'Під ризиком' : isDone ? 'Виконано' : 'В процесі'}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-slate-900 mt-1">{g.title}</h3>
                      <p className="text-xs text-slate-500 leading-relaxed max-w-3xl">{g.description}</p>
                    </div>

                    <div className="text-right shrink-0">
                      <div
                        className={`text-2xl font-extrabold ${
                          isRisk ? 'text-rose-600' : isDone ? 'text-emerald-600' : 'text-slate-900'
                        }`}
                      >
                        {g.progress}%
                      </div>
                      <span className="text-xs text-slate-500 font-medium">Ціль: {g.targetValue}</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[11px] text-slate-500 font-medium">
                      <span>Поточний факт: {g.currentValue}</span>
                      <span>Планова ціль: {g.targetValue}</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          isRisk ? 'bg-rose-500' : isDone ? 'bg-emerald-500' : 'bg-blue-600'
                        }`}
                        style={{ width: `${Math.min(g.progress, 100)}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Footer Meta */}
                  <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[16px] text-slate-400">person</span>
                      <span>Відповідальний: <strong className="text-slate-800 font-semibold">{g.owner}</strong></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>Задіяні підрозділи:</span>
                      <div className="flex items-center gap-1">
                        {g.departments.map((d) => (
                          <span key={d} className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-mono text-[10px] font-bold">
                            {d}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Add Goal Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 border border-slate-200 space-y-4">
            <div className="flex items-start justify-between">
              <h3 className="text-base font-bold text-slate-900">Додати нову стратегічну ціль (OKR)</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleAddGoal} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1" htmlFor="goalTitleInput">
                  Назва стратегічної цілі <span className="text-rose-600">*</span>
                </label>
                <input
                  id="goalTitleInput"
                  required
                  type="text"
                  value={newGoal.title}
                  onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                  placeholder="Наприклад: Вихід на ринок локалізації медичного обладнання..."
                  className="w-full text-xs border border-slate-300 rounded-lg p-2.5 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1" htmlFor="goalDescInput">
                  Опис та ключові результати (Key Results)
                </label>
                <textarea
                  id="goalDescInput"
                  rows={3}
                  value={newGoal.description}
                  onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                  placeholder="Опишіть вимірні критерії успіху та очікувані метрики..."
                  className="w-full text-xs border border-slate-300 rounded-lg p-2.5 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1" htmlFor="goalPillarSelect">
                    Стратегічний напрямок
                  </label>
                  <select
                    id="goalPillarSelect"
                    value={newGoal.pillar}
                    onChange={(e) => setNewGoal({ ...newGoal, pillar: e.target.value })}
                    className="w-full text-xs border border-slate-300 rounded-lg p-2 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="Дохід та експансія">Дохід та експансія</option>
                    <option value="Операційна ефективність">Операційна ефективність</option>
                    <option value="Маркетинг та лідогенерація">Маркетинг та лідогенерація</option>
                    <option value="HR та культура">HR та культура</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1" htmlFor="goalTargetInput">
                    Цільовий показник
                  </label>
                  <input
                    id="goalTargetInput"
                    type="text"
                    value={newGoal.targetValue}
                    onChange={(e) => setNewGoal({ ...newGoal, targetValue: e.target.value })}
                    placeholder="Наприклад: 50 000 € або 95%"
                    className="w-full text-xs border border-slate-300 rounded-lg p-2 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold cursor-pointer"
                >
                  Скасувати
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold cursor-pointer shadow-xs"
                >
                  Створити ціль
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
