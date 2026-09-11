import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { dbRepository } from './src/db/repository';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // =========================================================================
  // API ROUTES: CORE & DATABASE SCHEMA
  // =========================================================================

  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'mk-group-crm-backend',
      environment: process.env.NODE_ENV || 'development',
      timestamp: new Date().toISOString(),
      activeDepartments: ['SLS', 'HR', 'LOC', 'MKT', 'OPS', 'FIN'],
    });
  });

  app.get('/api/db/schema', (req, res) => {
    try {
      const schemaPath = path.join(process.cwd(), 'src', 'db', 'schema.sql');
      if (fs.existsSync(schemaPath)) {
        const sqlContent = fs.readFileSync(schemaPath, 'utf8');
        res.json({
          status: 'success',
          dialect: 'PostgreSQL 15+',
          tablesCount: 8,
          schema: sqlContent,
        });
      } else {
        res.status(404).json({ error: 'Schema file not found' });
      }
    } catch (err) {
      res.status(500).json({ error: 'Failed to read database schema', details: String(err) });
    }
  });

  // =========================================================================
  // API ROUTES: SALES (SLS) MODULE
  // =========================================================================

  // 1. Get all deals
  app.get('/api/sales/deals', (req, res) => {
    const deals = dbRepository.getDeals();
    res.json({ status: 'success', count: deals.length, data: deals });
  });

  // 2. Create new deal
  app.post('/api/sales/deals', (req, res) => {
    const { clientCompany, contactPerson, email, phone, dealTitle, segment, valueEur, stage, assignedRepId, assignedRepName, source, expectedCloseDate, notes } = req.body;
    if (!clientCompany || !dealTitle || !valueEur) {
      return res.status(400).json({ error: 'Missing required fields: clientCompany, dealTitle, valueEur' });
    }
    const newDeal = dbRepository.addDeal({
      clientCompany,
      contactPerson: contactPerson || '—',
      email: email || '',
      phone: phone || '',
      dealTitle,
      segment: segment || 'SMB',
      valueEur: Number(valueEur),
      stage: stage || 'lead',
      probabilityPct: 20,
      assignedRepId: assignedRepId || 'emp-2',
      assignedRepName: assignedRepName || 'Іван Данченко',
      source: source || 'Outreach SDR',
      expectedCloseDate: expectedCloseDate || new Date().toISOString().split('T')[0],
      notes: notes || '',
    });
    res.status(201).json({ status: 'success', data: newDeal });
  });

  // 3. Update deal stage
  app.patch('/api/sales/deals/:id/stage', (req, res) => {
    const { stage } = req.body;
    if (!stage) {
      return res.status(400).json({ error: 'Field "stage" is required' });
    }
    const updated = dbRepository.updateDealStage(req.params.id, stage);
    if (!updated) {
      return res.status(404).json({ error: 'Deal not found' });
    }
    res.json({ status: 'success', data: updated });
  });

  // 4. Delete deal
  app.delete('/api/sales/deals/:id', (req, res) => {
    const success = dbRepository.deleteDeal(req.params.id);
    if (!success) {
      return res.status(404).json({ error: 'Deal not found' });
    }
    res.json({ status: 'success', message: 'Deal deleted' });
  });

  // 5. Get sales aggregated metrics
  app.get('/api/sales/metrics', (req, res) => {
    const metrics = dbRepository.getSalesMetrics();
    res.json({ status: 'success', data: metrics });
  });

  // 6. Get sales team performance & KPI calculations
  app.get('/api/sales/reps', (req, res) => {
    const reps = dbRepository.getSalesReps();
    res.json({ status: 'success', count: reps.length, data: reps });
  });

  // 7. Get sales activity logs
  app.get('/api/sales/activities', (req, res) => {
    const activities = dbRepository.getSalesActivities();
    res.json({ status: 'success', count: activities.length, data: activities });
  });

  // 8. Add sales activity log
  app.post('/api/sales/activities', (req, res) => {
    const { dealId, dealTitle, repName, activityType, durationMin, summary, outcome } = req.body;
    if (!repName || !summary) {
      return res.status(400).json({ error: 'Missing required fields: repName, summary' });
    }
    const newAct = dbRepository.addSalesActivity({
      dealId,
      dealTitle,
      repName,
      activityType: activityType || 'call',
      durationMin: Number(durationMin) || 15,
      summary,
      outcome: outcome || '',
    });
    res.status(201).json({ status: 'success', data: newAct });
  });

  // =========================================================================
  // API ROUTES: HR & TALENT MANAGEMENT (HR) MODULE
  // =========================================================================

  // 1. Get all vacancies
  app.get('/api/hr/vacancies', (req, res) => {
    const vacancies = dbRepository.getVacancies();
    res.json({ status: 'success', count: vacancies.length, data: vacancies });
  });

  // 2. Create new vacancy
  app.post('/api/hr/vacancies', (req, res) => {
    const { title, departmentCode, targetGrade, hiringManagerName, recruiterName, plannedSalaryMinEur, plannedSalaryMaxEur, priority, status, targetCloseDate, description } = req.body;
    if (!title || !departmentCode || !plannedSalaryMinEur) {
      return res.status(400).json({ error: 'Missing required fields: title, departmentCode, plannedSalaryMinEur' });
    }
    const newVac = dbRepository.addVacancy({
      title,
      departmentCode: departmentCode || 'HR',
      targetGrade: targetGrade || 'Middle',
      hiringManagerName: hiringManagerName || 'М. Семенюк',
      recruiterName: recruiterName || 'М. Семенюк',
      plannedSalaryMinEur: Number(plannedSalaryMinEur),
      plannedSalaryMaxEur: Number(plannedSalaryMaxEur || plannedSalaryMinEur * 1.3),
      priority: priority || 'medium',
      status: status || 'open',
      targetCloseDate: targetCloseDate || new Date().toISOString().split('T')[0],
      description: description || '',
    });
    res.status(201).json({ status: 'success', data: newVac });
  });

  // 3. Update vacancy status
  app.patch('/api/hr/vacancies/:id/status', (req, res) => {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ error: 'Field "status" is required' });
    }
    const updated = dbRepository.updateVacancyStatus(req.params.id, status);
    if (!updated) {
      return res.status(404).json({ error: 'Vacancy not found' });
    }
    res.json({ status: 'success', data: updated });
  });

  // 4. Get candidates
  app.get('/api/hr/candidates', (req, res) => {
    const candidates = dbRepository.getCandidates();
    res.json({ status: 'success', count: candidates.length, data: candidates });
  });

  // 5. Create candidate
  app.post('/api/hr/candidates', (req, res) => {
    const { vacancyId, vacancyTitle, departmentCode, fullName, email, phone, telegram, location, currentStage, ratingStars, expectedSalaryEur, notes } = req.body;
    if (!fullName || !email) {
      return res.status(400).json({ error: 'Missing required fields: fullName, email' });
    }
    const newCand = dbRepository.addCandidate({
      vacancyId: vacancyId || 'vac-201',
      vacancyTitle: vacancyTitle || 'General Application',
      departmentCode: departmentCode || 'HR',
      fullName,
      email,
      phone: phone || '',
      telegram: telegram || '',
      location: location || 'Київ / Віддалено',
      currentStage: currentStage || 'applied',
      ratingStars: Number(ratingStars) || 3,
      expectedSalaryEur: Number(expectedSalaryEur) || 1500,
      notes: notes || '',
    });
    res.status(201).json({ status: 'success', data: newCand });
  });

  // 6. Update candidate stage
  app.patch('/api/hr/candidates/:id/stage', (req, res) => {
    const { stage } = req.body;
    if (!stage) {
      return res.status(400).json({ error: 'Field "stage" is required' });
    }
    const updated = dbRepository.updateCandidateStage(req.params.id, stage);
    if (!updated) {
      return res.status(404).json({ error: 'Candidate not found' });
    }
    res.json({ status: 'success', data: updated });
  });

  // 7. Issue formal offer with KPI bonus logic
  app.post('/api/hr/candidates/:id/offer', (req, res) => {
    const { baseSalaryEur, kpiBonusEur, formula } = req.body;
    if (!baseSalaryEur) {
      return res.status(400).json({ error: 'Field "baseSalaryEur" is required' });
    }
    const updated = dbRepository.issueKpiOffer(
      req.params.id,
      Number(baseSalaryEur),
      Number(kpiBonusEur || 0),
      formula || `Базова ставка €${baseSalaryEur} + KPI бонус €${kpiBonusEur} (Cap 150%)`
    );
    if (!updated) {
      return res.status(404).json({ error: 'Candidate not found' });
    }
    res.json({ status: 'success', data: updated });
  });

  // 8. Get onboarding lifecycle list
  app.get('/api/hr/onboarding', (req, res) => {
    const list = dbRepository.getOnboardingList();
    res.json({ status: 'success', count: list.length, data: list });
  });

  // 9. Update onboarding milestone
  app.patch('/api/hr/onboarding/:id', (req, res) => {
    const updated = dbRepository.updateOnboardingMilestone(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Onboarding record not found' });
    }
    res.json({ status: 'success', data: updated });
  });

  // 10. Get HR department metrics
  app.get('/api/hr/metrics', (req, res) => {
    const metrics = dbRepository.getHrMetrics();
    res.json({ status: 'success', data: metrics });
  });

  // =========================================================================
  // VITE MIDDLEWARE (DEVELOPMENT) & STATIC SERVING (PRODUCTION)
  // =========================================================================

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[MK-Group CRM] Backend server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
