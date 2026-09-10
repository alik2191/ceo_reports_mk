import React, { useState } from 'react';
import { ScreenId, Employee } from '../../types';
import { MOCK_EMPLOYEES } from '../../data/mockData';

interface CorporateCatalogScreenProps {
  onNavigate: (screen: ScreenId) => void;
}

export const CorporateCatalogScreen: React.FC<CorporateCatalogScreenProps> = ({ onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCompany, setSelectedCompany] = useState('all');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  const filteredEmployees = MOCK_EMPLOYEES.filter((emp) => {
    if (selectedCompany !== 'all' && emp.company !== selectedCompany) return false;
    if (selectedDepartment !== 'all' && emp.department !== selectedDepartment) return false;
    if (selectedStatus !== 'all' && emp.status !== selectedStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = (emp.fullName || '').toLowerCase().includes(q);
      const matchPosition = (emp.position || '').toLowerCase().includes(q);
      const matchEmail = (emp.email || '').toLowerCase().includes(q);
      if (!matchName && !matchPosition && !matchEmail) return false;
    }
    return true;
  });

  return (
    <div id="screen-corporate-catalog" className="flex-1 flex flex-col min-w-0 bg-[#f8faff]">
      {/* ================= TOPBAR HEADER ================= */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-8 py-3.5 shadow-xs flex items-center justify-between flex-wrap gap-4">
        <div className="flex flex-col">
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Корпоративний каталог · Команда холдингу MK Group
            </h1>
            <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-xs font-semibold ring-1 ring-blue-700/10">
              38 співробітників
            </span>
            <span className="inline-flex items-center gap-1 text-xs text-slate-600 font-semibold px-2 py-0.5 rounded-md bg-slate-100">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              MK:translations &amp; Localica
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Контакти, підрозділи, організаційні ролі, локації та статус активності спеціалістів
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md text-xs font-semibold transition ${
                viewMode === 'grid' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Сітка карток"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">grid_view</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-md text-xs font-semibold transition ${
                viewMode === 'table' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Табличний вигляд"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">view_list</span>
            </button>
          </div>

          <button
            onClick={() => alert('Експорт адресного довідника .CSV розпочато.')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs transition cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[16px] text-emerald-600">download</span>
            <span>Експорт контактів</span>
          </button>
        </div>
      </header>

      {/* ================= CONTENT BODY ================= */}
      <div className="p-8 space-y-6 max-w-7xl mx-auto w-full">
        {/* Filters Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3 flex-wrap">
          {/* Search Input */}
          <div className="relative flex-1 min-w-[240px] w-full">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Пошук за ПІБ, посадою чи email..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          {/* Filter Selects */}
          <div className="flex items-center gap-2.5 flex-wrap w-full md:w-auto">
            <select
              aria-label="Фільтр за компанією"
              value={selectedCompany}
              onChange={(e) => setSelectedCompany(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-blue-500"
            >
              <option value="all">Усі компанії холдингу</option>
              <option value="MK:translations">MK:translations</option>
              <option value="Localica">Localica</option>
              <option value="MK Group (Holding)">Корпоративний центр</option>
            </select>

            <select
              aria-label="Фільтр за підрозділом"
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-blue-500"
            >
              <option value="all">Усі підрозділи</option>
              <option value="Локалізація">Локалізація (LOC)</option>
              <option value="Продажі">Продажі (SLS)</option>
              <option value="Маркетинг">Маркетинг (MKT)</option>
              <option value="HR & Рекрутинг">HR &amp; Рекрутинг (HR)</option>
              <option value="Фінанси">Фінанси (FIN)</option>
              <option value="Операції">Операції (OPS)</option>
            </select>

            <select
              aria-label="Фільтр за статусом"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-blue-500"
            >
              <option value="all">Усі статуси</option>
              <option value="active">Активний</option>
              <option value="vacation">У відпустці</option>
              <option value="probation">Випробувальний термін</option>
            </select>
          </div>
        </div>

        {/* Count result */}
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>
            Знайдено <strong className="text-slate-900 font-bold">{filteredEmployees.length}</strong> співробітників
          </span>
          <span>Останнє оновлення кадрового реєстру: Сьогодні, 09:30</span>
        </div>

        {/* Grid View */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredEmployees.map((emp) => (
              <div
                key={emp.id}
                onClick={() => setSelectedEmployee(emp)}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-blue-400 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-extrabold text-sm flex items-center justify-center shadow-xs">
                      {emp.avatarInitials}
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        emp.status === 'active'
                          ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20'
                          : emp.status === 'vacation'
                          ? 'bg-amber-50 text-amber-700 ring-1 ring-amber-600/20'
                          : 'bg-blue-50 text-blue-700 ring-1 ring-blue-600/20'
                      }`}
                    >
                      {emp.status === 'active'
                        ? 'Активний'
                        : emp.status === 'vacation'
                        ? 'У відпустці'
                        : 'Випробувальний'}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm mt-3">{emp.fullName}</h3>
                  <p className="text-xs text-blue-700 font-semibold mt-0.5">{emp.position}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">{emp.company}</p>

                  <div className="mt-3 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                    <div className="flex items-center gap-1.5 truncate">
                      <span className="material-symbols-outlined text-[15px] text-slate-400">mail</span>
                      <span className="truncate">{emp.email}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[15px] text-slate-400">location_on</span>
                      <span>{emp.location}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">{emp.department}</span>
                  <span className="text-blue-600 font-bold flex items-center gap-0.5">
                    Профіль <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Table View */
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-bold text-[10px] tracking-wider">
                    <th className="py-3.5 px-4">Співробітник</th>
                    <th className="py-3.5 px-4">Посада</th>
                    <th className="py-3.5 px-4">Компанія</th>
                    <th className="py-3.5 px-4">Підрозділ</th>
                    <th className="py-3.5 px-4">Контакти</th>
                    <th className="py-3.5 px-4">Локація</th>
                    <th className="py-3.5 px-4">Статус</th>
                    <th className="py-3.5 px-4 text-right">Дія</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                  {filteredEmployees.map((emp) => (
                    <tr
                      key={emp.id}
                      onClick={() => setSelectedEmployee(emp)}
                      className="hover:bg-slate-50/70 transition cursor-pointer"
                    >
                      <td className="py-3 px-4 flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                          {emp.avatarInitials}
                        </div>
                        <span className="font-bold text-slate-900">{emp.fullName}</span>
                      </td>
                      <td className="py-3 px-4 font-semibold text-blue-700">{emp.position}</td>
                      <td className="py-3 px-4 text-slate-600">{emp.company}</td>
                      <td className="py-3 px-4 text-slate-600">{emp.department}</td>
                      <td className="py-3 px-4 text-slate-500">
                        <div>{emp.email}</div>
                        <div className="text-[11px] text-slate-400">{emp.phone}</div>
                      </td>
                      <td className="py-3 px-4 text-slate-600">{emp.location}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            emp.status === 'active'
                              ? 'bg-emerald-50 text-emerald-700'
                              : emp.status === 'vacation'
                              ? 'bg-amber-50 text-amber-700'
                              : 'bg-blue-50 text-blue-700'
                          }`}
                        >
                          {emp.status === 'active'
                            ? 'Активний'
                            : emp.status === 'vacation'
                            ? 'Відпустка'
                            : 'Випробувальний'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedEmployee(emp);
                          }}
                          className="px-2.5 py-1 rounded bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 font-semibold text-[11px] transition"
                        >
                          Картка
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Selected Employee Detail Modal */}
        {selectedEmployee && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white font-bold text-lg flex items-center justify-center shadow-sm">
                    {selectedEmployee.avatarInitials}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">{selectedEmployee.fullName}</h3>
                    <p className="text-xs text-blue-700 font-semibold">{selectedEmployee.position}</p>
                    <p className="text-[11px] text-slate-500">
                      {selectedEmployee.company} · {selectedEmployee.department}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedEmployee(null)}
                  className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Робочий Email:</span>
                  <a href={`mailto:${selectedEmployee.email}`} className="font-semibold text-blue-600 hover:underline">
                    {selectedEmployee.email}
                  </a>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Телефон:</span>
                  <span className="font-semibold text-slate-800">{selectedEmployee.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Telegram / Корпоративний зв'язок:</span>
                  <span className="font-semibold text-slate-800">{selectedEmployee.telegram}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Локація / Офіс:</span>
                  <span className="font-semibold text-slate-800">{selectedEmployee.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Керівник (Reports To):</span>
                  <span className="font-semibold text-slate-800">{selectedEmployee.reportsTo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Дата приєднання:</span>
                  <span className="font-semibold text-slate-800">{selectedEmployee.startDate}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => {
                    setSelectedEmployee(null);
                    onNavigate('diary');
                  }}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[16px]">edit_note</span>
                  <span>Щоденник співробітника</span>
                </button>
                <button
                  onClick={() => {
                    setSelectedEmployee(null);
                    onNavigate('kpi_offer');
                  }}
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[16px]">calculate</span>
                  <span>KPI в офері</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
