import React, { useState, useEffect } from 'react';
import { ScreenId } from '../../types';
import { apiClient } from '../../services/api';
import { VacancyItem, CandidateItem, OnboardingItem, HrMetrics } from '../../db/repository';

interface Props {
  onNavigate: (screenId: ScreenId) => void;
}

const CANDIDATE_STAGES: { id: CandidateItem['currentStage']; label: string; color: string }[] = [
  { id: 'applied', label: 'Подано заявку', color: 'border-slate-300 bg-slate-50' },
  { id: 'screening', label: 'Скринінг HR', color: 'border-blue-300 bg-blue-50/50' },
  { id: 'test_task', label: 'Тестове / LQA', color: 'border-amber-300 bg-amber-50/50' },
  { id: 'tech_interview', label: 'Інтерв’ю з лідом', color: 'border-indigo-300 bg-indigo-50/50' },
  { id: 'offer_sent', label: 'Офер з KPI', color: 'border-purple-300 bg-purple-50/60' },
  { id: 'offer_accepted', label: 'Прийнято (Hired)', color: 'border-emerald-300 bg-emerald-50/70' },
];

export const HrDepartmentScreen: React.FC<Props> = ({ onNavigate }) => {
  const [vacancies, setVacancies] = useState<VacancyItem[]>([]);
  const [candidates, setCandidates] = useState<CandidateItem[]>([]);
  const [onboarding, setOnboarding] = useState<OnboardingItem[]>([]);
  const [metrics, setMetrics] = useState<HrMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [showAddVacancyModal, setShowAddVacancyModal] = useState(false);
  const [showAddCandidateModal, setShowAddCandidateModal] = useState(false);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<CandidateItem | null>(null);
  const [showSchemaModal, setShowSchemaModal] = useState(false);
  const [schemaSql, setSchemaSql] = useState<string>('');

  // Form states
  const [newVacancy, setNewVacancy] = useState({
    title: '',
    departmentCode: 'HR' as VacancyItem['departmentCode'],
    targetGrade: 'Middle' as VacancyItem['targetGrade'],
    hiringManagerName: 'М. Семенюк',
    recruiterName: 'М. Семенюк',
    plannedSalaryMinEur: 1500,
    plannedSalaryMaxEur: 2000,
    priority: 'medium' as VacancyItem['priority'],
    targetCloseDate: '2024-11-25',
    description: '',
  });

  const [newCandidate, setNewCandidate] = useState({
    vacancyId: '',
    fullName: '',
    email: '',
    phone: '',
    telegram: '',
    location: 'Київ / Варшава (Гібрид)',
    expectedSalaryEur: 1800,
    notes: '',
  });

  const [offerForm, setOfferForm] = useState({
    baseSalaryEur: 1800,
    kpiBonusEur: 500,
    kpiRule: 'Виконання індивідуального плану від 100%, обмеження Cap 150%',
  });

  const loadData = async () => {
    try {
      const [vacData, candData, onbData, metData] = await Promise.all([
        apiClient.getVacancies(),
        apiClient.getCandidates(),
        apiClient.getOnboardingList(),
        apiClient.getHrMetrics(),
      ]);
      setVacancies(vacData);
      setCandidates(candData);
      setOnboarding(onbData);
      setMetrics(metData);
    } catch (err) {
      console.error('Error loading HR data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCandidateStageChange = async (candId: string, stage: CandidateItem['currentStage']) => {
    await apiClient.updateCandidateStage(candId, stage);
    await loadData();
  };

  const handleToggleMilestone = async (
    onbId: string,
    field: 'equipmentIssued' | 'corporateEmailCreated' | 'accessGranted'
  ) => {
    const item = onboarding.find((o) => o.id === onbId);
    if (!item) return;
    const updated = !item[field];
    await apiClient.updateOnboardingMilestone(onbId, { [field]: updated });
    await loadData();
  };

  const handleCreateVacancySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await apiClient.createVacancy({
      title: newVacancy.title,
      departmentCode: newVacancy.departmentCode,
      targetGrade: newVacancy.targetGrade,
      hiringManagerName: newVacancy.hiringManagerName,
      recruiterName: newVacancy.recruiterName,
      plannedSalaryMinEur: Number(newVacancy.plannedSalaryMinEur),
      plannedSalaryMaxEur: Number(newVacancy.plannedSalaryMaxEur),
      priority: newVacancy.priority,
      status: 'open',
      targetCloseDate: newVacancy.targetCloseDate,
      description: newVacancy.description,
    });
    setShowAddVacancyModal(false);
    setNewVacancy({
      title: '',
      departmentCode: 'HR',
      targetGrade: 'Middle',
      hiringManagerName: 'М. Семенюк',
      recruiterName: 'М. Семенюк',
      plannedSalaryMinEur: 1500,
      plannedSalaryMaxEur: 2000,
      priority: 'medium',
      targetCloseDate: '2024-11-25',
      description: '',
    });
    await loadData();
  };

  const handleCreateCandidateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const vac = vacancies.find((v) => v.id === newCandidate.vacancyId) || vacancies[0];
    await apiClient.createCandidate({
      vacancyId: vac ? vac.id : 'vac-general',
      vacancyTitle: vac ? vac.title : 'Загальна заявка',
      departmentCode: vac ? vac.departmentCode : 'HR',
      fullName: newCandidate.fullName,
      email: newCandidate.email,
      phone: newCandidate.phone,
      telegram: newCandidate.telegram,
      location: newCandidate.location,
      currentStage: 'applied',
      ratingStars: 4,
      expectedSalaryEur: Number(newCandidate.expectedSalaryEur),
      notes: newCandidate.notes,
    });
    setShowAddCandidateModal(false);
    setNewCandidate({
      vacancyId: '',
      fullName: '',
      email: '',
      phone: '',
      telegram: '',
      location: 'Київ / Варшава (Гібрид)',
      expectedSalaryEur: 1800,
      notes: '',
    });
    await loadData();
  };

  const handleIssueOfferSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCandidate) return;
    const formulaText = `Базова ставка €${offerForm.baseSalaryEur} + KPI бонус €${offerForm.kpiBonusEur} (${offerForm.kpiRule})`;
    await apiClient.issueKpiOffer(
      selectedCandidate.id,
      Number(offerForm.baseSalaryEur),
      Number(offerForm.kpiBonusEur),
      formulaText
    );
    setShowOfferModal(false);
    setSelectedCandidate(null);
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
              <span className="px-2 py-0.5 text-[11px] font-bold bg-purple-100 text-purple-800 rounded">
                HR · Таланти та Адаптація
              </span>
              <span className="px-2 py-0.5 text-[11px] font-bold bg-emerald-100 text-emerald-800 rounded flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                98.0% Виконано
              </span>
              <span className="text-xs text-slate-400">| Q4 2024</span>
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <span className="material-symbols-outlined text-purple-600">badge</span>
              Операційний контур відділу HR та найму
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Тімлід: <strong>Марина Семенюк</strong> · 4 фахівці (Recruitment, People Partner, L&D) · Київ / Варшава
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
              onClick={() => setShowAddCandidateModal(true)}
              className="px-3 py-1.5 text-xs font-medium text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors flex items-center gap-1.5 border border-purple-200 shadow-2xs"
            >
              <span className="material-symbols-outlined text-[16px]">person_add</span>
              + Додати кандидата
            </button>
            <button
              onClick={() => setShowAddVacancyModal(true)}
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm shadow-purple-600/30"
            >
              <span className="material-symbols-outlined text-[16px]">post_add</span>
              + Нова вакансія
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
                <span>Укомплектованість штату</span>
                <span className="material-symbols-outlined text-purple-600 text-[18px]">group_add</span>
              </div>
              <div className="text-2xl font-bold text-slate-900">
                {metrics.filledPositions} / {metrics.totalPositions}
              </div>
              <div className="mt-2 flex items-center justify-between text-xs">
                <span className="text-slate-500">Відкритих позицій: {metrics.openVacanciesCount}</span>
                <span className="font-semibold text-emerald-600">{metrics.staffingRatePct}% факт</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1.5 mt-1.5 overflow-hidden">
                <div
                  className="bg-emerald-500 h-1.5 rounded-full"
                  style={{ width: `${metrics.staffingRatePct}%` }}
                ></div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-1">
                <span>Time-to-Hire (Швидкість найму)</span>
                <span className="material-symbols-outlined text-blue-600 text-[18px]">schedule</span>
              </div>
              <div className="text-2xl font-bold text-slate-900">
                {metrics.timeToHireDays} дн.
              </div>
              <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
                <span>Ціль: ≤ {metrics.targetTimeToHireDays} дн.</span>
                <span className="text-emerald-600 font-semibold">-3.6 дн. швидше плану</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1.5 mt-1.5 overflow-hidden">
                <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: '82%' }}></div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-1">
                <span>Проходження випробувального</span>
                <span className="material-symbols-outlined text-emerald-600 text-[18px]">verified_user</span>
              </div>
              <div className="text-2xl font-bold text-slate-900">
                {metrics.probationPassRatePct}%
              </div>
              <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
                <span>Цільовий норматив: 90%</span>
                <span className="text-emerald-600 font-semibold">Норматив виконано</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1.5 mt-1.5 overflow-hidden">
                <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${metrics.probationPassRatePct}%` }}></div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-1">
                <span>eNPS Залученість команди</span>
                <span className="material-symbols-outlined text-amber-600 text-[18px]">sentiment_very_satisfied</span>
              </div>
              <div className="text-2xl font-bold text-slate-900">
                +{metrics.enpsScore}
              </div>
              <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
                <span>Плинність кадрів: {metrics.turnoverRatePct}%</span>
                <span className="text-amber-600 font-semibold">Висока лояльність</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1.5 mt-1.5 overflow-hidden">
                <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: '88%' }}></div>
              </div>
            </div>
          </div>
        )}

        {/* Section: Open Vacancies (Requisitions) */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
                <span className="material-symbols-outlined text-purple-600 text-[18px]">work</span>
                Реєстр відкритих вакансій (Requisitions)
              </h2>
              <p className="text-xs text-slate-500">
                Затверджені штатні розписи підрозділів з бюджетними рамками та відповідальними
              </p>
            </div>
            <span className="text-xs font-mono text-slate-400">Активних: {vacancies.length}</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-semibold bg-slate-50/70">
                  <th className="py-2.5 px-3">Код / Посада</th>
                  <th className="py-2.5 px-3">Відділ & Грейд</th>
                  <th className="py-2.5 px-3">Hiring Manager / Рекрутер</th>
                  <th className="py-2.5 px-3">Бюджетна вилка</th>
                  <th className="py-2.5 px-3">Воронка (Заявки/Інтерв'ю)</th>
                  <th className="py-2.5 px-3">Дедлайн</th>
                  <th className="py-2.5 px-3 text-right">Статус</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {vacancies.map((vac) => (
                  <tr key={vac.id} className="hover:bg-slate-50/60">
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-900">{vac.title}</div>
                      <div className="text-[10px] font-mono text-slate-400">{vac.requisitionCode}</div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-1.5 py-0.5 bg-slate-100 text-slate-700 font-bold rounded text-[10px]">
                        {vac.departmentCode}
                      </span>
                      <span className="ml-1.5 text-slate-600">{vac.targetGrade}</span>
                    </td>
                    <td className="py-3 px-3">
                      <div className="text-slate-800 font-medium">{vac.hiringManagerName}</div>
                      <div className="text-[11px] text-slate-400">{vac.recruiterName}</div>
                    </td>
                    <td className="py-3 px-3 font-mono font-semibold text-slate-800">
                      €{vac.plannedSalaryMinEur} – €{vac.plannedSalaryMaxEur}
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-bold text-purple-700">{vac.applicantsCount}</span> кандидатів ·{' '}
                      <span className="font-bold text-blue-600">{vac.interviewedCount}</span> інтерв'ю
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-500">
                      {vac.targetCloseDate}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <span
                        className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                          vac.status === 'offer_stage'
                            ? 'bg-purple-100 text-purple-800'
                            : vac.status === 'interviewing'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {vac.status === 'offer_stage'
                          ? 'Етап оферу'
                          : vac.status === 'interviewing'
                          ? 'Інтерв’ю'
                          : 'Відкрито'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section: Candidate Pipeline Kanban & Offer Builder */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
                <span className="material-symbols-outlined text-purple-600 text-[18px]">how_to_reg</span>
                Воронка кандидатів та формування KPI-оферів
              </h2>
              <p className="text-xs text-slate-500">
                Переміщуйте кандидатів між етапами або генеруйте офер згідно регламенту формули Cap 150%
              </p>
            </div>
            <div className="text-xs text-slate-400 font-mono">
              Кандидатів у роботі: {candidates.length}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3 overflow-x-auto pb-2">
            {CANDIDATE_STAGES.map((stage) => {
              const stageCandidates = candidates.filter((c) => c.currentStage === stage.id);

              return (
                <div
                  key={stage.id}
                  className={`rounded-lg border p-2.5 flex flex-col min-w-[200px] ${stage.color}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-800">{stage.label}</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 bg-white rounded-full text-slate-600 shadow-2xs">
                      {stageCandidates.length}
                    </span>
                  </div>

                  <div className="space-y-2 flex-1">
                    {stageCandidates.map((cand) => (
                      <div
                        key={cand.id}
                        className="bg-white p-2.5 rounded-md border border-slate-200 shadow-2xs hover:shadow-xs transition-shadow text-xs"
                      >
                        <div className="font-semibold text-slate-900 mb-0.5">{cand.fullName}</div>
                        <div className="text-[10px] text-purple-700 font-medium mb-1 truncate">
                          {cand.vacancyTitle}
                        </div>

                        <div className="flex items-center justify-between text-[11px] text-slate-600 mb-2">
                          <span className="font-mono">Очікує: €{cand.expectedSalaryEur}</span>
                          <span className="text-amber-500 font-bold">★ {cand.ratingStars}.0</span>
                        </div>

                        {cand.offerBaseSalaryEur && (
                          <div className="bg-purple-50 p-1.5 rounded border border-purple-200 text-[10px] text-purple-900 mb-2">
                            <span className="font-bold">Офер: €{cand.offerBaseSalaryEur} + €{cand.offerKpiBonusEur} бонус</span>
                            <div className="text-[9px] text-slate-500 truncate mt-0.5">{cand.offerKpiFormula}</div>
                          </div>
                        )}

                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]">
                          <button
                            onClick={() => {
                              setSelectedCandidate(cand);
                              setOfferForm({
                                baseSalaryEur: cand.expectedSalaryEur,
                                kpiBonusEur: 500,
                                kpiRule: '10% від маржі B2B контрактів при виконанні плану, Cap 150%',
                              });
                              setShowOfferModal(true);
                            }}
                            className="text-purple-700 hover:text-purple-900 font-semibold"
                          >
                            + KPI Офер
                          </button>

                          <div className="flex items-center gap-1">
                            {stage.id !== 'applied' && (
                              <button
                                title="Попередній етап"
                                onClick={() => {
                                  const idx = CANDIDATE_STAGES.findIndex((s) => s.id === stage.id);
                                  if (idx > 0) handleCandidateStageChange(cand.id, CANDIDATE_STAGES[idx - 1].id);
                                }}
                                className="p-0.5 hover:bg-slate-100 rounded text-slate-400"
                              >
                                <span className="material-symbols-outlined text-[14px]">arrow_back</span>
                              </button>
                            )}
                            {stage.id !== 'offer_accepted' && (
                              <button
                                title="Наступний етап"
                                onClick={() => {
                                  const idx = CANDIDATE_STAGES.findIndex((s) => s.id === stage.id);
                                  if (idx < CANDIDATE_STAGES.length - 1)
                                    handleCandidateStageChange(cand.id, CANDIDATE_STAGES[idx + 1].id);
                                }}
                                className="p-0.5 hover:bg-purple-50 rounded text-purple-600"
                              >
                                <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}

                    {stageCandidates.length === 0 && (
                      <div className="text-center py-6 text-slate-400 text-xs italic">
                        Немає кандидатів
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section: Onboarding & Probation Lifecycle */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
                <span className="material-symbols-outlined text-purple-600 text-[18px]">assignment_turned_in</span>
                Адаптація та чекліст випробувального терміну (Onboarding Lifecycle)
              </h2>
              <p className="text-xs text-slate-500">
                Інтерактивні відмітки IT-доступу, техніки та чекпоінтів Day 30, Day 60, Day 90
              </p>
            </div>
            <span className="text-xs font-mono text-slate-400">На випробувальному: {onboarding.length}</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-semibold bg-slate-50/70">
                  <th className="py-2.5 px-3">Співробітник / Ментор</th>
                  <th className="py-2.5 px-3">Відділ & Посада</th>
                  <th className="py-2.5 px-3">Термін випробувального</th>
                  <th className="py-2.5 px-3">Техніка & Пошта & Доступи</th>
                  <th className="py-2.5 px-3">1-on-1s</th>
                  <th className="py-2.5 px-3">Зрізи (30 / 60 / 90)</th>
                  <th className="py-2.5 px-3 text-right">Статус</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {onboarding.map((onb) => (
                  <tr key={onb.id} className="hover:bg-slate-50/60">
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-900">{onb.fullName}</div>
                      <div className="text-[11px] text-slate-400">Ментор: {onb.mentorName}</div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-1.5 py-0.5 bg-slate-100 text-slate-700 font-bold rounded text-[10px]">
                        {onb.departmentCode}
                      </span>
                      <span className="ml-1.5 text-slate-700 font-medium">{onb.role}</span>
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-600">
                      {onb.startDate} → {onb.probationEndDate}
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <label className="flex items-center gap-1 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={onb.equipmentIssued}
                            onChange={() => handleToggleMilestone(onb.id, 'equipmentIssued')}
                            className="rounded text-purple-600 focus:ring-purple-500"
                          />
                          <span className="text-[11px] text-slate-600">Техніка</span>
                        </label>
                        <label className="flex items-center gap-1 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={onb.corporateEmailCreated}
                            onChange={() => handleToggleMilestone(onb.id, 'corporateEmailCreated')}
                            className="rounded text-purple-600 focus:ring-purple-500"
                          />
                          <span className="text-[11px] text-slate-600">Пошта</span>
                        </label>
                        <label className="flex items-center gap-1 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={onb.accessGranted}
                            onChange={() => handleToggleMilestone(onb.id, 'accessGranted')}
                            className="rounded text-purple-600 focus:ring-purple-500"
                          />
                          <span className="text-[11px] text-slate-600">ERP/VPN</span>
                        </label>
                      </div>
                    </td>
                    <td className="py-3 px-3 font-mono font-semibold text-purple-700">
                      {onb.oneOnOneCount} сесій
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1 text-[10px]">
                        <span
                          className={`px-1.5 py-0.5 rounded font-bold ${
                            onb.day30ReviewStatus === 'completed'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          D30: {onb.day30ReviewStatus === 'completed' ? '✓' : '—'}
                        </span>
                        <span
                          className={`px-1.5 py-0.5 rounded font-bold ${
                            onb.day60ReviewStatus === 'completed'
                              ? 'bg-emerald-100 text-emerald-800'
                              : onb.day60ReviewStatus === 'scheduled'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          D60: {onb.day60ReviewStatus === 'completed' ? '✓' : 'План'}
                        </span>
                        <span className="px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded font-bold">
                          D90: —
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <span className="px-2 py-0.5 text-[10px] font-bold bg-blue-100 text-blue-800 rounded">
                        В процесі
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal: Add Vacancy */}
      {showAddVacancyModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full border border-slate-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <span className="material-symbols-outlined text-purple-600">post_add</span>
                Відкрити нову штатну вакансію
              </h3>
              <button
                onClick={() => setShowAddVacancyModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateVacancySubmit} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-medium mb-1">Назва посади *</label>
                <input
                  type="text"
                  required
                  placeholder="напр. Senior Localization Engineer"
                  value={newVacancy.title}
                  onChange={(e) => setNewVacancy({ ...newVacancy, title: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-purple-500 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Підрозділ *</label>
                  <select
                    value={newVacancy.departmentCode}
                    onChange={(e) => setNewVacancy({ ...newVacancy, departmentCode: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-purple-500 focus:outline-hidden"
                  >
                    <option value="SLS">SLS · Корпоративні продажі</option>
                    <option value="HR">HR · Таланти та персонал</option>
                    <option value="LOC">LOC · Локалізація</option>
                    <option value="TECH">TECH · Інженерія</option>
                    <option value="OPS">OPS · Операції</option>
                    <option value="FIN">FIN · Бухгалтерія</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Цільовий грейд</label>
                  <select
                    value={newVacancy.targetGrade}
                    onChange={(e) => setNewVacancy({ ...newVacancy, targetGrade: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-purple-500 focus:outline-hidden"
                  >
                    <option value="Junior">Junior</option>
                    <option value="Middle">Middle</option>
                    <option value="Senior">Senior</option>
                    <option value="Lead">Lead / Тімлід</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Бюджет від (€)</label>
                  <input
                    type="number"
                    value={newVacancy.plannedSalaryMinEur}
                    onChange={(e) => setNewVacancy({ ...newVacancy, plannedSalaryMinEur: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-purple-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Бюджет до (€)</label>
                  <input
                    type="number"
                    value={newVacancy.plannedSalaryMaxEur}
                    onChange={(e) => setNewVacancy({ ...newVacancy, plannedSalaryMaxEur: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-purple-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Опис вимог та обов'язків</label>
                <textarea
                  rows={2}
                  placeholder="Ключові вимоги, технології, мовні комбінації..."
                  value={newVacancy.description}
                  onChange={(e) => setNewVacancy({ ...newVacancy, description: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-purple-500 focus:outline-hidden"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddVacancyModal(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-600 rounded-md hover:bg-slate-50"
                >
                  Скасувати
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 text-white font-semibold rounded-md hover:bg-purple-700"
                >
                  Опублікувати вакансію
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Candidate */}
      {showAddCandidateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full border border-slate-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <span className="material-symbols-outlined text-purple-600">person_add</span>
                Внести нового кандидата в базу
              </h3>
              <button
                onClick={() => setShowAddCandidateModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCandidateSubmit} className="p-5 space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-medium mb-1">Повне ім'я кандидата *</label>
                <input
                  type="text"
                  required
                  placeholder="Ім'я та прізвище"
                  value={newCandidate.fullName}
                  onChange={(e) => setNewCandidate({ ...newCandidate, fullName: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-purple-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Цільова вакансія *</label>
                <select
                  value={newCandidate.vacancyId}
                  onChange={(e) => setNewCandidate({ ...newCandidate, vacancyId: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-purple-500 focus:outline-hidden"
                >
                  <option value="">Оберіть вакансію зі списку</option>
                  {vacancies.map((v) => (
                    <option key={v.id} value={v.id}>
                      [{v.departmentCode}] {v.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="candidate@email.com"
                    value={newCandidate.email}
                    onChange={(e) => setNewCandidate({ ...newCandidate, email: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-purple-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Telegram / Телефон</label>
                  <input
                    type="text"
                    placeholder="@telegram_handle"
                    value={newCandidate.telegram}
                    onChange={(e) => setNewCandidate({ ...newCandidate, telegram: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-purple-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Очікувана ставка (€)</label>
                  <input
                    type="number"
                    value={newCandidate.expectedSalaryEur}
                    onChange={(e) => setNewCandidate({ ...newCandidate, expectedSalaryEur: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-purple-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Локація</label>
                  <input
                    type="text"
                    value={newCandidate.location}
                    onChange={(e) => setNewCandidate({ ...newCandidate, location: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-purple-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Коментар рекрутера</label>
                <textarea
                  rows={2}
                  placeholder="Досвід, володіння софтом (CAT/CRM), результати первинного контакту..."
                  value={newCandidate.notes}
                  onChange={(e) => setNewCandidate({ ...newCandidate, notes: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-purple-500 focus:outline-hidden"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddCandidateModal(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-600 rounded-md hover:bg-slate-50"
                >
                  Скасувати
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 text-white font-semibold rounded-md hover:bg-purple-700"
                >
                  Зберегти кандидата
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Issue KPI Offer */}
      {showOfferModal && selectedCandidate && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full border border-slate-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-purple-50/50">
              <div>
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <span className="material-symbols-outlined text-purple-600">receipt_long</span>
                  Генератор офіційного оферу з KPI-формулою
                </h3>
                <p className="text-[11px] text-slate-500">
                  Кандидат: <strong>{selectedCandidate.fullName}</strong> ({selectedCandidate.vacancyTitle})
                </p>
              </div>
              <button
                onClick={() => setShowOfferModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleIssueOfferSubmit} className="p-5 space-y-4 text-xs">
              <div className="bg-amber-50 p-3 rounded-lg border border-amber-200 text-[11px] text-amber-900">
                <span className="font-bold">Регламент оферів MK Group:</span> Базова ставка фіксується в обраній юрособі. Бонусна частина підпорядкована правилу Cap limit 150% (максимальний бонус не перевищує 1.5x від базового плану).
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Базова ставка (€/міс) *</label>
                  <input
                    type="number"
                    required
                    value={offerForm.baseSalaryEur}
                    onChange={(e) => setOfferForm({ ...offerForm, baseSalaryEur: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-purple-500 focus:outline-hidden font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Плановий KPI бонус (€) *</label>
                  <input
                    type="number"
                    required
                    value={offerForm.kpiBonusEur}
                    onChange={(e) => setOfferForm({ ...offerForm, kpiBonusEur: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-purple-500 focus:outline-hidden font-bold text-purple-700"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    Cap limit (150%): €{Math.round(offerForm.kpiBonusEur * 1.5)}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Формула та умови нарахування</label>
                <input
                  type="text"
                  value={offerForm.kpiRule}
                  onChange={(e) => setOfferForm({ ...offerForm, kpiRule: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-purple-500 focus:outline-hidden"
                />
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="font-semibold text-slate-700 text-[11px] block mb-1">Підсумковий вигляд пункту оферу:</span>
                <p className="font-mono text-slate-800 text-[11px]">
                  "Затверджено оклад €{offerForm.baseSalaryEur} netto + щомісячний KPI бонус до €{offerForm.kpiBonusEur} за формулою ({offerForm.kpiRule}). З обмеженням Cap 150%."
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowOfferModal(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-600 rounded-md hover:bg-slate-50"
                >
                  Скасувати
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 text-white font-semibold rounded-md hover:bg-purple-700"
                >
                  Зберегти та надіслати офер
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
                <span className="material-symbols-outlined text-purple-600">terminal</span>
                <h3 className="font-bold text-slate-900 text-sm">
                  HR Реляційна схема БД (PostgreSQL) та REST API специфікація
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
                <div className="text-purple-400 font-bold mb-1">// RESTful API Endpoints (HR & Talents):</div>
                <div className="space-y-1 text-slate-300 text-[11px]">
                  <div>GET    /api/hr/vacancies            - Отримати перелік вакансій</div>
                  <div>POST   /api/hr/vacancies            - Створити нову вакансію</div>
                  <div>PATCH  /api/hr/vacancies/:id/status - Змінити статус вакансії</div>
                  <div>GET    /api/hr/candidates           - Отримати базу кандидатів</div>
                  <div>POST   /api/hr/candidates           - Додати кандидата у воронку</div>
                  <div>PATCH  /api/hr/candidates/:id/stage - Перевести на наступний етап</div>
                  <div>POST   /api/hr/candidates/:id/offer - Сформувати KPI-офер (Cap 150%)</div>
                  <div>GET    /api/hr/onboarding           - Перелік співробітників на випробувальному</div>
                  <div>PATCH  /api/hr/onboarding/:id       - Оновити чекпоінт адаптації</div>
                  <div>GET    /api/hr/metrics              - HR метрики (Time-to-hire, eNPS, Штат)</div>
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
