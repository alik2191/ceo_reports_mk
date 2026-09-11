-- ============================================================================
-- MK GROUP CRM & CPM PLATFORM — RELATIONAL DATABASE SCHEMA (PostgreSQL 15+)
-- High-performance schema supporting Sales (SLS) and HR & Talent modules,
-- consolidated employee records, KPI offer calculations, and audit trails.
-- ============================================================================

-- Extensions for UUID and cryptographic hashing
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- 1. CORE ORGANIZATIONAL STRUCTURE & EMPLOYEES
-- ============================================================================

CREATE TYPE department_code_enum AS ENUM ('SLS', 'HR', 'LOC', 'MKT', 'OPS', 'FIN', 'TECH');
CREATE TYPE employment_type_enum AS ENUM ('Штат', 'B2B Контракт', 'ФОП', 'Freelance');
CREATE TYPE employee_status_enum AS ENUM ('active', 'vacation', 'onboarding', 'suspended', 'terminated');
CREATE TYPE company_entity_enum AS ENUM ('MK:translations', 'Localica', 'Холдинг (Центр)');

CREATE TABLE IF NOT EXISTS departments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code department_code_enum UNIQUE NOT NULL,
    name VARCHAR(150) NOT NULL,
    head_employee_id UUID,
    head_name VARCHAR(150) NOT NULL,
    head_role VARCHAR(150) NOT NULL,
    headcount_fact INT NOT NULL DEFAULT 0,
    headcount_plan INT NOT NULL DEFAULT 0,
    performance_rate NUMERIC(5,2) NOT NULL DEFAULT 100.00,
    status VARCHAR(50) NOT NULL DEFAULT 'optimal',
    locations VARCHAR(255) NOT NULL,
    company company_entity_enum NOT NULL DEFAULT 'Холдинг (Центр)',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS employees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(30) UNIQUE NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    initials VARCHAR(10) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50),
    telegram VARCHAR(100),
    role VARCHAR(150) NOT NULL,
    grade VARCHAR(50) NOT NULL,
    department_code department_code_enum NOT NULL,
    company company_entity_enum NOT NULL,
    legal_entity VARCHAR(150) NOT NULL,
    location VARCHAR(100) NOT NULL,
    employment_type employment_type_enum NOT NULL DEFAULT 'Штат',
    status employee_status_enum NOT NULL DEFAULT 'active',
    manager_id UUID REFERENCES employees(id) ON DELETE SET NULL,
    manager_name VARCHAR(150),
    manager_role VARCHAR(150),
    base_salary_eur NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    hire_date DATE NOT NULL DEFAULT CURRENT_DATE,
    probation_end_date DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Foreign key for department lead
ALTER TABLE departments
    ADD CONSTRAINT fk_department_head
    FOREIGN KEY (head_employee_id) REFERENCES employees(id) ON DELETE SET NULL;

-- ============================================================================
-- 2. SALES DEPARTMENT DOMAIN (SLS)
-- ============================================================================

CREATE TYPE deal_stage_enum AS ENUM (
    'lead',             -- Новий лід / Контакт
    'discovery',        -- Кваліфікація та Демо
    'proposal',         -- Комерційна пропозиція надіслана
    'negotiation',      -- Узгодження умов та SLA
    'contract_signing', -- Підписання договору
    'won',              -- Угода укладена (Виграно)
    'lost'              -- Втрачено / Відмова
);

CREATE TYPE deal_segment_enum AS ENUM (
    'Enterprise',
    'SMB',
    'Key Account',
    'Tech & GameDev',
    'Legal & FinTech'
);

CREATE TYPE sales_source_enum AS ENUM (
    'Outreach SDR',
    'LinkedIn',
    'Inbound Web',
    'Referral',
    'Exhibition / Summit',
    'Partner Channel'
);

CREATE TYPE activity_type_enum AS ENUM (
    'call',
    'demo',
    'email',
    'proposal_sent',
    'contract_sent',
    'follow_up'
);

