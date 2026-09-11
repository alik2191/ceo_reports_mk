import { Employee } from '../types';

export interface DealItem {
  id: string;
  dealCode: string;
  clientCompany: string;
  contactPerson: string;
  email: string;
  phone: string;
  dealTitle: string;
  segment: 'Enterprise' | 'SMB' | 'Key Account' | 'Tech & GameDev' | 'Legal & FinTech';
  valueEur: number;
  stage: 'lead' | 'discovery' | 'proposal' | 'negotiation' | 'contract_signing' | 'won' | 'lost';
  probabilityPct: number;
  assignedRepId: string;
  assignedRepName: string;
  source: 'Outreach SDR' | 'LinkedIn' | 'Inbound Web' | 'Referral' | 'Exhibition / Summit';
  expectedCloseDate: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SalesActivityItem {
  id: string;
  dealId?: string;
  dealTitle?: string;
  repName: string;
  activityType: 'call' | 'demo' | 'email' | 'proposal_sent' | 'contract_sent';
  date: string;
  durationMin: number;
  summary: string;
  outcome?: string;
}

export interface SalesRepItem {
  id: string;
  repName: string;
  role: string;
  monthlyTargetEur: number;
  actualClosedEur: number;
  dealsWonCount: number;
  pipelineActiveEur: number;
  winRatePct: number;
  baseSalaryEur: number;
  kpiBonusRatePct: number;
  calculatedBonusEur: number;
  capBonusLimitEur: number;
  status: 'optimal' | 'on_track' | 'lagging';
}

export interface SalesMetrics {
  totalRevenueEur: number;
  monthlyTargetEur: number;
  pipelineValueEur: number;
  activeDealsCount: number;
  winRatePct: number;
  avgDealSizeEur: number;
  closedWonEur: number;
  targetCompletionPct: number;
}

export interface VacancyItem {
  id: string;
  requisitionCode: string;
  title: string;
  departmentCode: 'SLS' | 'HR' | 'LOC' | 'MKT' | 'OPS' | 'FIN' | 'TECH';
  targetGrade: 'Junior' | 'Middle' | 'Senior' | 'Lead' | 'Executive';
  hiringManagerName: string;
  recruiterName: string;
  plannedSalaryMinEur: number;
  plannedSalaryMaxEur: number;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'draft' | 'open' | 'interviewing' | 'offer_stage' | 'filled' | 'cancelled';
  openDate: string;
  targetCloseDate: string;
  applicantsCount: number;
  interviewedCount: number;
  description: string;
}

export interface CandidateItem {
  id: string;
  candidateCode: string;
  vacancyId: string;
  vacancyTitle: string;
  departmentCode: 'SLS' | 'HR' | 'LOC' | 'MKT' | 'OPS' | 'FIN' | 'TECH';
  fullName: string;
  email: string;
  phone: string;
  telegram: string;
  location: string;
  currentStage: 'applied' | 'screening' | 'test_task' | 'tech_interview' | 'culture_fit' | 'offer_sent' | 'offer_accepted' | 'rejected';
  ratingStars: number;
  expectedSalaryEur: number;
  offerBaseSalaryEur?: number;
  offerKpiBonusEur?: number;
  offerKpiFormula?: string;
  notes?: string;
  createdAt: string;
}

export interface OnboardingItem {
  id: string;
  candidateId?: string;
  fullName: string;
  departmentCode: string;
  role: string;
  mentorName: string;
  startDate: string;
  probationEndDate: string;
  equipmentIssued: boolean;
  corporateEmailCreated: boolean;
  accessGranted: boolean;
  day30ReviewStatus: 'completed' | 'scheduled' | 'pending';
  day60ReviewStatus: 'completed' | 'scheduled' | 'pending';
  day90ReviewStatus: 'completed' | 'scheduled' | 'pending';
  oneOnOneCount: number;
  overallStatus: 'in_progress' | 'passed' | 'extended' | 'at_risk';
}

export interface HrMetrics {
  timeToHireDays: number;
  targetTimeToHireDays: number;
  costPerHireEur: number;
  probationPassRatePct: number;
  enpsScore: number;
  turnoverRatePct: number;
  staffingRatePct: number;
  totalPositions: number;
  filledPositions: number;
  openVacanciesCount: number;
}

// Initial In-Memory Database Seed
class MockDatabaseRepository {
  private deals: DealItem[] = [
    {
      id: 'deal-101',
      dealCode: 'SLS-D-2024-041',
      clientCompany: 'FinTech Dynamics Poland Sp. z o.o.',
      contactPerson: 'Marek Wisniewski',
      email: 'm.wisniewski@fintechdyn.pl',
      phone: '+48 22 890 1234',
      dealTitle: 'Локалізація банківського SaaS застосунку (PL/DE/FR)',
      segment: 'Enterprise',
      valueEur: 38500,
      stage: 'negotiation',
      probabilityPct: 80,
      assignedRepId: 'emp-2',
      assignedRepName: 'Іван Данченко',
      source: 'LinkedIn',
      expectedCloseDate: '2024-10-30',
      notes: 'Клієнт погодив тарифні ставки, фіналізація SLA щодо термінів постачання оновлень.',
      createdAt: '2024-09-15',
      updatedAt: '2024-10-18',
    },
    {
      id: 'deal-102',
      dealCode: 'SLS-D-2024-042',
      clientCompany: 'Apex GameStudios Inc.',
      contactPerson: 'Sarah Jenkins',
      email: 's.jenkins@apexstudios.com',
      phone: '+44 20 7946 0912',
      dealTitle: 'Повна локалізація RPG тайтлу (1.2 млн слів)',
      segment: 'Tech & GameDev',
      valueEur: 52000,
      stage: 'proposal',
      probabilityPct: 60,
      assignedRepId: 'emp-8',
      assignedRepName: 'Роман Ткач',
      source: 'Exhibition / Summit',
      expectedCloseDate: '2024-11-15',
      notes: 'Надіслано тест LQA та комерційну пропозицію. Очікуємо фідбек продюсера.',
      createdAt: '2024-09-22',
      updatedAt: '2024-10-16',
    },
    {
      id: 'deal-103',
      dealCode: 'SLS-D-2024-043',
      clientCompany: 'MedTech Diagnostics GmbH',
      contactPerson: 'Klaus Reinhardt',
      email: 'reinhardt@medtech-diag.de',
      phone: '+49 89 2345 6789',
      dealTitle: 'Медичний сертифікований переклад інструкцій ISO 17100',
      segment: 'Enterprise',
      valueEur: 24800,
      stage: 'discovery',
      probabilityPct: 40,
      assignedRepId: 'emp-10',
      assignedRepName: 'Дмитро Шевчук',
      source: 'Outreach SDR',
      expectedCloseDate: '2024-11-20',
      notes: 'Проведено discovery call, запросили сертифікати відповідності та приклади проектів.',
      createdAt: '2024-10-02',
      updatedAt: '2024-10-17',
    },
    {
      id: 'deal-104',
      dealCode: 'SLS-D-2024-044',
      clientCompany: 'LexCorp Legal Advisors',
      contactPerson: 'Anna Kowalska',
      email: 'a.kowalska@lexcorp.eu',
      phone: '+48 12 345 6789',
      dealTitle: 'Річний контракт на переклад M&A документації',
      segment: 'Legal & FinTech',
      valueEur: 42000,
      stage: 'contract_signing',
      probabilityPct: 95,
      assignedRepId: 'emp-2',
      assignedRepName: 'Іван Данченко',
      source: 'Referral',
      expectedCloseDate: '2024-10-25',
      notes: 'Юристи фіналізують драфт договору. Договір на підписі у CEO.',
      createdAt: '2024-08-20',
      updatedAt: '2024-10-19',
    },
    {
      id: 'deal-105',
      dealCode: 'SLS-D-2024-045',
      clientCompany: 'Baltic Logistics Hub',
      contactPerson: 'Janis Berzins',
      email: 'j.berzins@balticlog.lv',
      phone: '+371 67 123 456',
      dealTitle: 'Локалізація TMS системи керування флотом',
      segment: 'SMB',
      valueEur: 18500,
      stage: 'lead',
      probabilityPct: 20,
      assignedRepId: 'emp-10',
      assignedRepName: 'Дмитро Шевчук',
      source: 'Inbound Web',
      expectedCloseDate: '2024-11-30',
      notes: 'Вхідний лід з сайту Localica.io. Заплановано перший дзвінок на завтра.',
      createdAt: '2024-10-18',
      updatedAt: '2024-10-18',
    },
    {
      id: 'deal-106',
      dealCode: 'SLS-D-2024-039',
      clientCompany: 'Nordic Cloud Solutions AB',
      contactPerson: 'Erik Lindqvist',
      email: 'erik@nordiccloud.se',
      phone: '+46 8 123 4567',
      dealTitle: 'Локалізація B2B порталу клієнтської підтримки',
      segment: 'Enterprise',
      valueEur: 31000,
      stage: 'won',
      probabilityPct: 100,
      assignedRepId: 'emp-2',
      assignedRepName: 'Іван Данченко',
      source: 'LinkedIn',
      expectedCloseDate: '2024-10-10',
      notes: 'Угоду успішно закрито! Передано в операційний відділ (PM Савчук).',
      createdAt: '2024-08-01',
      updatedAt: '2024-10-10',
    },
  ];

