export interface HealthCategoryResponseDto {
    id: string; // UUID
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
    date: string; // ISO format from backend
    description: string;
    createdAt: string;
    updatedAt: string;
    categoryName: string;
    categoryId: string;
    files: RecordFileResponseDto[];
}

export interface HealthRecordRequest {
    name: string;
    date: string; // "YYYY-MM-DD"
    description?: string;
    files?: File[];
}
