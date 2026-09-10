import React, { useState } from 'react';
import { ScreenId, AuditEntry } from '../../types';
import { MOCK_AUDIT_LOG } from '../../data/mockData';

interface AuditLogScreenProps {
  onNavigate: (screen: ScreenId) => void;
}

export const AuditLogScreen: React.FC<AuditLogScreenProps> = ({ onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState<'all' | 'info' | 'warning' | 'critical'>('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedEntry, setSelectedEntry] = useState<AuditEntry | null>(null);

  const filteredLogs = MOCK_AUDIT_LOG.filter((entry) => {
    if (severityFilter !== 'all' && entry.severity !== severityFilter) return false;
    if (categoryFilter !== 'all' && entry.category !== categoryFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchAction = (entry.action || entry.event || '').toLowerCase().includes(q);
      const matchUser = (entry.user || entry.actor || '').toLowerCase().includes(q);
      const matchTarget = (entry.target || entry.module || '').toLowerCase().includes(q);
      if (!matchAction && !matchUser && !matchTarget) return false;
    }
    return true;
  });

  return (
    <div id="screen-audit-log" className="flex-1 flex flex-col min-w-0 bg-[#f8faff]">
      {/* ================= TOPBAR HEADER ================= */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-8 py-3.5 shadow-xs flex items-center justify-between flex-wrap gap-4">
        <div className="flex flex-col">
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Журнал аудиту · Хроніка змін, фіксацій та безпека
            </h1>
            <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-xs font-semibold ring-1 ring-blue-700/10">
              Append-only лог
            </span>
            <span className="inline-flex items-center gap-1 text-xs text-slate-600 font-semibold px-2 py-0.5 rounded-md bg-slate-100">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              Цілісність підтверджена (SHA-256)
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Незмінний реєстр усіх операцій користувачів: дедлайни, затвердження звітів, коригування фактів та входи в систему
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => alert('Експорт журналу аудиту в форматі CSV (зашифровано ключем безпеки)...')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs transition cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[16px] text-slate-600">download</span>
            <span>Експорт CSV</span>
          </button>
          <button
            onClick={() => alert('Цілісність ланцюга блоків перевірено. Жодних несанкціонованих змін не виявлено.')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[16px]">verified</span>
            <span>Верифікувати хеш</span>
          </button>
        </div>
      </header>

      {/* ================= CONTENT BODY ================= */}
      <div className="p-8 space-y-6 max-w-7xl mx-auto w-full">
        {/* Quick Stats Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Записів за сьогодні
            </span>
            <div className="text-2xl font-extrabold text-slate-900 mt-1">24 події</div>
            <span className="text-[11px] text-emerald-600 font-medium">100% зафіксовано</span>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Коригування фактів (ТЗ)
            </span>
            <div className="text-2xl font-extrabold text-amber-600 mt-1">1 запис</div>
            <span className="text-[11px] text-slate-500">Потребувало погодження CFO</span>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Критичні сповіщення
            </span>
            <div className="text-2xl font-extrabold text-slate-900 mt-1">0</div>
            <span className="text-[11px] text-emerald-600 font-medium">Система стабільна</span>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Останній запис
            </span>
            <div className="text-sm font-extrabold text-slate-900 mt-2">14:48:10 (Warsaw)</div>
            <span className="text-[11px] text-blue-600 font-medium">Ірина Мельник (COO)</span>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[240px] w-full">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Пошук за дією, ПІБ користувача чи сутністю..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          <div className="flex items-center gap-2.5 flex-wrap w-full md:w-auto">
            <select
              aria-label="Фільтр за важливістю"
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value as any)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-blue-500"
            >
              <option value="all">Усі рівні важливості</option>
              <option value="info">Звичайний (Info)</option>
              <option value="warning">Попередження (Warning)</option>
              <option value="critical">Критичний (Critical)</option>
            </select>

            <select
              aria-label="Фільтр за категорією"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-blue-500"
            >
              <option value="all">Усі категорії</option>
              <option value="Звітність">Звітність</option>
              <option value="Ескалація">Ескалації</option>
              <option value="Офер & KPI">Офери &amp; KPI</option>
              <option value="Коригування">Коригування фактів</option>
              <option value="Безпека">Безпека</option>
            </select>
          </div>
        </div>

        {/* Audit Table */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-bold text-[10px] tracking-wider">
                  <th className="py-3.5 px-4">Час (Timestamp)</th>
                  <th className="py-3.5 px-4">Користувач &amp; Роль</th>
                  <th className="py-3.5 px-4">Категорія</th>
                  <th className="py-3.5 px-4">Дія (Action)</th>
                  <th className="py-3.5 px-4">Об'єкт / Сутність</th>
                  <th className="py-3.5 px-4">IP-адреса</th>
                  <th className="py-3.5 px-4">Рівень</th>
                  <th className="py-3.5 px-4 text-right">Деталі</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                {filteredLogs.map((entry) => (
                  <tr
                    key={entry.id}
                    onClick={() => setSelectedEntry(entry)}
                    className="hover:bg-slate-50/70 transition cursor-pointer"
                  >
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                      {entry.timestamp}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900 whitespace-nowrap">
                      {entry.user}
                    </td>
                    <td className="py-3 px-4 text-slate-600 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-[10px] font-semibold">
                        {entry.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-800 font-semibold">{entry.action}</td>
                    <td className="py-3 px-4 font-mono text-blue-700 text-[11px]">{entry.target}</td>
                    <td className="py-3 px-4 font-mono text-slate-400 text-[11px]">{entry.ip}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          entry.severity === 'critical'
                            ? 'bg-rose-100 text-rose-800'
                            : entry.severity === 'warning'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-50 text-emerald-700'
                        }`}
                      >
                        {entry.severity}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedEntry(entry);
                        }}
                        className="p-1 text-slate-400 hover:text-blue-600 rounded transition"
                      >
                        <span className="material-symbols-outlined text-[18px]">info</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal for Details */}
        {selectedEntry && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 border border-slate-200 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                    ID: {selectedEntry.id}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 mt-1">{selectedEntry.action}</h3>
                  <p className="text-xs text-slate-500">{selectedEntry.timestamp}</p>
                </div>
                <button
                  onClick={() => setSelectedEntry(null)}
                  className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Користувач:</span>
                  <span className="font-bold text-slate-900">{selectedEntry.user}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Категорія події:</span>
                  <span className="font-semibold text-slate-800">{selectedEntry.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Цільовий об'єкт (Target):</span>
                  <span className="font-mono text-blue-700 font-bold">{selectedEntry.target}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">IP-адреса клієнта:</span>
                  <span className="font-mono text-slate-700">{selectedEntry.ip}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Криптографічний хеш:</span>
                  <span className="font-mono text-slate-500 text-[10px]">{selectedEntry.hash}</span>
                </div>
              </div>

              <div>
                <span className="text-xs font-bold text-slate-700">Опис та коментар:</span>
                <p className="text-xs text-slate-600 mt-1 p-3 rounded-lg bg-blue-50/50 border border-blue-100 leading-relaxed">
                  {selectedEntry.details}
                </p>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setSelectedEntry(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs rounded-xl transition"
                >
                  Закрити
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