  private salesReps: SalesRepItem[] = [
    {
      id: 'emp-2',
      repName: 'Іван Данченко',
      role: 'Тімлід B2B продажів (Lead Sales)',
      monthlyTargetEur: 60000,
      actualClosedEur: 73000,
      dealsWonCount: 4,
      pipelineActiveEur: 80500,
      winRatePct: 44.5,
      baseSalaryEur: 2200,
      kpiBonusRatePct: 15,
      calculatedBonusEur: 1200,
      capBonusLimitEur: 1500,
      status: 'optimal',
    },
    {
      id: 'emp-8',
      repName: 'Роман Ткач',
      role: 'Senior Enterprise Sales Exec',
      monthlyTargetEur: 45000,
      actualClosedEur: 42000,
      dealsWonCount: 2,
      pipelineActiveEur: 76800,
      winRatePct: 38.0,
      baseSalaryEur: 1800,
      kpiBonusRatePct: 12,
      calculatedBonusEur: 840,
      capBonusLimitEur: 1200,
      status: 'on_track',
    },
    {
      id: 'emp-10',
      repName: 'Дмитро Шевчук',
      role: 'B2B SDR & Account Representative',
      monthlyTargetEur: 25000,
      actualClosedEur: 18500,
      dealsWonCount: 1,
      pipelineActiveEur: 43300,
      winRatePct: 29.5,
      baseSalaryEur: 1300,
      kpiBonusRatePct: 10,
      calculatedBonusEur: 450,
      capBonusLimitEur: 750,
      status: 'on_track',
    },
  ];