CREATE TABLE IF NOT EXISTS sales_deals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    deal_code VARCHAR(30) UNIQUE NOT NULL,
    client_company VARCHAR(200) NOT NULL,
    client_contact_name VARCHAR(150) NOT NULL,
    client_email VARCHAR(255) NOT NULL,
    client_phone VARCHAR(50),
    deal_title VARCHAR(255) NOT NULL,
    segment deal_segment_enum NOT NULL DEFAULT 'SMB',
    value_eur NUMERIC(12,2) NOT NULL,
    stage deal_stage_enum NOT NULL DEFAULT 'lead',
    probability_pct INT NOT NULL DEFAULT 20,
    assigned_rep_id UUID REFERENCES employees(id) ON DELETE SET NULL,
    assigned_rep_name VARCHAR(150) NOT NULL,
    source sales_source_enum NOT NULL DEFAULT 'Outreach SDR',
    expected_close_date DATE NOT NULL,
    actual_close_date DATE,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_sales_deals_stage ON sales_deals(stage);
CREATE INDEX idx_sales_deals_assigned_rep ON sales_deals(assigned_rep_id);
CREATE INDEX idx_sales_deals_expected_close ON sales_deals(expected_close_date);

CREATE TABLE IF NOT EXISTS sales_activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    deal_id UUID REFERENCES sales_deals(id) ON DELETE CASCADE,
    rep_id UUID REFERENCES employees(id) ON DELETE SET NULL,
    rep_name VARCHAR(150) NOT NULL,
    activity_type activity_type_enum NOT NULL,
    activity_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    duration_min INT NOT NULL DEFAULT 15,
    summary VARCHAR(255) NOT NULL,
    outcome VARCHAR(255),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sales_reps_performance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rep_id UUID REFERENCES employees(id) ON DELETE CASCADE,
    rep_name VARCHAR(150) NOT NULL,
    role VARCHAR(100) NOT NULL,
    period VARCHAR(20) NOT NULL, -- e.g. '2024-Q4' or '2024-10'
    monthly_target_eur NUMERIC(12,2) NOT NULL,
    actual_closed_eur NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    deals_won_count INT NOT NULL DEFAULT 0,
    pipeline_active_eur NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    win_rate_pct NUMERIC(5,2) NOT NULL DEFAULT 0.00,
    base_salary_eur NUMERIC(10,2) NOT NULL,
    kpi_bonus_rate_pct NUMERIC(5,2) NOT NULL DEFAULT 10.00,
    calculated_bonus_eur NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    cap_bonus_limit_eur NUMERIC(10,2) NOT NULL, -- Cap 150% from base bonus
    status VARCHAR(50) NOT NULL DEFAULT 'on_track',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_rep_period UNIQUE (rep_id, period)
);

-- ============================================================================
-- 3. HR & TALENT MANAGEMENT DOMAIN (HR)
-- ============================================================================

CREATE TYPE vacancy_status_enum AS ENUM (
    'draft',
    'open',
    'interviewing',
    'offer_stage',
    'filled',
    'cancelled'
);

CREATE TYPE vacancy_priority_enum AS ENUM ('low', 'medium', 'high', 'critical');

CREATE TYPE candidate_stage_enum AS ENUM (
    'applied',
    'screening',
    'test_task',
    'tech_interview',
    'culture_fit',
    'offer_sent',
    'offer_accepted',
    'rejected'
);

CREATE TYPE onboarding_status_enum AS ENUM (
    'pending_start',
    'in_progress',
    'passed',
    'extended',
    'failed'
);

