export interface AnnouncementDto {
  announcementId: number;
  title: string;
  content: string;
  category: string;
  createdAt: string;
  active: boolean;
}

export interface APIResponse<T> {
  status: string;
  data?: T;
  message?: string;
}
