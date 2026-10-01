import React from 'react';
import { Appeal } from '../types';
import { StatusBadge, CategoryBadge, UrgencyBadge } from './Badges';
import { formatUzbekDate } from '../utils/storage';
import { 
  X, 
  Printer, 
  School, 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  ShieldCheck,
  ArrowRight,
  BookOpen
} from 'lucide-react';

interface AppealDetailModalProps {
  appeal: Appeal | null;
  onClose: () => void;
  onOpenResponseModal?: (appeal: Appeal) => void;
  isAdmin?: boolean;
}

export const AppealDetailModal: React.FC<AppealDetailModalProps> = ({
  appeal,
  onClose,
  onOpenResponseModal,
  isAdmin = false
}) => {
  if (!appeal) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 print:p-0 print:bg-white">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] print:max-h-none print:shadow-none print:border-none">
        
        {/* Top bar (hidden in print) */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-slate-100 bg-slate-50/70 print:hidden shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 font-mono">
              ARIZA TAFSILOTI
            </span>
            <span className="font-mono text-xs font-semibold px-2 py-0.5 bg-blue-100 text-blue-800 rounded">
              {appeal.trackingCode}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Chop etish</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 print:p-2">
          
          {/* Official Letterhead */}
          <div className="border-b-2 border-slate-900 pb-4 text-center">
            <div className="flex justify-center mb-2">
              <div className="w-12 h-12 rounded-xl bg-blue-900 text-white flex items-center justify-center">
                <School className="w-7 h-7" />
              </div>
            </div>
            <p className="text-[11px] font-semibold tracking-wider text-slate-600 uppercase">
              O‘zbekiston Respublikasi Maktabgacha va Maktab Ta’limi Vazirligi
            </p>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 mt-0.5">
              45-SONLI UMUMTA'LIM MAKTABI
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              SchoolDirect: O‘quvchi murojaatlari va so‘rovlar qaydnomasi
            </p>
          </div>

          {/* Key Meta Table */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200/80 text-xs">
            <div>
              <span className="text-slate-500 block">Ariza raqami:</span>
              <span className="font-mono font-bold text-slate-900">{appeal.trackingCode}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Keltirilgan sana:</span>
              <span className="font-medium text-slate-800">{formatUzbekDate(appeal.createdAt)}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Murojaatchi:</span>
              <span className="font-semibold text-slate-900">
                {appeal.isAnonymous ? 'Anonim (Maxfiy)' : appeal.studentName}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block">Sinfi:</span>
              <span className="font-bold text-blue-700">{appeal.studentClass}</span>
            </div>
          </div>

          {/* Status & Badges Strip */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-white border border-slate-200 rounded-xl">
            <div className="flex flex-wrap items-center gap-2">
              <CategoryBadge category={appeal.category} />
              <UrgencyBadge urgency={appeal.urgency} />
            </div>
            <div>
              <StatusBadge status={appeal.status} />
            </div>
          </div>

          {/* Title and Description */}
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-2">
              {appeal.title}
            </h3>
            <div className="p-4 bg-slate-50/70 border border-slate-200 rounded-xl text-sm text-slate-800 leading-relaxed whitespace-pre-line">
              {appeal.description}
            </div>
          </div>

          {/* Specific Schedule Context if present */}
          {appeal.scheduleDetails && (
            <div className="p-4 bg-blue-50/50 border border-blue-200/80 rounded-xl">
              <h4 className="text-xs font-bold uppercase tracking-wider text-blue-900 mb-3 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-blue-700" />
                Dars jadvalini o‘zgartirish tafsilotlari
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-2.5 bg-white rounded-lg border border-blue-100">
                  <span className="text-slate-500 block">Fan nomi:</span>
                  <span className="font-semibold text-slate-900">{appeal.scheduleDetails.subject}</span>
                </div>
                <div className="p-2.5 bg-white rounded-lg border border-blue-100">
                  <span className="text-slate-500 block">Hafta kuni:</span>
                  <span className="font-semibold text-slate-900">{appeal.scheduleDetails.dayOfWeek}</span>
                </div>
                <div className="p-2.5 bg-white rounded-lg border border-blue-100">
                  <span className="text-slate-500 block">Hozirgi vaqt / soat:</span>
                  <span className="font-semibold text-rose-700">{appeal.scheduleDetails.currentSlot}</span>
                </div>
                <div className="p-2.5 bg-white rounded-lg border border-blue-100">
                  <span className="text-slate-500 block">Taklif etilayotgan soat:</span>
                  <span className="font-semibold text-emerald-700">{appeal.scheduleDetails.proposedSlot}</span>
                </div>
              </div>
              {appeal.scheduleDetails.reason && (
                <div className="mt-2 text-xs text-slate-600 bg-white p-2.5 rounded-lg border border-blue-100">
                  <span className="font-semibold text-slate-700">Ko‘chirish sababi: </span>
                  {appeal.scheduleDetails.reason}
                </div>
              )}
            </div>
          )}

          {/* Specific Teaching Context if present */}
          {appeal.teachingDetails && (
            <div className="p-4 bg-purple-50/50 border border-purple-200/80 rounded-xl">
              <h4 className="text-xs font-bold uppercase tracking-wider text-purple-900 mb-3 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-purple-700" />
                Dars jarayoni va metodikasi taklifi
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-2.5 bg-white rounded-lg border border-purple-100">
                  <span className="text-slate-500 block">Fan:</span>
                  <span className="font-semibold text-slate-900">{appeal.teachingDetails.subject}</span>
                </div>
                <div className="p-2.5 bg-white rounded-lg border border-purple-100">
                  <span className="text-slate-500 block">O‘qituvchi:</span>
                  <span className="font-semibold text-slate-900">{appeal.teachingDetails.teacherName || 'Belgilanmagan'}</span>
                </div>
              </div>
              <div className="mt-2 text-xs text-purple-900 bg-white p-2.5 rounded-lg border border-purple-100">
                <span className="font-semibold text-slate-700">Taklif yo‘nalishi: </span>
                {appeal.teachingDetails.suggestionArea}
              </div>
            </div>
          )}

          {/* Official Administrative Resolution */}
          <div className="border-t border-slate-200 pt-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-blue-800" />
              Maktab Ma'muriyati Xulosasi va Rezolyutsiyasi
            </h4>

            {appeal.adminResponse ? (
              <div className="p-5 rounded-xl border bg-gradient-to-br from-slate-50 to-blue-50/30 border-blue-200/80 relative overflow-hidden">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div>
                    <span className="text-xs font-bold text-blue-950 uppercase tracking-wide">
                      {appeal.adminResponse.responderTitle}
                    </span>
                    <p className="text-sm font-semibold text-slate-900">
                      {appeal.adminResponse.responderName}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] text-slate-500 block">Javob berilgan vaqt:</span>
                    <span className="text-xs font-medium text-slate-800">
                      {formatUzbekDate(appeal.adminResponse.answeredAt)}
                    </span>
                  </div>
                </div>

                <p className="text-sm text-slate-800 mt-3 leading-relaxed bg-white/80 p-3 rounded-lg border border-slate-200/60">
                  {appeal.adminResponse.comment}
                </p>

                {appeal.adminResponse.decisionNote && (
                  <div className="mt-2 text-xs font-medium text-blue-800">
                    Qaror xulosasi: {appeal.adminResponse.decisionNote}
                  </div>
                )}

                {/* Decorative School Seal Stamp */}
                <div className="mt-4 pt-3 border-t border-blue-200/60 flex items-center justify-between">
                  <div className="text-[11px] text-slate-500">
                    Elektron raqamli tasdiq: 45-MAKTAB/REG-{appeal.trackingCode}
                  </div>
                  <div className="text-xs font-mono font-bold text-blue-800 border border-blue-300 rounded px-2 py-0.5 bg-blue-50 uppercase tracking-widest">
                    TASDIQLANDI
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6 rounded-xl border border-dashed border-amber-300 bg-amber-50/50 text-center">
                <Clock className="w-8 h-8 text-amber-600 mx-auto mb-2" />
                <p className="text-sm font-semibold text-amber-900">
                  Ushbu ariza hozirda ma'muriyat tomonidan o‘rganilmoqda
                </p>
                <p className="text-xs text-amber-700 mt-1 max-w-md mx-auto">
                  Maktab rahbariyati yoki tegishli o‘quv bo‘limi arizani ko‘rib chiqqach, rasmiy xulosa shu yerda aks etadi.
                </p>
              </div>
            )}
          </div>

          {/* Audit trail / Tarix */}
          {appeal.statusHistory && appeal.statusHistory.length > 0 && (
            <div className="border-t border-slate-100 pt-4">
              <span className="text-xs font-semibold text-slate-500 block mb-2">
                Harakatlar tarixi:
              </span>
              <div className="space-y-2">
                {appeal.statusHistory.map((h, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0" />
                    <div>
                      <span className="font-medium text-slate-800">{h.actor}:</span> {h.note}
                      <span className="text-slate-400 ml-2 font-mono">{formatUzbekDate(h.timestamp)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Footer actions */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-3 shrink-0 print:hidden">
          <div className="text-xs text-slate-500">
            45-sonli umumta'lim maktabi rasmiy portali
          </div>
          <div className="flex items-center gap-2">
            {isAdmin && onOpenResponseModal && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenResponseModal(appeal);
                }}
                className="px-4 py-2 text-xs font-semibold bg-blue-700 hover:bg-blue-800 text-white rounded-lg transition-colors flex items-center gap-1.5"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Qaror chiqarish / Javob yozish</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors"
            >
              Yopish
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
