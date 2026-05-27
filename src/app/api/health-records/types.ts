export interface HealthCategoryResponseDto {
  id: string;
  slug: string;
  name: string;
  icon: string;
  colorClass: string;
  recordCount: number;
}

export interface RecordFileResponseDto {
  id: string;
  fileName: string;
  fileType: string;
  fileUrl: string;
  fileSize: number;
}

export interface HealthRecordResponseDto {
  id: string;
  name: string;
  date: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  categoryName: string;
  categoryId: string;
  files: RecordFileResponseDto[];
}

export interface HealthRecordRequest {
  name: string;
  date: string;
  description?: string;
  files?: File[];
}