import React, { useState } from 'react';
import { ScreenId } from '../../types';

interface SettingsScreenProps {
  onNavigate: (screen: ScreenId) => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'general' | 'integrations'>('integrations');

  // General settings state
  const [currency, setCurrency] = useState('EUR');
  const [timeZone, setTimeZone] = useState('Europe/Warsaw');
  const [capLimit, setCapLimit] = useState(150);
  const [riskThreshold, setRiskThreshold] = useState(90);
  const [autoLockReports, setAutoLockReports] = useState(true);
  const [twoFactorAuth, setTwoFactorAuth] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Microsoft Entra ID (Azure AD SSO) state
  const [entraEnabled, setEntraEnabled] = useState(true);
  const [tenantId, setTenantId] = useState('e6b12a84-93c4-4b52-9b2f-3d84a1e902b1');
  const [clientId, setClientId] = useState('4f89d312-70b1-4c78-b631-0987fa543210');
  const [clientSecret, setClientSecret] = useState('mk_sec_993410a8ef819203847cba983');
  const [showSecret, setShowSecret] = useState(false);
  const [enforceSso, setEnforceSso] = useState(true);
  const [testEntraStatus, setTestEntraStatus] = useState<'idle' | 'testing' | 'success'>('idle');

  // Hurma HR CRM state
  const [hurmaEnabled, setHurmaEnabled] = useState(true);
  const [hurmaSubdomain, setHurmaSubdomain] = useState('mk-group.hurma.work');
  const [hurmaApiToken, setHurmaApiToken] = useState('hrm_live_9f82a17b823e4c19a9284102c91834e5');
  const [showHurmaToken, setShowHurmaToken] = useState(false);
  const [hurmaSyncInterval, setHurmaSyncInterval] = useState('2h');
  const [syncEmployees, setSyncEmployees] = useState(true);
  const [syncDepartments, setSyncDepartments] = useState(true);
  const [syncLeaves, setSyncLeaves] = useState(true);
  const [syncKpiOffers, setSyncKpiOffers] = useState(true);
  const [testHurmaStatus, setTestHurmaStatus] = useState<'idle' | 'testing' | 'success'>('idle');
  const [lastSyncTime, setLastSyncTime] = useState('Сьогодні, 03:45');
  const [isSyncingNow, setIsSyncingNow] = useState(false);
  const [copiedWebhook, setCopiedWebhook] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
    }, 3000);
  };

  const handleTestEntra = () => {
    setTestEntraStatus('testing');
    setTimeout(() => {
      setTestEntraStatus('success');
      setTimeout(() => setTestEntraStatus('idle'), 4000);
    }, 1200);
  };

  const handleTestHurma = () => {
    setTestHurmaStatus('testing');
    setTimeout(() => {
      setTestHurmaStatus('success');
      setTimeout(() => setTestHurmaStatus('idle'), 1200);
    }, 1200);
  };

  const handleSyncHurmaNow = () => {
    setIsSyncingNow(true);
    setTimeout(() => {
      setIsSyncingNow(false);
      const now = new Date();
      setLastSyncTime(`Сьогодні, ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    }, 1800);
  };

  const copyWebhookUrl = () => {
    navigator.clipboard?.writeText('https://api.mk-localica.com/v1/webhooks/hurma-events');
    setCopiedWebhook(true);
    setTimeout(() => setCopiedWebhook(false), 2500);
  };

  return (
    <div id="screen-settings" className="flex-1 flex flex-col min-w-0 bg-[#f8faff]">
      {/* ================= TOPBAR HEADER ================= */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-8 py-3.5 shadow-xs flex items-center justify-between flex-wrap gap-4">
        <div className="flex flex-col">
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Налаштування · Параметри системи, регламенти та інтеграції
            </h1>
            <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-xs font-semibold ring-1 ring-blue-700/10">
              v2.4.8-prod
            </span>
            <span className="inline-flex items-center gap-1 text-xs text-emerald-700 font-semibold px-2 py-0.5 rounded-md bg-emerald-50 ring-1 ring-emerald-600/10">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Холдинг активний
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Конфігурація бізнес-правил ТЗ, SSO авторизація Entra ID, синхронізація з Hurma HR CRM
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => onNavigate('audit')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs transition cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[16px]">history</span>
            <span>Журнал змін конфігурації</span>
          </button>
          <button
            onClick={handleSave}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[16px]">save</span>
            <span>Зберегти налаштування</span>
          </button>
        </div>
      </header>

      {/* ================= CONTENT BODY ================= */}
      <div className="p-8 space-y-6 max-w-5xl mx-auto w-full">
        {savedSuccess && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between animate-in fade-in duration-200">
            <div className="flex items-center gap-2 font-bold">
              <span className="material-symbols-outlined text-emerald-600 text-[20px]">check_circle</span>
              <span>Системні параметри та ключі інтеграцій успішно збережено й верифіковано.</span>
            </div>
            <span className="text-[11px] text-emerald-600 font-medium">Зафіксовано в аудит-лозі</span>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-slate-200">
          <button
            type="button"
            onClick={() => setActiveTab('integrations')}
            className={`pb-3 px-3 text-xs font-bold flex items-center gap-2 border-b-2 transition cursor-pointer ${
              activeTab === 'integrations'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">hub</span>
            <span>Корпоративні інтеграції (Entra ID & Hurma)</span>
            <span className="px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-extrabold">
              2 активні
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('general')}
            className={`pb-3 px-3 text-xs font-bold flex items-center gap-2 border-b-2 transition cursor-pointer ${
              activeTab === 'general'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">tune</span>
            <span>Загальні регламенти та KPI</span>
          </button>
        </div>

        {activeTab === 'integrations' ? (
          /* ================= TAB 1: КОРПОРАТИВНІ ІНТЕГРАЦІЇ ================= */
          <div className="space-y-6 animate-in fade-in duration-150">
            {/* 1. Microsoft Entra ID Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                    <span className="material-symbols-outlined text-[24px]">corporate_fare</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="text-sm font-bold text-slate-900">
                        Microsoft Entra ID (раніше Azure AD) · SSO Авторизація
                      </h2>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        OIDC / OAuth 2.0
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">
                      Безшовний корпоративний вхід співробітників за робочими адресами @mk-translations.com та @localica.io
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={entraEnabled}
                      onChange={(e) => setEntraEnabled(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                  <span className="text-xs font-bold text-slate-700">
                    {entraEnabled ? 'Активно' : 'Вимкнено'}
                  </span>
                </div>
              </div>

              {entraEnabled && (
                <div className="space-y-4 pt-1">
                  {/* Status Banner */}
                  <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-100 flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2.5">
                      <span className="material-symbols-outlined text-blue-600 text-[20px] shrink-0 mt-0.5">
                        verified
                      </span>
                      <div className="text-xs">
                        <span className="font-bold text-blue-900 block">
                          Контур єдиної авторизації холдингу налаштовано
                        </span>
                        <span className="text-blue-700">
                          Підтримується автоматичне підтягування ролей, захист MFA та миттєвий відклик доступу при блокуванні в IT-системі компанії.
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleTestEntra}
                      disabled={testEntraStatus === 'testing'}
                      className="shrink-0 px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs disabled:opacity-50 cursor-pointer"
                    >
                      {testEntraStatus === 'testing' ? (
                        <>
                          <span className="material-symbols-outlined text-[16px] animate-spin">refresh</span>
                          <span>Тестування...</span>
                        </>
                      ) : testEntraStatus === 'success' ? (
                        <>
                          <span className="material-symbols-outlined text-[16px] text-emerald-300">check</span>
                          <span>Зв'язок OK!</span>
                        </>
                      ) : (
                        <>
                          <span className="material-symbols-outlined text-[16px]">sync</span>
                          <span>Тест зв'язку</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1" htmlFor="tenantIdInput">
                        Directory (Tenant) ID
                      </label>
                      <input
                        id="tenantIdInput"
                        type="text"
                        value={tenantId}
                        onChange={(e) => setTenantId(e.target.value)}
                        placeholder="00000000-0000-0000-0000-000000000000"
                        className="w-full text-xs font-mono border border-slate-300 rounded-lg p-2.5 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                      <span className="text-[11px] text-slate-400 mt-1 block">
                        Ідентифікатор орендаря в Microsoft Entra Admin Center.
                      </span>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1" htmlFor="clientIdInput">
                        Application (Client) ID
                      </label>
                      <input
                        id="clientIdInput"
                        type="text"
                        value={clientId}
                        onChange={(e) => setClientId(e.target.value)}
                        placeholder="00000000-0000-0000-0000-000000000000"
                        className="w-full text-xs font-mono border border-slate-300 rounded-lg p-2.5 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                      <span className="text-[11px] text-slate-400 mt-1 block">
                        ID зареєстрованого додатку 'MK Group KPI Dashboard'.
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1" htmlFor="clientSecretInput">
                      Client Secret Key (Серверний ключ)
                    </label>
                    <div className="relative">
                      <input
                        id="clientSecretInput"
                        type={showSecret ? 'text' : 'password'}
                        value={clientSecret}
                        onChange={(e) => setClientSecret(e.target.value)}
                        className="w-full text-xs font-mono border border-slate-300 rounded-lg p-2.5 pr-10 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowSecret(!showSecret)}
                        className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          {showSecret ? 'visibility_off' : 'visibility'}
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Дозволені корпоративні домени */}
                  <div>
                    <span className="block text-xs font-bold text-slate-700 mb-1.5">
                      Дозволені корпоративні поштові домени
                    </span>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-100 border border-slate-300 text-xs font-bold text-slate-800">
                        <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                        @mk-translations.com
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-100 border border-slate-300 text-xs font-bold text-slate-800">
                        <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
                        @localica.io
                      </span>
                      <span className="text-xs text-slate-500 ml-1">
                        (Акаунти поза цими доменами відхиляються політикою безпеки)
                      </span>
                    </div>
                  </div>

                  {/* Enforce SSO Toggle */}
                  <div className="pt-2">
                    <label className="flex items-center gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={enforceSso}
                        onChange={(e) => setEnforceSso(e.target.checked)}
                        className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                      />
                      <span className="text-xs font-semibold text-slate-800">
                        Примусовий вхід через Entra ID SSO (блокувати локальні паролі для співробітників)
                      </span>
                    </label>
                    <p className="text-[11px] text-slate-400 ml-6 mt-0.5">
                      Вимагає наявність активного корпоративного облікового запису Microsoft 365 та проходження 2FA.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* 2. Hurma HR CRM Integration Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                    <span className="material-symbols-outlined text-[24px]">group_work</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="text-sm font-bold text-slate-900">
                        Hurma System · HR CRM &amp; ATS Інтеграція
                      </h2>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                        REST API v1 / Webhooks
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">
                      Автоматична двостороння синхронізація співробітників, оргструктури, відпусток та планів найму
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={hurmaEnabled}
                      onChange={(e) => setHurmaEnabled(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                  </label>
                  <span className="text-xs font-bold text-slate-700">
                    {hurmaEnabled ? 'Підключено' : 'Вимкнено'}
                  </span>
                </div>
              </div>

              {hurmaEnabled && (
                <div className="space-y-4 pt-1">
                  {/* Sync status & Actions banner */}
                  <div className="p-3.5 rounded-xl bg-purple-50/60 border border-purple-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <span className="material-symbols-outlined text-purple-600 text-[20px]">
                        cloud_sync
                      </span>
                      <div className="text-xs">
                        <span className="font-bold text-purple-900 block">
                          Остання успішна синхронізація: {lastSyncTime}
                        </span>
                        <span className="text-purple-700">
                          Синхронізовано 48 співробітників, 6 підрозділів, 12 активних лікарняних/відпусток.
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleTestHurma}
                        disabled={testHurmaStatus === 'testing'}
                        className="px-3 py-1 rounded-lg bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-semibold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
                      >
                        {testHurmaStatus === 'testing' ? (
                          <>
                            <span className="material-symbols-outlined text-[16px] animate-spin">refresh</span>
                            <span>Перевірка токена...</span>
                          </>
                        ) : testHurmaStatus === 'success' ? (
                          <>
                            <span className="material-symbols-outlined text-[16px] text-emerald-600">check</span>
                            <span className="text-emerald-700">API активне!</span>
                          </>
                        ) : (
                          <>
                            <span className="material-symbols-outlined text-[16px]">key</span>
                            <span>Тест токена</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={handleSyncHurmaNow}
                        disabled={isSyncingNow}
                        className="px-3 py-1 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs disabled:opacity-50 cursor-pointer"
                      >
                        <span className={`material-symbols-outlined text-[16px] ${isSyncingNow ? 'animate-spin' : ''}`}>
                          sync
                        </span>
                        <span>{isSyncingNow ? 'Синхронізація...' : 'Синхронізувати зараз'}</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1" htmlFor="hurmaSubdomainInput">
                        Домен інстансу Hurma
                      </label>
                      <div className="flex items-center">
                        <input
                          id="hurmaSubdomainInput"
                          type="text"
                          value={hurmaSubdomain}
                          onChange={(e) => setHurmaSubdomain(e.target.value)}
                          placeholder="company.hurma.work"
                          className="w-full text-xs font-mono border border-slate-300 rounded-lg p-2.5 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-purple-500"
                        />
                      </div>
                      <span className="text-[11px] text-slate-400 mt-1 block">
                        URL вашого корпоративного порталу в системі Hurma.
                      </span>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1" htmlFor="hurmaSyncInterval">
                        Регулярність фонової синхронізації
                      </label>
                      <select
                        id="hurmaSyncInterval"
                        value={hurmaSyncInterval}
                        onChange={(e) => setHurmaSyncInterval(e.target.value)}
                        className="w-full text-xs border border-slate-300 rounded-lg p-2.5 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-purple-500"
                      >
                        <option value="15m">Кожні 15 хвилин (High-Frequency)</option>
                        <option value="1h">Щогодини</option>
                        <option value="2h">Кожні 2 години (Рекомендовано)</option>
                        <option value="24h">Один раз на добу (03:00 ночі)</option>
                        <option value="manual">Лише ручний запуск</option>
                      </select>
                      <span className="text-[11px] text-slate-400 mt-1 block">
                        Автоматичне оновлення статусів у фоні без навантаження на систему.
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1" htmlFor="hurmaApiTokenInput">
                      Hurma API Secret Bearer Token
                    </label>
                    <div className="relative">
                      <input
                        id="hurmaApiTokenInput"
                        type={showHurmaToken ? 'text' : 'password'}
                        value={hurmaApiToken}
                        onChange={(e) => setHurmaApiToken(e.target.value)}
                        className="w-full text-xs font-mono border border-slate-300 rounded-lg p-2.5 pr-10 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-purple-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowHurmaToken(!showHurmaToken)}
                        className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          {showHurmaToken ? 'visibility_off' : 'visibility'}
                        </span>
                      </button>
                    </div>
                    <span className="text-[11px] text-slate-400 mt-1 block">
                      Токен генерується в розділі Hurma &gt; Налаштування &gt; Інтеграції та API.
                    </span>
                  </div>

                  {/* Модулі синхронізації */}
                  <div className="pt-2 border-t border-slate-100">
                    <span className="block text-xs font-bold text-slate-900 mb-2.5">
                      Об'єкти та модулі автоматичного обміну даними
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <label className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={syncEmployees}
                          onChange={(e) => setSyncEmployees(e.target.checked)}
                          className="mt-0.5 w-4 h-4 text-purple-600 rounded border-slate-300 focus:ring-purple-500"
                        />
                        <div>
                          <span className="text-xs font-bold text-slate-800 block">Каталог співробітників</span>
                          <span className="text-[11px] text-slate-500">
                            Автоматичне додавання, оновлення посад та деактивація при звільненні.
                          </span>
                        </div>
                      </label>

                      <label className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={syncDepartments}
                          onChange={(e) => setSyncDepartments(e.target.checked)}
                          className="mt-0.5 w-4 h-4 text-purple-600 rounded border-slate-300 focus:ring-purple-500"
                        />
                        <div>
                          <span className="text-xs font-bold text-slate-800 block">Організаційна структура</span>
                          <span className="text-[11px] text-slate-500">
                            Синхронізація відділів (LOC, SLS, MKT, HR, FIN, OPS) та керівників.
                          </span>
                        </div>
                      </label>

                      <label className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={syncLeaves}
                          onChange={(e) => setSyncLeaves(e.target.checked)}
                          className="mt-0.5 w-4 h-4 text-purple-600 rounded border-slate-300 focus:ring-purple-500"
                        />
                        <div>
                          <span className="text-xs font-bold text-slate-800 block">Відпустки, лікарняні та відсутності</span>
                          <span className="text-[11px] text-slate-500">
                            Корекція робочого фонду годин у «Щоденнику співробітника».
                          </span>
                        </div>
                      </label>

                      <label className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={syncKpiOffers}
                          onChange={(e) => setSyncKpiOffers(e.target.checked)}
                          className="mt-0.5 w-4 h-4 text-purple-600 rounded border-slate-300 focus:ring-purple-500"
                        />
                        <div>
                          <span className="text-xs font-bold text-slate-800 block">Офери та кандидати з ATS</span>
                          <span className="text-[11px] text-slate-500">
                            Автозаповнення KPI-додатків для кандидатів на етапі 'Job Offer Accepted'.
                          </span>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Webhook Endpoint for Instant events */}
                  <div className="p-3.5 rounded-xl bg-slate-100/70 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="text-[11px] font-bold text-slate-700 block">
                        Webhook URL для миттєвих подій з Hurma (Event-driven):
                      </span>
                      <code className="text-[11px] text-purple-700 font-mono">
                        https://api.mk-localica.com/v1/webhooks/hurma-events
                      </code>
                    </div>
                    <button
                      type="button"
                      onClick={copyWebhookUrl}
                      className="px-3 py-1 rounded-lg bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs font-semibold transition flex items-center gap-1 shrink-0 self-start sm:self-center cursor-pointer shadow-2xs"
                    >
                      <span className="material-symbols-outlined text-[15px]">
                        {copiedWebhook ? 'done' : 'content_copy'}
                      </span>
                      <span>{copiedWebhook ? 'Скопійовано!' : 'Копіювати URL'}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* ================= TAB 2: ЗАГАЛЬНІ РЕГЛАМЕНТИ ТА KPI ================= */
          <form onSubmit={handleSave} className="space-y-6 animate-in fade-in duration-150">
            {/* Card 1: Базові параметри холдингу */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <span className="material-symbols-outlined text-[20px]">tune</span>
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-900">Базові фінансові та системні параметри</h2>
                  <p className="text-xs text-slate-500">Глобальні константи для MK:translations та Localica</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1" htmlFor="currencySelect">
                    Основна валюта консолідації холдингу
                  </label>
                  <select
                    id="currencySelect"
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full text-xs border border-slate-300 rounded-lg p-2.5 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="EUR">EUR (€) — Євро (Основна за ТЗ)</option>
                    <option value="USD">USD ($) — Долар США</option>
                    <option value="UAH">UAH (₴) — Гривня</option>
                    <option value="PLN">PLN (zł) — Польський злотий</option>
                  </select>
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    Всі звіти CEO та фінансового аналітика конвертуються за міжбанківським курсом NBP.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1" htmlFor="timeZoneSelect">
                    Часовий пояс регламенту дедлайнів
                  </label>
                  <select
                    id="timeZoneSelect"
                    value={timeZone}
                    onChange={(e) => setTimeZone(e.target.value)}
                    className="w-full text-xs border border-slate-300 rounded-lg p-2.5 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="Europe/Warsaw">Europe/Warsaw (UTC+1 / UTC+2)</option>
                    <option value="Europe/Kyiv">Europe/Kyiv (UTC+2 / UTC+3)</option>
                  </select>
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    Дедлайни понеділка 12:00 (керівники) та 15:00 (COO) рахуються за цим поясом.
                  </span>
                </div>
              </div>
            </div>

            {/* Card 2: Бізнес-правила розрахунку KPI */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                  <span className="material-symbols-outlined text-[20px]">calculate</span>
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-900">Методологія розрахунку KPI за ТЗ</h2>
                  <p className="text-xs text-slate-500">
                    Правила обмеження екстремальних значень та критерії класифікації ризику
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1" htmlFor="capLimitInput">
                    Максимальний внесок однієї цілі (Cap Limit %)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      id="capLimitInput"
                      type="number"
                      value={capLimit}
                      onChange={(e) => setCapLimit(Number(e.target.value))}
                      min={100}
                      max={200}
                      className="w-32 text-xs border border-slate-300 rounded-lg p-2.5 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 font-bold text-slate-900"
                    />
                    <span className="text-xs font-semibold text-slate-600">% стеля</span>
                  </div>
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    За ТЗ: 150%. Запобігає викривленню інтегрального відсотка підрозділу другорядними завданнями.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1" htmlFor="riskThresholdInput">
                    Поріг зони підвищеного ризику (&lt; %)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      id="riskThresholdInput"
                      type="number"
                      value={riskThreshold}
                      onChange={(e) => setRiskThreshold(Number(e.target.value))}
                      min={70}
                      max={95}
                      className="w-32 text-xs border border-slate-300 rounded-lg p-2.5 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 font-bold text-slate-900"
                    />
                    <span className="text-xs font-semibold text-rose-600">%</span>
                  </div>
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    За ТЗ: &lt;90%. Автоматично позначає підрозділ червоним бейджем «Під ризиком» на панелі CEO.
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoLockReports}
                    onChange={(e) => setAutoLockReports(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                  />
                  <span className="text-xs font-semibold text-slate-800">
                    Автоматичне блокування редагування планів та фактів після настання дедлайну
                  </span>
                </label>
                <p className="text-[11px] text-slate-400 ml-6 mt-0.5">
                  Будь-які коригування після настання дедлайну дозволені лише через авторизований запит у Журналі аудиту.
                </p>
              </div>
            </div>

            {/* Card 3: Безпека та шифрування */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
                  <span className="material-symbols-outlined text-[20px]">security</span>
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-900">Безпека, шифрування та ролевий доступ</h2>
                  <p className="text-xs text-slate-500">Контроль сесій, двофакторна автентифікація та аудиторські логи</p>
                </div>
              </div>

              <div className="space-y-3">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={twoFactorAuth}
                    onChange={(e) => setTwoFactorAuth(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                  />
                  <span className="text-xs font-semibold text-slate-800">
                    Обов'язкова двофакторна автентифікація (2FA) для ролей CEO, COO та Бухгалтерія
                  </span>
                </label>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-emerald-600 text-[18px]">verified_user</span>
                    <span>Шифрування збережених даних: <strong className="text-slate-900">AES-256-GCM</strong></span>
                  </div>
                  <span className="text-emerald-700 font-bold text-[11px]">Сертифікат чинний</span>
                </div>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
