export type NotificationImportance = 'REGULAR' | 'URGENT' | 'SILENT';

export interface User {
  id: string;
  name: string;
  handle: string;
  avatarUrl: string;
}

export interface AppEvent {
  id: string;
  name: string;
  description: string;
  creatorId: string;
  defaultMode: NotificationImportance;
  defaultMessage?: string;
  subscribers: string[];
  isPublic: boolean;
  isArchived?: boolean;
  recurrence: 'none' | 'daily' | 'weekly' | 'custom';
  scheduledTime?: number;
  createdAt: number;
}

export interface AppNotification {
  id: string;
  eventId: string;
  triggerUserId: string;
  message: string;
  importance: NotificationImportance;
  timestamp: number;
  readBy: string[];
}
