import {
  DealItem,
  SalesActivityItem,
  SalesRepItem,
  SalesMetrics,
  VacancyItem,
  CandidateItem,
  OnboardingItem,
  HrMetrics,
  dbRepository,
} from '../db/repository';

export const apiClient = {
  // Database Schema
  async getDatabaseSchema(): Promise<{ dialect: string; schema: string }> {
    try {
      const res = await fetch('/api/db/schema');
      if (res.ok) {
        const json = await res.json();
        return { dialect: json.dialect, schema: json.schema };
      }
    } catch {
      // fallback
    }
    return {
      dialect: 'PostgreSQL 15+',
      schema: `-- (Schema served from repository)
-- Full DDL is defined in /src/db/schema.sql`,
    };
  },

  // ================= SALES (SLS) =================
  async getDeals(): Promise<DealItem[]> {
    try {
      const res = await fetch('/api/sales/deals');
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch {
      // fallback
    }
    return dbRepository.getDeals();
  },

  async createDeal(deal: Omit<DealItem, 'id' | 'dealCode' | 'createdAt' | 'updatedAt'>): Promise<DealItem> {
    try {
      const res = await fetch('/api/sales/deals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(deal),
      });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch {
      // fallback
    }
    return dbRepository.addDeal(deal);
  },

  async updateDealStage(id: string, stage: DealItem['stage']): Promise<DealItem | null> {
    try {
      const res = await fetch(`/api/sales/deals/${id}/stage`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stage }),
      });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch {
      // fallback
    }
    return dbRepository.updateDealStage(id, stage);
  },

  async deleteDeal(id: string): Promise<boolean> {
    try {
      const res = await fetch(`/api/sales/deals/${id}`, { method: 'DELETE' });
      if (res.ok) return true;
    } catch {
      // fallback
    }
    return dbRepository.deleteDeal(id);
  },

  async getSalesMetrics(): Promise<SalesMetrics> {
    try {
      const res = await fetch('/api/sales/metrics');
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch {
      // fallback
    }
    return dbRepository.getSalesMetrics();
  },

  async getSalesReps(): Promise<SalesRepItem[]> {
    try {
      const res = await fetch('/api/sales/reps');
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch {
      // fallback
    }
    return dbRepository.getSalesReps();
  },

  async getSalesActivities(): Promise<SalesActivityItem[]> {
    try {
      const res = await fetch('/api/sales/activities');
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch {
      // fallback
    }
    return dbRepository.getSalesActivities();
  },

  async logSalesActivity(activity: Omit<SalesActivityItem, 'id' | 'date'>): Promise<SalesActivityItem> {
    try {
      const res = await fetch('/api/sales/activities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(activity),
      });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch {
      // fallback
    }
    return dbRepository.addSalesActivity(activity);
  },

  // ================= HR & TALENTS =================
  async getVacancies(): Promise<VacancyItem[]> {
    try {
      const res = await fetch('/api/hr/vacancies');
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch {
      // fallback
    }
    return dbRepository.getVacancies();
  },

  async createVacancy(
    vac: Omit<VacancyItem, 'id' | 'requisitionCode' | 'openDate' | 'applicantsCount' | 'interviewedCount'>
  ): Promise<VacancyItem> {
    try {
      const res = await fetch('/api/hr/vacancies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(vac),
      });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch {
      // fallback
    }
    return dbRepository.addVacancy(vac);
  },

  async updateVacancyStatus(id: string, status: VacancyItem['status']): Promise<VacancyItem | null> {
    try {
      const res = await fetch(`/api/hr/vacancies/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch {
      // fallback
    }
    return dbRepository.updateVacancyStatus(id, status);
  },

  async getCandidates(): Promise<CandidateItem[]> {
    try {
      const res = await fetch('/api/hr/candidates');
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch {
      // fallback
    }
    return dbRepository.getCandidates();
  },

  async createCandidate(
    cand: Omit<CandidateItem, 'id' | 'candidateCode' | 'createdAt'>
  ): Promise<CandidateItem> {
    try {
      const res = await fetch('/api/hr/candidates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cand),
      });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch {
      // fallback
    }
    return dbRepository.addCandidate(cand);
  },

  async updateCandidateStage(id: string, stage: CandidateItem['currentStage']): Promise<CandidateItem | null> {
    try {
      const res = await fetch(`/api/hr/candidates/${id}/stage`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stage }),
      });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch {
      // fallback
    }
    return dbRepository.updateCandidateStage(id, stage);
  },

  async issueKpiOffer(
    id: string,
    baseSalaryEur: number,
    kpiBonusEur: number,
    formula: string
  ): Promise<CandidateItem | null> {
    try {
      const res = await fetch(`/api/hr/candidates/${id}/offer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ baseSalaryEur, kpiBonusEur, formula }),
      });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch {
      // fallback
    }
    return dbRepository.issueKpiOffer(id, baseSalaryEur, kpiBonusEur, formula);
  },

  async getOnboardingList(): Promise<OnboardingItem[]> {
    try {
      const res = await fetch('/api/hr/onboarding');
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch {
      // fallback
    }
    return dbRepository.getOnboardingList();
  },

  async updateOnboardingMilestone(
    id: string,
    updates: Partial<Pick<OnboardingItem, 'equipmentIssued' | 'corporateEmailCreated' | 'accessGranted' | 'day30ReviewStatus' | 'day60ReviewStatus' | 'day90ReviewStatus' | 'overallStatus'>>
  ): Promise<OnboardingItem | null> {
    try {
      const res = await fetch(`/api/hr/onboarding/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch {
      // fallback
    }
    return dbRepository.updateOnboardingMilestone(id, updates);
  },

  async getHrMetrics(): Promise<HrMetrics> {
    try {
      const res = await fetch('/api/hr/metrics');
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch {
      // fallback
    }
    return dbRepository.getHrMetrics();
  },
};
