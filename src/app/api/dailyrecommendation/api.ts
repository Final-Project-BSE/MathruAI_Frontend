// src/services/api.ts

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Store token in memory (you can use localStorage in a real app)
let authToken: string | null = null;

export const setAuthToken = (token: string) => {
  authToken = token;
};

export const getAuthToken = () => {
  return authToken;
};

const getHeaders = () => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }
  
  return headers;
};

// Health Check
export const checkHealth = async () => {
  const response = await fetch(`${API_BASE_URL}/health`, {
    method: 'GET',
  });
  
  if (!response.ok) {
    throw new Error('Health check failed');
  }
  
  return response.json();
};

// Get User Information
export const getUser = async (userId: number) => {
  const response = await fetch(`${API_BASE_URL}/user/${userId}`, {
    method: 'GET',
    headers: getHeaders(),
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch user');
  }
  
  return response.json();
};

// Get Daily Recommendation
export const getDailyRecommendation = async (userId: number, forceRegenerate: boolean = false) => {
  const url = new URL(`${API_BASE_URL}/recommendation/${userId}`);
  if (forceRegenerate) {
    url.searchParams.append('force_regenerate', 'true');
  }
  
  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: getHeaders(),
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch recommendation');
  }
  
  return response.json();
};

// Get Recommendation History
export const getRecommendationHistory = async (userId: number, limit: number = 30) => {
  const url = new URL(`${API_BASE_URL}/recommendations/history/${userId}`);
  url.searchParams.append('limit', limit.toString());
  
  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: getHeaders(),
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch recommendation history');
  }
  
  return response.json();
};

// Update User Data
export const updateUserData = async (
  userId: number, 
  data: {
    pregnancy_week?: number;
    preferences?: string;
    regenerate_recommendation?: boolean;
  }
) => {
  const response = await fetch(`${API_BASE_URL}/user/${userId}/data`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    throw new Error('Failed to update user data');
  }
  
  return response.json();
};

// Get User Data History
export const getUserDataHistory = async (userId: number, limit: number = 10) => {
  const url = new URL(`${API_BASE_URL}/user/${userId}/data/history`);
  url.searchParams.append('limit', limit.toString());
  
  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: getHeaders(),
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch user data history');
  }
  
  return response.json();
};

// Get System Stats
export const getSystemStats = async () => {
  const response = await fetch(`${API_BASE_URL}/stats`, {
    method: 'GET',
    headers: getHeaders(),
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch system stats');
  }
  
  return response.json();
};

// Search Knowledge Base
export const searchKnowledgeBase = async (query: string, topK: number = 5) => {
  const response = await fetch(`${API_BASE_URL}/search`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ query, top_k: topK }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to search knowledge base');
  }
  
  return response.json();
};

// Upload PDF
export const uploadPDF = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  
  const headers: HeadersInit = {};
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }
  
  const response = await fetch(`${API_BASE_URL}/upload-pdf`, {
    method: 'POST',
    headers,
    body: formData,
  });
  
  if (!response.ok) {
    throw new Error('Failed to upload PDF');
  }
  
  return response.json();
};