import React, { useState, useEffect } from 'react';
import { Appeal, AppealStatus } from '../types';
import { 
  X, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Sparkles, 
  Send, 
  ShieldCheck, 
  UserCheck 
} from 'lucide-react';

interface AdminResponseModalProps {
  appeal: Appeal | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmitResponse: (
    appealId: string,
    newStatus: AppealStatus,
    responderTitle: string,
    responderName: string,
    comment: string,
    decisionNote?: string
  ) => void;
}

const TEMPLATES = [
  {
    label: 'Jadval tasdiqlandi',
    status: 'approved' as AppealStatus,
    title: 'O‘quv ishlari bo‘yicha direktor o‘rinbosari',
    comment: 'Taklif ma’qullandi. Dars jadvaliga dushanba kunidan boshlab rasmiy o‘zgartirish kiritiladi va sinf rahbari hamda fan o‘qituvchisiga yetkaziladi.',
    note: 'Dars jadvaliga o‘zgartirish kiritildi'
  },
  {
    label: 'O‘qituvchi bilan kelishildi',
    status: 'approved' as AppealStatus,
    title: 'Maktab Direktori',
    comment: 'Fan o‘qituvchisi bilan o‘quv bo‘limida suhbat o‘tkazildi. Dars jarayoniga ko‘proq amaliy misollar, interaktiv metodlar va test tahlillari kiritilishi yo‘lga qo‘yildi.',
    note: 'Metodik ko‘rsatma berildi'
  },
  {
    label: 'Sharoit yaxshilanadi',
    status: 'approved' as AppealStatus,
    title: 'Maktab Direktori',
    comment: 'Foydali taklif uchun minnatdorchilik bildiramiz. So‘rov moddiy-texnik ta’minot bo‘limiga topshirildi va yaqin kunlarda ijobiy hal qilinadi.',
    note: 'Ijroga qaratildi'
  },
  {
    label: 'Bandlik sababli rad',
    status: 'rejected' as AppealStatus,
    title: 'O‘quv ishlari bo‘yicha direktor o‘rinbosari',
    comment: 'Taklifingiz o‘rganib chiqildi. Biroq so‘ralgan soatda tegishli xona/sport zali boshqa sinflar bilan band bo‘lgani va sanitariya me’yorlari talabi tufayli vaqtni ko‘chirishning imkoni yo‘q.',
    note: 'Xona bandligi tufayli rad etildi'
  },
  {
    label: 'Dasturga mos emas (rad)',
    status: 'rejected' as AppealStatus,
    title: 'Maktab Direktori',
    comment: 'Ushbu taklif O‘zbekiston Respublikasi umumta’lim maktablari o‘quv rejasi va dars soatlari standartlariga muvofiq kelmaganligi sababli qanoatlantirilmadi.',
    note: 'O‘quv rejasiga zid'
  },
  {
    label: 'O‘rganilmoqda',
    status: 'pending' as AppealStatus,
    title: 'O‘quv bo‘limi',
    comment: 'Ariza qabul qilingan va pedagogik kengashda muhokama qilish uchun o‘rganish jarayoniga olingan. Natijasi tez orada e’lon qilinadi.',
    note: 'Muhokamada'
  }
];

