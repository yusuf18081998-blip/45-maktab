import React, { useState, useEffect } from 'react';
import { Appeal, AppealCategory, UrgencyLevel, AppealStatus } from '../types';
import { StatusBadge, CategoryBadge, UrgencyBadge } from './Badges';
import { formatUzbekDate, getStoredStudentProfile, saveStudentProfile } from '../utils/storage';
import { 
  Send, 
  Calendar, 
  BookOpen, 
  Lightbulb, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Copy, 
  Search, 
  PlusCircle, 
  FileText,
  User,
  GraduationCap,
  Sparkles,
  ArrowRight,
  Eye
} from 'lucide-react';

interface StudentPortalProps {
  appeals: Appeal[];
  onSubmitAppeal: (appealData: Partial<Appeal>) => void;
  onSelectAppeal: (appeal: Appeal) => void;
  onNotify: (message: string, type: 'success' | 'info' | 'error') => void;
}

const COMMON_CLASSES = [
  '11-"A"', '11-"B"',
  '10-"A"', '10-"B"',
  '9-"A"', '9-"B"',
  '8-"A"', '8-"B"',
  '7-"A"', '7-"B"',
  '6-"A"', '6-"B"',
  '5-"A"', '5-"B"'
];

export const StudentPortal: React.FC<StudentPortalProps> = ({
  appeals,
  onSubmitAppeal,
  onSelectAppeal,
  onNotify
}) => {
  const [activeTab, setActiveTab] = useState<'form' | 'my-appeals'>('form');

  // Form State
  const initialProfile = getStoredStudentProfile();
  const [studentName, setStudentName] = useState(initialProfile.name || '');
  const [studentClass, setStudentClass] = useState(initialProfile.grade || '10-"A"');
  const [studentPhone, setStudentPhone] = useState(initialProfile.phone || '');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [category, setCategory] = useState<AppealCategory>('schedule');
  const [urgency, setUrgency] = useState<UrgencyLevel>('normal');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  // Schedule specific fields
  const [scheduleSubject, setScheduleSubject] = useState('');
  const [scheduleDay, setScheduleDay] = useState('Dushanba');
  const [scheduleCurrentSlot, setScheduleCurrentSlot] = useState('1-soat (08:30)');
  const [scheduleProposedSlot, setScheduleProposedSlot] = useState('3-soat (10:10)');
  const [scheduleReason, setScheduleReason] = useState('');

  // Teaching specific fields
  const [teachingSubject, setTeachingSubject] = useState('');
  const [teachingTeacherName, setTeachingTeacherName] = useState('');
  const [teachingSuggestionArea, setTeachingSuggestionArea] = useState('Amaliy mashg‘ulotlar va test tahlillari');

  // Success state after submission
  const [submittedCode, setSubmittedCode] = useState<string | null>(null);

  // Filter state for My Appeals tab
  const [statusFilter, setStatusFilter] = useState<'all' | AppealStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Save profile to localStorage on change
  useEffect(() => {
    if (studentName) {
      saveStudentProfile({
        name: studentName,
        grade: studentClass,
        phone: studentPhone
      });
    }
  }, [studentName, studentClass, studentPhone]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAnonymous && !studentName.trim()) {
      onNotify('Iltimos, ism-familiyangizni kiriting.', 'error');
      return;
    }

    if (!title.trim() || !description.trim()) {
      onNotify('Iltimos, murojaat mavzusi va matnini to‘liq to‘ldiring.', 'error');
      return;
    }

    if (category === 'schedule' && !scheduleSubject.trim()) {
      onNotify('Iltimos, dars jadvalini o‘zgartirish uchun fan nomini kiriting.', 'error');
      return;
    }

    if (category === 'teaching' && !teachingSubject.trim()) {
      onNotify('Iltimos, taklif kiritilayotgan fanni belgilang.', 'error');
      return;
    }

    const payload: Partial<Appeal> = {
      studentName: isAnonymous ? 'Anonim o‘quvchi' : studentName.trim(),
      studentClass,
      studentPhone: isAnonymous ? undefined : studentPhone.trim() || undefined,
      isAnonymous,
      category,
      urgency,
      title: title.trim(),
      description: description.trim(),
      scheduleDetails: category === 'schedule' ? {
        subject: scheduleSubject.trim(),
        dayOfWeek: scheduleDay,
        currentSlot: scheduleCurrentSlot,
        proposedSlot: scheduleProposedSlot,
        reason: scheduleReason.trim()
      } : undefined,
      teachingDetails: category === 'teaching' ? {
        subject: teachingSubject.trim(),
        teacherName: teachingTeacherName.trim() || undefined,
        suggestionArea: teachingSuggestionArea
      } : undefined
    };

    onSubmitAppeal(payload);

    // reset fields
    setTitle('');
    setDescription('');
    setScheduleSubject('');
    setScheduleReason('');
    setTeachingSubject('');
    setTeachingTeacherName('');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    onNotify(`Kod nusxalandi: ${text}`, 'success');
  };

  // Filter student appeals:
  // Shows either user's submitted ones or all for demonstration
  const filteredAppeals = appeals.filter(a => {
    if (statusFilter !== 'all' && a.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = a.title.toLowerCase().includes(q);
      const matchCode = a.trackingCode.toLowerCase().includes(q);
      const matchDesc = a.description.toLowerCase().includes(q);
      const matchStudent = a.studentName.toLowerCase().includes(q);
      if (!matchTitle && !matchCode && !matchDesc && !matchStudent) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Hero Welcome Banner */}
      <div className="relative rounded-2xl bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white p-6 sm:p-8 shadow-sm overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-700/60 border border-blue-500/40 text-xs font-semibold text-blue-100 mb-3">
            <GraduationCap className="w-4 h-4 text-blue-200" />
            <span>45-sonli umumta'lim maktabi</span>
          </div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-white">
            Maktab Murojaat va So‘rovlar Tizimi
          </h1>
          <p className="mt-2 text-sm text-blue-100 leading-relaxed max-w-2xl">
            Dars jadvalini surish, o‘qituvchi dars jarayoni yoki maktab sharoitini yaxshilash bo‘yicha takliflaringizni to‘g‘ridan-to‘g‘ri maktab rahbariyatiga yuboring va arizangiz holatini onlayn kuzatib boring.
          </p>
        </div>

        {/* Decorative background shape */}
        <div className="absolute -right-12 -bottom-12 w-64 h-64 rounded-full bg-blue-600/20 blur-2xl pointer-events-none" />
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveTab('form')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
            activeTab === 'form'
              ? 'bg-blue-700 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <PlusCircle className="w-4 h-4" />
          <span>Yangi murojaat yuborish</span>
        </button>

        <button
          onClick={() => setActiveTab('my-appeals')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
            activeTab === 'my-appeals'
              ? 'bg-blue-700 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Arizalar va Status kuzatuvi</span>
          <span className="font-mono text-xs px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 font-bold">
            {appeals.length}
          </span>
        </button>
      </div>

      {/* TAB 1: FORM */}
      {activeTab === 'form' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 sm:p-8">
          
          <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
            
            {/* Step 1: Student Information */}
            <div>
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                <User className="w-4 h-4 text-blue-700" />
                <span>1. O‘quvchi ma'lumotlari</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Full Name */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Ism va familiyangiz {!isAnonymous && <span className="text-red-500">*</span>}
                  </label>
                  <input
                    type="text"
                    disabled={isAnonymous}
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    placeholder={isAnonymous ? "Anonim yuborilmoqda" : "Masalan: Sardor Aliyev"}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white disabled:opacity-50 disabled:bg-slate-100"
                    required={!isAnonymous}
                  />
                </div>

                {/* Class / Sinf */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Sinfingiz <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={studentClass}
                    onChange={(e) => setStudentClass(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
                  >
                    {COMMON_CLASSES.map((cls) => (
                      <option key={cls} value={cls}>
                        {cls}-sinf
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Anonymous Checkbox and Phone */}
              <div className="mt-3 flex flex-wrap items-center justify-between gap-3 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-600 font-medium select-none">
                  <input
                    type="checkbox"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                  />
                  <span>Anonim tarzda yuborish (Shaxsingiz sir saqlanadi)</span>
                </label>

                {!isAnonymous && (
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span>Telefon (ixtiyoriy):</span>
                    <input
                      type="tel"
                      value={studentPhone}
                      onChange={(e) => setStudentPhone(e.target.value)}
                      placeholder="+998 90 123 45 67"
                      className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                )}
              </div>
            </div>

            <hr className="border-slate-100" />

            {/* Step 2: Category Selection */}
            <div>
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-700" />
                <span>2. Murojaat yoki so‘rov turi</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                
                {/* a) Dars jadvali */}
                <button
                  type="button"
                  onClick={() => setCategory('schedule')}
                  className={`text-left p-4 rounded-xl border transition-all flex flex-col justify-between ${
                    category === 'schedule'
                      ? 'bg-blue-50/70 border-blue-500 ring-2 ring-blue-200 text-blue-950'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div>
                    <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center mb-2">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <h3 className="font-bold text-xs sm:text-sm">
                      Dars jadvalini o‘zgartirish
                    </h3>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Dars soatini surish, boshqa kunga yoki soatga almashtirish iltimosi
                    </p>
                  </div>
                  <span className="text-[10px] font-bold text-blue-700 mt-3 block">
                    {category === 'schedule' ? '● Tanlangan' : 'Tanlash'}
                  </span>
                </button>

                {/* b) O‘qituvchi dars jarayoni */}
                <button
                  type="button"
                  onClick={() => setCategory('teaching')}
                  className={`text-left p-4 rounded-xl border transition-all flex flex-col justify-between ${
                    category === 'teaching'
                      ? 'bg-purple-50/70 border-purple-500 ring-2 ring-purple-200 text-purple-950'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div>
                    <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center mb-2">
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <h3 className="font-bold text-xs sm:text-sm">
                      Dars jarayoni & Metodika
                    </h3>
                    <p className="text-[11px] text-slate-500 mt-1">
                      O‘qituvchi dars o‘tishi, tushuntirishi yoki amaliyot bo‘yicha taklif
                    </p>
                  </div>
                  <span className="text-[10px] font-bold text-purple-700 mt-3 block">
                    {category === 'teaching' ? '● Tanlangan' : 'Tanlash'}
                  </span>
                </button>

                {/* c) Boshqa takliflar */}
                <button
                  type="button"
                  onClick={() => setCategory('general')}
                  className={`text-left p-4 rounded-xl border transition-all flex flex-col justify-between ${
                    category === 'general'
                      ? 'bg-emerald-50/70 border-emerald-500 ring-2 ring-emerald-200 text-emerald-950'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div>
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center mb-2">
                      <Lightbulb className="w-4 h-4" />
                    </div>
                    <h3 className="font-bold text-xs sm:text-sm">
                      Muhim maktab takliflari
                    </h3>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Kutubxona, sport zali, to‘garaklar yoki sharoit bo‘yicha takliflar
                    </p>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 mt-3 block">
                    {category === 'general' ? '● Tanlangan' : 'Tanlash'}
                  </span>
                </button>

              </div>
            </div>

            {/* Dynamic Context Fields: Schedule */}
            {category === 'schedule' && (
              <div className="p-4 sm:p-5 bg-blue-50/60 border border-blue-200 rounded-2xl space-y-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-700" />
                  <h3 className="text-xs font-bold text-blue-900 uppercase tracking-wide">
                    Dars jadvali so‘rovi tafsilotlari
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Qaysi fan? <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={scheduleSubject}
                      onChange={(e) => setScheduleSubject(e.target.value)}
                      placeholder="Masalan: Kimyo, Fizika, Geometriya"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Haftaning qaysi kuni?
                    </label>
                    <select
                      value={scheduleDay}
                      onChange={(e) => setScheduleDay(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                    >
                      <option value="Dushanba">Dushanba</option>
                      <option value="Seshanba">Seshanba</option>
                      <option value="Chorshanba">Chorshanba</option>
                      <option value="Payshanba">Payshanba</option>
                      <option value="Juma">Juma</option>
                      <option value="Shanba">Shanba</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Hozirgi dars soati
                    </label>
                    <select
                      value={scheduleCurrentSlot}
                      onChange={(e) => setScheduleCurrentSlot(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                    >
                      <option value="1-soat (08:30)">1-soat (08:30)</option>
                      <option value="2-soat (09:20)">2-soat (09:20)</option>
                      <option value="3-soat (10:10)">3-soat (10:10)</option>
                      <option value="4-soat (11:00)">4-soat (11:00)</option>
                      <option value="5-soat (12:00)">5-soat (12:00)</option>
                      <option value="6-soat (12:50)">6-soat (12:50)</option>
                      <option value="7-soat (13:40)">7-soat (13:40)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Taklif qilinayotgan yangi vaqt/soat
                    </label>
                    <select
                      value={scheduleProposedSlot}
                      onChange={(e) => setScheduleProposedSlot(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                    >
                      <option value="1-soat (08:30)">1-soat (08:30)</option>
                      <option value="2-soat (09:20)">2-soat (09:20)</option>
                      <option value="3-soat (10:10)">3-soat (10:10)</option>
                      <option value="4-soat (11:00)">4-soat (11:00)</option>
                      <option value="5-soat (12:00)">5-soat (12:00)</option>
                      <option value="6-soat (12:50)">6-soat (12:50)</option>
                      <option value="7-soat (13:40)">7-soat (13:40)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Soatni surish sababi
                  </label>
                  <input
                    type="text"
                    value={scheduleReason}
                    onChange={(e) => setScheduleReason(e.target.value)}
                    placeholder="Masalan: Laboratoriya xonasi bo‘sh bo‘lishi yoki murakkab fanlar ketma-ketligi"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>
            )}

            {/* Dynamic Context Fields: Teaching */}
            {category === 'teaching' && (
              <div className="p-4 sm:p-5 bg-purple-50/60 border border-purple-200 rounded-2xl space-y-4">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-purple-700" />
                  <h3 className="text-xs font-bold text-purple-900 uppercase tracking-wide">
                    Dars jarayoni va o‘qituvchi bo‘yicha taklif tafsilotlari
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Fan nomi <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={teachingSubject}
                      onChange={(e) => setTeachingSubject(e.target.value)}
                      placeholder="Masalan: Matematika, Ingliz tili, Tarix"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      O‘qituvchi F.I.O (ixtiyoriy)
                    </label>
                    <input
                      type="text"
                      value={teachingTeacherName}
                      onChange={(e) => setTeachingTeacherName(e.target.value)}
                      placeholder="Masalan: Qodirov A. S."
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Taklif yo‘nalishi
                  </label>
                  <select
                    value={teachingSuggestionArea}
                    onChange={(e) => setTeachingSuggestionArea(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
                  >
                    <option value="Amaliy mashg‘ulotlar va test tahlillari">Amaliy mashg‘ulotlar va test tahlillari</option>
                    <option value="Mavzularni ko‘proq interaktiv va ko‘rgazmali tushuntirish">Mavzularni ko‘proq interaktiv va ko‘rgazmali tushuntirish</option>
                    <option value="Og‘zaki nutq, speaking va debatlarni ko‘paytirish">Og‘zaki nutq, speaking va debatlarni ko‘paytirish</option>
                    <option value="Uyga vazifalar hajmi va baholash mezonlari">Uyga vazifalar hajmi va baholash mezonlari</option>
                    <option value="Olimpiada va tanlovlarga qo‘shimcha tayyorgarlik">Olimpiada va tanlovlarga qo‘shimcha tayyorgarlik</option>
                  </select>
                </div>
              </div>
            )}

            <hr className="border-slate-100" />

            {/* Step 3: Title and Narrative Content */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Murojaat mavzusi (Qisqacha sarlavha) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Masalan: Chorshanba kungi Kimyo darsini 3-soatga surish iltimosi"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Murojaat yoki so‘rov matni (Batafsil asoslash) <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Maktab ma'muriyatiga o‘z iltimos yoki taklifingizni batafsil yozib bering. Sabablari va bu o‘quv jarayoniga qanday foyda keltirishini ko‘rsating..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white leading-relaxed"
                  required
                />
              </div>

              {/* Urgency selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Muhimlilik darajasi
                </label>
                <div className="flex items-center gap-3">
                  {[
                    { key: 'normal', label: 'Oddiy' },
                    { key: 'important', label: 'Muhim' },
                    { key: 'urgent', label: 'Shoshilinch' }
                  ].map((lvl) => (
                    <label key={lvl.key} className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer">
                      <input
                        type="radio"
                        name="urgency"
                        checked={urgency === lvl.key}
                        onChange={() => setUrgency(lvl.key as UrgencyLevel)}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <span>{lvl.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-3 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-sm font-bold shadow-sm transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Murojaatni maktab ma'muriyatiga yuborish</span>
              </button>
            </div>

          </form>

        </div>
      )}

      {/* TAB 2: MY APPEALS & REAL-TIME TRACKING */}
      {activeTab === 'my-appeals' && (
        <div className="space-y-4">
          
          {/* Filter and Search Bar */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            
            {/* Status Tabs */}
            <div className="flex items-center p-1 bg-slate-100 rounded-xl w-full sm:w-auto overflow-x-auto">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                  statusFilter === 'all'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Barchasi ({appeals.length})
              </button>
              <button
                onClick={() => setStatusFilter('pending')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                  statusFilter === 'pending'
                    ? 'bg-white text-amber-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Ko‘rib chiqilmoqda ⏳ ({appeals.filter(a => a.status === 'pending').length})
              </button>
              <button
                onClick={() => setStatusFilter('approved')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                  statusFilter === 'approved'
                    ? 'bg-white text-emerald-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Qabul qilindi ✅ ({appeals.filter(a => a.status === 'approved').length})
              </button>
              <button
                onClick={() => setStatusFilter('rejected')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                  statusFilter === 'rejected'
                    ? 'bg-white text-rose-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Rad etildi ❌ ({appeals.filter(a => a.status === 'rejected').length})
              </button>
            </div>

            {/* Live Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Kod yoki so‘z bo‘yicha..."
                className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
              />
            </div>

          </div>

          {/* List of Appeals */}
          {filteredAppeals.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
              <Clock className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-700">Murojaatlar mavjud emas</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Ushbu filtr bo‘yicha hozircha hech qanday ariza topilmadi. "Yangi murojaat yuborish" bo‘limidan o‘z taklifingizni yuborishingiz mumkin.
              </p>
              <button
                onClick={() => setActiveTab('form')}
                className="mt-4 px-4 py-2 bg-blue-700 text-white rounded-xl text-xs font-semibold hover:bg-blue-800 transition-colors inline-flex items-center gap-1.5"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Yangi murojaat yaratish</span>
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredAppeals.map((appeal) => (
                <div
                  key={appeal.id}
                  className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs hover:border-blue-200 transition-all"
                >
                  {/* Top metadata strip */}
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={() => copyToClipboard(appeal.trackingCode)}
                        className="inline-flex items-center gap-1 font-mono font-bold text-xs bg-slate-100 hover:bg-blue-50 hover:text-blue-700 px-2.5 py-1 rounded-lg border border-slate-200/80 transition-colors text-slate-800"
                        title="Kodni nusxalash"
                      >
                        <span>{appeal.trackingCode}</span>
                        <Copy className="w-3 h-3 text-slate-400" />
                      </button>
                      <span className="text-xs font-medium text-slate-500">
                        {appeal.studentClass}
                      </span>
                      <span className="text-slate-300" aria-hidden="true">·</span>
                      <span className="text-xs text-slate-400">
                        {formatUzbekDate(appeal.createdAt)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <CategoryBadge category={appeal.category} />
                      <StatusBadge status={appeal.status} />
                    </div>
                  </div>

                  {/* Title and Body */}
                  <h3 className="text-base font-bold text-slate-900 mb-1.5">
                    {appeal.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                    {appeal.description}
                  </p>

                  {/* Schedule Details Snippet if any */}
                  {appeal.scheduleDetails && (
                    <div className="mb-4 p-3 bg-blue-50/50 border border-blue-100 rounded-xl text-xs flex flex-wrap items-center gap-x-4 gap-y-1.5">
                      <span className="font-semibold text-blue-900">
                        Fan: {appeal.scheduleDetails.subject} ({appeal.scheduleDetails.dayOfWeek})
                      </span>
                      <span className="text-slate-600">
                        Hozirgi: <strong className="text-rose-700">{appeal.scheduleDetails.currentSlot}</strong>
                      </span>
                      <span className="text-slate-400">→</span>
                      <span className="text-slate-600">
                        Taklif: <strong className="text-emerald-700">{appeal.scheduleDetails.proposedSlot}</strong>
                      </span>
                    </div>
                  )}

                  {/* Teaching Details Snippet if any */}
                  {appeal.teachingDetails && (
                    <div className="mb-4 p-3 bg-purple-50/50 border border-purple-100 rounded-xl text-xs flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-purple-900">
                        {appeal.teachingDetails.subject}
                      </span>
                      {appeal.teachingDetails.teacherName && (
                        <span className="text-slate-600">
                          ({appeal.teachingDetails.teacherName})
                        </span>
                      )}
                      <span className="text-purple-700">
                        · {appeal.teachingDetails.suggestionArea}
                      </span>
                    </div>
                  )}

                  {/* Official Administration Response (If available) */}
                  {appeal.adminResponse ? (
                    <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-50/80 to-blue-50/50 border border-emerald-200/80 mb-3">
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="font-bold text-emerald-900 uppercase tracking-wide flex items-center gap-1.5">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                          {appeal.adminResponse.responderTitle} javobi:
                        </span>
                        <span className="text-[11px] text-slate-500 font-mono">
                          {formatUzbekDate(appeal.adminResponse.answeredAt)}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium bg-white/70 p-2.5 rounded-lg border border-emerald-100">
                        "{appeal.adminResponse.comment}"
                      </p>
                      <div className="mt-2 flex items-center justify-between text-[11px] text-slate-600">
                        <span>Mas'ul: <strong>{appeal.adminResponse.responderName}</strong></span>
                        {appeal.adminResponse.decisionNote && (
                          <span className="text-emerald-800 font-semibold">{appeal.adminResponse.decisionNote}</span>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 bg-amber-50/60 border border-amber-200/60 rounded-xl text-xs text-amber-800 flex items-center gap-2 mb-3">
                      <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>
                        Ariza o‘quv bo‘limi tomonidan ko‘rib chiqilmoqda. Qaror qabul qilinishi bilan shu yerda xulosa ko‘rsatiladi.
                      </span>
                    </div>
                  )}

                  {/* Action row */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                    <span className="text-slate-400">
                      Muallif: {appeal.isAnonymous ? 'Anonim' : appeal.studentName}
                    </span>
                    <button
                      onClick={() => onSelectAppeal(appeal)}
                      className="px-3 py-1.5 text-blue-700 hover:text-blue-900 font-semibold hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-1"
                    >
                      <span>Rasmiy blankani ko‘rish</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                </div>
              ))}
            </div>
          )}

        </div>
      )}

    </div>
  );
};
