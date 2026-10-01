import React from 'react';
import { AppealStatus, AppealCategory, UrgencyLevel } from '../types';
import { Clock, CheckCircle2, XCircle, Calendar, BookOpen, Lightbulb, Users, AlertTriangle } from 'lucide-react';

export const StatusBadge: React.FC<{ status: AppealStatus; size?: 'sm' | 'md' }> = ({ status, size = 'md' }) => {
  const isSm = size === 'sm';
  const baseClasses = isSm
    ? 'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium'
    : 'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold';

  switch (status) {
    case 'pending':
      return (
        <span className={`${baseClasses} bg-amber-50 text-amber-800 border border-amber-200/80`}>
          <Clock className={isSm ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
          <span>Ko‘rib chiqilmoqda ⏳</span>
        </span>
      );
    case 'approved':
      return (
        <span className={`${baseClasses} bg-emerald-50 text-emerald-800 border border-emerald-200/80`}>
          <CheckCircle2 className={isSm ? 'w-3 h-3 text-emerald-600' : 'w-3.5 h-3.5 text-emerald-600'} />
          <span>Qabul qilindi ✅</span>
        </span>
      );
    case 'rejected':
      return (
        <span className={`${baseClasses} bg-rose-50 text-rose-800 border border-rose-200/80`}>
          <XCircle className={isSm ? 'w-3 h-3 text-rose-600' : 'w-3.5 h-3.5 text-rose-600'} />
          <span>Rad etildi ❌</span>
        </span>
      );
    default:
      return null;
  }
};

export const CategoryBadge: React.FC<{ category: AppealCategory }> = ({ category }) => {
  switch (category) {
    case 'schedule':
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-100 px-2.5 py-0.5 rounded-md">
          <Calendar className="w-3 h-3 text-blue-600" />
          <span>Dars jadvalini o‘zgartirish</span>
        </span>
      );
    case 'teaching':
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-purple-700 bg-purple-50 border border-purple-100 px-2.5 py-0.5 rounded-md">
          <BookOpen className="w-3 h-3 text-purple-600" />
          <span>Dars jarayoni & O‘qituvchi</span>
        </span>
      );
    case 'general':
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-100 px-2.5 py-0.5 rounded-md">
          <Lightbulb className="w-3 h-3 text-emerald-600" />
          <span>Maktab takliflari & Sharoit</span>
        </span>
      );
    case 'club':
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-indigo-700 bg-indigo-50 border border-indigo-100 px-2.5 py-0.5 rounded-md">
          <Users className="w-3 h-3 text-indigo-600" />
          <span>To‘garaklar & Mashg‘ulotlar</span>
        </span>
      );
    default:
      return null;
  }
};

export const UrgencyBadge: React.FC<{ urgency: UrgencyLevel }> = ({ urgency }) => {
  if (urgency === 'urgent') {
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded">
        <AlertTriangle className="w-3 h-3 text-red-600" />
        Shoshilinch
      </span>
    );
  }
  if (urgency === 'important') {
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
        Muhim
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-[11px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
      Oddiy
    </span>
  );
};