export const AdminResponseModal: React.FC<AdminResponseModalProps> = ({
  appeal,
  isOpen,
  onClose,
  onSubmitResponse
}) => {
  if (!isOpen || !appeal) return null;

  const [selectedStatus, setSelectedStatus] = useState<AppealStatus>(appeal.status);
  const [responderTitle, setResponderTitle] = useState(
    appeal.adminResponse?.responderTitle || 'Maktab Direktori'
  );
  const [responderName, setResponderName] = useState(
    appeal.adminResponse?.responderName || 'Xodoyqulova Ximiraxon Chinpolatovna'
  );
  const [comment, setComment] = useState(appeal.adminResponse?.comment || '');
  const [decisionNote, setDecisionNote] = useState(appeal.adminResponse?.decisionNote || '');
  const [error, setError] = useState('');

  // Sync state when appeal changes
  useEffect(() => {
    if (appeal) {
      setSelectedStatus(appeal.status === 'pending' ? 'approved' : appeal.status);
      setResponderTitle(appeal.adminResponse?.responderTitle || 'Maktab Direktori');
      setResponderName(appeal.adminResponse?.responderName || 'Xodoyqulova Ximiraxon Chinpolatovna');
      setComment(appeal.adminResponse?.comment || '');
      setDecisionNote(appeal.adminResponse?.decisionNote || '');
      setError('');
    }
  }, [appeal]);

  const applyTemplate = (tpl: typeof TEMPLATES[number]) => {
    setSelectedStatus(tpl.status);
    setResponderTitle(tpl.title);
    setComment(tpl.comment);
    setDecisionNote(tpl.note);
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      setError('Iltimos, ma’muriyatning rasmiy xulosasi / javob matnini kiriting.');
      return;
    }
    if (!responderName.trim()) {
      setError('Mas’ul shaxs ism-sharifini kiriting.');
      return;
    }

    onSubmitResponse(
      appeal.id,
      selectedStatus,
      responderTitle,
      responderName,
      comment.trim(),
      decisionNote.trim() || undefined
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-900 text-white flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Ma'muriyat qarori va javob yozish
              </h3>
              <p className="text-xs text-slate-500 font-mono">
                {appeal.trackingCode} — {appeal.studentName} ({appeal.studentClass})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5">
          
          {/* Summary of Appeal */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 text-xs">
            <span className="text-slate-500 block">Ariza sarlavhasi:</span>
            <p className="font-semibold text-slate-900 mt-0.5 line-clamp-2">
              {appeal.title}
            </p>
          </div>

          {/* Status Selection Buttons */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Ariza bo‘yicha qaror (Holatni o‘zgartirish)
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setSelectedStatus('approved')}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-semibold transition-all ${
                  selectedStatus === 'approved'
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-900 ring-2 ring-emerald-200'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <CheckCircle2 className={`w-5 h-5 mb-1 ${selectedStatus === 'approved' ? 'text-emerald-600' : 'text-slate-400'}`} />
                <span>Qabul qilindi</span>
                <span className="text-[10px] text-emerald-700 font-normal">Ijobiy xulosa</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedStatus('pending')}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-semibold transition-all ${
                  selectedStatus === 'pending'
                    ? 'bg-amber-50 border-amber-500 text-amber-900 ring-2 ring-amber-200'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Clock className={`w-5 h-5 mb-1 ${selectedStatus === 'pending' ? 'text-amber-600' : 'text-slate-400'}`} />
                <span>O‘rganilmoqda</span>
                <span className="text-[10px] text-amber-700 font-normal">Kutilmoqda</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedStatus('rejected')}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-semibold transition-all ${
                  selectedStatus === 'rejected'
                    ? 'bg-rose-50 border-rose-500 text-rose-900 ring-2 ring-rose-200'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <XCircle className={`w-5 h-5 mb-1 ${selectedStatus === 'rejected' ? 'text-rose-600' : 'text-slate-400'}`} />
                <span>Rad etildi</span>
                <span className="text-[10px] text-rose-700 font-normal">Asosli rad</span>
              </button>
            </div>
          </div>

          {/* Quick Template Selector */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>Tezkor tayyor shablonlar:</span>
              </label>
              <span className="text-[11px] text-slate-400">1-bosishda to‘ldirish</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {TEMPLATES.map((t, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => applyTemplate(t)}
                  className="px-2.5 py-1 text-xs bg-slate-100 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 border border-slate-200 rounded-lg transition-colors text-slate-700"
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Official Responder details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Mas'ul xodim lavozimi
              </label>
              <select
                value={responderTitle}
                onChange={(e) => setResponderTitle(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
              >
                <option value="Maktab Direktori">Maktab Direktori</option>
                <option value="O‘quv ishlari bo‘yicha direktor o‘rinbosari">O‘quv ishlari bo‘yicha direktor o‘rinbosari</option>
                <option value="Ma'naviyat va ma'rifat ishlari bo‘yicha o‘rinbosar">Ma'naviyat va ma'rifat ishlari bo‘yicha o‘rinbosar</option>
                <option value="Xo‘jalik ishlari bo‘yicha mudir">Xo‘jalik ishlari bo‘yicha mudir</option>
                <option value="Psixolog / Metodist">Psixolog / Metodist</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Mas'ul xodim F.I.O
              </label>
              <input
                type="text"
                value={responderName}
                onChange={(e) => setResponderName(e.target.value)}
                placeholder="Xodoyqulova Ximiraxon Chinpolatovna"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
                required
              />
            </div>
          </div>

          {/* Official Comment / Explanation */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Rasmiy javob va xulosa matni <span className="text-red-500">*</span>
            </label>
            <p className="text-[11px] text-slate-500 mb-2">
              Ushbu javob o‘quvchining arizasida rasmiy ma'muriyat muhrlangan xulosasi sifatida ko‘rinadi.
            </p>
            <textarea
              rows={4}
              value={comment}
              onChange={(e) => {
                setComment(e.target.value);
                if (error) setError('');
              }}
              placeholder="Arizaga maktab rahbariyati nomidan batafsil va asosli javob yozing..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white leading-relaxed"
            />
          </div>

          {/* Decision Summary Note */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Qisqacha qaror mezoni (ixtiyoriy)
            </label>
            <input
              type="text"
              value={decisionNote}
              onChange={(e) => setDecisionNote(e.target.value)}
              placeholder="Masalan: Dars jadvaliga o‘zgartirish kiritildi"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700">
              {error}
            </div>
          )}

          {/* Submit and Cancel buttons */}
          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-slate-100 rounded-xl transition-colors"
            >
              Bekor qilish
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-xl transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Javobni saqlash va yuborish</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
