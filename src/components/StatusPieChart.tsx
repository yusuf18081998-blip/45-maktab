import React, { useState } from 'react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip 
} from 'recharts';
import { AppealStatus, AppealCategory } from '../types';
import { PieChart as PieIcon, Layers, CheckCircle2, Clock, XCircle } from 'lucide-react';

interface StatusPieChartProps {
  pendingCount: number;
  approvedCount: number;
  rejectedCount: number;
  totalCount: number;
  scheduleCount: number;
  teachingCount: number;
  generalCount: number;
  activeStatusFilter: 'all' | AppealStatus;
  onSelectStatusFilter: (status: 'all' | AppealStatus) => void;
}

const STATUS_CONFIG = {
  pending: {
    label: 'Ko‘rib chiqilmoqda',
    emoji: '⏳',
    color: '#f59e0b', // Amber-500
    hoverColor: '#d97706',
    bgColor: 'bg-amber-50',
    textColor: 'text-amber-800',
    borderColor: 'border-amber-200'
  },
  approved: {
    label: 'Qabul qilindi',
    emoji: '✅',
    color: '#10b981', // Emerald-500
    hoverColor: '#059669',
    bgColor: 'bg-emerald-50',
    textColor: 'text-emerald-800',
    borderColor: 'border-emerald-200'
  },
  rejected: {
    label: 'Rad etildi',
    emoji: '❌',
    color: '#f43f5e', // Rose-500
    hoverColor: '#e11d48',
    bgColor: 'bg-rose-50',
    textColor: 'text-rose-800',
    borderColor: 'border-rose-200'
  }
};

const CATEGORY_CONFIG = {
  schedule: {
    label: 'Dars jadvali',
    color: '#3b82f6', // Blue-500
  },
  teaching: {
    label: 'Dars jarayoni & Metodika',
    color: '#8b5cf6', // Purple-500
  },
  general: {
    label: 'Maktab sharoiti & Takliflar',
    color: '#06b6d4', // Cyan-500
  }
};

