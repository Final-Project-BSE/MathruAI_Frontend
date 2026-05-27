export type Role =
  | "MIDWIFE"
  | "HOPE_TO_PREGNANT_MOTHER"
  | "PREGNANT_MOTHER"
  | "POST_PREGNANT_MOTHER";

export interface ChatParticipantDto {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  profileImageUrl?: string | null;
  roles: Role[];
}

export interface ChatConversationResponseDto {
  id: number;
  otherUser: ChatParticipantDto;
  lastMessage?: string | null;
  lastMessageAt?: string | null;
  unreadCount: number;
}

export interface ChatMessageResponseDto {
  id: number;
  conversationId: number;
  senderId: number;
  senderFirstName: string;
  senderLastName: string;
  senderEmail: string;
  senderRoles: Role[];
  receiverId: number;
  content: string;
  read: boolean;
  createdAt: string;
}

export interface ChatOpenConversationRequestDto {
  targetUserId: number;
}

export interface ChatSendMessageRequestDto {
  conversationId: number;
  content: string;
}

export interface UnreadCountResponseDto {
  unreadCount: number;
}