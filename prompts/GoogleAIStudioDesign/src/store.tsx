import React, { createContext, useContext, useState, ReactNode } from 'react';
import { AppEvent, AppNotification, User } from './types';
import { generateId } from './lib/utils';

export const CURRENT_USER: User = {
  id: 'u1',
  name: 'Alex Rivera',
  handle: '@arivera',
  avatarUrl: 'https://api.dicebear.com/7.x/notionists/svg?seed=Alex',
};

const MOCK_USERS: User[] = [
  CURRENT_USER,
  {
    id: 'u2',
    name: 'Sam Smith',
    handle: '@samsmith',
    avatarUrl: 'https://api.dicebear.com/7.x/notionists/svg?seed=Sam',
  },
  {
    id: 'u3',
    name: 'Jordan Lee',
    handle: '@jlee',
    avatarUrl: 'https://api.dicebear.com/7.x/notionists/svg?seed=Jordan',
  },
];

const MOCK_EVENTS: AppEvent[] = [
  {
    id: 'e1',
    name: 'Daily Standup',
    description: 'Team daily sync reminder.',
    creatorId: 'u1',
    defaultMode: 'REGULAR',
    subscribers: ['u1', 'u2', 'u3'],
    isPublic: true,
    recurrence: 'daily',
    createdAt: Date.now() - 1000000,
  },
  {
    id: 'e2',
    name: 'Weekend Gaming Session',
    description: 'Call to arms for the squad!',
    creatorId: 'u2',
    defaultMode: 'URGENT',
    subscribers: ['u1', 'u2'],
    isPublic: true,
    recurrence: 'none',
    createdAt: Date.now() - 2000000,
  },
];

const MOCK_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'n1',
    eventId: 'e1',
    triggerUserId: 'u3',
    message: 'Standup starts in 5 minutes!',
    importance: 'REGULAR',
    timestamp: Date.now() - 3600000,
    readBy: [],
  },
  {
    id: 'n2',
    eventId: 'e2',
    triggerUserId: 'u2',
    message: 'Get online NOW. Emergency raid!',
    importance: 'URGENT',
    timestamp: Date.now() - 50000,
    readBy: ['u1'],
  },
];

interface AppContextType {
  currentUser: User;
  users: User[];
  events: AppEvent[];
  notifications: AppNotification[];
  quickTriggerEventId: string | null;
  setQuickTriggerEventId: (id: string | null) => void;
  createEvent: (event: Omit<AppEvent, 'id' | 'createdAt' | 'creatorId' | 'subscribers'>) => void;
  updateEvent: (eventId: string, data: Partial<Omit<AppEvent, 'id' | 'createdAt' | 'creatorId' | 'subscribers'>>) => void;
  triggerNotification: (eventId: string, message: string, importance: AppNotification['importance']) => void;
  joinEvent: (eventId: string) => void;
  leaveEvent: (eventId: string) => void;
  archiveEvent: (eventId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<AppEvent[]>(MOCK_EVENTS);
  const [notifications, setNotifications] = useState<AppNotification[]>(MOCK_NOTIFICATIONS);
  const [quickTriggerEventId, setQuickTriggerEventId] = useState<string | null>(null);

  const createEvent = (eventData: Omit<AppEvent, 'id' | 'createdAt' | 'creatorId' | 'subscribers'>) => {
    const newEvent: AppEvent = {
      ...eventData,
      id: generateId(),
      createdAt: Date.now(),
      creatorId: CURRENT_USER.id,
      subscribers: [CURRENT_USER.id], // Creator is automatically subscribed
    };
    setEvents((prev) => [newEvent, ...prev]);
  };

  const updateEvent = (eventId: string, data: Partial<Omit<AppEvent, 'id' | 'createdAt' | 'creatorId' | 'subscribers'>>) => {
    setEvents((prev) =>
      prev.map((e) => (e.id === eventId ? { ...e, ...data } : e))
    );
  };

  const triggerNotification = (eventId: string, message: string, importance: AppNotification['importance']) => {
    const newNotification: AppNotification = {
      id: generateId(),
      eventId,
      triggerUserId: CURRENT_USER.id,
      message,
      importance,
      timestamp: Date.now(),
      readBy: [],
    };
    setNotifications((prev) => [newNotification, ...prev]);
  };

  const joinEvent = (eventId: string) => {
    setEvents((prev) =>
      prev.map((e) =>
        e.id === eventId && !e.subscribers.includes(CURRENT_USER.id)
          ? { ...e, subscribers: [...e.subscribers, CURRENT_USER.id] }
          : e
      )
    );
  };

  const leaveEvent = (eventId: string) => {
    setEvents((prev) =>
      prev.map((e) =>
        e.id === eventId
          ? { ...e, subscribers: e.subscribers.filter((id) => id !== CURRENT_USER.id) }
          : e
      )
    );
  };

  const archiveEvent = (eventId: string) => {
    setEvents((prev) =>
      prev.map((e) =>
        e.id === eventId && e.creatorId === CURRENT_USER.id
          ? { ...e, isArchived: true }
          : e
      )
    );
  };

  return (
    <AppContext.Provider
      value={{
        currentUser: CURRENT_USER,
        users: MOCK_USERS,
        events,
        notifications,
        quickTriggerEventId,
        setQuickTriggerEventId,
        createEvent,
        updateEvent,
        triggerNotification,
        joinEvent,
        leaveEvent,
        archiveEvent,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
