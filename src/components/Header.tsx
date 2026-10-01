import React from 'react';
import { UserRole } from '../types';
import { GraduationCap, ShieldCheck, Search, School, Lock, LogOut, ArrowRight } from 'lucide-react';

interface HeaderProps {
  currentRole: UserRole;
  isAdminAuthenticated: boolean;
  onOpenAdminLogin: () => void;
  onSwitchToStudent: () => void;
  onLogoutAdmin: () => void;
  pendingCount: number;
  onOpenQuickSearch: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  isAdminAuthenticated,
  onOpenAdminLogin,
  onSwitchToStudent,
  onLogoutAdmin,
  pendingCount,
  onOpenQuickSearch
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-3">
          
          {/* Brand Zone */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-blue-700 to-indigo-800 flex items-center justify-center text-white shadow-sm ring-2 ring-blue-100 shrink-0">
              <School className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg sm:text-xl font-bold tracking-tight text-slate-900">
                  SchoolDirect
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-50 text-blue-800 border border-blue-200/60 font-mono">
                  45-MAKTAB
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium hidden xs:block">
                45-sonli umumta'lim maktabi murojaat portali
              </p>
            </div>
          </div>

          {/* Quick Actions & Role Navigation */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Quick Tracking Search button */}
            <button
              onClick={onOpenQuickSearch}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200/80 rounded-xl transition-colors border border-slate-200/60"
              title="Ariza kodi orqali tekshirish"
            >
              <Search className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden md:inline">Kodni tekshirish</span>
            </button>

            {/* Separated Entrance Buttons */}
            {currentRole === 'student' ? (
              <div className="flex items-center gap-2">
                <div className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-50 text-blue-800 border border-blue-200 text-xs font-semibold">
                  <GraduationCap className="w-4 h-4 text-blue-600" />
                  <span>O‘quvchi paneli</span>
                </div>

                {/* Password-protected Admin login trigger button */}
                <button
                  type="button"
                  onClick={onOpenAdminLogin}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-xs"
                >
                  <Lock className="w-3.5 h-3.5 text-blue-300" />
                  <span>Ma'muriyat paneli</span>
                  {pendingCount > 0 && (
                    <span className="inline-flex items-center justify-center px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-amber-500 text-white font-mono ml-0.5">
                      {pendingCount}
                    </span>
                  )}
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <div className="hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-900 text-white text-xs font-semibold shadow-xs">
                  <ShieldCheck className="w-4 h-4 text-blue-300" />
                  <span>Ma'muriyat: Xodoyqulova X. Ch.</span>
                </div>

                {/* Button to go back to Student Portal freely */}
                <button
                  type="button"
                  onClick={onSwitchToStudent}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 rounded-xl text-xs sm:text-sm font-semibold transition-all"
                >
                  <GraduationCap className="w-4 h-4 text-blue-600" />
                  <span>O‘quvchi paneliga o‘tish</span>
                </button>

                {/* Logout button */}
                <button
                  type="button"
                  onClick={onLogoutAdmin}
                  className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 border border-slate-200 rounded-xl transition-colors"
                  title="Ma'muriyat tizimidan chiqish"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}

          </div>

        </div>
      </div>
    </header>
  );
};
