import React, { useState } from 'react';
import { Appeal, AppealCategory, AppealStatus, UrgencyLevel } from '../types';
import { StatusBadge, CategoryBadge, UrgencyBadge } from './Badges';
import { StatusPieChart } from './StatusPieChart';
import { formatUzbekDate, exportAppealsToCSV } from '../utils/storage';
import { 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Calendar, 
  BookOpen, 
  Lightbulb, 
  Search, 
  Download, 
  RotateCcw, 
  Trash2, 
  MessageSquare, 
  ExternalLink, 
  Filter, 
  ChevronRight,
  TrendingUp,
  User,
  GraduationCap
} from 'lucide-react';

interface AdminPortalProps {
  appeals: Appeal[];
  onOpenResponseModal: (appeal: Appeal) => void;
  onSelectAppeal: (appeal: Appeal) => void;
  onQuickChangeStatus: (appealId: string, status: AppealStatus) => void;
  onDeleteAppeal: (appealId: string) => void;
  onResetDefaults: () => void;
  onNotify: (message: string, type: 'success' | 'info' | 'error') => void;
  onSwitchToStudent?: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  appeals,
  onOpenResponseModal,
  onSelectAppeal,
  onQuickChangeStatus,
  onDeleteAppeal,
  onResetDefaults,
  onNotify,
  onSwitchToStudent
}) => {
  const [statusFilter, setStatusFilter] = useState<'all' | AppealStatus>('all');
  const [categoryFilter, setCategoryFilter] = useState<'all' | AppealCategory>('all');
  const [gradeFilter, setGradeFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'urgency'>('newest');

  // Compute statistics
  const total = appeals.length;
  const pending = appeals.filter(a => a.status === 'pending').length;
  const approved = appeals.filter(a => a.status === 'approved').length;
  const rejected = appeals.filter(a => a.status === 'rejected').length;
  const scheduleCount = appeals.filter(a => a.category === 'schedule').length;
  const teachingCount = appeals.filter(a => a.category === 'teaching').length;
  const generalCount = appeals.filter(a => a.category === 'general' || a.category === 'club').length;

  // Filtered list
  const filteredAppeals = appeals.filter(a => {
    if (statusFilter !== 'all' && a.status !== statusFilter) return false;
    if (categoryFilter !== 'all' && a.category !== categoryFilter) return false;
    if (gradeFilter !== 'all' && !a.studentClass.includes(gradeFilter)) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchCode = a.trackingCode.toLowerCase().includes(q);
      const matchTitle = a.title.toLowerCase().includes(q);
      const matchName = a.studentName.toLowerCase().includes(q);
      const matchClass = a.studentClass.toLowerCase().includes(q);
      const matchSubject = a.scheduleDetails?.subject.toLowerCase().includes(q) ||
                           a.teachingDetails?.subject.toLowerCase().includes(q);

      if (!matchCode && !matchTitle && !matchName && !matchClass && !matchSubject) {
        return false;
      }
    }
    return true;
  }).sort((a, b) => {
    if (sortBy === 'newest') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    if (sortBy === 'oldest') {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    }
    if (sortBy === 'urgency') {
      const rank = { urgent: 3, important: 2, normal: 1 };
      return rank[b.urgency] - rank[a.urgency];
    }
    return 0;
  });

  const handleExport = () => {
    exportAppealsToCSV(appeals);
    onNotify('Arizalar jadvali CSV fayl ko‘rinishida yuklab olindi.', 'success');
  };

  const handleConfirmReset = () => {
    if (window.confirm('Haqiqatan ham barcha ma’lumotlarni dastlabki namunaviy holatga qaytarmoqchimisiz?')) {
      onResetDefaults();
      onNotify('Namunaviy arizalar bazasi qayta tiklandi.', 'info');
    }
  };

  const handleDelete = (id: string, code: string) => {
    if (window.confirm(`Arizani (${code}) o‘chirib tashlashni tasdiqlaysizmi?`)) {
      onDeleteAppeal(id);
      onNotify(`Ariza ${code} muvaffaqiyatli o‘chirildi.`, 'info');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner / Director Header */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-7 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-blue-950 border border-blue-700/60 text-xs font-semibold text-blue-300 mb-2">
            <ShieldCheck className="w-4 h-4 text-blue-400" />
            <span>Maktab Rahbariyati & O‘quv Bo‘limi Konsoli</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            Kelib tushgan arizalar va murojaatlar nazorati
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            45-sonli umumta'lim maktabi o‘quvchilarining dars jadvali, dars jarayoni va takliflarini ko‘rib chiqish, rasmiy xulosa berish hamda ijrosini nazorat qilish paneli.
          </p>
          <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-blue-800/50 border border-blue-600/40 text-xs text-blue-100">
            <span className="font-semibold text-blue-200">Maktab Direktori:</span>
            <span className="font-bold text-white">Xodoyqulova Ximiraxon Chinpolatovna</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {onSwitchToStudent && (
            <button
              onClick={onSwitchToStudent}
              className="px-3.5 py-2 bg-blue-700 hover:bg-blue-600 text-white rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-sm"
              title="O‘quvchi portaliga qaytish"
            >
              <GraduationCap className="w-4 h-4" />
              <span>O‘quvchi paneli</span>
            </button>
          )}

          <button
            onClick={handleExport}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5"
            title="Hisobotni CSV formatida yuklab olish"
          >
            <Download className="w-4 h-4" />
            <span>Eksport (CSV)</span>
          </button>

          <button
            onClick={handleConfirmReset}
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-xl text-xs font-medium transition-colors flex items-center gap-1.5"
            title="Baza namunalarini tiklash"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Bazani tiklash</span>
          </button>
        </div>
      </div>

      {/* Main Statistics Grid (3. Talab: Asosiy statistika ko'rsatkichlari) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        
        {/* Total Appeals */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Jami arizalar
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
              {total}
            </span>
            <span className="text-xs text-slate-500">ta murojaat</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 flex items-center gap-1.5">
            <span>Dars jadvali: <strong className="text-slate-700 font-mono">{scheduleCount}</strong></span>
            <span>·</span>
            <span>Metodika: <strong className="text-slate-700 font-mono">{teachingCount}</strong></span>
          </div>
        </div>

        {/* Pending Requests */}
        <div className="bg-white rounded-2xl border border-amber-200/80 bg-amber-50/20 p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
              Ko‘rib chiqilmoqda ⏳
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-amber-900 font-mono tabular-nums">
              {pending}
            </span>
            <span className="text-xs text-amber-700">kutilayotgan</span>
          </div>
          <div className="mt-2 text-[11px] text-amber-700">
            {pending > 0 ? 'Zudlik bilan xulosa talab etiladi' : 'Barcha arizalar ko‘rib chiqilgan'}
          </div>
        </div>

        {/* Approved Requests */}
        <div className="bg-white rounded-2xl border border-emerald-200/80 bg-emerald-50/20 p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
              Qabul qilindi ✅
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-emerald-900 font-mono tabular-nums">
              {approved}
            </span>
            <span className="text-xs text-emerald-700">bajarilgan</span>
          </div>
          <div className="mt-2 text-[11px] text-emerald-700 font-mono">
            {total > 0 ? Math.round((approved / total) * 100) : 0}% ijobiy yechim
          </div>
        </div>

        {/* Rejected Requests */}
        <div className="bg-white rounded-2xl border border-rose-200/80 bg-rose-50/20 p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-800">
              Rad etildi ❌
            </span>
            <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center">
              <XCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-rose-900 font-mono tabular-nums">
              {rejected}
            </span>
            <span className="text-xs text-rose-700">asosli rad</span>
          </div>
          <div className="mt-2 text-[11px] text-rose-700 font-mono">
            {total > 0 ? Math.round((rejected / total) * 100) : 0}% rad etilgan
          </div>
        </div>

      </div>

      {/* Visual Pie Chart for Application Statuses */}
      <StatusPieChart
        pendingCount={pending}
        approvedCount={approved}
        rejectedCount={rejected}
        totalCount={total}
        scheduleCount={scheduleCount}
        teachingCount={teachingCount}
        generalCount={generalCount}
        activeStatusFilter={statusFilter}
        onSelectStatusFilter={(status) => setStatusFilter(status)}
      />

      {/* Control Panel: Filters, Class Selector & Search */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-xs space-y-4">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          
          {/* Status Tabs */}
          <div className="flex items-center p-1 bg-slate-100 rounded-xl overflow-x-auto">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                statusFilter === 'all'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Barchasi ({total})
            </button>
            <button
              onClick={() => setStatusFilter('pending')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                statusFilter === 'pending'
                  ? 'bg-white text-amber-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Ko‘rib chiqilmoqda ⏳ ({pending})
            </button>
            <button
              onClick={() => setStatusFilter('approved')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                statusFilter === 'approved'
                  ? 'bg-white text-emerald-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Qabul qilingan ✅ ({approved})
            </button>
            <button
              onClick={() => setStatusFilter('rejected')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                statusFilter === 'rejected'
                  ? 'bg-white text-rose-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Rad etilgan ❌ ({rejected})
            </button>
          </div>

          {/* Live Search input */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Ism, sinf, fan yoki kod bo‘yicha..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
            />
          </div>

        </div>

        {/* Secondary Filters row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs">
          
          <div className="flex flex-wrap items-center gap-2">
            {/* Category filter */}
            <div className="flex items-center gap-1.5 text-slate-600">
              <span className="font-medium">Mavzu:</span>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value as any)}
                className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="all">Barcha toifalar</option>
                <option value="schedule">Dars jadvalini o‘zgartirish</option>
                <option value="teaching">Dars jarayoni & O‘qituvchi</option>
                <option value="general">Maktab takliflari & Sharoit</option>
              </select>
            </div>

            {/* Class filter */}
            <div className="flex items-center gap-1.5 text-slate-600">
              <span className="font-medium">Sinf:</span>
              <select
                value={gradeFilter}
                onChange={(e) => setGradeFilter(e.target.value)}
                className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="all">Barcha sinflar</option>
                <option value="11">11-sinflar</option>
                <option value="10">10-sinflar</option>
                <option value="9">9-sinflar</option>
                <option value="8">8-sinflar</option>
                <option value="7">7-sinflar</option>
              </select>
            </div>
          </div>

          {/* Sort order */}
          <div className="flex items-center gap-1.5 text-slate-600">
            <span className="font-medium">Tartiblash:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="newest">Yangi kelganlar oldin</option>
              <option value="oldest">Avvalgi arizalar</option>
              <option value="urgency">Muhimlik darajasi bo‘yicha</option>
            </select>
          </div>

        </div>

      </div>

      {/* Applications List */}
      {filteredAppeals.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <Clock className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-700">Hech qanday ariza topilmadi</h3>
          <p className="text-xs text-slate-500 mt-1">
            Qidiruv so‘rovi yoki filtrlarni o‘zgartirib ko‘ring.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAppeals.map((appeal) => (
            <div
              key={appeal.id}
              className={`bg-white rounded-2xl border p-5 sm:p-6 shadow-xs transition-all ${
                appeal.status === 'pending'
                  ? 'border-amber-200/90 ring-1 ring-amber-100 hover:border-amber-300'
                  : 'border-slate-200/80 hover:border-blue-200'
              }`}
            >
              {/* Card Header */}
              <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="font-mono font-bold text-xs bg-slate-100 text-slate-900 px-2 py-0.5 rounded border border-slate-200">
                      {appeal.trackingCode}
                    </span>
                    <span className="font-bold text-xs text-blue-900 bg-blue-50 px-2 py-0.5 rounded">
                      {appeal.studentClass}
                    </span>
                    <span className="text-xs font-semibold text-slate-800">
                      {appeal.isAnonymous ? 'Anonim o‘quvchi' : appeal.studentName}
                    </span>
                    {appeal.studentPhone && !appeal.isAnonymous && (
                      <span className="text-xs text-slate-400 font-mono">
                        ({appeal.studentPhone})
                      </span>
                    )}
                    <span className="text-slate-300">·</span>
                    <span className="text-xs text-slate-400 font-mono">
                      {formatUzbekDate(appeal.createdAt)}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 mt-1">
                    {appeal.title}
                  </h3>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <UrgencyBadge urgency={appeal.urgency} />
                  <CategoryBadge category={appeal.category} />
                  <StatusBadge status={appeal.status} />
                </div>
              </div>

              {/* Description Body */}
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed mb-4 whitespace-pre-line bg-slate-50/60 p-3 rounded-xl border border-slate-100">
                {appeal.description}
              </p>

              {/* Schedule Context Box if present */}
              {appeal.scheduleDetails && (
                <div className="mb-4 p-3.5 bg-blue-50/60 border border-blue-200/70 rounded-xl text-xs">
                  <div className="font-bold text-blue-950 flex items-center gap-1.5 mb-2">
                    <Calendar className="w-3.5 h-3.5 text-blue-700" />
                    <span>Dars jadvalini o‘zgartirish taklifi:</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <div className="bg-white p-2 rounded-lg border border-blue-100">
                      <span className="text-slate-400 block text-[10px]">Fan:</span>
                      <strong className="text-slate-900">{appeal.scheduleDetails.subject}</strong>
                    </div>
                    <div className="bg-white p-2 rounded-lg border border-blue-100">
                      <span className="text-slate-400 block text-[10px]">Kun:</span>
                      <strong className="text-slate-900">{appeal.scheduleDetails.dayOfWeek}</strong>
                    </div>
                    <div className="bg-white p-2 rounded-lg border border-blue-100">
                      <span className="text-slate-400 block text-[10px]">Hozirgi soat:</span>
                      <strong className="text-rose-700">{appeal.scheduleDetails.currentSlot}</strong>
                    </div>
                    <div className="bg-white p-2 rounded-lg border border-blue-100">
                      <span className="text-slate-400 block text-[10px]">Taklif soat:</span>
                      <strong className="text-emerald-700">{appeal.scheduleDetails.proposedSlot}</strong>
                    </div>
                  </div>
                  {appeal.scheduleDetails.reason && (
                    <p className="mt-2 text-[11px] text-slate-600">
                      <strong>Sabab: </strong> {appeal.scheduleDetails.reason}
                    </p>
                  )}
                </div>
              )}

              {/* Teaching Context Box if present */}
              {appeal.teachingDetails && (
                <div className="mb-4 p-3.5 bg-purple-50/60 border border-purple-200/70 rounded-xl text-xs">
                  <div className="font-bold text-purple-950 flex items-center gap-1.5 mb-2">
                    <BookOpen className="w-3.5 h-3.5 text-purple-700" />
                    <span>Dars jarayoni va o‘qituvchi taklifi:</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="bg-white px-2.5 py-1 rounded-lg border border-purple-100 text-slate-800">
                      Fan: <strong>{appeal.teachingDetails.subject}</strong>
                    </span>
                    {appeal.teachingDetails.teacherName && (
                      <span className="bg-white px-2.5 py-1 rounded-lg border border-purple-100 text-slate-800">
                        O‘qituvchi: <strong>{appeal.teachingDetails.teacherName}</strong>
                      </span>
                    )}
                    <span className="bg-purple-100/70 text-purple-900 px-2.5 py-1 rounded-lg font-medium">
                      {appeal.teachingDetails.suggestionArea}
                    </span>
                  </div>
                </div>
              )}

              {/* Current Resolution / Ma'muriyat javobi (if already recorded) */}
              {appeal.adminResponse && (
                <div className="mb-4 p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-800">
                      Ma'muriyat xulosasi ({appeal.adminResponse.responderTitle} — {appeal.adminResponse.responderName}):
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {formatUzbekDate(appeal.adminResponse.answeredAt)}
                    </span>
                  </div>
                  <p className="text-slate-700 mt-1 leading-relaxed">
                    "{appeal.adminResponse.comment}"
                  </p>
                </div>
              )}

              {/* Action Toolbar: One-click status buttons & Official resolution modal opener */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
                
                {/* 1-Click Quick Status Changer (3. Talab: "bir tugma bilan o‘zgartirish") */}
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-semibold text-slate-400 mr-1 hidden sm:inline">
                    Tezkor holat:
                  </span>

                  <button
                    type="button"
                    onClick={() => onQuickChangeStatus(appeal.id, 'approved')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 ${
                      appeal.status === 'approved'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
                    }`}
                    title="Qabul qilish"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Qabul qilish</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onQuickChangeStatus(appeal.id, 'pending')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 ${
                      appeal.status === 'pending'
                        ? 'bg-amber-600 text-white'
                        : 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200'
                    }`}
                    title="Ko‘rib chiqishga qaytarish"
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>O‘rganilmoqda</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onQuickChangeStatus(appeal.id, 'rejected')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 ${
                      appeal.status === 'rejected'
                        ? 'bg-rose-600 text-white'
                        : 'bg-rose-50 text-rose-800 hover:bg-rose-100 border border-rose-200'
                    }`}
                    title="Rad etish"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Rad etish</span>
                  </button>
                </div>

                {/* Response / Resolution Modal button & Details */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onOpenResponseModal(appeal)}
                    className="px-3.5 py-1.5 bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>{appeal.adminResponse ? 'Javobni tahrirlash' : 'Javob yozish'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onSelectAppeal(appeal)}
                    className="p-1.5 text-slate-600 hover:text-blue-700 hover:bg-slate-100 rounded-lg transition-colors"
                    title="Rasmiy blankani ko‘rish / Chop etish"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(appeal.id, appeal.trackingCode)}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Arizani o‘chirish"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};
