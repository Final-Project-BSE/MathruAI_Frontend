export interface UserData {
  user_id: number;
  name: string;
  pregnancy_week: number;
  preferences: string;
  created_at?: string;
  data_updated_at?: string;
}

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface RecommendationData {
  user_id: number;
  date: string;
  recommendation: string;
  regenerated: boolean;
  checklist?: ChecklistItem[];
}

export interface HistoryItem {
  date: string;
  recommendation: string;
  created_at?: string;
  checklist?: ChecklistItem[];
}

export interface APIResponse<T> {
  status?: string;
  data?: T;
  error?: string;
  message?: string;
}