import axios from "axios";
import { AnnouncementDto } from "./types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8081";

const api = axios.create({
  baseURL: API_BASE_URL,
});

const authHeader = (token: string) => ({
  Authorization: `Bearer ${token}`,
});

export const getAllActiveAnnouncements = async (
  token: string,
): Promise<AnnouncementDto[]> => {
  const res = await api.get<AnnouncementDto[]>("/api/announcement/active", {
    headers: authHeader(token),
  });
  return res.data;
};

export const getAllAnnouncements = async (
  token: string,
): Promise<AnnouncementDto[]> => {
  const res = await api.get<AnnouncementDto[]>("/api/announcement", {
    headers: authHeader(token),
  });
  return res.data;
};

export const getAnnouncementById = async (
  token: string,
  id: number,
): Promise<AnnouncementDto> => {
  const res = await api.get<AnnouncementDto>(`/api/announcement/${id}`, {
    headers: authHeader(token),
  });
  return res.data;
};

export const createAnnouncement = async (
  token: string,
  data: AnnouncementDto,
): Promise<AnnouncementDto> => {
  const res = await api.post<AnnouncementDto>("/api/announcement", data, {
    headers: authHeader(token),
  });
  return res.data;
};

export const updateAnnouncement = async (
  token: string,
  id: number,
  data: AnnouncementDto,
): Promise<AnnouncementDto> => {
  const res = await api.put<AnnouncementDto>(`/api/announcement/${id}`, data, {
    headers: authHeader(token),
  });
  return res.data;
};

export const deleteAnnouncement = async (
  token: string,
  id: number,
): Promise<void> => {
  await api.delete(`/api/announcement/${id}`, {
    headers: authHeader(token),
  });
};

const announcementApi = {
  getAllActiveAnnouncements,
  getAllAnnouncements,
  getAnnouncementById,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
};

export default announcementApi;