  private salesActivities: SalesActivityItem[] = [
    {
      id: 'act-1',
      dealId: 'deal-101',
      dealTitle: 'Локалізація банківського SaaS',
      repName: 'Іван Данченко',
      activityType: 'demo',
      date: '2024-10-18 14:00',
      durationMin: 45,
      summary: 'Демонстрація TMS конекторів та AI Quality Assurance контуру',
      outcome: 'Клієнт схвалив підхід до захисту даних GDPR',
    },
    {
      id: 'act-2',
      dealId: 'deal-104',
      dealTitle: 'Річний контракт M&A документації',
      repName: 'Іван Данченко',
      activityType: 'call',
      date: '2024-10-18 11:30',
      durationMin: 25,
      summary: 'Узгодження умов оплати (Net 30) з фінансовим директором LexCorp',
      outcome: 'Погоджено, договір передано на підпис',
    },
    {
      id: 'act-3',
      dealId: 'deal-103',
      dealTitle: 'Медичний сертифікований переклад',
      repName: 'Дмитро Шевчук',
      activityType: 'email',
      date: '2024-10-17 16:45',
      durationMin: 15,
      summary: 'Надіслано копії ISO 17100 та ISO 9001 сертифікатів',
      outcome: 'Очікуємо підтвердження слоту для дзвінка з QM лідом',
    },
    {
      id: 'act-4',
      dealId: 'deal-102',
      dealTitle: 'Повна локалізація RPG тайтлу',
      repName: 'Роман Ткач',
      activityType: 'proposal_sent',
      date: '2024-10-16 10:15',
      durationMin: 30,
      summary: 'Фінальний прорахунок вартості за словесними сітками з урахуванням TM',
      outcome: 'Пропозицію доставлено, підтверджено отримання',
    },
  ];

