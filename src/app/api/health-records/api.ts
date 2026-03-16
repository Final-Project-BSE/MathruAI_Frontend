import axios from "axios";
import {
    HealthCategoryResponseDto,
    HealthRecordResponseDto,
    HealthRecordRequest
} from "./types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8080";

const api = axios.create({
    baseURL: API_BASE_URL,
});

// Debug interceptors
api.interceptors.request.use((config) => {
    console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, config.headers);
    return config;
}, (error) => {
    console.error("[API Request Error]", error);
    return Promise.reject(error);
});

api.interceptors.response.use((response) => {
    console.log(`[API Response] ${response.status} ${response.config.url}`);
    return response;
}, (error) => {
    console.error("[API Response Error]", {
        message: error.message,
        code: error.code,
        status: error.response?.status,
        data: error.response?.data,
        config: error.config
    });
    return Promise.reject(error);
});

const authHeader = (token: string) => ({
    Authorization: `Bearer ${token}`,
});

// 1. Fetch Categories
export const getCategories = async (token: string): Promise<HealthCategoryResponseDto[]> => {
    const res = await api.get<HealthCategoryResponseDto[]>("/api/health-records/categories", {
        headers: authHeader(token),
    });
    return res.data;
};

// 2. Fetch Records by Category
export const getRecordsByCategory = async (token: string, categoryId: string): Promise<HealthRecordResponseDto[]> => {
    const res = await api.get<HealthRecordResponseDto[]>(`/api/health-records/category/${categoryId}`, {
        headers: authHeader(token),
    });
    return res.data;
};

// 3. Create a New Record (Multipart Form Data)
export const createRecord = async (token: string, categoryId: string, data: HealthRecordRequest): Promise<HealthRecordResponseDto> => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("date", data.date);
    if (data.description) formData.append("description", data.description);

    if (data.files) {
        data.files.forEach((file) => formData.append("files", file));
    }
    const res = await api.post<HealthRecordResponseDto>(`/api/health-records/category/${categoryId}`, formData, {
        headers: {
            ...authHeader(token),
            "Content-Type": "multipart/form-data",
        },
    });
    return res.data;
};

// 4. Update a Record (Multipart Form Data)
export const updateRecord = async (token: string, recordId: string, data: HealthRecordRequest): Promise<HealthRecordResponseDto> => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("date", data.date);
    if (data.description) formData.append("description", data.description);

    if (data.files) {
        data.files.forEach((file) => formData.append("files", file));
    }
    const res = await api.put<HealthRecordResponseDto>(`/api/health-records/record/${recordId}`, formData, {
        headers: {
            ...authHeader(token),
            "Content-Type": "multipart/form-data",
        },
    });
    return res.data;
};

// 5. Delete a Record
export const deleteRecord = async (token: string, recordId: string): Promise<void> => {
    await api.delete(`/api/health-records/record/${recordId}`, {
        headers: authHeader(token),
    });
};

// 5. Fetch Record Details
export const getRecordDetails = async (token: string, recordId: string): Promise<HealthRecordResponseDto> => {
    const res = await api.get<HealthRecordResponseDto>(`/api/health-records/record/${recordId}`, {
        headers: authHeader(token),
    });
    return res.data;
};

// 6. Fetch Secure File (Blob)
export const fetchSecureFile = async (token: string, urlPath: string): Promise<Blob> => {
    // Determine the path to hit
    const targetUrl = urlPath.startsWith("http") ? urlPath.replace(API_BASE_URL, "") : urlPath;
    const res = await api.get<Blob>(targetUrl, {
        headers: authHeader(token),
        responseType: "blob",
    });
    return res.data;
};

export const getFileUrl = (path: string): string => {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    if (path.startsWith("data:")) return path; // Handle base64 previews
    return `${API_BASE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
};

export const downloadSecureFile = async (token: string, fileUrl: string, fileName: string) => {
    try {
        const blob = await fetchSecureFile(token, fileUrl);
        const objectUrl = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = objectUrl;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(objectUrl), 100);
    } catch (e) {
        console.error("Failed to download secure file", e);
    }
};

export const openSecureFile = async (token: string, fileUrl: string) => {
    try {
        const blob = await fetchSecureFile(token, fileUrl);
        const objectUrl = URL.createObjectURL(blob);
        window.open(objectUrl, "_blank");
        setTimeout(() => URL.revokeObjectURL(objectUrl), 60000); // cleanup after 60s
    } catch (e) {
        console.error("Failed to open secure file", e);
    }
};

const healthRecordsApi = {
    getCategories,
    getRecordsByCategory,
    createRecord,
    deleteRecord,
    getRecordDetails,
    getFileUrl,
    fetchSecureFile,
    downloadSecureFile,
    openSecureFile
};

export default healthRecordsApi;
