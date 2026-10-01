export type UserRole = 'student' | 'admin';

export type AppealCategory = 'schedule' | 'teaching' | 'general' | 'club';

export type AppealStatus = 'pending' | 'approved' | 'rejected';

export type UrgencyLevel = 'normal' | 'important' | 'urgent';

export interface ScheduleDetails {
  subject: string;
  dayOfWeek: string;
  currentSlot: string;
  proposedSlot: string;
  reason: string;
}

export interface TeachingDetails {
  subject: string;
  teacherName?: string;
  suggestionArea: string;
}

export interface AdminResponse {
  answeredAt: string;
  responderTitle: string;
  responderName: string;
  comment: string;
  decisionNote?: string;
}

export interface StatusHistoryItem {
  timestamp: string;
  status: AppealStatus;
  note: string;
  actor: string;
}

export interface Appeal {
  id: string;
  trackingCode: string;
  studentName: string;
  studentClass: string;
  studentPhone?: string;
  isAnonymous?: boolean;
  category: AppealCategory;
  title: string;
  description: string;
  urgency: UrgencyLevel;
  scheduleDetails?: ScheduleDetails;
  teachingDetails?: TeachingDetails;
  status: AppealStatus;
  createdAt: string;
  updatedAt?: string;
  adminResponse?: AdminResponse;
  statusHistory: StatusHistoryItem[];
}

export interface FilterOptions {
  status: 'all' | AppealStatus;
  category: 'all' | AppealCategory;
  grade: 'all' | string;
  searchQuery: string;
  sortBy: 'newest' | 'oldest' | 'urgency';
}

export interface SchoolStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  scheduleCount: number;
  teachingCount: number;
  generalCount: number;
}