  private vacancies: VacancyItem[] = [
    {
      id: 'vac-201',
      requisitionCode: 'REQ-TECH-2024-01',
      title: 'Senior ML Engineer (CAT / LLM Pipelines)',
      departmentCode: 'TECH',
      targetGrade: 'Senior',
      hiringManagerName: 'В. Грицай (CTO)',
      recruiterName: 'М. Семенюк (HR Lead)',
      plannedSalaryMinEur: 3800,
      plannedSalaryMaxEur: 4600,
      priority: 'critical',
      status: 'interviewing',
      openDate: '2024-09-20',
      targetCloseDate: '2024-11-05',
      applicantsCount: 38,
      interviewedCount: 6,
      description: 'Розробка та масштабування приватних інференс-моделей для пост-редагування та термінологічного контролю CAT.',
    },
    {
      id: 'vac-202',
      requisitionCode: 'REQ-SLS-2024-02',
      title: 'Middle B2B International Sales Executive',
      departmentCode: 'SLS',
      targetGrade: 'Middle',
      hiringManagerName: 'І. Данченко (Lead Sales)',
      recruiterName: 'М. Семенюк (HR Lead)',
      plannedSalaryMinEur: 1600,
      plannedSalaryMaxEur: 2200,
      priority: 'high',
      status: 'offer_stage',
      openDate: '2024-10-01',
      targetCloseDate: '2024-10-31',
      applicantsCount: 29,
      interviewedCount: 8,
      description: 'Активний пошук клієнтів на ринках DACH та Скандинавії, кваліфікація B2B лідів, закриття угод з чеком від €20k.',
    },
    {
      id: 'vac-203',
      requisitionCode: 'REQ-LOC-2024-03',
      title: 'Senior English-Ukrainian Translator & Post-Editor',
      departmentCode: 'LOC',
      targetGrade: 'Senior',
      hiringManagerName: 'О. Ковальчук (Lead LOC)',
      recruiterName: 'А. Сидоренко (HR Recruiter)',
      plannedSalaryMinEur: 1400,
      plannedSalaryMaxEur: 1700,
      priority: 'medium',
      status: 'open',
      openDate: '2024-10-10',
      targetCloseDate: '2024-11-20',
      applicantsCount: 45,
      interviewedCount: 4,
      description: 'Медична та юридична тематика, сертифікація ISO 17100, щоденний обсяг від 2500 слів.',
    },
  ];

  private candidates: CandidateItem[] = [
    {
      id: 'cand-301',
      candidateCode: 'CAND-2024-088',
      vacancyId: 'vac-202',
      vacancyTitle: 'Middle B2B International Sales Executive',
      departmentCode: 'SLS',
      fullName: 'Максим Руденко',
      email: 'm.rudenko.sales@gmail.com',
      phone: '+48 573 992 110',
      telegram: '@m_rudenko_b2b',
      location: 'Варшава, Польща',
      currentStage: 'offer_sent',
      ratingStars: 5,
      expectedSalaryEur: 1900,
      offerBaseSalaryEur: 1800,
      offerKpiBonusEur: 600,
      offerKpiFormula: 'База €1800 + 10% від маржі B2B контрактів при виконанні плану 100% (Cap limit 150%)',
      notes: '5 років досвіду в продажах локалізаційних послуг на DACH регіон. Чудова вільна німецька та англійська.',
      createdAt: '2024-10-05',
    },
    {
      id: 'cand-302',
      candidateCode: 'CAND-2024-089',
      vacancyId: 'vac-201',
      vacancyTitle: 'Senior ML Engineer (CAT / LLM Pipelines)',
      departmentCode: 'TECH',
      fullName: 'Тарас Гриневич',
      email: 't.hrynevych.ml@outlook.com',
      phone: '+380 67 111 2233',
      telegram: '@hrynevych_ai',
      location: 'Київ, Україна (Гібрид)',
      currentStage: 'tech_interview',
      ratingStars: 5,
      expectedSalaryEur: 4200,
      notes: 'Виконав тестове завдання на 98/100 балів. Сильний бекграунд в оптимізації HuggingFace інференсу.',
      createdAt: '2024-10-08',
    },
    {
      id: 'cand-303',
      candidateCode: 'CAND-2024-090',
      vacancyId: 'vac-201',
      vacancyTitle: 'Senior ML Engineer (CAT / LLM Pipelines)',
      departmentCode: 'TECH',
      fullName: 'Артем Мельник',
      email: 'a.melnyk@techstack.io',
      phone: '+48 600 443 221',
      telegram: '@artem_melnyk',
      location: 'Краків, Польща',
      currentStage: 'test_task',
      ratingStars: 4,
      expectedSalaryEur: 4000,
      notes: 'Передано тестове на перевірку CTO Грицаю. Дедлайн до 22 жовтня.',
      createdAt: '2024-10-12',
    },
    {
      id: 'cand-304',
      candidateCode: 'CAND-2024-091',
      vacancyId: 'vac-203',
      vacancyTitle: 'Senior Translator & Post-Editor',
      departmentCode: 'LOC',
      fullName: 'Ольга Кравчук',
      email: 'olga.kravchuk.transl@gmail.com',
      phone: '+380 50 998 8776',
      telegram: '@olga_lingua',
      location: 'Львів, Україна (Remote)',
      currentStage: 'screening',
      ratingStars: 4,
      expectedSalaryEur: 1500,
      notes: 'Пройшла первинний скринінг з рекрутером. Досвід у Trados та memoQ понад 7 років.',
      createdAt: '2024-10-15',
    },
  ];

