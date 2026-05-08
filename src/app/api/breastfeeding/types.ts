// ===================== SESSION =====================

export type FeedingSide = 'LEFT' | 'RIGHT' | 'BOTH';

export interface BreastfeedingSessionRequestDto {
  feedingTime: string;
  side: FeedingSide;
  durationMinutes: number;
  milkAmountMl?: number;
  notes?: string;
}

export interface BreastfeedingSessionResponseDto {
  id: string;
  feedingTime: string;
  side: FeedingSide;
  durationMinutes: number;
  milkAmountMl: number;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

// ===================== ISSUE =====================

export type IssueType =
  | 'PAIN'
  | 'LATCH_PROBLEM'
  | 'LOW_SUPPLY'
  | 'ENGORGEMENT'
  | 'MASTITIS'
  | 'OTHER';

export type SeverityLevel = 'MILD' | 'MODERATE' | 'SEVERE';

export interface BreastfeedingIssueRequestDto {
  issueType: IssueType;
  description: string;
  severity: SeverityLevel;
  reportedAt: string;
  resolved: boolean;
  midwifeNotes?: string;
}

export interface BreastfeedingIssueResponseDto {
  id: string;
  issueType: IssueType;
  description: string;
  severity: SeverityLevel;
  reportedAt: string;
  resolved: boolean;
  midwifeNotes: string;
  createdAt: string;
  updatedAt: string;
}

// ===================== TIP =====================

export type TipCategory =
  | 'LATCH_TECHNIQUE'
  | 'MILK_SUPPLY'
  | 'PAIN_RELIEF'
  | 'NUTRITION'
  | 'PUMPING'
  | 'GENERAL';

export interface BreastfeedingTipRequestDto {
  category: TipCategory;
  title: string;
  content: string;
  active: boolean;
}

export interface BreastfeedingTipResponseDto {
  id: string;
  category: TipCategory;
  title: string;
  content: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}