export const StatusPieChart: React.FC<StatusPieChartProps> = ({
  pendingCount,
  approvedCount,
  rejectedCount,
  totalCount,
  scheduleCount,
  teachingCount,
  generalCount,
  activeStatusFilter,
  onSelectStatusFilter
}) => {
  const [chartView, setChartView] = useState<'status' | 'category'>('status');
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  // Status data for Pie
  const statusData = [
    {
      id: 'pending' as AppealStatus,
      name: 'Ko‘rib chiqilmoqda',
      value: pendingCount,
      color: STATUS_CONFIG.pending.color,
      emoji: STATUS_CONFIG.pending.emoji
    },
    {
      id: 'approved' as AppealStatus,
      name: 'Qabul qilindi',
      value: approvedCount,
      color: STATUS_CONFIG.approved.color,
      emoji: STATUS_CONFIG.approved.emoji
    },
    {
      id: 'rejected' as AppealStatus,
      name: 'Rad etildi',
      value: rejectedCount,
      color: STATUS_CONFIG.rejected.color,
      emoji: STATUS_CONFIG.rejected.emoji
    }
  ].filter(item => item.value > 0);

  // Category data for secondary view
  const categoryData = [
    {
      id: 'schedule' as AppealCategory,
      name: 'Dars jadvalini surish',
      value: scheduleCount,
      color: CATEGORY_CONFIG.schedule.color,
      emoji: '⏰'
    },
    {
      id: 'teaching' as AppealCategory,
      name: 'O‘qituvchi & Dars jarayoni',
      value: teachingCount,
      color: CATEGORY_CONFIG.teaching.color,
      emoji: '📚'
    },
    {
      id: 'general' as AppealCategory,
      name: 'Maktab infratuzilmasi',
      value: generalCount,
      color: CATEGORY_CONFIG.general.color,
      emoji: '💡'
    }
  ].filter(item => item.value > 0);

  const currentData = chartView === 'status' ? statusData : categoryData;

  // Custom Recharts Tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const pct = totalCount > 0 ? Math.round((data.value / totalCount) * 100) : 0;
      return (
        <div className="bg-slate-900 text-white px-3 py-2 rounded-xl text-xs shadow-xl border border-slate-700 pointer-events-none">
          <div className="flex items-center gap-1.5 font-bold mb-0.5">
            <span>{data.emoji}</span>
            <span>{data.name}</span>
          </div>
          <div className="flex items-center justify-between gap-4 text-slate-300 font-mono">
            <span>Soni: <strong className="text-white">{data.value} ta</strong></span>
            <span>Ulishi: <strong className="text-emerald-400">{pct}%</strong></span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs">
      
      {/* Header with Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 border-b border-slate-100 pb-3">
        <div>
          <h2 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
            <PieIcon className="w-4 h-4 text-blue-700" />
            <span>Arizalar holati bo‘yicha vizual doira (Pie Chart)</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Kelib tushgan murojaatlarning statuslar bo‘yicha taqsimoti va monitoringi
          </p>
        </div>

        {/* View toggle */}
        <div className="flex items-center p-1 bg-slate-100 rounded-xl self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setChartView('status')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              chartView === 'status'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Holat bo‘yicha (Status)
          </button>
          <button
            type="button"
            onClick={() => setChartView('category')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              chartView === 'category'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Mavzular bo‘yicha
          </button>
        </div>
      </div>

      {totalCount === 0 ? (
        <div className="py-12 text-center text-slate-400 text-xs">
          Arizalar mavjud emas, diagramma chizish uchun ma’lumot yetarli emas.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          {/* Pie Chart Canvas (Left / Top) */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center relative">
            <div className="w-full h-56 sm:h-64 relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip content={<CustomTooltip />} />
                  <Pie
                    data={currentData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={88}
                    paddingAngle={4}
                    dataKey="value"
                    animationDuration={600}
                    onClick={(entry: any) => {
                      const selectedId = entry?.id || entry?.payload?.id;
                      if (chartView === 'status' && selectedId) {
                        onSelectStatusFilter(selectedId as AppealStatus);
                      }
                    }}
                    cursor="pointer"
                  >
                    {currentData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.color}
                        stroke="#ffffff"
                        strokeWidth={2}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>

              {/* Center Donut Hole Info */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Jami
                </span>
                <span className="text-2xl font-black text-slate-900 font-mono tabular-nums">
                  {totalCount}
                </span>
                <span className="text-[10px] text-slate-500 font-medium">
                  ariza
                </span>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 mt-1 italic text-center">
              * Diagramma bo‘lagini bosish orqali ro‘yxatni tezkor filtrlashingiz mumkin
            </p>
          </div>

          {/* Interactive Legend & Detailed Statistics (Right / Bottom) */}
          <div className="lg:col-span-6 space-y-3">
            
            {/* Status: Pending Row */}
            <div 
              onClick={() => onSelectStatusFilter(activeStatusFilter === 'pending' ? 'all' : 'pending')}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                activeStatusFilter === 'pending'
                  ? 'bg-amber-100/70 border-amber-400 ring-2 ring-amber-300'
                  : 'bg-amber-50/50 border-amber-200/80 hover:bg-amber-100/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs sm:text-sm font-bold text-amber-950">
                      Ko‘rib chiqilmoqda ⏳
                    </span>
                    {activeStatusFilter === 'pending' && (
                      <span className="text-[10px] bg-amber-200 text-amber-900 font-semibold px-1.5 py-0.2 rounded">
                        Faol filtr
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-amber-800">
                    O‘quv bo‘limi tomonidan o‘rganilayotgan so‘rovlar
                  </span>
                </div>
              </div>

              <div className="text-right shrink-0 pl-2">
                <span className="text-lg font-extrabold text-amber-950 font-mono tabular-nums block">
                  {pendingCount}
                </span>
                <span className="text-[11px] font-semibold text-amber-700 font-mono">
                  {totalCount > 0 ? Math.round((pendingCount / totalCount) * 100) : 0}%
                </span>
              </div>
            </div>

            {/* Status: Approved Row */}
            <div 
              onClick={() => onSelectStatusFilter(activeStatusFilter === 'approved' ? 'all' : 'approved')}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                activeStatusFilter === 'approved'
                  ? 'bg-emerald-100/70 border-emerald-400 ring-2 ring-emerald-300'
                  : 'bg-emerald-50/50 border-emerald-200/80 hover:bg-emerald-100/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs sm:text-sm font-bold text-emerald-950">
                      Qabul qilindi ✅
                    </span>
                    {activeStatusFilter === 'approved' && (
                      <span className="text-[10px] bg-emerald-200 text-emerald-900 font-semibold px-1.5 py-0.2 rounded">
                        Faol filtr
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-emerald-800">
                    Ma'qullangan va ijroga yo‘naltirilgan takliflar
                  </span>
                </div>
              </div>

              <div className="text-right shrink-0 pl-2">
                <span className="text-lg font-extrabold text-emerald-950 font-mono tabular-nums block">
                  {approvedCount}
                </span>
                <span className="text-[11px] font-semibold text-emerald-700 font-mono">
                  {totalCount > 0 ? Math.round((approvedCount / totalCount) * 100) : 0}%
                </span>
              </div>
            </div>

            {/* Status: Rejected Row */}
            <div 
              onClick={() => onSelectStatusFilter(activeStatusFilter === 'rejected' ? 'all' : 'rejected')}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                activeStatusFilter === 'rejected'
                  ? 'bg-rose-100/70 border-rose-400 ring-2 ring-rose-300'
                  : 'bg-rose-50/50 border-rose-200/80 hover:bg-rose-100/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <XCircle className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs sm:text-sm font-bold text-rose-950">
                      Rad etildi ❌
                    </span>
                    {activeStatusFilter === 'rejected' && (
                      <span className="text-[10px] bg-rose-200 text-rose-900 font-semibold px-1.5 py-0.2 rounded">
                        Faol filtr
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-rose-800">
                    Sanitariya yoki dars jadvali bandligi sababli rad etilganlar
                  </span>
                </div>
              </div>

              <div className="text-right shrink-0 pl-2">
                <span className="text-lg font-extrabold text-rose-950 font-mono tabular-nums block">
                  {rejectedCount}
                </span>
                <span className="text-[11px] font-semibold text-rose-700 font-mono">
                  {totalCount > 0 ? Math.round((rejectedCount / totalCount) * 100) : 0}%
                </span>
              </div>
            </div>

            {/* Reset Filter Button if active */}
            {activeStatusFilter !== 'all' && (
              <div className="pt-1 text-right">
                <button
                  type="button"
                  onClick={() => onSelectStatusFilter('all')}
                  className="text-xs text-blue-700 hover:text-blue-900 font-semibold hover:underline"
                >
                  Filtrni bekor qilish (Barcha arizalarni ko‘rsatish)
                </button>
              </div>
            )}

          </div>

        </div>
      )}

    </div>
  );
};