  private onboardingList: OnboardingItem[] = [
    {
      id: 'onb-401',
      candidateId: 'cand-299',
      fullName: 'Катерина Василенко',
      departmentCode: 'SLS',
      role: 'B2B SDR Specialist',
      mentorName: 'Іван Данченко',
      startDate: '2024-09-15',
      probationEndDate: '2024-12-15',
      equipmentIssued: true,
      corporateEmailCreated: true,
      accessGranted: true,
      day30ReviewStatus: 'completed',
      day60ReviewStatus: 'scheduled',
      day90ReviewStatus: 'pending',
      oneOnOneCount: 5,
      overallStatus: 'in_progress',
    },
    {
      id: 'onb-402',
      fullName: 'Олександр Бойко',
      departmentCode: 'LOC',
      role: 'LQA Specialist & Reviewer',
      mentorName: 'Олена Ковальчук',
      startDate: '2024-08-20',
      probationEndDate: '2024-11-20',
      equipmentIssued: true,
      corporateEmailCreated: true,
      accessGranted: true,
      day30ReviewStatus: 'completed',
      day60ReviewStatus: 'completed',
      day90ReviewStatus: 'scheduled',
      oneOnOneCount: 8,
      overallStatus: 'passed',
    },
  ];

  private hrMetrics: HrMetrics = {
    timeToHireDays: 21.4,
    targetTimeToHireDays: 25.0,
    costPerHireEur: 640.0,
    probationPassRatePct: 94.2,
    enpsScore: 68,
    turnoverRatePct: 4.1,
    staffingRatePct: 96.0,
    totalPositions: 50,
    filledPositions: 48,
    openVacanciesCount: 2,
  };

  // ===================== SALES METHODS =====================

  public getDeals(): DealItem[] {
    return [...this.deals];
  }

