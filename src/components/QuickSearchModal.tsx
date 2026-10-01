import React, { useState } from 'react';
import { Appeal } from '../types';
import { StatusBadge, CategoryBadge } from './Badges';
import { formatUzbekDate } from '../utils/storage';
import { Search, X, CheckCircle, Clock, AlertCircle, ArrowRight } from 'lucide-react';

interface QuickSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  appeals: Appeal[];
  onSelectAppeal: (appeal: Appeal) => void;
}

export const QuickSearchModal: React.FC<QuickSearchModalProps> = ({
  isOpen,
  onClose,
  appeals,
  onSelectAppeal
}) => {
  const [code, setCode] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  if (!isOpen) return null;

  const normalizedQuery = code.trim().toLowerCase();
  const searchResults = normalizedQuery
    ? appeals.filter(a =>
        a.trackingCode.toLowerCase().includes(normalizedQuery) ||
        a.id.toLowerCase().includes(normalizedQuery) ||
        a.title.toLowerCase().includes(normalizedQuery) ||
        a.studentName.toLowerCase().includes(normalizedQuery)
      )
    : [];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSearched(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Ariza holatini tekshirish
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Ariza yuborilganda berilgan maxsus kodni (masalan: SD-45-7821) kiriting
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <div className="p-6">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value);
                  setHasSearched(false);
                }}
                placeholder="Ariza kodi: SD-45-..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white uppercase font-mono tracking-wider"
                autoFocus
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-sm font-semibold transition-colors flex items-center gap-1.5 shrink-0"
            >
              <span>Qidirish</span>
            </button>
          </form>

          {/* Quick examples */}
          <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
            <span>Namunaviy kodlar:</span>
            {appeals.slice(0, 3).map((a) => (
              <button
                key={a.id}
                type="button"
                onClick={() => {
                  setCode(a.trackingCode);
                  setHasSearched(true);
                }}
                className="font-mono text-blue-600 hover:underline px-1.5 py-0.5 bg-blue-50 rounded"
              >
                {a.trackingCode}
              </button>
            ))}
          </div>

          {/* Results Area */}
          <div className="mt-6 border-t border-slate-100 pt-4">
            {normalizedQuery === '' ? (
              <div className="text-center py-8 text-slate-400 text-xs">
                Ariza kodini kiriting va qidirish tugmasini bosing
              </div>
            ) : searchResults.length > 0 ? (
              <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {searchResults.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      onSelectAppeal(item);
                      onClose();
                    }}
                    className="p-3.5 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/40 cursor-pointer transition-all flex flex-col gap-2"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs text-blue-900 bg-blue-100/70 px-2 py-0.5 rounded">
                          {item.trackingCode}
                        </span>
                        <span className="text-xs text-slate-500">
                          {item.studentClass}
                        </span>
                      </div>
                      <StatusBadge status={item.status} size="sm" />
                    </div>

                    <p className="text-sm font-semibold text-slate-800 line-clamp-1">
                      {item.title}
                    </p>

                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>{formatUzbekDate(item.createdAt)}</span>
                      <span className="flex items-center gap-1 text-blue-600 font-medium">
                        Batafsil ko‘rish <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>

                    {item.adminResponse && (
                      <div className="mt-1 p-2 bg-emerald-50/80 border border-emerald-200/60 rounded-lg text-xs text-emerald-900">
                        <span className="font-semibold">{item.adminResponse.responderTitle}:</span> {item.adminResponse.comment}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : hasSearched ? (
              <div className="text-center py-8">
                <AlertCircle className="w-8 h-8 text-amber-500 mx-auto mb-2" />
                <p className="text-sm font-semibold text-slate-700">Ariza topilmadi</p>
                <p className="text-xs text-slate-500 mt-1">
                  Kodni to‘g‘ri kiritganingizni tekshirib ko‘ring (masalan: SD-45-7821)
                </p>
              </div>
            ) : null}
          </div>

        </div>

      </div>
    </div>
  );
};
