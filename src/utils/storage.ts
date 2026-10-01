import { Appeal, AppealStatus, AdminResponse } from '../types';
import { INITIAL_APPEALS } from '../data/initialData';

const STORAGE_KEY = 'schooldirect_45_appeals';
const CURRENT_USER_KEY = 'schooldirect_45_current_student';

export function getStoredAppeals(): Appeal[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_APPEALS));
      return INITIAL_APPEALS;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_APPEALS));
      return INITIAL_APPEALS;
    }
    return parsed;
  } catch (error) {
    console.error('LocalStorage o‘qishda xatolik:', error);
    return INITIAL_APPEALS;
  }
}

export function saveAppeals(appeals: Appeal[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appeals));
  } catch (error) {
    console.error('LocalStorage saqlashda xatolik:', error);
  }
}

export function resetAppealsToDefault(): Appeal[] {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_APPEALS));
    return INITIAL_APPEALS;
  } catch (error) {
    console.error('Qayta tiklashda xatolik:', error);
    return INITIAL_APPEALS;
  }
}

export function generateTrackingCode(): string {
  const randomDigits = Math.floor(1000 + Math.random() * 9000);
  return `SD-45-${randomDigits}`;
}

export function getStoredStudentProfile(): { name: string; grade: string; phone: string } {
  try {
    const raw = localStorage.getItem(CURRENT_USER_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    // ignore
  }
  return { name: '', grade: '10-"A"', phone: '' };
}

export function saveStudentProfile(profile: { name: string; grade: string; phone: string }): void {
  try {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(profile));
  } catch (e) {
    // ignore
  }
}

export function formatUzbekDate(isoString: string): string {
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return isoString;

    const months = [
      'yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun',
      'iyul', 'avgust', 'sentabr', 'oktabr', 'noyabr', 'dekabr'
    ];

    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${day}-${month}, ${year} ${hours}:${minutes}`;
  } catch {
    return isoString;
  }
}

export function exportAppealsToCSV(appeals: Appeal[]): void {
  const headers = ['ID', 'Tracking Kod', 'Sana', 'O‘quvchi', 'Sinf', 'Telefon', 'Mavzu', 'Kategoriya', 'Holat', 'Ma\'muriyat Javobi'];
  
  const rows = appeals.map(a => [
    `"${a.id}"`,
    `"${a.trackingCode}"`,
    `"${formatUzbekDate(a.createdAt)}"`,
    `"${a.isAnonymous ? 'Anonim' : a.studentName}"`,
    `"${a.studentClass}"`,
    `"${a.studentPhone || '-'}"`,
    `"${a.title.replace(/"/g, '""')}"`,
    `"${a.category}"`,
    `"${a.status === 'pending' ? 'Ko‘rib chiqilmoqda' : a.status === 'approved' ? 'Qabul qilindi' : 'Rad etildi'}"`,
    `"${(a.adminResponse?.comment || '-').replace(/"/g, '""')}"`
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `45-maktab_arizalar_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
