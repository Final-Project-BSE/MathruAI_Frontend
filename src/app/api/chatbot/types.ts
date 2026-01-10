export interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  status?: "sending" | "sent" | "error";
}

export interface SystemStats {
  knowledge_base_stats: {
    total_chunks: number;
    embedding_dimension: number;
    embedding_model: string;
    database_connected: boolean;
  };
}

export interface ChatSession {
  id: number;
  session_id?: number;
  session_name: string;
  created_at: string;
  updated_at?: string;
  last_activity?: string;
  message_count: number;
}

export interface ChatMessageRecord {
  id: number;
  message?: string;
  response?: string;
  created_at: string;
}

export interface ListChatsResponse {
  status: "success" | "error";
  sessions: ChatSession[];
  message?: string;
}

export interface CreateChatResponse {
  status: "success" | "error";
  session_id: number;
  message?: string;
}

export interface DeleteChatResponse {
  status: "success" | "error";
  message?: string;
}

export interface GetChatMessagesResponse {
  status: "success" | "error";
  messages: ChatMessageRecord[];
  message?: string;
}

export interface HealthResponse {
  status: string;
  error?: string;
}

export interface StatsResponse {
  knowledge_base_stats?: {
    total_chunks: number;
    embedding_dimension: number;
    embedding_model: string;
    database_connected: boolean;
  };
}

export interface ChatResponse {
  status: string;
  response: string;
  processing_time_seconds: number;
  session_id?: number;
  parameters_used?: {
    top_k: number;
    similarity_threshold: number;
  };
}

