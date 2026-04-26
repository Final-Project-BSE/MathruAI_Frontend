export interface RecoveryRecordRequestDto {
  patientId: number;
  dayNumber: number;
  completedTaskIds: string[];
  dailyNotes: string;
}

export interface RecoveryRecordResponseDto {
  id: number;
  patientId: number;
  dayNumber: number;
  completedTaskIds: string[];
  dailyNotes: string;
  createdAt: string;
  updatedAt: string;
}
