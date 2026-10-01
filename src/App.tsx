/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Appeal, UserRole, AppealStatus } from './types';
import { 
  getStoredAppeals, 
  saveAppeals, 
  resetAppealsToDefault, 
  generateTrackingCode 
} from './utils/storage';
import { Header } from './components/Header';
import { StudentPortal } from './components/StudentPortal';
import { AdminPortal } from './components/AdminPortal';
import { AppealDetailModal } from './components/AppealDetailModal';
import { AdminResponseModal } from './components/AdminResponseModal';
import { AdminLoginModal } from './components/AdminLoginModal';
import { QuickSearchModal } from './components/QuickSearchModal';
import { ToastContainer, ToastMessage } from './components/Toast';
import { School, ShieldCheck, GraduationCap } from 'lucide-react';

export default function App() {
  const [currentRole, setCurrentRole] = useState<UserRole>('student');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('schooldirect_45_admin_auth') === 'true';
    } catch {
      return false;
    }
  });
  const [isAdminLoginModalOpen, setIsAdminLoginModalOpen] = useState(false);

  const [appeals, setAppeals] = useState<Appeal[]>([]);
  const [selectedAppealForDetail, setSelectedAppealForDetail] = useState<Appeal | null>(null);
  const [appealForResponse, setAppealForResponse] = useState<Appeal | null>(null);
  const [isQuickSearchOpen, setIsQuickSearchOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Load appeals on start
  useEffect(() => {
    const loaded = getStoredAppeals();
    setAppeals(loaded);
  }, []);

  // Save appeals whenever updated
  const updateAndSaveAppeals = (updater: (prev: Appeal[]) => Appeal[]) => {
    setAppeals((prev) => {
      const next = updater(prev);
      saveAppeals(next);
      return next;
    });
  };

  // Toast Helper
  const showToast = (text: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, text, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const handleDismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Student: Create new appeal
  const handleCreateAppeal = (appealData: Partial<Appeal>) => {
    const trackingCode = generateTrackingCode();
    const newId = `app-45-${Date.now()}`;
    const nowIso = new Date().toISOString();

    const newAppeal: Appeal = {
      id: newId,
      trackingCode,
      studentName: appealData.studentName || 'O‘quvchi',
      studentClass: appealData.studentClass || '10-"A"',
      studentPhone: appealData.studentPhone,
      isAnonymous: appealData.isAnonymous || false,
      category: appealData.category || 'schedule',
      title: appealData.title || '',
      description: appealData.description || '',
      urgency: appealData.urgency || 'normal',
      scheduleDetails: appealData.scheduleDetails,
      teachingDetails: appealData.teachingDetails,
      status: 'pending',
      createdAt: nowIso,
      updatedAt: nowIso,
      statusHistory: [
        {
          timestamp: nowIso,
          status: 'pending',
          note: 'Ariza tizimga muvaffaqiyatli kiritildi va maktab ma’muriyatiga yo‘naltirildi.',
          actor: appealData.isAnonymous ? 'Anonim o‘quvchi' : `${appealData.studentName} (${appealData.studentClass})`
        }
      ]
    };

    updateAndSaveAppeals((prev) => [newAppeal, ...prev]);
    showToast(`Murojaat muvaffaqiyatli qabul qilindi! Kuzatuv kodi: ${trackingCode}`, 'success');
  };

  // Admin Login Flow
  const handleOpenAdminLogin = () => {
    if (isAdminAuthenticated) {
      setCurrentRole('admin');
    } else {
      setIsAdminLoginModalOpen(true);
    }
  };

  const handleAdminLoginSuccess = () => {
    setIsAdminAuthenticated(true);
    try {
      sessionStorage.setItem('schooldirect_45_admin_auth', 'true');
    } catch {
      // ignore
    }
    setIsAdminLoginModalOpen(false);
    setCurrentRole('admin');
    showToast('Xush kelibsiz! Ma’muriyat paneliga muvaffaqiyatli kirdingiz.', 'success');
  };

  const handleSwitchToStudent = () => {
    setCurrentRole('student');
  };

  const handleLogoutAdmin = () => {
    setIsAdminAuthenticated(false);
    try {
      sessionStorage.removeItem('schooldirect_45_admin_auth');
    } catch {
      // ignore
    }
    setCurrentRole('student');
    showToast('Ma’muriyat sessiyasi yakunlandi. O‘quvchi portaliga qaytildi.', 'info');
  };

  // Admin: 1-Click Status changer
  const handleQuickChangeStatus = (appealId: string, newStatus: AppealStatus) => {
    const nowIso = new Date().toISOString();
    const statusLabel = 
      newStatus === 'approved' ? 'Qabul qilindi ✅' :
      newStatus === 'rejected' ? 'Rad etildi ❌' : 'Ko‘rib chiqilmoqda ⏳';

    updateAndSaveAppeals((prev) =>
      prev.map((item) => {
        if (item.id === appealId) {
          const updatedHistory = [
            ...(item.statusHistory || []),
            {
              timestamp: nowIso,
              status: newStatus,
              note: `Holat tezkorlik bilan o‘zgartirildi: ${statusLabel}`,
              actor: 'Maktab Ma’muriyati'
            }
          ];
          return {
            ...item,
            status: newStatus,
            updatedAt: nowIso,
            statusHistory: updatedHistory
          };
        }
        return item;
      })
    );

    showToast(`Ariza holati o‘zgartirildi: ${statusLabel}`, 'success');
  };

  // Admin: Submit Detailed Resolution / Official Response
  const handleSubmitAdminResponse = (
    appealId: string,
    newStatus: AppealStatus,
    responderTitle: string,
    responderName: string,
    comment: string,
    decisionNote?: string
  ) => {
    const nowIso = new Date().toISOString();

    updateAndSaveAppeals((prev) =>
      prev.map((item) => {
        if (item.id === appealId) {
          const updatedHistory = [
            ...(item.statusHistory || []),
            {
              timestamp: nowIso,
              status: newStatus,
              note: `${responderTitle} (${responderName}) rasmiy qaror chiqardi: "${comment.slice(0, 70)}..."`,
              actor: `${responderTitle} (${responderName})`
            }
          ];

          return {
            ...item,
            status: newStatus,
            updatedAt: nowIso,
            adminResponse: {
              answeredAt: nowIso,
              responderTitle,
              responderName,
              comment,
              decisionNote
            },
            statusHistory: updatedHistory
          };
        }
        return item;
      })
    );

    showToast('Rasmiy xulosa va ma’muriyat javobi muvaffaqiyatli saqlandi!', 'success');
  };

  // Admin: Delete Appeal
  const handleDeleteAppeal = (appealId: string) => {
    updateAndSaveAppeals((prev) => prev.filter((a) => a.id !== appealId));
  };

  // Admin: Reset to default mock data
  const handleResetDefaults = () => {
    const restored = resetAppealsToDefault();
    setAppeals(restored);
  };

  const pendingCount = appeals.filter((a) => a.status === 'pending').length;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900">
      
      {/* Top Header */}
      <Header
        currentRole={currentRole}
        isAdminAuthenticated={isAdminAuthenticated}
        onOpenAdminLogin={handleOpenAdminLogin}
        onSwitchToStudent={handleSwitchToStudent}
        onLogoutAdmin={handleLogoutAdmin}
        pendingCount={pendingCount}
        onOpenQuickSearch={() => setIsQuickSearchOpen(true)}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {currentRole === 'student' ? (
          <StudentPortal
            appeals={appeals}
            onSubmitAppeal={handleCreateAppeal}
            onSelectAppeal={(appeal) => setSelectedAppealForDetail(appeal)}
            onNotify={showToast}
          />
        ) : (
          <AdminPortal
            appeals={appeals}
            onOpenResponseModal={(appeal) => setAppealForResponse(appeal)}
            onSelectAppeal={(appeal) => setSelectedAppealForDetail(appeal)}
            onQuickChangeStatus={handleQuickChangeStatus}
            onDeleteAppeal={handleDeleteAppeal}
            onResetDefaults={handleResetDefaults}
            onNotify={showToast}
            onSwitchToStudent={handleSwitchToStudent}
          />
        )}

      </main>

      {/* Modals */}
      <AdminLoginModal
        isOpen={isAdminLoginModalOpen}
        onClose={() => setIsAdminLoginModalOpen(false)}
        onSuccess={handleAdminLoginSuccess}
      />

      <AppealDetailModal
        appeal={selectedAppealForDetail}
        onClose={() => setSelectedAppealForDetail(null)}
        onOpenResponseModal={(appeal) => setAppealForResponse(appeal)}
        isAdmin={currentRole === 'admin'}
      />

      <AdminResponseModal
        appeal={appealForResponse}
        isOpen={!!appealForResponse}
        onClose={() => setAppealForResponse(null)}
        onSubmitResponse={handleSubmitAdminResponse}
      />

      <QuickSearchModal
        isOpen={isQuickSearchOpen}
        onClose={() => setIsQuickSearchOpen(false)}
        appeals={appeals}
        onSelectAppeal={(appeal) => setSelectedAppealForDetail(appeal)}
      />

      {/* Toast Notifications */}
      <ToastContainer
        toasts={toasts}
        onDismiss={handleDismissToast}
      />

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200/80 bg-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <School className="w-4 h-4 text-blue-700" />
            <span className="font-semibold text-slate-700">45-sonli umumta'lim maktabi</span>
            <span>·</span>
            <span>Direktor: Xodoyqulova Ximiraxon Chinpolatovna</span>
          </div>

          <div className="flex items-center gap-4">
            {currentRole === 'student' ? (
              <button
                onClick={handleOpenAdminLogin}
                className="text-blue-700 hover:underline font-medium flex items-center gap-1"
              >
                <span>🏛️ Ma’muriyat paneli (Parol orqali)</span>
              </button>
            ) : (
              <button
                onClick={handleSwitchToStudent}
                className="text-blue-700 hover:underline font-medium flex items-center gap-1"
              >
                <span>🎓 O‘quvchi portaliga o‘tish</span>
              </button>
            )}
            <span>·</span>
            <span className="font-mono text-slate-400">Ish vaqti: Dush-Shanba 08:00 - 17:00</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
