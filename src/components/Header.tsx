import React, { useState } from 'react';
import { ScreenMeta } from '../types';
import { Search, Bell, Calendar, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface HeaderProps {
  currentScreenMeta: ScreenMeta;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onQuickNavigate?: (screenId: any) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentScreenMeta,
  searchQuery,
  onSearchChange,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header
      id="top-header"
      className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0 sticky top-0 z-30 shadow-xs"
    >
      {/* Breadcrumb & Title */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
          <span className="hover:text-slate-800 transition cursor-default">MK Group CRM</span>
          <span>/</span>
          <span className="text-amber-600 font-semibold">{currentScreenMeta.navLabel}</span>
        </div>
        <div className="h-4 w-px bg-slate-200" />
        <span className="hidden md:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Синхронізація: Активна
        </span>
      </div>

      {/* Right controls: Search, Date, Notifications, User */}
      <div className="flex items-center gap-4">
        {/* Global Search */}
        <div className="relative w-64 hidden sm:block">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            id="global-crm-search"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Пошук у системі..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition"
          />
        </div>

        {/* Date stamp */}
        <div className="hidden lg:flex items-center gap-1.5 text-xs text-slate-500 font-medium bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-200">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span>8 березня 2025 (Пт)</span>
        </div>

        {/* Notifications button */}
        <div className="relative">
          <button
            id="notifications-button"
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition"
            title="Сповіщення системи"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-500 ring-2 ring-white" />
          </button>

          {showNotifications && (
            <div
              id="notifications-popover"
              className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-100"
            >
              <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-900">Системні сповіщення</span>
                <span className="text-[10px] text-amber-600 font-medium">3 нові</span>
              </div>
              <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto">
                <div className="p-3 hover:bg-slate-50 transition cursor-pointer">
                  <div className="text-xs font-medium text-slate-800">Затверджено офер OFFER-2025-089</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Бухгалтерія верифікувала KPI для Богдана Лисенка</div>
                  <div className="text-[10px] text-slate-400 mt-1">10 хв тому • Бухгалтерія</div>
                </div>
                <div className="p-3 hover:bg-slate-50 transition cursor-pointer">
                  <div className="text-xs font-medium text-slate-800">Операційний інцидент вирішено</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Вузол сортування Львів-Захід повернуто до 100% SLA</div>
                  <div className="text-[10px] text-slate-400 mt-1">42 хв тому • COO</div>
                </div>
                <div className="p-3 hover:bg-slate-50 transition cursor-pointer">
                  <div className="text-xs font-medium text-slate-800">Фінансовий звіт за лютий зведений</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Консолідована виручка досягла ₴4.82 млрд</div>
                  <div className="text-[10px] text-slate-400 mt-1">2 год тому • CFO</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