  public addDeal(deal: Omit<DealItem, 'id' | 'dealCode' | 'createdAt' | 'updatedAt'>): DealItem {
    const newDeal: DealItem = {
      ...deal,
      id: `deal-${Date.now()}`,
      dealCode: `SLS-D-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };
    this.deals.unshift(newDeal);
    return newDeal;
  }

  public updateDealStage(id: string, stage: DealItem['stage']): DealItem | null {
    const deal = this.deals.find((d) => d.id === id);
    if (!deal) return null;
    deal.stage = stage;
    if (stage === 'won') deal.probabilityPct = 100;
    else if (stage === 'lost') deal.probabilityPct = 0;
    else if (stage === 'contract_signing') deal.probabilityPct = 90;
    else if (stage === 'negotiation') deal.probabilityPct = 80;
    else if (stage === 'proposal') deal.probabilityPct = 60;
    else if (stage === 'discovery') deal.probabilityPct = 40;
    else deal.probabilityPct = 20;
    deal.updatedAt = new Date().toISOString().split('T')[0];
    return deal;
  }

  public deleteDeal(id: string): boolean {
    const initialLen = this.deals.length;
    this.deals = this.deals.filter((d) => d.id !== id);
    return this.deals.length < initialLen;
  }

  public getSalesMetrics(): SalesMetrics {
    const closedWon = this.deals
      .filter((d) => d.stage === 'won')
      .reduce((sum, d) => sum + d.valueEur, 0);
    const pipeline = this.deals
      .filter((d) => d.stage !== 'won' && d.stage !== 'lost')
      .reduce((sum, d) => sum + d.valueEur, 0);
    const wonCount = this.deals.filter((d) => d.stage === 'won').length;
    const closedCount = this.deals.filter((d) => d.stage === 'won' || d.stage === 'lost').length;
    const winRate = closedCount > 0 ? (wonCount / closedCount) * 100 : 42.5;
    const monthlyTarget = 130000;

    return {
      totalRevenueEur: closedWon + 104500, // month to date total
      monthlyTargetEur: monthlyTarget,
      pipelineValueEur: pipeline,
      activeDealsCount: this.deals.filter((d) => d.stage !== 'won' && d.stage !== 'lost').length,
      winRatePct: Math.round(winRate * 10) / 10,
      avgDealSizeEur: Math.round(pipeline / Math.max(1, this.deals.length)),
      closedWonEur: closedWon,
      targetCompletionPct: Math.round(((closedWon + 104500) / monthlyTarget) * 1000) / 10,
    };
  }

  public getSalesReps(): SalesRepItem[] {
    return [...this.salesReps];
  }

  public getSalesActivities(): SalesActivityItem[] {
    return [...this.salesActivities];
  }

  public addSalesActivity(act: Omit<SalesActivityItem, 'id' | 'date'>): SalesActivityItem {
    const newAct: SalesActivityItem = {
      ...act,
      id: `act-${Date.now()}`,
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };
    this.salesActivities.unshift(newAct);
    return newAct;
  }

  // ===================== HR METHODS =====================

  public getVacancies(): VacancyItem[] {
    return [...this.vacancies];
  }

  public addVacancy(vac: Omit<VacancyItem, 'id' | 'requisitionCode' | 'openDate' | 'applicantsCount' | 'interviewedCount'>): VacancyItem {
    const newVac: VacancyItem = {
      ...vac,
      id: `vac-${Date.now()}`,
      requisitionCode: `REQ-${vac.departmentCode}-${new Date().getFullYear()}-${Math.floor(10 + Math.random() * 90)}`,
      openDate: new Date().toISOString().split('T')[0],
      applicantsCount: 0,
      interviewedCount: 0,
    };
    this.vacancies.unshift(newVac);
    return newVac;
  }

  public updateVacancyStatus(id: string, status: VacancyItem['status']): VacancyItem | null {
    const vac = this.vacancies.find((v) => v.id === id);
    if (!vac) return null;
    vac.status = status;
    return vac;
  }

  public getCandidates(): CandidateItem[] {
    return [...this.candidates];
  }

  public addCandidate(cand: Omit<CandidateItem, 'id' | 'candidateCode' | 'createdAt'>): CandidateItem {
    const newCand: CandidateItem = {
      ...cand,
      id: `cand-${Date.now()}`,
      candidateCode: `CAND-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    this.candidates.unshift(newCand);
    return newCand;
  }

  public updateCandidateStage(id: string, stage: CandidateItem['currentStage']): CandidateItem | null {
    const cand = this.candidates.find((c) => c.id === id);
    if (!cand) return null;
    cand.currentStage = stage;
    return cand;
  }

  public issueKpiOffer(id: string, baseSalaryEur: number, kpiBonusEur: number, formula: string): CandidateItem | null {
    const cand = this.candidates.find((c) => c.id === id);
    if (!cand) return null;
    cand.currentStage = 'offer_sent';
    cand.offerBaseSalaryEur = baseSalaryEur;
    cand.offerKpiBonusEur = kpiBonusEur;
    cand.offerKpiFormula = formula;
    return cand;
  }

  public getOnboardingList(): OnboardingItem[] {
    return [...this.onboardingList];
  }

  public updateOnboardingMilestone(
    id: string,
    updates: Partial<Pick<OnboardingItem, 'equipmentIssued' | 'corporateEmailCreated' | 'accessGranted' | 'day30ReviewStatus' | 'day60ReviewStatus' | 'day90ReviewStatus' | 'overallStatus'>>
  ): OnboardingItem | null {
    const onb = this.onboardingList.find((o) => o.id === id);
    if (!onb) return null;
    Object.assign(onb, updates);
    return onb;
  }

  public getHrMetrics(): HrMetrics {
    return { ...this.hrMetrics };
  }
}

export const dbRepository = new MockDatabaseRepository();
