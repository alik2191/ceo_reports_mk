import React, { useState, useEffect } from 'react';
import { ScreenId } from '../../types';
import { apiClient } from '../../services/api';
import { DealItem, SalesMetrics, SalesRepItem, SalesActivityItem } from '../../db/repository';

interface Props {
  onNavigate: (screenId: ScreenId) => void;
}

const STAGES: { id: DealItem['stage']; label: string; color: string; prob: number }[] = [
  { id: 'lead', label: 'Новий лід', color: 'border-slate-300 bg-slate-50', prob: 20 },
  { id: 'discovery', label: 'Discovery / Демо', color: 'border-blue-300 bg-blue-50/50', prob: 40 },
  { id: 'proposal', label: 'КП надіслано', color: 'border-amber-300 bg-amber-50/50', prob: 60 },
  { id: 'negotiation', label: 'Переговори & SLA', color: 'border-indigo-300 bg-indigo-50/50', prob: 80 },
  { id: 'contract_signing', label: 'Підписання', color: 'border-purple-300 bg-purple-50/50', prob: 95 },
  { id: 'won', label: 'Укладено (Won)', color: 'border-emerald-300 bg-emerald-50/60', prob: 100 },
];

export const SalesDepartmentScreen: React.FC<Props> = ({ onNavigate }) => {
  const [deals, setDeals] = useState<DealItem[]>([]);
  const [metrics, setMetrics] = useState<SalesMetrics | null>(null);
  const [reps, setReps] = useState<SalesRepItem[]>([]);
  const [activities, setActivities] = useState<SalesActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [showAddDealModal, setShowAddDealModal] = useState(false);
  const [showAddActivityModal, setShowAddActivityModal] = useState(false);
  const [showSchemaModal, setShowSchemaModal] = useState(false);
  const [schemaSql, setSchemaSql] = useState<string>('');

  // Form states
  const [newDeal, setNewDeal] = useState({
    clientCompany: '',
    contactPerson: '',
    email: '',
    phone: '',
    dealTitle: '',
    segment: 'Enterprise' as DealItem['segment'],
    valueEur: 25000,
    stage: 'lead' as DealItem['stage'],
    assignedRepName: 'Іван Данченко',
    source: 'Outreach SDR' as DealItem['source'],
    expectedCloseDate: '2024-11-30',
    notes: '',
  });

  const [newActivity, setNewActivity] = useState({
    repName: 'Іван Данченко',
    dealTitle: '',
    activityType: 'demo' as SalesActivityItem['activityType'],
    durationMin: 30,
    summary: '',
    outcome: '',
  });

  const loadData = async () => {
    try {
      const [dealsData, metricsData, repsData, activitiesData] = await Promise.all([
        apiClient.getDeals(),
        apiClient.getSalesMetrics(),
        apiClient.getSalesReps(),
        apiClient.getSalesActivities(),
      ]);
      setDeals(dealsData);
      setMetrics(metricsData);
      setReps(repsData);
      setActivities(activitiesData);
    } catch (err) {
      console.error('Error loading sales data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleStageChange = async (dealId: string, newStage: DealItem['stage']) => {
    await apiClient.updateDealStage(dealId, newStage);
    await loadData();
  };

  const handleDeleteDeal = async (dealId: string) => {
    if (confirm('Видалити цю угоду з пайплайну?')) {
      await apiClient.deleteDeal(dealId);
      await loadData();
    }
  };

  const handleCreateDealSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await apiClient.createDeal({
      clientCompany: newDeal.clientCompany,
      contactPerson: newDeal.contactPerson,
      email: newDeal.email,
      phone: newDeal.phone,
      dealTitle: newDeal.dealTitle,
      segment: newDeal.segment,
      valueEur: Number(newDeal.valueEur),
      stage: newDeal.stage,
      probabilityPct: 20,
      assignedRepId: 'emp-2',
      assignedRepName: newDeal.assignedRepName,
      source: newDeal.source,
      expectedCloseDate: newDeal.expectedCloseDate,
      notes: newDeal.notes,
    });
    setShowAddDealModal(false);
    setNewDeal({
      clientCompany: '',
      contactPerson: '',
      email: '',
      phone: '',
      dealTitle: '',
      segment: 'Enterprise',
      valueEur: 25000,
      stage: 'lead',
      assignedRepName: 'Іван Данченко',
      source: 'Outreach SDR',
      expectedCloseDate: '2024-11-30',
      notes: '',
    });
    await loadData();
  };

  const handleCreateActivitySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await apiClient.logSalesActivity({
      repName: newActivity.repName,
      dealTitle: newActivity.dealTitle,
      activityType: newActivity.activityType,
      durationMin: Number(newActivity.durationMin),
      summary: newActivity.summary,
      outcome: newActivity.outcome,
    });
    setShowAddActivityModal(false);
    setNewActivity({
      repName: 'Іван Данченко',
      dealTitle: '',
      activityType: 'demo',
      durationMin: 30,
      summary: '',
      outcome: '',
    });
    await loadData();
  };

  const handleOpenSchemaModal = async () => {
    const res = await apiClient.getDatabaseSchema();
    setSchemaSql(res.schema);
    setShowSchemaModal(true);
  };

  return (
    <div className="flex-1 bg-slate-50 min-h-full pb-12">
      {/* Top Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-5 sticky top-0 z-10 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 text-[11px] font-bold bg-blue-100 text-blue-800 rounded">
                SLS · Корпоративні продажі
              </span>
              <span className="px-2 py-0.5 text-[11px] font-bold bg-emerald-100 text-emerald-800 rounded flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                104.2% Виконано
              </span>
              <span className="text-xs text-slate-400">| Q4 2024</span>
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <span className="material-symbols-outlined text-blue-600">point_of_sale</span>
              Операційний контур відділу продажів (Sales SLS)
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Тімлід: <strong>Іван Данченко</strong> · 8 співробітників (Enterprise, SDR, KAM) · Варшава / Remote
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleOpenSchemaModal}
              className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1.5 border border-slate-300 shadow-2xs"
            >
              <span className="material-symbols-outlined text-[16px] text-slate-600">database</span>
              Схема БД & REST API
            </button>
            <button
              onClick={() => setShowAddActivityModal(true)}
              className="px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors flex items-center gap-1.5 border border-blue-200 shadow-2xs"
            >
              <span className="material-symbols-outlined text-[16px]">add_task</span>
              + Лог активності
            </button>
            <button
              onClick={() => setShowAddDealModal(true)}
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm shadow-blue-600/30"
            >
              <span className="material-symbols-outlined text-[16px]">add</span>
              + Нова угода
            </button>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        {/* KPI Metric Summary Cards */}
        {metrics && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-1">
                <span>План виручки Q4</span>
                <span className="material-symbols-outlined text-blue-600 text-[18px]">payments</span>
              </div>
              <div className="text-2xl font-bold text-slate-900">
                €{metrics.totalRevenueEur.toLocaleString()}
              </div>
              <div className="mt-2 flex items-center justify-between text-xs">
                <span className="text-slate-500">Ціль: €{metrics.monthlyTargetEur.toLocaleString()}</span>
                <span className="font-semibold text-emerald-600">
                  {Math.round((metrics.totalRevenueEur / metrics.monthlyTargetEur) * 100)}% виконання
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1.5 mt-1.5 overflow-hidden">
                <div
                  className="bg-emerald-500 h-1.5 rounded-full"
                  style={{ width: `${Math.min(100, (metrics.totalRevenueEur / metrics.monthlyTargetEur) * 100)}%` }}
                ></div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-1">
                <span>Активний пайплайн</span>
                <span className="material-symbols-outlined text-indigo-600 text-[18px]">funnel</span>
              </div>
              <div className="text-2xl font-bold text-slate-900">
                €{metrics.pipelineValueEur.toLocaleString()}
              </div>
              <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
                <span>Угод у роботі: {metrics.activeDealsCount}</span>
                <span className="text-indigo-600 font-semibold">Сер. чек: €{metrics.avgDealSizeEur.toLocaleString()}</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1.5 mt-1.5 overflow-hidden">
                <div className="bg-indigo-500 h-1.5 rounded-full" style={{ width: '74%' }}></div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-1">
                <span>Конверсія Win Rate</span>
                <span className="material-symbols-outlined text-emerald-600 text-[18px]">trending_up</span>
              </div>
              <div className="text-2xl font-bold text-slate-900">
                {metrics.winRatePct}%
              </div>
              <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
                <span>Цільовий норматив: 35%</span>
                <span className="text-emerald-600 font-semibold">+9.5% до нормативу</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1.5 mt-1.5 overflow-hidden">
                <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${metrics.winRatePct}%` }}></div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-1">
                <span>SDR активність тижня</span>
                <span className="material-symbols-outlined text-amber-600 text-[18px]">call</span>
              </div>
              <div className="text-2xl font-bold text-slate-900">
                {activities.length * 7} дій
              </div>
              <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
                <span>Призначено демо: 9</span>
                <span className="text-amber-600 font-semibold">SQL темп: 100%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1.5 mt-1.5 overflow-hidden">
                <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: '85%' }}></div>
              </div>
            </div>
          </div>
        )}

        {/* Section: Interactive Sales Deals Kanban Pipeline */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
                <span className="material-symbols-outlined text-blue-600 text-[18px]">view_column</span>
                B2B Пайплайн угод (Воронка продажів)
              </h2>
              <p className="text-xs text-slate-500">
                Перетягуйте або використовуйте кнопки зміни етапу для фіксації в реляційній базі даних
              </p>
            </div>
            <div className="text-xs text-slate-400 font-mono">
              Всього угод: {deals.length}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3 overflow-x-auto pb-2">
            {STAGES.map((stage) => {
              const stageDeals = deals.filter((d) => d.stage === stage.id);
              const stageSum = stageDeals.reduce((acc, d) => acc + d.valueEur, 0);

              return (
                <div
                  key={stage.id}
                  className={`rounded-lg border p-2.5 flex flex-col min-w-[200px] ${stage.color}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-800">{stage.label}</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 bg-white rounded-full text-slate-600 shadow-2xs">
                      {stageDeals.length}
                    </span>
                  </div>
                  <div className="text-[11px] font-semibold text-slate-600 mb-2">
                    €{stageSum.toLocaleString()}
                  </div>

                  <div className="space-y-2 flex-1">
                    {stageDeals.map((deal) => (
                      <div
                        key={deal.id}
                        className="bg-white p-2.5 rounded-md border border-slate-200 shadow-2xs hover:shadow-xs transition-shadow text-xs"
                      >
                        <div className="flex items-start justify-between gap-1 mb-1">
                          <span className="font-semibold text-slate-900 leading-snug line-clamp-1">
                            {deal.clientCompany}
                          </span>
                          <span className="text-[9px] font-bold px-1 py-0.5 bg-slate-100 text-slate-600 rounded">
                            {deal.segment}
                          </span>
                        </div>

                        <div className="text-[11px] text-slate-600 mb-2 line-clamp-2">
                          {deal.dealTitle}
                        </div>

                        <div className="flex items-center justify-between text-xs font-bold text-blue-700 mb-2">
                          <span>€{deal.valueEur.toLocaleString()}</span>
                          <span className="text-[10px] font-normal text-slate-400">
                            {deal.expectedCloseDate}
                          </span>
                        </div>

                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
                          <span className="truncate">{deal.assignedRepName.split(' ')[0]}</span>

                          <div className="flex items-center gap-1">
                            {stage.id !== 'lead' && (
                              <button
                                title="Попередній етап"
                                onClick={() => {
                                  const idx = STAGES.findIndex((s) => s.id === stage.id);
                                  if (idx > 0) handleStageChange(deal.id, STAGES[idx - 1].id);
                                }}
                                className="p-0.5 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-700"
                              >
                                <span className="material-symbols-outlined text-[14px]">arrow_back</span>
                              </button>
                            )}
                            {stage.id !== 'won' && (
                              <button
                                title="Наступний етап"
                                onClick={() => {
                                  const idx = STAGES.findIndex((s) => s.id === stage.id);
                                  if (idx < STAGES.length - 1) handleStageChange(deal.id, STAGES[idx + 1].id);
                                }}
                                className="p-0.5 hover:bg-blue-50 rounded text-blue-600"
                              >
                                <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                              </button>
                            )}
                            <button
                              title="Видалити"
                              onClick={() => handleDeleteDeal(deal.id)}
                              className="p-0.5 hover:bg-red-50 rounded text-slate-300 hover:text-red-500"
                            >
                              <span className="material-symbols-outlined text-[14px]">delete</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}

                    {stageDeals.length === 0 && (
                      <div className="text-center py-6 text-slate-400 text-xs italic">
                        Немає угод
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section: Sales Reps KPI & Bonus Tracker */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-xs p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
                  <span className="material-symbols-outlined text-blue-600 text-[18px]">group</span>
                  Команда продажів & Розрахунок KPI бонусів (Cap 150%)
                </h2>
                <p className="text-xs text-slate-500">
                  Зв’язок із бухгалтерським модулем `kpi_offer` та автоматичним нарахуванням
                </p>
              </div>
              <button
                onClick={() => onNavigate('kpi_offer')}
                className="text-xs text-blue-600 hover:underline font-medium"
              >
                Деталі в оферах →
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-semibold bg-slate-50/70">
                    <th className="py-2.5 px-3">Співробітник / Роль</th>
                    <th className="py-2.5 px-3">План місяця</th>
                    <th className="py-2.5 px-3">Факт (Won)</th>
                    <th className="py-2.5 px-3">Win Rate</th>
                    <th className="py-2.5 px-3">Базова ставка</th>
                    <th className="py-2.5 px-3">KPI Бонус</th>
                    <th className="py-2.5 px-3 text-right">Статус</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {reps.map((rep) => (
                    <tr key={rep.id} className="hover:bg-slate-50/60">
                      <td className="py-3 px-3">
                        <div className="font-semibold text-slate-900">{rep.repName}</div>
                        <div className="text-[11px] text-slate-400">{rep.role}</div>
                      </td>
                      <td className="py-3 px-3 font-mono font-medium">
                        €{rep.monthlyTargetEur.toLocaleString()}
                      </td>
                      <td className="py-3 px-3 font-mono font-bold text-emerald-600">
                        €{rep.actualClosedEur.toLocaleString()}
                      </td>
                      <td className="py-3 px-3 font-mono">
                        {rep.winRatePct}%
                      </td>
                      <td className="py-3 px-3 font-mono text-slate-600">
                        €{rep.baseSalaryEur.toLocaleString()}
                      </td>
                      <td className="py-3 px-3 font-mono">
                        <span className="font-semibold text-indigo-700">€{rep.calculatedBonusEur}</span>
                        <span className="text-[10px] text-slate-400 block">Cap: €{rep.capBonusLimitEur}</span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-100 text-emerald-800 rounded">
                          Перевиконано
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* SDR Activity Log Stream */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
                <span className="material-symbols-outlined text-amber-600 text-[18px]">history</span>
                Останні активності SDR
              </h2>
              <span className="text-xs text-slate-400 font-mono">Регламент</span>
            </div>

            <div className="space-y-3 flex-1 overflow-y-auto max-h-[320px] pr-1">
              {activities.map((act) => (
                <div key={act.id} className="p-2.5 rounded-lg border border-slate-100 bg-slate-50/70 text-xs">
                  <div className="flex items-center justify-between text-slate-500 mb-1">
                    <span className="font-semibold text-slate-800">{act.repName}</span>
                    <span className="text-[10px] font-mono text-slate-400">{act.date}</span>
                  </div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="px-1.5 py-0.2 bg-blue-100 text-blue-800 text-[10px] font-semibold rounded uppercase">
                      {act.activityType}
                    </span>
                    <span className="text-[11px] font-medium text-slate-700 truncate">
                      {act.dealTitle || 'Загальна комунікація'}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-600">{act.summary}</div>
                  {act.outcome && (
                    <div className="mt-1 text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                      Результат: {act.outcome}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal: Add Deal */}
      {showAddDealModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full border border-slate-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <span className="material-symbols-outlined text-blue-600">add_circle</span>
                Створити нову B2B угоду (Sales)
              </h3>
              <button
                onClick={() => setShowAddDealModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateDealSubmit} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-medium mb-1">Компанія клієнта *</label>
                <input
                  type="text"
                  required
                  placeholder="напр. Nordic Cloud Solutions Sp. z o.o."
                  value={newDeal.clientCompany}
                  onChange={(e) => setNewDeal({ ...newDeal, clientCompany: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Контактна особа</label>
                  <input
                    type="text"
                    placeholder="Ім'я та прізвище"
                    value={newDeal.contactPerson}
                    onChange={(e) => setNewDeal({ ...newDeal, contactPerson: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Email</label>
                  <input
                    type="email"
                    placeholder="client@company.eu"
                    value={newDeal.email}
                    onChange={(e) => setNewDeal({ ...newDeal, email: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Назва проекту / Завдання *</label>
                <input
                  type="text"
                  required
                  placeholder="напр. Локалізація ERP системи на ринки Скандинавії"
                  value={newDeal.dealTitle}
                  onChange={(e) => setNewDeal({ ...newDeal, dealTitle: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Бюджет (€) *</label>
                  <input
                    type="number"
                    required
                    min="100"
                    value={newDeal.valueEur}
                    onChange={(e) => setNewDeal({ ...newDeal, valueEur: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Сегмент</label>
                  <select
                    value={newDeal.segment}
                    onChange={(e) => setNewDeal({ ...newDeal, segment: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
                  >
                    <option value="Enterprise">Enterprise</option>
                    <option value="SMB">SMB</option>
                    <option value="Key Account">Key Account</option>
                    <option value="Tech & GameDev">Tech & GameDev</option>
                    <option value="Legal & FinTech">Legal & FinTech</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Етап</label>
                  <select
                    value={newDeal.stage}
                    onChange={(e) => setNewDeal({ ...newDeal, stage: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
                  >
                    {STAGES.map((s) => (
                      <option key={s.id} value={s.id}>{s.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Відповідальний менеджер</label>
                  <select
                    value={newDeal.assignedRepName}
                    onChange={(e) => setNewDeal({ ...newDeal, assignedRepName: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
                  >
                    <option value="Іван Данченко">Іван Данченко (Тімлід)</option>
                    <option value="Роман Ткач">Роман Ткач (Senior Enterprise)</option>
                    <option value="Дмитро Шевчук">Дмитро Шевчук (B2B SDR)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Очікуване закриття</label>
                  <input
                    type="date"
                    value={newDeal.expectedCloseDate}
                    onChange={(e) => setNewDeal({ ...newDeal, expectedCloseDate: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddDealModal(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-600 rounded-md hover:bg-slate-50"
                >
                  Скасувати
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700"
                >
                  Зберегти в базу даних
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add SDR Activity */}
      {showAddActivityModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full border border-slate-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <span className="material-symbols-outlined text-blue-600">edit_note</span>
                Зафіксувати SDR активність
              </h3>
              <button
                onClick={() => setShowAddActivityModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateActivitySubmit} className="p-5 space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-medium mb-1">Менеджер</label>
                <select
                  value={newActivity.repName}
                  onChange={(e) => setNewActivity({ ...newActivity, repName: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
                >
                  <option value="Іван Данченко">Іван Данченко</option>
                  <option value="Роман Ткач">Роман Ткач</option>
                  <option value="Дмитро Шевчук">Дмитро Шевчук</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Тип контакту</label>
                  <select
                    value={newActivity.activityType}
                    onChange={(e) => setNewActivity({ ...newActivity, activityType: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
                  >
                    <option value="call">Телефонний дзвінок</option>
                    <option value="demo">Онлайн-демонстрація</option>
                    <option value="email">Email-листування</option>
                    <option value="proposal_sent">Відправка КП</option>
                    <option value="contract_sent">Договір на підпис</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Тривалість (хв)</label>
                  <input
                    type="number"
                    value={newActivity.durationMin}
                    onChange={(e) => setNewActivity({ ...newActivity, durationMin: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Проект або компанія</label>
                <input
                  type="text"
                  placeholder="напр. MedTech Diagnostics GmbH"
                  value={newActivity.dealTitle}
                  onChange={(e) => setNewActivity({ ...newActivity, dealTitle: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Зміст розмови / Коментар *</label>
                <textarea
                  required
                  rows={2}
                  placeholder="Короткий зміст бесіди, інтереси клієнта, наступні кроки..."
                  value={newActivity.summary}
                  onChange={(e) => setNewActivity({ ...newActivity, summary: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Отриманий результат</label>
                <input
                  type="text"
                  placeholder="напр. Призначено повторний дзвінок з CTO на 24.10"
                  value={newActivity.outcome}
                  onChange={(e) => setNewActivity({ ...newActivity, outcome: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddActivityModal(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-600 rounded-md hover:bg-slate-50"
                >
                  Скасувати
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700"
                >
                  Записати в лог
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Schema and API Architecture */}
      {showSchemaModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full border border-slate-200 overflow-hidden max-h-[85vh] flex flex-col">
            <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-blue-600">terminal</span>
                <h3 className="font-bold text-slate-900 text-sm">
                  Реляційна схема БД (PostgreSQL) та REST API специфікація
                </h3>
              </div>
              <button
                onClick={() => setShowSchemaModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-4 text-xs font-mono">
              <div className="bg-slate-900 text-slate-100 p-3.5 rounded-lg">
                <div className="text-emerald-400 font-bold mb-1">// RESTful API Endpoints:</div>
                <div className="space-y-1 text-slate-300 text-[11px]">
                  <div>GET    /api/sales/deals           - Отримати перелік усіх угод</div>
                  <div>POST   /api/sales/deals           - Створити нову угоду</div>
                  <div>PATCH  /api/sales/deals/:id/stage - Змінити етап воронки</div>
                  <div>DELETE /api/sales/deals/:id       - Видалити угоду</div>
                  <div>GET    /api/sales/metrics         - Агреговані KPI виручки, win-rate</div>
                  <div>GET    /api/sales/reps            - Показники сейлзів та розрахунок бонусів</div>
                  <div>GET    /api/sales/activities      - Журнал SDR активностей</div>
                  <div>POST   /api/sales/activities      - Зафіксувати активність</div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5 font-sans">
                  <span className="font-bold text-slate-800">DDL Специфікація таблиць (/src/db/schema.sql):</span>
                  <button
                    onClick={() => {
                      navigator.clipboard?.writeText(schemaSql);
                      alert('SQL DDL скопійовано в буфер обміну!');
                    }}
                    className="px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded border border-slate-300 text-slate-700 text-[11px]"
                  >
                    Скопіювати SQL
                  </button>
                </div>
                <pre className="bg-slate-100 p-3 rounded-lg border border-slate-200 overflow-x-auto text-[11px] text-slate-800 max-h-72">
                  {schemaSql}
                </pre>
              </div>
            </div>

            <div className="px-5 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
              <span className="text-[11px] text-slate-500 font-sans">
                Готово для міграції в Cloud SQL / Supabase / PostgreSQL
              </span>
              <button
                onClick={() => setShowSchemaModal(false)}
                className="px-4 py-1.5 bg-slate-800 text-white rounded-md hover:bg-slate-900 text-xs font-semibold"
              >
                Закрити
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