CREATE TABLE IF NOT EXISTS hr_vacancies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    requisition_code VARCHAR(30) UNIQUE NOT NULL,
    title VARCHAR(200) NOT NULL,
    department_code department_code_enum NOT NULL,
    target_grade VARCHAR(50) NOT NULL,
    hiring_manager_id UUID REFERENCES employees(id) ON DELETE SET NULL,
    hiring_manager_name VARCHAR(150) NOT NULL,
    recruiter_id UUID REFERENCES employees(id) ON DELETE SET NULL,
    recruiter_name VARCHAR(150) NOT NULL,
    planned_salary_min_eur NUMERIC(10,2) NOT NULL,
    planned_salary_max_eur NUMERIC(10,2) NOT NULL,
    priority vacancy_priority_enum NOT NULL DEFAULT 'medium',
    status vacancy_status_enum NOT NULL DEFAULT 'open',
    open_date DATE NOT NULL DEFAULT CURRENT_DATE,
    target_close_date DATE NOT NULL,
    actual_hire_date DATE,
    applicants_count INT NOT NULL DEFAULT 0,
    interviewed_count INT NOT NULL DEFAULT 0,
    job_description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS hr_candidates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    candidate_code VARCHAR(30) UNIQUE NOT NULL,
    vacancy_id UUID REFERENCES hr_vacancies(id) ON DELETE CASCADE,
    vacancy_title VARCHAR(200) NOT NULL,
    department_code department_code_enum NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    telegram VARCHAR(100),
    location VARCHAR(100) NOT NULL,
    current_stage candidate_stage_enum NOT NULL DEFAULT 'applied',
    rating_stars INT NOT NULL DEFAULT 3,
    expected_salary_eur NUMERIC(10,2) NOT NULL,
    offer_base_salary_eur NUMERIC(10,2),
    offer_kpi_bonus_eur NUMERIC(10,2),
    offer_kpi_formula TEXT,
    offer_sent_date TIMESTAMPTZ,
    resume_url VARCHAR(500),
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_hr_candidates_stage ON hr_candidates(current_stage);
CREATE INDEX idx_hr_candidates_vacancy ON hr_candidates(vacancy_id);

CREATE TABLE IF NOT EXISTS hr_onboarding_lifecycle (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    candidate_id UUID REFERENCES hr_candidates(id) ON DELETE SET NULL,
    employee_id UUID REFERENCES employees(id) ON DELETE SET NULL,
    full_name VARCHAR(150) NOT NULL,
    department_code department_code_enum NOT NULL,
    role VARCHAR(150) NOT NULL,
    mentor_name VARCHAR(150) NOT NULL,
    start_date DATE NOT NULL,
    probation_end_date DATE NOT NULL,
    equipment_issued BOOLEAN NOT NULL DEFAULT FALSE,
    corporate_email_created BOOLEAN NOT NULL DEFAULT FALSE,
    access_granted BOOLEAN NOT NULL DEFAULT FALSE,
    day30_review_status VARCHAR(50) NOT NULL DEFAULT 'pending',
    day60_review_status VARCHAR(50) NOT NULL DEFAULT 'pending',
    day90_review_status VARCHAR(50) NOT NULL DEFAULT 'pending',
    one_on_one_count INT NOT NULL DEFAULT 0,
    overall_status onboarding_status_enum NOT NULL DEFAULT 'in_progress',
    feedback_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS hr_department_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    period VARCHAR(20) NOT NULL UNIQUE,
    time_to_hire_days NUMERIC(4,1) NOT NULL DEFAULT 21.0,
    target_time_to_hire_days NUMERIC(4,1) NOT NULL DEFAULT 25.0,
    cost_per_hire_eur NUMERIC(10,2) NOT NULL DEFAULT 650.00,
    probation_pass_rate_pct NUMERIC(5,2) NOT NULL DEFAULT 94.50,
    enps_score INT NOT NULL DEFAULT 68,
    turnover_rate_pct NUMERIC(4,2) NOT NULL DEFAULT 4.20,
    staffing_rate_pct NUMERIC(5,2) NOT NULL DEFAULT 96.00, -- 48 out of 50
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 4. SYSTEM-WIDE AUDIT TRAIL LOGS
-- ============================================================================

CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    actor VARCHAR(150) NOT NULL,
    actor_role VARCHAR(150) NOT NULL,
    module VARCHAR(50) NOT NULL, -- 'SALES', 'HR', 'FINANCE', 'ORG'
    event_type VARCHAR(100) NOT NULL,
    target_entity VARCHAR(100) NOT NULL,
    target_id VARCHAR(100),
    details TEXT NOT NULL,
    ip_address VARCHAR(50),
    severity VARCHAR(20) NOT NULL DEFAULT 'info',
    sha256_hash VARCHAR(64) NOT NULL
);

CREATE INDEX idx_audit_logs_timestamp ON audit_logs(timestamp DESC);
CREATE INDEX idx_audit_logs_module ON audit_logs(module);
