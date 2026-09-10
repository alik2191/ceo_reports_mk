import React, { useState, useEffect } from 'react';
import { ScreenId } from './types';
import { SCREENS_CONFIG } from './data/mockData';
import { Sidebar } from './components/Sidebar';
import { CeoDashboardScreen } from './components/screens/CeoDashboardScreen';
import { CooOperationsScreen } from './components/screens/CooOperationsScreen';
import { CompanyStructureScreen } from './components/screens/CompanyStructureScreen';
import { CorporateCatalogScreen } from './components/screens/CorporateCatalogScreen';
import { SettingsScreen } from './components/screens/SettingsScreen';
import { KpiOfferScreen } from './components/screens/KpiOfferScreen';
import { FinancialAnalystScreen } from './components/screens/FinancialAnalystScreen';
import { AuditLogScreen } from './components/screens/AuditLogScreen';
import { GoalsPlanningScreen } from './components/screens/GoalsPlanningScreen';
import { DepartmentReportsScreen } from './components/screens/DepartmentReportsScreen';
import { EmployeeDiaryScreen } from './components/screens/EmployeeDiaryScreen';

export default function App() {
  // Screen 1 is Initial Screen: Панель CEO — MK Group (CRM Dashboard)
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('ceo');

  // Sync hash routing
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '') as ScreenId;
      const validScreen = SCREENS_CONFIG.find((s) => s.id === hash);
      if (validScreen) {
        setCurrentScreen(validScreen.id);
      }
    };

    if (window.location.hash) {
      handleHashChange();
    }

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleNavigate = (screenId: ScreenId) => {
    setCurrentScreen(screenId);
    window.location.hash = screenId;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentMeta =
    SCREENS_CONFIG.find((s) => s.id === currentScreen) || SCREENS_CONFIG[0];

  // Update document title to reflect current screen
  useEffect(() => {
    document.title = currentMeta.fullName;
  }, [currentMeta]);

  return (
    <div id="app-root" className="min-h-screen bg-slate-100 flex font-sans text-slate-900 antialiased">
      {/* Permanent Sidebar (Guarantees //nav//a is always present and clickable) */}
      <div className="flex shrink-0">
        <Sidebar currentScreen={currentScreen} onNavigate={handleNavigate} />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        {/* Dynamic Screen View */}
        <main
          id="main-screen-container"
          className="flex-1 flex flex-col min-w-0"
        >
          {currentScreen === 'ceo' && <CeoDashboardScreen onNavigate={handleNavigate} />}
          {currentScreen === 'coo' && <CooOperationsScreen onNavigate={handleNavigate} />}
          {currentScreen === 'structure' && <CompanyStructureScreen onNavigate={handleNavigate} />}
          {currentScreen === 'catalog' && <CorporateCatalogScreen onNavigate={handleNavigate} />}
          {currentScreen === 'settings' && <SettingsScreen onNavigate={handleNavigate} />}
          {currentScreen === 'kpi_offer' && <KpiOfferScreen onNavigate={handleNavigate} />}
          {currentScreen === 'finance' && <FinancialAnalystScreen onNavigate={handleNavigate} />}
          {currentScreen === 'audit' && <AuditLogScreen onNavigate={handleNavigate} />}
          {currentScreen === 'goals' && <GoalsPlanningScreen onNavigate={handleNavigate} />}
          {currentScreen === 'reports' && <DepartmentReportsScreen onNavigate={handleNavigate} />}
          {currentScreen === 'diary' && <EmployeeDiaryScreen onNavigate={handleNavigate} />}
        </main>
      </div>
    </div>
  );
}
