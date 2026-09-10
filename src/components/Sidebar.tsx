import React, { useState } from 'react';
import { ScreenId } from '../types';
import { SCREENS_CONFIG } from '../data/mockData';

interface SidebarProps {
  currentScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
  selectedScope?: string;
  onScopeChange?: (scope: string) => void;
  currentRole?: string;
  onRoleChange?: (role: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentScreen,
  onNavigate,
  currentRole = 'CEO',
  onRoleChange,
}) => {
  const [showRoleModal, setShowRoleModal] = useState(false);

  const mainItems = SCREENS_CONFIG.filter((s) => s.category === 'main');
  const analyticsItems = SCREENS_CONFIG.filter((s) => s.category === 'analytics');
  const orgItems = SCREENS_CONFIG.filter((s) => s.category === 'org');

  const roles = [
    { code: 'CEO', name: 'О. Ковальчук', title: 'Генеральний директор (CEO)' },
    { code: 'COO', name: 'К. Марченко', title: 'Операційний директор (COO)' },
    { code: 'LOC', name: 'Олена Ковальчук', title: 'Керівник відділу (LOC Lead)' },
    { code: 'CFO', name: 'Т. Бондар', title: 'Головний бухгалтер (CFO)' },
    { code: 'HRD', name: 'М. Семенюк', title: 'HR Директор' },
  ];

  return (
    <>
      <aside
        id="sidebar-container"
        className="w-64 min-w-[16rem] max-w-[16rem] bg-slate-900 border-r border-slate-800 text-slate-300 flex flex-col justify-between shrink-0 select-none shadow-2xl z-50 h-screen"
      >
        {/* Top Branding & Profile & Scope */}
        <div className="flex flex-col">
          {/* Brand Logo Header */}
          <div className="h-16 px-5 border-b border-slate-800/80 flex items-center justify-between bg-slate-950/60">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20 text-white font-bold text-lg ring-1 ring-white/20">
                M
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-white text-[15px] tracking-tight flex items-center gap-1.5 leading-none">
                  MK GROUP
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 font-semibold uppercase tracking-wider">
                    CPM
                  </span>
                </span>
                <span className="text-[11px] text-slate-400 font-medium truncate mt-1">
                  MK:translations · Localica
                </span>
              </div>
            </div>
          </div>

          {/* User Role Card */}
          <div className="p-3.5 mx-3 mt-3.5 rounded-xl bg-slate-800/70 border border-slate-700/60 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="relative shrink-0">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-blue-400 flex items-center justify-center text-white font-bold shadow-md ring-2 ring-blue-500/30 text-sm">
                  ОК
                </div>
                <span
                  className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-slate-900 rounded-full"
                  title="Онлайн"
                ></span>
              </div>
              <div className="flex flex-col min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white truncate leading-snug">
                    {roles.find((r) => r.code === currentRole)?.name || 'О. Ковальчук'}
                  </span>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 ring-1 ring-blue-500/30">
                    {currentRole}
                  </span>
                </div>
                <div className="flex items-center gap-1 mt-0.5 text-[11px] text-slate-400 font-normal">
                  <span className="material-symbols-outlined text-[13px] text-slate-400">
                    schedule
                  </span>
                  <span>Warsaw · 14:48</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Navigation Scroll Area */}
        <nav
          id="main-navigation"
          aria-label="Головне меню CRM"
          className="flex-1 overflow-y-auto px-3 py-3 space-y-4 text-xs font-medium mt-1 sidebar-scroll"
        >
          {/* Group 1: ОСНОВНЕ */}
          <div>
            <div className="px-2 pb-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Основне
            </div>
            <div className="space-y-1">
              {mainItems.map((item) => {
                const isActive = currentScreen === item.id;
                return (
                  <a
                    key={item.id}
                    id={`nav-link-${item.id}`}
                    href={`#${item.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      onNavigate(item.id);
                    }}
                    className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg transition-all ${
                      isActive
                        ? 'bg-blue-600 text-white font-semibold shadow-md shadow-blue-600/30'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    <span
                      className={`material-symbols-outlined text-[18px] shrink-0 ${
                        isActive ? 'text-white' : 'text-slate-400'
                      }`}
                    >
                      {item.icon}
                    </span>
                    <span className="truncate">{item.navLabel}</span>
                    {isActive && (
                      <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white animate-pulse shrink-0"></span>
                    )}
                  </a>
                );
              })}
            </div>
          </div>

          {/* Group 2: АНАЛІТИКА ТА ФІНАНСИ */}
          <div>
            <div className="px-2 pb-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Аналітика та Фінанси
            </div>
            <div className="space-y-1">
              {analyticsItems.map((item) => {
                const isActive = currentScreen === item.id;
                return (
                  <a
                    key={item.id}
                    id={`nav-link-${item.id}`}
                    href={`#${item.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      onNavigate(item.id);
                    }}
                    className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg transition-all ${
                      isActive
                        ? 'bg-blue-600 text-white font-semibold shadow-md shadow-blue-600/30'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    <span
                      className={`material-symbols-outlined text-[18px] shrink-0 ${
                        isActive ? 'text-white' : 'text-slate-400'
                      }`}
                    >
                      {item.icon}
                    </span>
                    <span className="truncate">{item.navLabel}</span>
                    {item.badge && !isActive && (
                      <span className="ml-auto text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-700/80 text-emerald-400 shrink-0">
                        {item.badge}
                      </span>
                    )}
                    {isActive && (
                      <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white animate-pulse shrink-0"></span>
                    )}
                  </a>
                );
              })}
            </div>
          </div>

          {/* Group 3: ОРГАНІЗАЦІЯ */}
          <div>
            <div className="px-2 pb-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Організація
            </div>
            <div className="space-y-1">
              {orgItems.map((item) => {
                const isActive = currentScreen === item.id;
                return (
                  <a
                    key={item.id}
                    id={`nav-link-${item.id}`}
                    href={`#${item.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      onNavigate(item.id);
                    }}
                    className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg transition-all ${
                      isActive
                        ? 'bg-blue-600 text-white font-semibold shadow-md shadow-blue-600/30'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    <span
                      className={`material-symbols-outlined text-[18px] shrink-0 ${
                        isActive ? 'text-white' : 'text-slate-400'
                      }`}
                    >
                      {item.icon}
                    </span>
                    <span className="truncate">{item.navLabel}</span>
                    {isActive && (
                      <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white animate-pulse shrink-0"></span>
                    )}
                  </a>
                );
              })}
            </div>
          </div>
        </nav>

        {/* Sidebar Bottom: Sandbox Emulator & Quick Actions */}
        <div className="p-3 border-t border-slate-800/90 bg-slate-950/40 space-y-2">
          <div className="bg-slate-800/60 p-2 rounded-lg border border-slate-700/50 flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0"></span>
              <div className="flex flex-col truncate">
                <span className="text-[11px] font-semibold text-slate-200 leading-tight truncate">
                  Sandbox режим
                </span>
                <span className="text-[10px] text-slate-400 truncate">
                  Емуляція: {currentRole}
                </span>
              </div>
            </div>
            <button
              onClick={() => setShowRoleModal(true)}
              className="px-2 py-1 text-[11px] font-medium bg-slate-700 hover:bg-slate-600 text-slate-200 rounded transition-colors"
              title="Змінити тестову персону"
              type="button"
            >
              Роль
            </button>
          </div>
          <div className="flex items-center justify-between px-1 text-[11px] text-slate-400">
            <a
              className="hover:text-slate-200 flex items-center gap-1 transition-colors"
              href="#help"
              onClick={(e) => {
                e.preventDefault();
                alert('Регламентна документація MK Group CPM v2.4 (ТЗ розділи 1–14).');
              }}
            >
              <span className="material-symbols-outlined text-[14px]">help</span> Довідка
            </a>
            <a
              className="hover:text-rose-400 flex items-center gap-1 transition-colors"
              href="#exit"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('ceo');
              }}
            >
              <span className="material-symbols-outlined text-[14px]">logout</span> Вихід
            </a>
          </div>
        </div>
      </aside>

      {/* Role Emulation Modal */}
      {showRoleModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 w-full max-w-sm text-slate-100 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                <h3 className="text-sm font-bold text-white">Sandbox: Перемикання ролі</h3>
              </div>
              <button
                onClick={() => setShowRoleModal(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
            <p className="text-xs text-slate-400 mb-3">
              Виберіть робочу персону для емуляції доступу та перегляду відповідних екранів:
            </p>
            <div className="space-y-2">
              {roles.map((r) => (
                <button
                  key={r.code}
                  onClick={() => {
                    onRoleChange(r.code);
                    setShowRoleModal(false);
                  }}
                  className={`w-full text-left p-2.5 rounded-xl border transition flex items-center justify-between text-xs ${
                    currentRole === r.code
                      ? 'bg-blue-600/20 border-blue-500 text-white font-semibold'
                      : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div>
                    <span className="font-bold text-white block">{r.name}</span>
                    <span className="text-[11px] text-slate-400">{r.title}</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-700 text-blue-300">
                    {r.code}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
